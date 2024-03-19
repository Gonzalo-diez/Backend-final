const socket = io();

socket.on('addMessage', (addMessage) => {
    socket.emit("addMessage", addMessage);
    const chatList = document.getElementById('chatList');
    const chatElement = document.createElement('div');
    chatElement.classList.add('col-md-4', 'mb-4');
    chatElement.innerHTML = `
        <div class="card">
            <h2>${addMessage.user}</h2>
            <p>${addMessage.text}</p>
        </div>`;
    chatList.appendChild(chatElement);
});

document.getElementById('messageForm').addEventListener('submit', async (event) => {
    event.preventDefault();

    const user = document.getElementById('user').value;
    const message = document.getElementById('message').value;

    if (user && message) {
        try {
            const response = await fetch('http://localhost:8080/messages/addMessage', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ user, text: message })
            });

            if (!response.ok) {
                throw new Error('Error al agregar el mensaje');
            }

            console.log("Mensaje agregado:", { user, message });
            document.getElementById('message').value = '';

            event.target.reset();
        } catch (error) {
            console.error('Error al agregar el mensaje:', error);
        }
    }
});