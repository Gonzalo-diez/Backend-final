const socket = io();

socket.on('connection', () => {
    console.log("Websocket del lado cliente funciona");
})

socket.on('addProduct', (addProduct) => {
    console.log("Se agregado el producto:", addProduct);
})

// Manejar el envío del formulario para agregar un producto
document.getElementById('addProductForm').addEventListener('submit', (event) => {
    event.preventDefault();

    // Obtener los valores del formulario
    const title = document.getElementById('title').value;
    const description = document.getElementById('description').value;
    const price = parseFloat(document.getElementById('price').value);
    const stock = parseInt(document.getElementById('stock').value);
    const category = document.getElementById('category').value;
    const image = document.getElementById('image').files[0];

    console.log('Datos del producto:', title, description, price, stock, category, image);

    // Crear un objeto FormData para enviar datos de formulario y archivos
    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('price', price);
    formData.append('stock', stock);
    formData.append('category', category);
    formData.append('image', image);

    // Emitir el evento addProduct al servidor de WebSocket con los datos del producto
    socket.emit('addProduct', formData);

    // Resetear el formulario después de enviar los datos
    event.target.reset();
});

// Manejar la eliminación de un producto
document.getElementById('productList').addEventListener('click', (event) => {
    // Verificar si el clic ocurrió en un botón de eliminación
    if (event.target.classList.contains('delete-btn')) {
        // Obtener el ID del producto del atributo 'data-product-id'
        const productId = event.target.getAttribute('data-product-id');
        // Obtener la URL para eliminar el producto
        const deleteUrl = event.target.getAttribute('data-delete-url');
        // Llamar a la función para eliminar el producto
        deleteProduct(productId, deleteUrl);
    }
});

// Función para eliminar un producto
function deleteProduct(productId, deleteUrl) {
    console.log('Intentando eliminar el producto con ID:', productId);
    // Realizar una solicitud DELETE a la URL proporcionada
    fetch(deleteUrl, {
        method: 'DELETE'
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('No se pudo eliminar el producto');
            }
            return response.json();
        })
        .then(data => {
            console.log('Producto eliminado exitosamente:', data.productId);
        })
        .catch(error => {
            console.error('Error al eliminar el producto:', error);
        });
}

// Escuchar el evento de eliminación de producto
socket.on('deleteProduct', (productId) => {
    // Eliminar el producto de la interfaz de usuario
    const productElement = document.querySelector(`div[data-product-id="${productId}"]`);
    if (productElement) {
        productElement.remove();
    } else {
        console.error(`Producto con ID ${productId} no encontrado en la interfaz de usuario.`);
    }
});