document.addEventListener('DOMContentLoaded', () => {
    const sensors = {
        light: document.getElementById('light-status'),
        motion: document.getElementById('motion-status'),
        door: document.getElementById('door-status'),
        smoke: document.getElementById('smoke-status')
    };

    // Simulación de actualización de estado de sensores
    setInterval(() => {
        for (let sensor in sensors) {
            sensors[sensor].textContent = Math.random() > 0.5 ? 'Activo' : 'Inactivo';
        }
    }, 5000);
});