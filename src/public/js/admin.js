const socket = io()
const cont = document.querySelector('.cont-conn')
socket.on('cons', (data) => {
    console.log(data)
    var div = document.createElement('DIV')
    div.classList.add('conn')
    div.id = data.id
    div.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-device-airtag"
    width="28" height="28" viewBox="0 0 24 24" stroke-width="1.5" stroke="#7bc62d" fill="none"
    stroke-linecap="round" stroke-linejoin="round">
    <path stroke="none" d="M0 0h24v24H0z" fill="none" />
    <path d="M4 12a8 8 0 1 0 16 0a8 8 0 0 0 -16 0" />
    <path d="M9 15v.01" />
    <path d="M15 15a6 6 0 0 0 -6 -6" />
    <path d="M12 15a3 3 0 0 0 -3 -3" />
    <div>
    <p>${data.username}</p>
    <p class="status">${data.status}</p>
    </div>`
    cont.append(div)
})
socket.on('disconnected', (data) => {
    var disconnection = document.getElementById(data)
    disconnection.remove()
})

const cont_r = document.getElementById('cont_r')
let r = 0
const btn_round = document.getElementById('admin_round')
btn_round.addEventListener('click', () => {
    socket.emit('start:round')
    p = 1
    r++
    cont_r.textContent = r
    cont_p.textContent = p
})

const cont_p = document.getElementById('cont_p')
let p = 0
const btn_next = document.getElementById('admin_next')
btn_next.addEventListener('click', () => {
    socket.emit('next')
    p++
    cont_p.textContent = p
    socket.emit('refresh')
})

const btn_inicio = document.getElementById('admin_inicio')
btn_inicio.addEventListener('click', () => {
    socket.emit('start')
})