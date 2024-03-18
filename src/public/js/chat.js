const socket = io();

document.getElementById('messageForm').addEventListener('submit', (event) => {
    event.preventDefault();

    const user = document.getElementById('user').value;
    const message = document.getElementById('message').value;

    if (user && message) {
        socket.emit('addMessage', { user, message });
        console.log("Mensaje agregado:", { user, message });
        document.getElementById('message').value = '';
    }
});