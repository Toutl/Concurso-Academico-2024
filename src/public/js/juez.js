const section = document.getElementById('upd_cont')

const upd_btn = document.querySelectorAll('.upd_btn');

upd_btn.forEach(btn => {
    btn.addEventListener('click', () => {
        section.classList.add('modal')
        section.innerHTML = ` <form class="update modal-content" id="upd_form" action="/juez" method="post">
        <h3 id="form_header"></h3>
    <div>
        <label for="upd_score">Actualizar puntauje:</label> 
        <input type="number" name="upd_score" id="upd_score" placeholder="" autofocus>
        <input name="upd_user" type="hidden" id="upd_user">
        <input name="upd_username" type="hidden" id="upd_username">
    </div>
        <button id="upd_submit" type="submit">Aceptar</button>
    </form>`
        const upd_score = document.getElementById('upd_score')
        const form_hdr = document.getElementById('form_header')
        const upd_user = document.getElementById('upd_user');
        si = 'score_' + btn.id
        const score = document.getElementById(si)
        const user = document.getElementsByClassName(btn.id)
        const username = document.getElementById('upd_username')
        form_hdr.textContent = user[0].textContent
        upd_score.textContent = score.textContent
        upd_user.value = btn.id
        username.value = user[0].textContent
    });
})