document.addEventListener('DOMContentLoaded', () => {
    const token = localStorage.getItem('token');
    const userRole = localStorage.getItem('userRole');

    if (!token || userRole !== 'admin') {
        alert('Acceso no autorizado. Por favor, inicia sesión como administrador.');
        window.location.href = '/login.html';
        return;
    }

    const pendingUsersList = document.getElementById('pending-users-list');
    const pendingBookingsList = document.getElementById('pending-bookings-list');

    const fetchPendingUsers = async () => {
        try {
            const response = await fetch('/api/users/pending', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const users = await response.json();
            
            pendingUsersList.innerHTML = '';
            if (users.length === 0) {
                pendingUsersList.innerHTML = `<li class="list-group-item">No hay peticiones de usuarios pendientes.</li>`;
                return;
            }

            users.forEach(user => {
                const li = document.createElement('li');
                li.className = 'list-group-item d-flex justify-content-between align-items-center';
                li.innerHTML = `
                    <span>${user.username} (${user.role})</span>
                    <div>
                        <button class="btn btn-success btn-sm me-2 accept-user" data-id="${user._id}">Aceptar</button>
                        <button class="btn btn-danger btn-sm deny-user" data-id="${user._id}">Denegar</button>
                    </div>
                `;
                pendingUsersList.appendChild(li);
            });
        } catch (error) {
            console.error('Error fetching pending users:', error);
            pendingUsersList.innerHTML = `<li class="list-group-item text-danger">Error al cargar usuarios.</li>`;
        }
    };

    const fetchPendingBookings = async () => {
        try {
            const response = await fetch('/api/bookings/pending', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const bookings = await response.json();
            
            pendingBookingsList.innerHTML = '';
            if (bookings.length === 0) {
                pendingBookingsList.innerHTML = `<li class="list-group-item">No hay peticiones de reserva pendientes.</li>`;
                return;
            }

            bookings.forEach(booking => {
                const li = document.createElement('li');
                li.className = 'list-group-item';
                li.innerHTML = `
                    <div class="d-flex justify-content-between align-items-center mb-2">
                        <span>
                            <strong>${booking.court.name}</strong> - ${new Date(booking.date).toLocaleDateString()} a las ${booking.time}
                        </span>
                        <div>
                            <button class="btn btn-success btn-sm me-2 accept-booking" data-id="${booking._id}">Aceptar</button>
                            <button class="btn btn-danger btn-sm deny-booking" data-id="${booking._id}">Denegar</button>
                        </div>
                    </div>
                    <small>Usuario: ${booking.user.username}</small><br>
                    <small>Costo de la seña: $${booking.paymentAmount}</small>
                `;
                pendingBookingsList.appendChild(li);
            });
        } catch (error) {
            console.error('Error fetching pending bookings:', error);
            pendingBookingsList.innerHTML = `<li class="list-group-item text-danger">Error al cargar reservas.</li>`;
        }
    };

    const handleAction = async (url, method) => {
        try {
            const response = await fetch(url, {
                method: method,
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await response.json();
            if (response.ok) {
                alert(data.msg);
                fetchPendingUsers();
                fetchPendingBookings();
            } else {
                alert('Error: ' + data.msg);
            }
        } catch (error) {
            console.error('Error handling action:', error);
            alert('Error al conectar con el servidor.');
        }
    };

    pendingUsersList.addEventListener('click', (e) => {
        const target = e.target;
        const id = target.dataset.id;
        if (target.classList.contains('accept-user')) {
            handleAction(`/api/users/accept/${id}`, 'PUT');
        } else if (target.classList.contains('deny-user')) {
            handleAction(`/api/users/deny/${id}`, 'DELETE');
        }
    });

    pendingBookingsList.addEventListener('click', (e) => {
        const target = e.target;
        const id = target.dataset.id;
        if (target.classList.contains('accept-booking')) {
            handleAction(`/api/bookings/accept/${id}`, 'PUT');
        } else if (target.classList.contains('deny-booking')) {
            handleAction(`/api/bookings/deny/${id}`, 'DELETE');
        }
    });

    fetchPendingUsers();
    fetchPendingBookings();
});