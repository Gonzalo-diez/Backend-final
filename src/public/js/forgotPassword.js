document.addEventListener("DOMContentLoaded", function() {
    const form = document.querySelector("form");
    const errorMessage = document.getElementById("errorMessage");

    form.addEventListener("submit", async function(event) {
        event.preventDefault();

        const email = document.getElementById("email").value;

        try {
            const response = await fetch("https://backend-final-production-8834.up.railway.app/api/sessions/requestPasswordReset", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ email })
            });

            const result = await response.json();

            if (response.ok) {
                alert("Se ha enviado un enlace de restablecimiento de contraseña a su email.");
                form.reset();
            } else {
                errorMessage.style.display = "block";
                errorMessage.textContent = result.error || "Ocurrió un error al enviar el enlace de restablecimiento de contraseña.";
            }
        } catch (error) {
            console.error("Error enviando el formulario:", error);
            errorMessage.style.display = "block";
            errorMessage.textContent = "Ocurrió un error al enviar el enlace de restablecimiento de contraseña.";
        }
    });
});
