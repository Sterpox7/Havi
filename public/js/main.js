document.addEventListener('DOMContentLoaded', () => {
    // Lógica de Registro
    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
        registerForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;
            const role = document.getElementById('role').value;
            try {
                const response = await fetch('/api/users/register', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ username, password, role }),
                });
                const data = await response.json();
                if (response.ok) {
                    alert('Registro exitoso. Esperando aprobación del administrador.');
                    window.location.href = '/login.html';
                } else {
                    alert('Error: ' + data.msg);
                }
            } catch (err) {
                console.error('Error:', err);
                alert('Error al conectar con el servidor.');
            }
        });
    }

    // Login
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;
            try {
                const response = await fetch('/api/users/login', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ username, password }),
                });
                const data = await response.json();
                if (response.ok) {
                    localStorage.setItem('token', data.token);
                    localStorage.setItem('userRole', data.role);
                    alert('Inicio de sesión exitoso. Redirigiendo...');
                    // Redirigir a canchas
                    window.location.href = '/courts.html';
                } else {
                    alert('Error: ' + data.msg);
                }
            } catch (err) {
                console.error('Error:', err);
                alert('Error al conectar con el servidor.');
            }
        });
    }
});