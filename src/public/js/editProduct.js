const token = localStorage.getItem('token');
const userId = localStorage.getItem('userId');
const userRole = localStorage.getItem('userRole');

document.addEventListener("DOMContentLoaded", () => {
    const editProductForm = document.getElementById("editProductForm");
    const errorMessage = document.getElementById("errorMessage");
    const productId = editProductForm.getAttribute("data-product-id");

    editProductForm.addEventListener("submit", async (event) => {
        event.preventDefault();

        const form = document.getElementById('editProductForm');
        const formData = new FormData(form);

        try {
            const response = await fetch(`http://localhost:8080/api/products/${productId}`, {
                method: "PUT",
                headers: {
                    "authorization": `Bearer ${token}`
                },
                body: formData,
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || "Error al editar el producto");
            }

            // El perfil se editó exitosamente, redirigir a otra página o mostrar un mensaje de éxito
            window.location.href = "http://localhost:8080/api/products/";
        } catch (error) {
            errorMessage.textContent = error.message;
            errorMessage.style.display = "block";
        }
    });
});