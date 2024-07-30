const socket = io.connect('https://backend-final-production-8834.up.railway.app/');

const token = localStorage.getItem("token");

// Función para manejar el evento de hacer clic en el botón "Eliminar Usuario"
function handleDeleteUser(event) {
    if (!event.target.classList.contains('delete-btn')) {
        return;
    }

    const userId = event.target.getAttribute('data-user-id');

    // Realizar la solicitud HTTP DELETE para eliminar el usuario
    fetch(`https://backend-final-production-8834.up.railway.app/api/sessions/${userId}`, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${token}`,
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Error al eliminar el usuario');
        }
        return response.json();
    })
    .then(data => {
        console.log('Usuario eliminado:', data);
        // Emitir el evento "deleteUser" al servidor con el ID del usuario a eliminar
        socket.emit('deleteUser', userId);
    })
    .catch(error => {
        console.error('Error al eliminar el usuario:', error);
    });
}

// Agregar un event listener para el evento click en el contenedor userList
document.getElementById('userList').addEventListener('click', handleDeleteUser);

// Manejar el evento de usuario eliminado desde el servidor
socket.on('deleteUser', (deleteUserId) => {
    // Eliminar el usuario de la interfaz
    const userElement = document.querySelector(`[data-user-id="${deleteUserId}"]`);
    if (userElement) {
        userElement.parentElement.parentElement.remove();
        console.log(`Usuario con ID ${deleteUserId} eliminado`);
    } else {
        console.log(`No se encontró el usuario con ID ${deleteUserId}`);
    }
});

// Función para manejar el evento de hacer clic en el botón "Cambiar Rol"
function handleChangeUserRole(event) {
    if (!event.target.classList.contains('update-btn')) {
        return;
    }

    const userId = event.target.getAttribute('data-user-id');

    // Realizar la solicitud HTTP PUT para cambiar el rol del usuario
    fetch(`https://backend-final-production-8834.up.railway.app/api/sessions/changeRole/${userId}`, {
        method: 'PUT',
        headers: {
            'Authorization': `Bearer ${token}`,
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Error al cambiar el rol del usuario');
        }
        return response.json();
    })
    .then(data => {
        console.log('Rol editado:', data);
        // Emitir el evento "changeRole" al servidor con el ID del usuario cuyo rol se cambió
        socket.emit('changeRole', { userId, user: data });
    })
    .catch(error => {
        console.error('Error al cambiar el rol del usuario:', error);
    });
}

// Agregar un event listener para el evento click en el contenedor userList
document.getElementById('userList').addEventListener('click', handleChangeUserRole);

// Manejar el evento de rol cambiado desde el servidor
socket.on('changeRole', ({ userId, user }) => {
    // Actualizar el rol del usuario en la interfaz
    const userElement = document.querySelector(`[data-user-id="${userId}"]`);
    if (userElement) {
        // Actualizar los elementos del usuario con la nueva información
        userElement.querySelector('.user-role').textContent = user.role;
        console.log(`Usuario con ID ${userId} rol cambiado`);
    } else {
        console.log(`No se encontró el usuario con ID ${userId}`);
    }
});