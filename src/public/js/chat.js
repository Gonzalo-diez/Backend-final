const socket = io.connect('https://backend-final-production-8834.up.railway.app/');
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
            const response = await fetch('https://backend-final-production-8834.up.railway.app/api/messages/addMessage', {
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