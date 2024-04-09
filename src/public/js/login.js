document.addEventListener('DOMContentLoaded', function () {
    const loginForm = document.getElementById('loginForm');

    if (loginForm) {
        loginForm.addEventListener('submit', function (event) {
            event.preventDefault();

            const formData = new FormData(loginForm);
            const errorMessage = document.getElementById('errorMessage');

            fetch('http://localhost:8080/api/users/login', {
                method: 'POST',
                body: formData,
            })
                .then(response => {
                    if (response.ok) {
                        // Si la respuesta es exitosa, redirigir al usuario al inicio
                        console.log("Inicio de sesión exitoso!")
                    } else {
                        // Si la respuesta no es exitosa, mostrar un mensaje de error
                        errorMessage.textContent = 'Email o contraseña incorrectos. Por favor, inténtalo de nuevo.';
                        errorMessage.style.display = 'block';
                    }
                })
                .catch(error => {
                    console.error('Error en el inicio de sesión:', error);
                });
        });
    }
});