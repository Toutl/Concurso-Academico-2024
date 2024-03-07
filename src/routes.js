import { Router } from "express";
import { pool } from "./db.js";

const router = Router()

router.get('/', (req, res) => { let error = []; res.render('login', { error }) });

router.post('/', async (req, res) => {
    let error = []
    const username = req.body.username
    const pw = req.body.pw
    const sql = `SELECT * FROM users WHERE username = '${username}'`
    const data = await pool.query(sql)
    if (data.length) {
        if (pw != data[0].pw) {
            error.push('Contraseña incorrecta')
            res.render('login', { error })
        }
        if (pw == data[0].pw && data[0].rol == 'user') {
            req.session.username = username
            req.session.score = parseInt(data[0].score)
            req.session.ids = []
            req.session.count = 0
            req.session.ronda = 1
            req.session.materias = []
            req.session.grado = data[0].grado
            req.session.rol = data[0].rol
            req.session.dq = false
            res.redirect('/inicio')
        }
        if (pw == data[0].pw && data[0].rol == 'juez') {
            req.session.username = username
            req.session.rol = data[0].rol
            res.redirect('/juez')
        }
        if (pw == data[0].pw && data[0].rol == 'admin') {
            req.session.username = username
            req.session.rol = data[0].rol
            res.redirect('/admin')
        }
        if (pw == data[0].pw && data[0].rol == 'tabla') {
            res.redirect('/tabla')
        }
    } else {
        error.push('No existe el usuario')
        res.render('login', { error })
    }
});

router.get('/inicio', (req, res) => {
    const user_info = {
        username: req.session.username,
        score: req.session.score
    }
    res.render('inicio', {user_info})
})

router.get('/ronda/:round', async (req, res) => {
    req.session.count = 0
    const round = req.params.round
    const sql = `SELECT * FROM ORDER BY RAND() LIMIT 1`

    const table = req.session.grado
    const materias_sql = `SELECT DISTINCT materia FROM preguntas_${table}`
    const materias = await pool.query(materias_sql)
    for(let materia of materias){
        req.session.materias.push(materia.materia)
    }
    const user_info = {
        username: req.session.username,
        score: req.session.score
    }
    // const frase = pool.query(sql)
    res.render('ronda', { round, user_info })
});

router.get('/pregunta/:round', async (req, res) => {
    const user_info = {
        username: req.session.username,
        ids: req.session.ids
    }
    const sql_user = `SELECT descalificado FROM users WHERE username = '${user_info.username}'`
    const query_user = await pool.query(sql_user)
    const dq = query_user[0].descalificado
    if(dq == 1){
        req.session.dq = true
        res.redirect('/descalificado')
    }
    if (req.session.count >= 3) {
        req.session.ronda++
        if (req.session.ronda == 4) {
            res.redirect('/final')
        } else {
            let url = `/ronda/${req.session.ronda}`
            res.redirect(url)
        }
    }
    let not_ids = 'id = '
    for (let id of user_info.ids) {
        not_ids += `${id} or id = `
    }
    not_ids += '0'
    const table = req.session.grado
    const random = Math.floor(Math.random() * req.session.materias.length)
    const materia = req.session.materias[random]
    if(req.session.materias.length === 0){
        const round = req.params.round
        const sql = `SELECT * FROM preguntas_${table} WHERE round = ${req.session.ronda} AND NOT (${not_ids}) ORDER BY RAND() LIMIT 1`
        const preguntas = await pool.query(sql)
        res.render('pregunta', { round, preguntas, user_info })

    }else{  
        if (req.session.materias.includes(materia)) {
            const index = req.session.materias.indexOf(materia)
            req.session.materias.splice(index, 1)
        } 
        const round = req.params.round
        const sql = `SELECT * FROM preguntas_${table} WHERE round = ${req.session.ronda} AND materia = '${materia}' AND NOT (${not_ids}) ORDER BY RAND() LIMIT 1`
        const preguntas = await pool.query(sql)
        res.render('pregunta', { round, preguntas, user_info })
    }
});

router.post('/respuesta', async (req, res) => {
    if(req.session.dq == true){res.redirect('/descalificado')}
    let correcto
    const r_correct = req.body.r_correct
    const r = req.body.r
    let score = parseInt(req.body.score)
    const time = req.body.time
    const round = req.body.round
    const img = req.body.img
    let extra = 0
    req.session.count++
    if (r == r_correct) {
        correcto = true
        switch (round) {
            case '1':
                if (time >= 15) {extra = 7}
                if (time >= 20) {extra = 11} 
                if (time >= 25) {extra = 15} 
                break;
            case '2':
                if (time >= 25) {extra = 6}
                if (time >= 35) {extra = 10}
                if (time >= 45) {extra = 14}
                if (time >= 55) {extra = 18} 
                break;
            case '3':
                if (time >= 30) {extra = 5}
                if (time >= 40) {extra = 8}
                if (time >= 50) {extra = 11} 
                if (time >= 60) {extra = 14} 
                if (time >= 70) {extra = 17}
                if (time >= 80) {extra = 20} 
                break;
        }
        score = score + extra
        req.session.score = req.session.score + score
    } else {
        correcto = false
    }
    req.session.ids.push(req.body.p_id)
    const user_info = {
        username: req.session.username,
        score: req.session.score,
        ids: req.session.ids
    }
    const rs = [req.body.opc1, req.body.opc2, req.body.opc3, req.body.opc4]
    const p = req.body.p
    const sql = `UPDATE users set score = ${user_info.score} WHERE username = '${user_info.username}'`
    const query = await pool.query(sql)
    res.render('respuesta', { rs, user_info, round, p, correcto, r, r_correct, score, img })
})

router.get('/descalificado', (req, res) => {
    res.render('dq')
})

router.get('/juez', async (req, res) => {
    if (req.session.rol != 'juez') {
        res.send('ño')
    }
    const username = req.session.username
    const sql = `SELECT * FROM users WHERE rol = 'user' ORDER BY score DESC`
    const users = await pool.query(sql)
    res.render('admin/juez', { username, users })
})

router.post('/juez', async (req, res) => {

    const score = req.body.upd_score
    const id = req.body.upd_user
    const username = req.body.upd_username
    const sql = `UPDATE users SET score = ${score} WHERE id = ${id}`
    const update = await pool.query(sql)
    if (update.warningCount == 0) {
        res.redirect('/juez')
    }
})

router.get('/admin', async (req, res) => {
    if (req.session.rol != 'admin') {
        res.send('ño')
    }
    const username = req.session.username
    res.render('admin/admin', { username })
})

router.get('/dq/:id', async (req, res) => {
    const id = req.params.id
    const sql = `UPDATE users SET descalificado = true WHERE id = ${id}`
    const update = await pool.query(sql)
    if (update.warningCount == 0) {
        res.redirect('/juez')
    }
})

router.get('/final',  (req, res) => {
    res.render('final')
})

router.get('/tabla', async (req, res) => {
    const sql = `SELECT * FROM users WHERE rol = 'user' ORDER BY score DESC`
    const users = await pool.query(sql)
    res.render('tabla', {users})
})

export default router