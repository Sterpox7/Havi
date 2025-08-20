// public/js/courts.js
console.log('courts.js version 2.0 - Filtros activos.');

document.addEventListener('DOMContentLoaded', async () => {
    const courtsList = document.getElementById('courts-list');
    const sportFilter = document.getElementById('sportFilter');
    const costFilter = document.getElementById('costFilter');
    let allCourts = [];

    const fetchAllCourts = async () => {
        try {
            const response = await fetch('/api/courts');
            allCourts = await response.json();
            renderCourts();
        } catch (err) {
            console.error('Error fetching courts:', err);
            courtsList.innerHTML = '<p class="text-center text-danger">Error al cargar las canchas.</p>';
        }
    };

    const renderCourts = () => {
        const selectedSport = sportFilter.value;
        const maxCost = parseFloat(costFilter.value);

        let filteredCourts = allCourts;

        if (selectedSport && selectedSport !== 'all') {
            filteredCourts = filteredCourts.filter(court => court.sport === selectedSport);
        }

        if (maxCost && !isNaN(maxCost)) {
            filteredCourts = filteredCourts.filter(court => court.cost <= maxCost);
        }

        courtsList.innerHTML = '';
        if (filteredCourts.length === 0) {
            courtsList.innerHTML = '<p class="text-center text-white">No hay canchas disponibles que cumplan con los filtros.</p>';
            return;
        }

        filteredCourts.forEach(court => {
            const courtCard = document.createElement('div');
            courtCard.className = 'col-md-4';
            courtCard.innerHTML = `
                <div class="card court-card">
                    <img src="${court.image || 'images/default.jpg'}" class="card-img-top" alt="${court.name}">
                    <div class="card-body">
                        <h5 class="card-title">${court.name}</h5>
                        <p class="card-text">
                            <strong>Deporte:</strong> ${court.sport}<br>
                            <strong>Costo:</strong> $${court.cost}<br>
                            <strong>Duración:</strong> ${court.duration}
                        </p>
                        <a href="booking.html?courtId=${court._id}&name=${court.name}&sport=${court.sport}&cost=${court.cost}" class="btn btn-dark w-100">Reservar</a>
                    </div>
                </div>
            `;
            courtsList.appendChild(courtCard);
        });
    };

    sportFilter.addEventListener('change', renderCourts);
    costFilter.addEventListener('input', renderCourts);

    fetchAllCourts();
});