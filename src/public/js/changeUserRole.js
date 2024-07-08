document.addEventListener("DOMContentLoaded", function() {
    const form = document.getElementById("roleChangeForm");
    const errorMessage = document.getElementById("errorMessage");

    form.addEventListener('submit', async function (event) {
        event.preventDefault();

        const userId = localStorage.getItem('userId');
        const token = localStorage.getItem('token')

        // Crear un nuevo FormData con los archivos del formulario
        const formData = new FormData(form);

        try {
            const response = await fetch(`http://localhost:8080/api/sessions/premium/${userId}`, {
                method: 'PUT',
                body: formData,
                headers: {
                    "authorization": `Bearer ${token}`
                },
            });

            if (response.headers.get('Content-Type')?.includes('application/json')) {
                const result = await response.json();
                
                if (response.ok) {
                    alert("Se ha cambiado el rol del usuario.");
                    window.location.href = "http://localhost:8080/api/products"; 
                } else {
                    errorMessage.style.display = "block";
                    errorMessage.textContent = result.error || "Ocurrió un error al cambiar el rol del usuario.";
                }
            } else {
                throw new Error('Respuesta inesperada del servidor');
            }
        } catch (error) {
            console.error("Error enviando el formulario:", error);
            errorMessage.style.display = "block";
            errorMessage.textContent = "Ocurrió un error al cambiar el rol del usuario.";
        }
    });
});