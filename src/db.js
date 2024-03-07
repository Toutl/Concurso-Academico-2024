import {createPool} from 'mysql';
import {promisify} from 'util'

var pool = createPool({
    host: '0.0.0', // La dirección del host de tu base de datos
    user: 'ejemploUsuario', // Tu usuario
    password: 'ejemploContrasena', // Tu contraseña
    database: 'tuDataBase' // La base de datos que usaras en el proyecto
});

pool.getConnection((err) => {
    if (err) {
        console.log(err);
    }
    return;
})

pool.query = promisify(pool.query)

export { pool }