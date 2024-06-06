const logout = async () => {
    const token = localStorage.getItem('token');
    const userId = localStorage.getItem('userId');
    console.log("Token antes de enviarlo al servidor:", token);
    console.log("ID del usuario antes de enviarlo al servidor:", userId);

    try {
        const response = await fetch('http://localhost:8080/api/sessions/logout', {
            method: 'GET',
            headers: {
                "authorization": `Bearer ${token}`
            }
        });

        if (response.ok) {
            console.log('Logout exitoso');
            localStorage.removeItem("token");
            localStorage.removeItem("userId");
            localStorage.removeItem("userRole");
            window.location.replace("/api/sessions/login");
        } else {
            const errorMessage = await response.text();
            console.error('Error en el logout:', errorMessage);
        }
    } catch (error) {
        console.error('Error en el logout:', error);
    }
};

// Función para manejar el evento de clic en el botón de logout
const handleLogoutClick = () => {
    logout();
};

// Agregar un event listener al botón de logout
document.addEventListener('DOMContentLoaded', () => {
    const logoutButton = document.getElementById('logoutButton'); 
    if (logoutButton) {
        logoutButton.addEventListener('click', handleLogoutClick);
    }
});

const perfil = async () => {
    const token = localStorage.getItem('token');
    const userId = localStorage.getItem('userId');

    try {
        const response = await fetch(`http://localhost:8080/api/sessions/dashboard/${userId}`, {
            method: 'GET',
            headers: {
                "authorization": `Bearer ${token}`
            }
        });

        if (response.ok) {
            console.log("Perfil")
            window.location.replace(`/api/sessions/dashboard/${userId}`);
        } else {
            const errorMessage = await response.text();
            console.error('Error en ir al perfil:', errorMessage);
        }
    } catch (error) {
        console.error('Error en ir al perfil:', error);
    }
}

// Función para manejar el evento de clic en el botón de perfil
const handlePerfilClick = () => {
    perfil();
};

// Agregar un event listener al botón de perfil
document.addEventListener('DOMContentLoaded', () => {
    const perfilButton = document.getElementById('perfilButton'); 
    if (perfilButton) {
        perfilButton.addEventListener('click', handlePerfilClick);
    }
});

const changePassword = async () => {
    const token = localStorage.getItem('token');
    const userId = localStorage.getItem('userId');

    try {
        const response = await fetch(`http://localhost:8080/api/sessions/changePassword/${userId}`, {
            method: 'GET',
            headers: {
                "authorization": `Bearer ${token}`
            }
        });

        if (response.ok) {
            console.log("Cambiar contraseña")
            window.location.replace(`/api/sessions/changePassword/${userId}`);
        } else {
            const errorMessage = await response.text();
            console.error('Error en ir al cambiar contraseña:', errorMessage);
        }
    } catch (error) {
        console.error('Error en ir al cambiar contraseña:', error);
    }
}

// Función para manejar el evento de clic en el botón de cambiar contraseña
const handleChangePasswordClick = () => {
    changePassword();
};

// Agregar un event listener al botón de cambiar contraseña
document.addEventListener('DOMContentLoaded', () => {
    const changePasswordButton = document.getElementById('changePasswordButton'); 
    if (changePasswordButton) {
        changePasswordButton.addEventListener('click', handleChangePasswordClick);
    }
});

const editUser = async () => {
    const token = localStorage.getItem('token');
    const userId = localStorage.getItem('userId');

    try {
        const response = await fetch(`http://localhost:8080/api/sessions/updateUser/${userId}`, {
            method: 'GET',
            headers: {
                "authorization": `Bearer ${token}`
            }
        });

        if (response.ok) {
            window.location.replace(`/api/sessions/updateUser/${userId}`);
        } else {
            const errorMessage = await response.text();
            console.error('Error en ir al perfil:', errorMessage);
        }
    } catch (error) {
        console.error('Error en ir al perfil:', error);
    }
}

// Función para manejar el evento de click en el botón de editar usuario
const handleEditUserClick = () => {
    editUser();
};

// Agregar un event listener al botón de editar usuario
document.addEventListener('DOMContentLoaded', () => {
    const editUserButton = document.getElementById('editUserButton'); 
    if (editUserButton) {
        editUserButton.addEventListener('click', handleEditUserClick);
    }
});

const chat = async () => {
    const token = localStorage.getItem('token');

    try {
        const response = await fetch(`http://localhost:8080/api/messages`, {
            method: 'GET',
            headers: {
                "authorization": `Bearer ${token}`
            }
        });

        if (response.ok) {
            window.location.replace(`http://localhost:8080/api/messages`);
        } else {
            const errorMessage = await response.text();
            console.error('Error en ir al chat:', errorMessage);
        }
    } catch (error) {
        console.error('Error en ir al chat:', error);
    }
}

// Función para manejar el evento de clic en el botón de chat
const handleChatClick = () => {
    chat();
};

// Agregar un event listener al botón de chat
document.addEventListener('DOMContentLoaded', () => {
    const chatButton = document.getElementById('chatButton'); 
    if (chatButton) {
        chatButton.addEventListener('click', handleChatClick);
    }
});

const changeRole = async () => {
    const token = localStorage.getItem('token');
    const userId = localStorage.getItem('userId');

    try {
        const response = await fetch(`http://localhost:8080/api/sessions/premium/${userId}`, {
            method: 'GET',
            headers: {
                "authorization": `Bearer ${token}`
            }
        });

        if (response.ok) {
            window.location.replace(`http://localhost:8080/api/sessions/premium/${userId}`);
        } else {
            const errorMessage = await response.text();
            console.error('Error en ir a cambiar roles:', errorMessage);
        }
    } catch (error) {
        console.error('Error en ir a cambiar roles:', error);
    }
}

// Función para manejar el evento de clic en el botón de cambiar rol
const handleChangeRoleClick = () => {
    changeRole();
};

// Agregar un event listener al botón de cambiar rol
document.addEventListener('DOMContentLoaded', () => {
    const changeRoleButton = document.getElementById('changeRoleButton'); 
    if (changeRoleButton) {
        changeRoleButton.addEventListener('click', handleChangeRoleClick);
    }
});