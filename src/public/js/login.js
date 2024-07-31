// Login de formulario
document.addEventListener('DOMContentLoaded', function () {
    const loginForm = document.getElementById('loginForm');

    if (loginForm) {
        loginForm.addEventListener('submit', function (event) {
            event.preventDefault();

            const formData = new FormData(loginForm);
            const obj = {};
            formData.forEach((val, key) => obj[key]=val);
            const errorMessage = document.getElementById('errorMessage');

            fetch('https://backend-final-production-8834.up.railway.app/api/sessions/login', {
                method: 'POST',
                body: JSON.stringify(obj),
                headers: {
                    'Content-Type': 'application/json',
                    "Access-Control-Allow-Origin": "*"
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
                const token = data.access_token;
                const userId = data.userId;
                const userRole = data.userRole;

                localStorage.setItem('token', token);
                localStorage.setItem('userId', userId);
                localStorage.setItem('userRole', userRole);
                console.log("Token:", token);
                console.log("userId:", userId);
                console.log("user rol:", userRole);
                console.log("Inicio de sesión exitoso!");

                if (userRole === 'admin') {
                    window.location.href = `https://backend-final-production-8834.up.railway.app/api/sessions/dashboard/${userId}`;
                }
                else {
                    window.location.href = "https://backend-final-production-8834.up.railway.app/api/products";
                }
            })
            .catch(error => {
                console.error('Error en el inicio de sesión:', error);
            });
        });
    }
});

// Login de GitHub
document.addEventListener('DOMContentLoaded', function() {
    const githubButton = document.getElementById('github');

    if(githubButton) {
        githubButton.addEventListener("click", function(event) {
            event.preventDefault();

            const errorMessage = document.getElementById('errorMessage');

            fetch('https://backend-final-production-8834.up.railway.app/api/sessions/github', {
                method: 'GET',
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
                    errorMessage.textContent = 'GitHub invalido.';
                    errorMessage.style.display = 'block';
                    throw new Error('Credenciales incorrectas');
                }
            })
            .then(data => {
                // Extraer el token de la respuesta JSON
                // Almacenar el token en el almacenamiento local
                const token = localStorage.setItem('token', data.access_token);
                const userId = localStorage.setItem('userId', data.userId);
                const userRole = localStorage.setItem('userRole', data.userRole);
                console.log("Token:", token);
                console.log("UserId:", userId);
                console.log("UserRole:", userRole);
                console.log("Inicio de sesión exitoso!");
                window.location.href = "https://backend-final-production-8834.up.railway.app/api/products/"
            })
            .catch(error => {
                console.error('Error en el inicio de sesión:', error);
            });
        })
    }
})