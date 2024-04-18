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
                if (response.ok) {
                    // La respuesta exitosa
                    return response.json(); // Convertir la respuesta a JSON
                } else {
                    // Si la respuesta no es exitosa, mostrar un mensaje de error
                    errorMessage.textContent = 'Email o contraseña incorrectos. Por favor, inténtalo de nuevo.';
                    errorMessage.style.display = 'block';
                    throw new Error('Credenciales incorrectas');
                }
            })
            .then(json => {
                // Extraer el token de la respuesta JSON
                // Almacenar el token en el almacenamiento local
                localStorage.setItem('token', json.access_token);
                console.log("Inicio de sesión exitoso!");
            })
            .catch(error => {
                console.error('Error en el inicio de sesión:', error);
            });
        });
    }
});