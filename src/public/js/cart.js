const socket = io.connect('http://localhost:8080');

// Función para eliminar un producto del carrito usando Fetch
async function deleteProductFromCart(cartId, productId) {
    try {
        const response = await fetch(`http://localhost:8080/api/carts/${cartId}/products/${productId}`, {
            method: 'DELETE'
        });

        if (response.ok) {
            console.log(`Producto con ID ${productId} eliminado del carrito`);
        } else {
            console.error(`Error al eliminar el producto con ID ${productId} del carrito`);
        }
    } catch (error) {
        console.error('Error de red:', error);
    }
}

// Función para manejar el evento de hacer clic en el botón "Eliminar Producto"
function handleDeleteProductCart(event) {
    if (!event.target.classList.contains('delete-btn')) {
        return;
    }

    const productId = event.target.getAttribute('data-product-id');

    // Emitir el evento "deleteProductCart" al servidor con el ID del producto a eliminar
    socket.emit('deleteProductCart', productId);
}

// Agregar un event listener para el evento click en el contenedor productList
document.getElementById('cartList').addEventListener('click', handleDeleteProductCart);

// Manejar el evento de producto borrado desde el servidor
socket.on('deleteProductCart', (deleteProductCartId) => {
    // Eliminar el producto de la interfaz
    const cartElement = document.querySelector(`[data-product-id="${deleteProductCartId}"]`);
    if (cartElement) {
        cartElement.parentElement.parentElement.remove();
        console.log(`Producto con ID ${deleteProductCartId} eliminado`);
    } else {
        console.log(`No se encontró el producto con ID ${deleteProductCartId}`);
    }
});
