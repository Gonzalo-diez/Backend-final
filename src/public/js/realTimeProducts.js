const socket = io.connect('http://localhost:8080');

socket.on('addProduct', (addProduct) => {
    // Lógica para agregar el nuevo producto a la interfaz de usuario
    const productList = document.getElementById('productList');
    const productElement = document.createElement('div');
    productElement.classList.add('col-md-4', 'mb-4');
    productElement.innerHTML = `
        <div class="card">
            <img src="/img/${addProduct.image}" class="card-img-top img-fluid" alt="${addProduct.title}"
                style="max-height: 400px; aspect-ratio: 3/2; object-fit: contain;">
            <div class="card-body">
                <h5 class="card-title">${addProduct.title}</h5>
                <p class="card-text">${addProduct.brand}</p>
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
        const response = await fetch('http://localhost:8080/api/products/addProduct', {
            method: 'POST',
            body: formData
        });

        if (!response.ok) {
            throw new Error('Error al agregar el producto');
        }

        const data = await response.json();
        socket.emit("addProduct", data.Product);
        console.log('Producto agregado:', data.Product);

        // Limpiar el formulario después de agregar el producto
        event.target.reset();

    } catch (error) {
        console.error('Error al agregar el producto:', error);
    }
});

socket.on('deleteProduct', (deletedProductId) => {
    // Lógica para eliminar el producto de la interfaz de usuario
    const deletedProductElement = document.getElementById(deletedProductId);
    if (deletedProductElement) {
        deletedProductElement.remove();
    }
});

// Manejar la eliminación de un producto
document.getElementById('productList').addEventListener('click', async (event) => {
    // Verificar si el clic ocurrió en un botón de eliminación
    if (event.target.classList.contains('delete-btn')) {
        // Obtener el ID del producto del atributo 'data-product-id'
        const id = event.target.getAttribute('data-product-id');

        try {
            const response = await fetch(`http://localhost:8080/api/products/deleteProduct/${id}`, {
                method: 'DELETE'
            });

            if (!response.ok) {
                throw new Error('No se pudo eliminar el producto');
            }

            // Emitir un evento de socket para indicar la eliminación del producto
            socket.emit('deleteProduct', id);

            // Eliminar el producto de la interfaz de usuario
            const deletedProductElement = document.getElementById(id);
            if (deletedProductElement) {
                deletedProductElement.remove();
            }

            console.log('Producto eliminado exitosamente');

            location.reload();
        } catch (error) {
            console.error('Error al eliminar el producto:', error);
        }
    }
});