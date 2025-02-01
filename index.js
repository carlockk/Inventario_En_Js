// Variables para almacenar productos y categorías en el almacenamiento local
let productos = JSON.parse(localStorage.getItem('productos')) || [];
let categorias = JSON.parse(localStorage.getItem('categorias')) || [];
let editMode = false; // Modo de edición
let editIndex = null; // Índice del producto a editar

// Elementos del DOM
const form = document.getElementById('productForm');
const productList = document.getElementById('productList');
const clearStorage = document.getElementById('clearStorage');
const showInventory = document.getElementById('showInventory');
const inventoryModal = document.getElementById('inventoryModal');
const showCategories = document.getElementById('showCategories');
const categoriesModal = document.getElementById('categoriesModal');
const overlay = document.getElementById('overlay');
const closeInventoryModal = document.getElementById('closeInventoryModal');
const closeCategoriesModal = document.getElementById('closeCategoriesModal');
const categoryList = document.getElementById('categoryList');
const categoriaInput = document.getElementById('categoria');
const categoryOptions = document.getElementById('categoryOptions');
const unidadSelect = document.getElementById('unidad');
const showAgregar = document.getElementById('showAgregar');
const agregarModal = document.getElementById('agregarModal');
const closeAgregarModal = document.getElementById('closeAgregarModal');

// Funciones para abrir y cerrar modales
const openModal = (modal) => {
    modal.style.display = 'block';
    overlay.style.display = 'block';
};

const closeModal = (modal) => {
    modal.style.display = 'none';
    overlay.style.display = 'none';
};

overlay.addEventListener('click', () => {
    closeModal(inventoryModal);
    closeModal(agregarModal);
    closeModal(categoriesModal);
});

closeInventoryModal.addEventListener('click', () => closeModal(inventoryModal));
closeAgregarModal.addEventListener('click', () => closeModal(agregarModal));
closeCategoriesModal.addEventListener('click', () => closeModal(categoriesModal));

// Manejo del formulario para agregar o editar productos
form.addEventListener('submit', (event) => {
    event.preventDefault();
    const nombre = document.getElementById('nombre').value;
    const precio = parseFloat(document.getElementById('precio').value);
    const cantidad = parseInt(document.getElementById('cantidad').value);
    const unidad = unidadSelect.value;
    const categoria = categoriaInput.value.trim();

    if (!categorias.includes(categoria)) categorias.push(categoria);

    if (editMode) {
        productos[editIndex] = { nombre, precio, cantidad, unidad, categoria };
        alert('Producto editado con éxito.');
        editMode = false;
        form.querySelector('button[type="submit"]').textContent = 'Agregar Producto';
    } else {
        productos.push({ nombre, precio, cantidad, unidad, categoria });
        alert('Producto agregado exitosamente.');
    }

    guardarEnLocalStorage();
    form.reset();
    actualizarTabla();
    actualizarCategorias();
    closeModal(agregarModal);
});

// Actualiza la lista de categorías en los modales
const actualizarCategorias = () => {
    categoryList.innerHTML = '';
    categoryOptions.innerHTML = '';
    categorias.forEach((categoria, index) => {
        const li = document.createElement('li');
        li.innerHTML = `
            ${categoria}
            <button class="btn-edit" onclick="editarCategoria(${index})">Editar</button>
            <button class="btn-delete" onclick="eliminarCategoria(${index})">Eliminar</button>
        `;
        categoryList.appendChild(li);

        const option = document.createElement('option');
        option.value = categoria;
        categoryOptions.appendChild(option);
    });
};

// Permite editar el nombre de una categoría
const editarCategoria = (index) => {
    const nuevaCategoria = prompt('Editar categoría:', categorias[index]);
    if (nuevaCategoria) {
        categorias[index] = nuevaCategoria;
        guardarEnLocalStorage();
        actualizarCategorias();
    }
};

// Elimina una categoría y sus productos asociados
const eliminarCategoria = (index) => {
    if (confirm('¿Estás seguro de que deseas eliminar esta categoría?')) {
        const categoriaAEliminar = categorias[index];
        productos = productos.filter(p => p.categoria !== categoriaAEliminar);
        categorias.splice(index, 1);
        guardarEnLocalStorage();
        actualizarCategorias();
        actualizarTabla();
    }
};

// Guarda productos y categorías en el almacenamiento local
const guardarEnLocalStorage = () => {
    localStorage.setItem('productos', JSON.stringify(productos));
    localStorage.setItem('categorias', JSON.stringify(categorias));
};

// Actualiza la tabla de inventario con productos agrupados por categoría
const actualizarTabla = () => {
    productList.innerHTML = '';
    categorias.forEach(categoria => {
        const productosFiltrados = productos.filter(p => p.categoria === categoria);

        if (productosFiltrados.length > 0) {
            const headerRow = document.createElement('tr');
            headerRow.innerHTML = `<td colspan="6" style="text-align: center; font-weight: bold;">${categoria}</td>`;
            productList.appendChild(headerRow);

            productosFiltrados.forEach((producto) => {
                const index = productos.indexOf(producto); // Encuentra el índice real en el array original
                const total = producto.precio * producto.cantidad;
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${producto.nombre}</td>
                    <td>${producto.precio.toFixed(2)}</td>
                    <td>${producto.cantidad}</td>
                    <td>${producto.unidad}</td>
                    <td>${total.toFixed(2)}</td>
                    <td>
                        <button onclick="editarProducto(${index})">Editar</button>
                        <button class="btn-eliminar" onclick="eliminarProducto(${index})">Eliminar</button>
                    </td>
                `;
                productList.appendChild(row);
            });
        }
    });

    // Ocultar botones "Eliminar" si no es admin
    const urlParams = new URLSearchParams(window.location.search);
    const isGuest = urlParams.get('role') === 'guest';
    const isAdmin = localStorage.getItem('isAdmin') === 'true';
    const userIsAdmin = isAdmin && !isGuest;

    if (!userIsAdmin) {
        document.querySelectorAll('.btn-eliminar').forEach((btn) => {
            btn.style.display = 'none';
        });
    }
};


// Permite editar un producto desde la tabla inventario
const editarProducto = (index) => {
const producto = productos[index];
document.getElementById('nombre').value = producto.nombre;
document.getElementById('precio').value = producto.precio;
document.getElementById('cantidad').value = producto.cantidad;
document.getElementById('categoria').value = producto.categoria;
unidadSelect.value = producto.unidad;

editMode = true;
editIndex = index;
form.querySelector('button[type="submit"]').textContent = 'Guardar';

// Asegúrate de que el modal de agregar producto esté al frente
agregarModal.style.zIndex = '1002';
openModal(agregarModal);
};



// Elimina un producto de la tabla inventario
const eliminarProducto = (index) => {
    if (confirm('¿Estás seguro de que deseas eliminar este producto?')) {
        productos.splice(index, 1);
        guardarEnLocalStorage();
        actualizarTabla();
    }
};

// Manejo de eventos para mostrar y cerrar modales
showInventory.addEventListener('click', () => {
    actualizarTabla();
    openModal(inventoryModal);
});

showAgregar.addEventListener('click', () => openModal(agregarModal));

showCategories.addEventListener('click', () => {
    actualizarCategorias();
    openModal(categoriesModal);
});

// Detectar si el usuario no es admin
window.addEventListener('load', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const isGuest = urlParams.get('role') === 'guest';
    const isAdmin = localStorage.getItem('isAdmin') === 'true';

    if (isGuest) {
        localStorage.setItem('isAdmin', false);
    }

    const userIsAdmin = isAdmin && !isGuest;

    if (!userIsAdmin) {
        // Ocultar botones "Agregar Producto" y "Ver Categorías"
        showAgregar.style.display = 'none';
        showCategories.style.display = 'none';
    }
});
        // Función de "Cerrar sesión"
        function logout() {
            localStorage.removeItem('isAdmin'); // Eliminar estado de admin
            window.location.href = 'index.html'; // Redirigir al inicio de sesión
        }
        



// Inicializa la tabla y las categorías
actualizarTabla();
actualizarCategorias();


