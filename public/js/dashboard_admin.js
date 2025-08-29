// public/js/dashboard_admin.js
document.addEventListener('DOMContentLoaded', async () => {
    const token = localStorage.getItem('token');
    const userRole = localStorage.getItem('userRole');
    const logoutBtn = document.getElementById('logout-btn');
    const pendingBookingsContainer = document.getElementById('pending-bookings');

    if (!token || userRole !== 'admin') {
        window.location.href = '/login.html';
        return;
    }

    
    const socket = io();

    
    socket.on('new_booking_request', (booking) => {
        
        console.log('Nueva reserva en tiempo real:', booking);
        fetchAndRenderBookings();
    });

    logoutBtn.addEventListener('click', () => {
        localStorage.removeItem('token');
        localStorage.removeItem('userRole');
        window.location.href = '/login.html';
    });

    const fetchAndRenderBookings = async () => {
        try {
            const response = await fetch('/api/bookings', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const bookings = await response.json();
            
            pendingBookingsContainer.innerHTML = '';
            const pendingBookings = bookings.filter(b => b.paymentStatus === 'pending');

            if (pendingBookings.length === 0) {
                pendingBookingsContainer.innerHTML = '<p class="text-center">No hay peticiones de reserva pendientes.</p>';
                return;
            }

            pendingBookings.forEach(booking => {
                const bookingCard = document.createElement('div');
                bookingCard.className = 'col-md-6';
                bookingCard.innerHTML = `
                    <div class="card p-3">
                        <p><strong>Usuario:</strong> ${booking.user.username}</p>
                        <p><strong>Cancha:</strong> ${booking.court.name}</p>
                        <p><strong>Fecha y Hora:</strong> ${new Date(booking.date).toLocaleDateString()} a las ${booking.time}</p>
                        <p><strong>Monto de la Seña:</strong> $${booking.paymentAmount}</p>
                        <p><strong>Estado:</strong> ${booking.paymentStatus}</p>
                        <div class="d-flex justify-content-between mt-3">
                            <button class="btn btn-success accept-booking-btn" data-id="${booking._id}">Aceptar</button>
                            <button class="btn btn-danger deny-booking-btn" data-id="${booking._id}">Denegar</button>
                        </div>
                    </div>
                `;
                pendingBookingsContainer.appendChild(bookingCard);
            });
            
        } catch (error) {
            console.error('Error fetching pending bookings:', error);
            pendingBookingsContainer.innerHTML = '<p class="text-danger text-center">Error al cargar las reservas.</p>';
        }
    };

    document.getElementById('pending-bookings').addEventListener('click', (e) => {
        if (e.target.classList.contains('accept-booking-btn')) {
            const bookingId = e.target.getAttribute('data-id');
        
            console.log('Aceptar reserva:', bookingId);
        } else if (e.target.classList.contains('deny-booking-btn')) {
            const bookingId = e.target.getAttribute('data-id');
            
            console.log('Denegar reserva:', bookingId);
        }
    });

    fetchAndRenderBookings();
});