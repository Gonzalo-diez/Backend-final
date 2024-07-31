const socket = io.connect('https://backend-final-production-8834.up.railway.app/');

const token = localStorage.getItem("token");
const userId = localStorage.getItem("userId");
const userRole = localStorage.getItem("userRole");

function handleAddToCart(event) {
    if (!event.target.classList.contains('cart-btn')) {
        return;
    }

    if (!token) {
        console.log("Usuario no logueado o registrado");
        window.location.href = "https://backend-final-production-8834.up.railway.app/api/sessions/login"
    }

    if (userRole === "admin") {
        alert("Usted es el administrador");
        window.location.href = "https://backend-final-production-8834.up.railway.app/api/sessions/login"
    }

    const productId = event.target.getAttribute('data-product-id');

    // Realizar una solicitud HTTP POST para agregar el producto al carrito
    fetch("https://backend-final-production-8834.up.railway.app/api/carts/", {
        method: 'POST',
        headers: {
            "authorization": `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ productId, userId, userRole })
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Error al agregar el producto al carrito');
            }
            return response.json();
        })
        .then(data => {
            console.log('Producto agregado al carrito:', data);
        })
        .catch(error => {
            console.error('Error al agregar el producto al carrito:', error);
        });
}

if (userRole === "user" || userRole === "premium") {
    const goToCartBtn = document.getElementById('goToCartBtn');
    const cartForm = document.getElementById('cartForm');

    // Agregar un evento de clic al botón
    goToCartBtn.addEventListener('click', () => {
        // Obtener el valor seleccionado en el select
        const selectedCartId = document.getElementById('cart').value;
        // Construir la URL del carrito utilizando el ID seleccionado
        const cartUrl = `https://backend-final-production-8834.up.railway.app/api/carts/${selectedCartId}`;

        // Obtener el token de localStorage
        const token = localStorage.getItem('token');

        // Verificar si el token está presente
        if (!token) {
            console.log("Token no encontrado. Usuario no autenticado.");
            // Aquí podrías mostrar un mensaje al usuario o redirigirlo a la página de inicio de sesión
            return;
        }

        // Realizar la solicitud al servidor utilizando fetch
        fetch(cartUrl, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        })
            .then(response => {
                // Verificar si la respuesta es exitosa
                if (!response.ok) {
                    throw new Error('Error al obtener el carrito');
                }
                // Redirigir al usuario a la URL del carrito
                window.location.href = cartUrl;
            })
            .catch(error => {
                console.error('Error al obtener el carrito:', error);
            });
    });
}

// Agregar un event listener para el evento click en el contenedor productList
document.getElementById('productList').addEventListener('click', handleAddToCart);

async function renderProducts(products) {
    if (!products || !products.image) {
        console.error('No se pudo renderizar el producto:', products);
        return;
    }

    const productList = document.getElementById('productList');
    const productElement = document.createElement('div');
    productElement.classList.add('col-md-4', 'mb-4');
    productElement.innerHTML = `
        <div class="card">
                <img src="/img/${products.image}" class="card-img-top img-fluid" alt="{{this.title}}"
                    style="max-height: 400px; aspect-ratio: 3/2; object-fit: contain;">
                <div class="card-body">
                    <h5 class="card-title">${products.title}}</h5>
                    <p class="card-text">${products.brand}</p>
                    <p class="card-text">${products.description}</p>
                    <p class="card-text">Precio: ${products.price}</p>
                    <p class="card-text">Stock: ${products.stock}</p>
                    <p class="card-text">Categoría: ${products.category}</p>
                    <a href="https://backend-final-production-8834.up.railway.app/api/products/{{this._id}}" class="btn btn-primary">Ver detalles</a>
                    {{#eq ../user.role "==" "admin"}}
                    <button class="btn btn-danger delete-btn" data-product-id="{{this._id}}">Eliminar Producto</button>
                    <a href="https://backend-final-production-8834.up.railway.app/api/products/updateProduct/{{this._id}}" class="btn btn-warning">Editar Producto</a>
                    {{/eq}}
                    {{#eq ../user.role "==" "premium"}}
                    {{#eq ../user._id "==" this.owner}}
                    <button class="btn btn-danger delete-btn" data-product-id="{{this._id}}">Eliminar Producto</button>
                    <a href="https://backend-final-production-8834.up.railway.app/api/products/updateProduct/{{this._id}}" class="btn btn-warning">Editar Producto</a>
                    {{/eq}}
                    {{/eq}}
                    {{#ifRole ../user.role "user" "premium"}}
                    {{#eq ../user._id "!=" this.owner}}
                    <button class="btn btn-success cart-btn" data-product-id="{{this._id}}">Agregar al carrito</button>
                    {{/eq}}
                    {{/ifRole}}
                </div>
            </div>`;
    productList.appendChild(productElement);
}

socket.on('addProduct', (addProduct) => {
    renderProducts(addProduct);
});

if (userRole === "admin" || userRole === "premium") {
    // Manejar el envío del formulario para agregar un producto
    document.getElementById('addProductForm').addEventListener('submit', async function(event) {
        event.preventDefault(); 
    
        const form = document.getElementById('addProductForm');
        const formData = new FormData(form);
    
        try {
            const response = await fetch('/api/products/', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
                body: formData
            });
    
            if (!response.ok) {
                const errorData = await response.json();
                console.error('Error:', errorData);
                alert('Error al agregar el producto. Por favor, verifica los datos e inténtalo de nuevo.');
            } else {
                const responseData = await response.json();
                console.log('Success:', responseData);
                alert('Producto agregado exitosamente');
            }
        } catch (error) {
            console.error('Error de red:', error);
            alert('Hubo un problema con la solicitud. Por favor, intenta de nuevo.');
        }
    });

    // Función para manejar el evento de hacer clic en el botón "Eliminar Producto"
    function handleDeleteProduct(event) {
        if (!event.target.classList.contains('delete-btn')) {
            return;
        }

        const productId = event.target.getAttribute('data-product-id');

        // Realizar la solicitud HTTP DELETE para eliminar el producto
        fetch(`https://backend-final-production-8834.up.railway.app/api/products/${productId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                "authorization": `Bearer ${token}`,
            },
            body: JSON.stringify({ userId, userRole })
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Error al eliminar el producto');
                }
                return response.json();
            })
            .then(data => {
                console.log('Producto eliminado:', data);
                // Emitir el evento "deleteProduct" al servidor con el ID del producto a eliminar
                socket.emit('deleteProduct', productId);
            })
            .catch(error => {
                console.error('Error al eliminar el producto:', error);
            });
    }

    // Agregar un event listener para el evento click en el contenedor productList
    document.getElementById('productList').addEventListener('click', handleDeleteProduct);

    // Manejar el evento de producto borrado desde el servidor
    socket.on('deleteProduct', (deletedProductId) => {
        // Eliminar el producto de la interfaz
        const productElement = document.querySelector(`[data-product-id="${deletedProductId}"]`);
        if (productElement) {
            productElement.parentElement.parentElement.remove();
            console.log(`Producto con ID ${deletedProductId} eliminado`);
        } else {
            console.log(`No se encontró el producto con ID ${deletedProductId}`);
        }
    });
}