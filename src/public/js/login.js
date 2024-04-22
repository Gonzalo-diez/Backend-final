document.addEventListener('DOMContentLoaded', function () {
    const loginForm = document.getElementById('loginForm');

    if (loginForm) {
        loginForm.addEventListener('submit', function (event) {
            event.preventDefault();

            const formData = new FormData(loginForm);
            const obj = {};
            formData.forEach((val, key) => obj[key]=val);
            const errorMessage = document.getElementById('errorMessage');

            fetch('http://localhost:8080/users/login', {
                method: 'POST',
                body: JSON.stringify(obj),
                headers: {
                    'Content-Type': 'application/json' 
                }
            })
            .then(response => {
                if (response.status === 200) {
                    // La respuesta exitosa
                    return response.json();
                } else {
                    // Si la respuesta no es exitosa, mostrar un mensaje de error
                    errorMessage.textContent = 'Email o contraseña incorrectos. Por favor, inténtalo de nuevo.';
                    errorMessage.style.display = 'block';
                    throw new Error('Credenciales incorrectas');
                }
            })
            .then(data => {
                // Extraer el token de la respuesta JSON
                // Almacenar el token en el almacenamiento local
                const token = localStorage.setItem('token', data.access_token);
                console.log("Token:", token);
                console.log("Inicio de sesión exitoso!");
                window.location.href = "http://localhost:8080/api/products/"
            })
            .catch(error => {
                console.error('Error en el inicio de sesión:', error);
            });
        });
    }
});