const socket = io.connect('https://backend-final-production-8834.up.railway.app/');

const token = localStorage.getItem("token");
const userId = localStorage.getItem("userId");

// Función para eliminar un producto del carrito usando Fetch
async function deleteProductFromCart(cid, pid) {
    console.log("id del carrito:", cid);
    console.log("id del producto:", pid);

    try {
        const response = await fetch(`https://backend-final-production-8834.up.railway.app/api/carts/${cid}/products/${pid}`, {
            method: 'DELETE',
            headers: {
                "authorization": `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ userId })
        });

        if (response.ok) {
            console.log(`Producto con ID ${pid} eliminado del carrito ${cid}`);
        } else {
            console.error(`Error al eliminar el producto con ID ${pid} del carrito`);
        }
    } catch (error) {
        console.error('Error de red:', error);
    }
}

// Función para manejar el evento de hacer click en el botón "Eliminar Producto"
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
    // Eliminar el producto del DOM
    const cartElement = document.querySelector(`[data-product-id="${deleteProductCartId}"]`);
    if (cartElement) {
        cartElement.parentElement.parentElement.remove();
        console.log(`Producto con ID ${deleteProductCartId} eliminado`);
    } else {
        console.log(`No se encontró el producto con ID ${deleteProductCartId}`);
    }
});

// Función para vaciar el carrito
async function clearCart(cid) {
    try {
        const response = await fetch(`https://backend-final-production-8834.up.railway.app/api/carts/${cid}`, {
            method: 'DELETE',
            headers: {
                "authorization": `Bearer ${token}`,
            },
            body: JSON.stringify({ userId })
        });

        if (response.ok) {
            console.log(`Carrito vaciado: ${cid} - ${response.body}`);
        } else {
            console.error(`Error al vaciar el carrito`);
        }
    } catch (error) {
        console.error('Error de red:', error);
    }
}

// Función para manejar el evento de hacer click en el boton "Vaciar carrito"
function handleClearCart(event, cid) {
    if (!event.target.classList.contains('clear-btn')) {
        return;
    }

    // Emitir el evento "clearCart" al servidor con el ID del producto a eliminar
    socket.emit('clearCart', cid);
}

// Agregar un event listener para el evento click en el contenedor productList
document.getElementById('cartOptions').addEventListener('click', handleClearCart);

// Manejar el evento de producto borrado desde el servidor
socket.on('clearCart', (clearCart) => {
    // Eliminar el producto del DOM
    const cartElement = document.querySelector(`[data-cart-id="${clearCart}"]`);;
    if (cartElement) {
        cartElement.parentElement.parentElement.remove();
        console.log(`Carrito con ID ${clearCart} vaciado`);
    } else {
        console.log(`No se encontró el carrito con ID ${clearCart}`);
    }
});