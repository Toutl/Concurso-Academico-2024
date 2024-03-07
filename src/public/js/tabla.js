const socket = io()
socket.on('refresh', () => {
    location.reload()
})