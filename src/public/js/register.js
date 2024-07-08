document.addEventListener('DOMContentLoaded', function () {
    const registerForm = document.getElementById('registerForm');

    if (registerForm) {
        registerForm.addEventListener('submit', function (event) {
            event.preventDefault();

            const formData = new FormData(registerForm);
            const errorMessage = document.getElementById('errorMessage');

            fetch('http://localhost:8080/api/sessions/register', {
                method: 'POST',
                body: formData
                // No especificamos 'Content-Type' ya que el navegador se encargará de esto cuando usamos FormData
            })
            .then(response => {
                if (response.status === 200) {
                    return response.json();
                } else {
                    errorMessage.textContent = 'Este email ya es un usuario. Logueate';
                    errorMessage.style.display = 'block';
                    throw new Error('Credenciales incorrectas');
                }
            })
            .then(data => {
                const token = data.access_token;
                const userId = data.userId;
                const userRole = data.userRole;

                localStorage.setItem('token', token);
                localStorage.setItem('userId', userId);
                localStorage.setItem('userRole', userRole);
                console.log("Token:", token);
                console.log("User Id:", userId);
                console.log("User Role:", userRole);
                console.log("Registro exitoso!");
                window.location.href = "http://localhost:8080/api/products/";
            })
            .catch(error => {
                console.error('Error en el registro:', error);
            });
        });
    }
});