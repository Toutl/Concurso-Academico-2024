const socket = io()
let username = document.getElementById('user')
username = username.textContent

socket.on('connect', () => {
    console.log(socket.id)
    socket.emit('conected', { username: username, id: socket.id, status : 'revisando'})
})
socket.on('next', () => {
    var link = document.getElementById('link_next')
    link.click()
})