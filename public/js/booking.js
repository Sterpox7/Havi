
document.addEventListener('DOMContentLoaded', async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const courtId = urlParams.get('courtId');
    const bookingDateInput = document.getElementById('booking-date');
    const scheduleGrid = document.getElementById('schedule');
    
    let selectedCourt;

    const fetchCourtDetails = async () => {
        try {
            const res = await fetch(`/api/courts/${courtId}`);
            selectedCourt = await res.json();
            document.getElementById('court-name').textContent = selectedCourt.name;
            document.getElementById('court-info').textContent = `Costo: $${selectedCourt.cost} | Duración: ${selectedCourt.duration} minutos`;
        } catch (err) {
            console.error('Error fetching court details:', err);
        }
    };
    
    const fetchSchedule = async (date) => {
        const allTimes = generateTimes('09:00', '21:00', selectedCourt.duration);
        
        try {
            const response = await fetch(`/api/bookings/occupied?courtId=${courtId}&date=${date}`);
            const occupiedBookings = await response.json();
            const occupiedTimes = occupiedBookings.map(booking => booking.time);

            scheduleGrid.innerHTML = '';
            allTimes.forEach(time => {
                const isOccupied = occupiedTimes.includes(time);
                const button = document.createElement('a');
                button.className = `btn schedule-btn ${isOccupied ? 'btn-warning' : 'btn-success'}`;
                button.textContent = isOccupied ? `${time} (Ocupado)` : `Reservar ${time}`;
                
                if (!isOccupied) {
                    const params = new URLSearchParams({
                        courtId: courtId,
                        date: date,
                        time: time,
                        cost: selectedCourt.cost,
                        name: selectedCourt.name,
                        address: selectedCourt.address,
                        image: selectedCourt.image
                    });
                    button.href = `/payment.html?${params.toString()}`;
                } else {
                    button.href = '#';
                    button.style.cursor = 'not-allowed';
                }
                scheduleGrid.appendChild(button);
            });
        } catch (err) {
            console.error('Error fetching schedule:', err);
            scheduleGrid.innerHTML = '<p class="text-danger">Error al cargar los horarios.</p>';
        }
    };

    const generateTimes = (start, end, interval) => {
        const times = [];
        let [startHour, startMin] = start.split(':').map(Number);
        const [endHour, endMin] = end.split(':').map(Number);
        
        let currentTime = new Date();
        currentTime.setHours(startHour, startMin, 0, 0);
        const endTime = new Date();
        endTime.setHours(endHour, endMin, 0, 0);

        while (currentTime <= endTime) {
            times.push(currentTime.toTimeString().substring(0, 5));
            currentTime.setMinutes(currentTime.getMinutes() + interval);
        }
        return times;
    };

    bookingDateInput.addEventListener('change', (e) => {
        if (selectedCourt) {
            fetchSchedule(e.target.value);
        }
    });

    if (courtId) {
        fetchCourtDetails().then(() => {
            const today = new Date().toISOString().split('T')[0];
            bookingDateInput.value = today;
            bookingDateInput.min = today;
            fetchSchedule(today);
        });
    } else {
        document.querySelector('.booking-container').innerHTML = '<p class="text-danger">No se encontró el ID de la cancha.</p>';
    }
});