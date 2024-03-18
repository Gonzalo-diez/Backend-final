const socket = io();

document.getElementById('send').addEventListener('click', () => {
    const user = document.getElementById('user').value;
    const message = document.getElementById('message').value;

    if (user && message) {
        socket.emit('addMessage', { user, message });
        document.getElementById('message').value = '';
    }
});

socket.on('addMessage', (data) => {
    const { user, message } = data;
    const chatMessages = document.getElementById('chat-messages');
    const newMessage = document.createElement('div');
    newMessage.textContent = `${user}: ${message}`;
    chatMessages.appendChild(newMessage);
});
