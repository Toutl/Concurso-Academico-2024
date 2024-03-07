const socket = io()
const link = document.getElementById('link_inicio')
let username = document.getElementById('user')
username = username.textContent
socket.on('connect', () => {
    socket.emit('conected', { username: username, id: socket.id, status: 'inicio' })
})
socket.on('start', () => {
    link.click()
})