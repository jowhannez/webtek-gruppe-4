window.onload = function() {
    const container = document.getElementById('circles-container');

    for (let i = 0; i < 3; i++) {
        const circle = document.createElement('div');
        circle.className = 'circle';

        // Sett tilfeldig posisjon fra venstre
        const leftPosition = Math.random() * (window.innerWidth - 50);
        circle.style.left = `${leftPosition}px`;

        // Legg til sirkel i containeren
        container.appendChild(circle);

        // Start animasjonen
        fall(circle);
    }

    function fall(circle) {
        let position = 0;

        // Animasjon
        const interval = setInterval(() => {
            if (position >= window.innerHeight) {
                clearInterval(interval);
                circle.remove(); // Fjerner sirkelen etter at den har falt
            } else {
                position += 5; // Flytt sirkelen nedover
                circle.style.top = `${position}px`;
            }
        }, 50); // Oppdater hvert 50 ms
    }
};