document.getElementById('loginForm').addEventListener('submit', (e) => {
    e.preventDefault();

    const username = document.getElementById('username').value.trim(); // Elimina espacios
    const password = document.getElementById('password').value.trim(); // Elimina espacios

    // Validar usuario y contraseña
    if (username === 'carlos' && password === '123456') {
        localStorage.setItem('isAdmin', 'true'); // Guardar como string
        window.location.href = 'home.html'; // Redirigir al sistema principal
    } else {
        localStorage.setItem('isAdmin', 'false'); // Guardar como string
        document.getElementById('errorMessage').style.display = 'block';
    }
});
