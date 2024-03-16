import { io } from "../../app.js";

const socket = io();

socket.emit('message', 'Se ha conectado el websocket');