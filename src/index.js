import express from 'express';
import { dirname, join } from 'path'
import { fileURLToPath } from 'url'
import morgan from 'morgan';
import session from 'cookie-session'
import { Server } from 'socket.io';
import {createServer} from 'node:http'

import router from './routes.js'

const app = express();

const port = process.env.PORT ?? 8080

const __dirname = dirname(fileURLToPath(import.meta.url))

app.use(session({
    secret: 'agustinselacome',
    name: 'usuario',
    resave: true,
    saveUninitialized: true,
  }));


app.use((req, res, next) => {
    next()
})

const server = createServer(app)
const io = new Server(server)
io.sockets.on('connection', (socket) => {
  socket.on('conected', (data) => {
    io.sockets.emit('cons', data)
  })
  socket.on('disconnect', () => {
    io.sockets.emit('disconnected', socket.id)
  })
  socket.on('start', () => {
    io.sockets.emit('start')
  })
  socket.on('start:round', () => {
    io.sockets.emit('start:round')
  })
  socket.on('next', () => {
    io.sockets.emit('next')
  })
  socket.on('refresh', () => {
    io.sockets.emit('refresh')
  })
})

app.set('views', join(__dirname, 'views'))
app.set('view engine', 'ejs')

app.use(morgan('dev'))
app.use(express.urlencoded({extended : false}))
app.use(express.json())

app.use(router)
app.use(express.static(join(__dirname, 'public')))

server.listen(port)