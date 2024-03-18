const socket = io();

socket.on('addProduct', (addProduct) => {
    socket.emit("addProduct", addProduct);
    const productList = document.getElementById('productList');
    const productElement = document.createElement('div');
    productElement.classList.add('col-md-4', 'mb-4');
    productElement.innerHTML = `
        <div class="card">
            <img src="/img/${addProduct.image}" class="card-img-top img-fluid" alt="${addProduct.title}"
                style="max-height: 400px; aspect-ratio: 3/2; object-fit: contain;">
            <div class="card-body">
                <h5 class="card-title">${addProduct.title}</h5>
                <p class="card-text">${newProduct.brand}</p>
                <p class="card-text">${addProduct.description}</p>
                <p class="card-text">Precio: $${addProduct.price}</p>
                <p class="card-text">Stock: ${addProduct.stock}</p>
                <p class="card-text">Categoría: ${addProduct.category}</p>
                <button class="btn btn-danger delete-btn" data-product-id="${addProduct._id}"
                    data-delete-url="/realtimeproducts/deleteProduct/${addProduct._id}">Eliminar
                    Producto</button>
            </div>
        </div>`;
    productList.appendChild(productElement);
});

// Manejar el envío del formulario para agregar un producto
document.getElementById('addProductForm').addEventListener('submit', async (event) => {
    event.preventDefault();

    // Obtener los valores del formulario
    const formData = new FormData(event.target);

    try {
        const response = await fetch('http://localhost:8080/products/addProduct', {
            method: 'POST',
            body: formData
        });

        if (!response.ok) {
            throw new Error('Error al agregar el producto');
        }

        const data = await response.json();
        console.log('Producto agregado:', data.Product);

        // Limpiar el formulario después de agregar el producto
        event.target.reset();

    } catch (error) {
        console.error('Error al agregar el producto:', error);
    }
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
        .then(() => {
            console.log('Producto eliminado exitosamente');
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