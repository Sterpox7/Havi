document.addEventListener('DOMContentLoaded', async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const courtId = urlParams.get('courtId');
    const date = urlParams.get('date');
    const time = urlParams.get('time');
    const cost = parseFloat(urlParams.get('cost'));
    const courtName = urlParams.get('name');
    const courtAddress = urlParams.get('address');
    const courtImage = urlParams.get('image');

    if (!courtId) {
        document.querySelector('.payment-container').innerHTML = '<p class="text-danger text-center">Error: No se encontró el ID de la cancha. Por favor, regresa y selecciona una cancha de nuevo.</p>';
        return;
    }

    document.getElementById('court-name').textContent = courtName;
    document.getElementById('court-address').textContent = courtAddress;
    document.getElementById('court-image').src = courtImage;
    document.getElementById('booking-date').textContent = new Date(date).toLocaleDateString('es-ES');
    document.getElementById('booking-time').textContent = time;
    document.getElementById('total-cost').textContent = cost.toFixed(2);
    document.getElementById('deposit-cost').textContent = (cost / 2).toFixed(2);

    document.getElementById('payment-done-btn').addEventListener('click', async () => {
        const phoneNumber = document.getElementById('phone-number').value;
        const token = localStorage.getItem('token');
        
        if (!token) {
            alert('Debes iniciar sesión para completar la reserva.');
            window.location.href = '/login.html';
            return;
        }

        if (!phoneNumber) {
            alert('Por favor, ingresa tu número de teléfono.');
            return;
        }

        try {
            await fetch('/api/users/update-phone', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ phoneNumber })
            });
        } catch (err) {
            console.error('Error al actualizar el teléfono:', err);
        }

        const bookingData = {
            court: courtId,
            date: date,
            time: time,
            paymentAmount: cost / 2,
            paymentStatus: 'pending'
        };

        try {
            const response = await fetch('/api/bookings', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(bookingData)
            });
            const data = await response.json();
            if (response.ok) {
                alert('¡Pago realizado! Te notificaremos cuando tu reserva esté confirmada.');
                window.location.href = '/courts.html';
            } else {
                alert('Error al procesar la reserva: ' + data.msg);
            }
        } catch (err) {
            console.error('Error:', err);
            alert('Error al conectar con el servidor.');
        }
    });
});