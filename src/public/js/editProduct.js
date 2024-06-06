const token = localStorage.getItem('token');
const userId = localStorage.getItem('userId');

document.addEventListener("DOMContentLoaded", () => {
    const editProductForm = document.getElementById("editProductForm");
    const errorMessage = document.getElementById("errorMessage");
    const productId = editProductForm.getAttribute("data-product-id");

    editProductForm.addEventListener("submit", async (event) => {
        event.preventDefault();

        const title = document.getElementById("title").value;
        const brand = document.getElementById("brand").value;
        const description = document.getElementById("description").value;
        const price = document.getElementById("price").value;
        const stock = document.getElementById("stock").value;
        const category = document.getElementById("category").value;
        const image = document.getElementById("image").value;

        try {
            const response = await fetch(`http://localhost:8080/api/products/${productId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "authorization": `Bearer ${token}`
                },
                body: JSON.stringify({ title, brand, description, price, stock, category, image, userId }),
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