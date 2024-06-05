document.addEventListener("DOMContentLoaded", function() {
    const form = document.querySelector("form");
    const errorMessage = document.getElementById("errorMessage");

    form.addEventListener("submit", async function(event) {
        event.preventDefault();

        const newPassword = document.getElementById("password").value;
        const token = window.location.pathname.split("/").pop(); 

        try {
            const response = await fetch(`http://localhost:8080/api/sessions/resetPassword/${token}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ newPassword })
            });

            const result = await response.json();

            if (response.ok) {
                alert("Contraseña restablecida correctamente.");
                window.location.href = "http://localhost:8080/api/sessions/login"; 
            } else {
                errorMessage.style.display = "block";
                errorMessage.textContent = result.error || "Ocurrió un error al restablecer la contraseña.";
            }
        } catch (error) {
            console.error("Error submitting reset password form:", error);
            errorMessage.style.display = "block";
            errorMessage.textContent = "Ocurrió un error al restablecer la contraseña.";
        }
    });
});