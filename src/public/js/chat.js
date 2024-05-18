const socket = io.connect('http://localhost:8080');
const token = localStorage.getItem('token');
const userRole = localStorage.getItem('userRole');

socket.on('addMessage', (addMessage) => {
    const chatList = document.getElementById('chatList');
    const chatElement = document.createElement('div');
    chatElement.classList.add('col-md-4', 'mb-4');
    chatElement.innerHTML = `
        <div class="card">
            <h2>usuario: ${addMessage.userEmail}</h2>
            <p>mensaje: ${addMessage.text}</p>
        </div>`;
    chatList.appendChild(chatElement);
});

document.getElementById('messageForm').addEventListener('submit', async (event) => {
    event.preventDefault();

    const userEmail = document.getElementById('user').value;
    const message = document.getElementById('message').value;

    if (userEmail && message) {
        try {
            const response = await fetch('http://localhost:8080/api/messages/addMessage', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    "authorization": `Bearer ${token}`
                },
                body: JSON.stringify({ userEmail, text: message })
            });

            if (!response.ok) {
                throw new Error('Error al agregar el mensaje');
            }

            console.log("Mensaje agregado:", { userEmail, message });
            socket.emit("addMessage", { userEmail, text: message });
            document.getElementById('message').value = '';

            event.target.reset();
        } catch (error) {
            console.error('Error al agregar el mensaje:', error);
        }
    }
});