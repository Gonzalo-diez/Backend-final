const token = localStorage.getItem("token");
const userId = localStorage.getItem("userId");

document.addEventListener("DOMContentLoaded", function() {
    const form = document.getElementById("uploadDocsForm");
    const errorMessage = document.getElementById("errorMessage");

    form.addEventListener('submit', async function (event) {
        event.preventDefault();

        // Crear un nuevo FormData con los archivos del formulario
        const formData = new FormData(form);

        try {
            const response = await fetch(`https://backend-final-production-8834.up.railway.app/api/sessions/${userId}/uploadDocuments`, {
                method: 'POST',
                body: formData,
                headers: {
                    "authorization": `Bearer ${token}`
                },
            });

            if (response.headers.get('Content-Type')?.includes('application/json')) {
                const result = await response.json();
                
                if (response.ok) {
                    alert("Se ha subido los documentos.");
                    window.location.href = "https://backend-final-production-8834.up.railway.app/api/products"; 
                } else {
                    errorMessage.style.display = "block";
                    errorMessage.textContent = result.error || "Ocurrió un error al subir los documentos.";
                }
            } else {
                throw new Error('Respuesta inesperada del servidor');
            }
        } catch (error) {
            console.error("Error enviando el formulario:", error);
            errorMessage.style.display = "block";
            errorMessage.textContent = "Ocurrió un error al subir los documentos.";
        }
    });
});