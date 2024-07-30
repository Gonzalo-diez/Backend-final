// Cambiar contraseña de formulario
const token = localStorage.getItem('token');
const userId = localStorage.getItem('userId');

document.addEventListener("DOMContentLoaded", () => {
    const changePasswordForm = document.getElementById("changePasswordForm");
    const errorMessage = document.getElementById("errorMessage");

    changePasswordForm.addEventListener("submit", async (event) => {
        event.preventDefault();

        const oldPassword = document.getElementById("oldPassword").value;
        const newPassword = document.getElementById("newPassword").value;

        try {
            const response = await fetch(`https://backend-final-production-8834.up.railway.app/api/sessions/changePassword/${userId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "authorization": `Bearer ${token}`
                },
                body: JSON.stringify({ oldPassword, newPassword }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || "Error al cambiar la contraseña");
            }

            // La contraseña se cambió exitosamente, redirigir a otra página o mostrar un mensaje de éxito
            window.location.href = "https://backend-final-production-8834.up.railway.app/api/products/";
        } catch (error) {
            errorMessage.textContent = error.message;
            errorMessage.style.display = "block";
        }
    });
});