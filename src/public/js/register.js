document.addEventListener('DOMContentLoaded', function () {
    const registerForm = document.getElementById('registerForm');

    if (registerForm) {
        registerForm.addEventListener('submit', function (event) {
            event.preventDefault();

            const formData = new FormData(registerForm);
            const errorMessage = document.getElementById('errorMessage');

            fetch('http://localhost:8080/api/users/register', {
                method: 'POST',
                body: formData,
            })
                .then(response => {
                    if (response.ok) {
                        // Si la respuesta es exitosa, redirigir al usuario al inicio
                        console.log("Registro de usuario exitoso!")
                    } else {
                        // Si la respuesta no es exitosa, mostrar un mensaje de error
                        errorMessage.textContent = 'Este email ya tiene cuenta.';
                        errorMessage.style.display = 'block';
                    }
                })
                .catch(error => {
                    console.error('Error en el registro:', error);
                });
        });
    }
});