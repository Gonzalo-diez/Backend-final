const token = localStorage.getItem('token');
const userId = localStorage.getItem('userId');

document.addEventListener("DOMContentLoaded", () => {
    const purchaseForm = document.getElementById("purchaseForm");
    const errorMessage = document.getElementById("errorMessage");
    const cartId = purchaseForm.getAttribute("data-cart-id");

    console.log("cartId:", cartId);

    purchaseForm.addEventListener("submit", async (event) => {
        event.preventDefault();

        const country = document.getElementById("country").value;
        const state = document.getElementById("state").value;
        const city = document.getElementById("city").value;
        const street = document.getElementById("street").value;
        const postal_code = document.getElementById("postal_code").value;
        const phone = document.getElementById("phone").value;
        const card_bank = document.getElementById("card_bank").value;
        const security_number = document.getElementById("security_number").value;

        try {
            const response = await fetch(`http://localhost:8080/api/carts/${cartId}/purchase`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "authorization": `Bearer ${token}`
                },
                body: JSON.stringify({ country, state, city, street, postal_code, phone, card_bank, security_number, userId }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || "Error al realizar la compra");
            }

            // Compra realizada exitosamente, mostrar SweetAlert con detalles del ticket
            Swal.fire({
                title: 'Compra Realizada Exitosamente',
                html: `
                    <p><strong>Código de Ticket:</strong> ${data.ticket.code}</p>
                    <p><strong>Fecha de Compra:</strong> ${new Date(data.ticket.purchase_datetime).toLocaleString()}</p>
                    <p><strong>Monto Total:</strong> $${data.ticket.amount}</p>
                    <p><strong>Productos:</strong></p>
                    <ul>
                        ${data.ticket.products.map(product => `
                            <li>${product.product} - Cantidad: ${product.productQuantity} - Total: $${product.productTotal}</li>
                        `).join('')}
                    </ul>
                `,
                icon: 'success',
                confirmButtonText: 'Aceptar'
            }).then(() => {
                window.location.href = "http://localhost:8080/api/products/";
            });
        } catch (error) {
            Swal.fire({
                title: 'Error',
                text: error.message,
                icon: 'error',
                confirmButtonText: 'Aceptar'
            });
        }
    });
});