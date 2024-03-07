const socket = io()
let username = document.getElementById('user')
username = username.textContent
const link = document.getElementById('link_round')
socket.on('connect', () => {
    socket.emit('conected', { username: username, id: socket.id, status: 'en espera' })
})
socket.on('start:round', () => {
    link.click()
})