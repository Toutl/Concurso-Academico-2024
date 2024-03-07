const socket = io()
let username = document.getElementById('user')
username = username.textContent

socket.on('connect', () => {
    socket.emit('conected', { username: username, id: socket.id, status: 'contestando' })
})
let ronda = window.location.pathname.slice(10)
addEventListener('DOMContentLoaded', function () {
    const send = document.querySelector('.revisar');
    const temp = document.querySelector('.time');
    const r1 = document.querySelector('.r1');
    const r2 = document.querySelector('.r2');
    const r3 = document.querySelector('.r3');
    const r4 = document.querySelector('.r4');
    const r5 = document.getElementById('no');
    const time_input = document.getElementById('time')
    
    if(ronda == '1'){
        var time = 30
    }if(ronda == '2'){
        var time = 60
    }if(ronda == '3'){
        var time = 90
    }

    const timer = setInterval(() => {
        temp.textContent = time;
        time--;
        time_input.value = time;
        if (time <= 10) {
            temp.classList.add('rojo');
        }
        if (time <= 0) {
            this.clearInterval(timer);
            r5.click();
            send.click();
        }
    }, 1000)

    r1.addEventListener('click', function () {
        r1.classList.add('selected');
        r2.classList.remove('selected')
        r3.classList.remove('selected')
        r4.classList.remove('selected')
    });
    r2.addEventListener('click', function () {
        r2.classList.add('selected');
        r1.classList.remove('selected')
        r3.classList.remove('selected')
        r4.classList.remove('selected')
    });
    r3.addEventListener('click', function () {
        r3.classList.add('selected');
        r2.classList.remove('selected')
        r1.classList.remove('selected')
        r4.classList.remove('selected')
    });
    r4.addEventListener('click', function () {
        r4.classList.add('selected');
        r2.classList.remove('selected')
        r3.classList.remove('selected')
        r1.classList.remove('selected')
    });
})