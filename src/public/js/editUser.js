// Editar el usuario de formulario
const token = localStorage.getItem('token');
const userId = localStorage.getItem('userId');

document.addEventListener("DOMContentLoaded", () => {
    const editUserForm = document.getElementById("editUserForm");
    const errorMessage = document.getElementById("errorMessage");

    editUserForm.addEventListener("submit", async (event) => {
        event.preventDefault();

        const firstName = document.getElementById("firstName").value;
        const lastName = document.getElementById("lastName").value;
        const email = document.getElementById("email").value;

        try {
            const response = await fetch(`http://localhost:8080/api/sessions/updateUser/${userId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "authorization": `Bearer ${token}`
                },
                body: JSON.stringify({ firstName, lastName, email }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || "Error al editar el perfil");
            }

            // El perfil se editó exitosamente, redirigir a otra página o mostrar un mensaje de éxito
            window.location.href = "http://localhost:8080/api/products/";
        } catch (error) {
            errorMessage.textContent = error.message;
            errorMessage.style.display = "block";
        }
    });
});
