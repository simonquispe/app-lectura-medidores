document.addEventListener('DOMContentLoaded', () => {

    // Get all interactive elements from the DOM

    const form = document.getElementById('reading-form');
    const meterPhotoInput = document.getElementById('meterPhoto');
    const uploadButton = document.getElementById('upload-button');
    const fileNameSpan = document.getElementById('file-name');

    const recordsContainer = document.getElementById('records-container');

    // Defensive check: if the main form or records container is missing, don't proceed.
    if (!form || !recordsContainer) {
        console.error("No se encontraron los elementos esenciales del formulario o del contenedor de registros. El script no puede continuar.");
        return;
    } else {
        // --- Core function to add a record card to the UI ---
        function addRecordCard(meterId, reading, dateTime, location) {
            // 1. Create the main card container
            const card = document.createElement('div');
            card.className = 'record-card';

            // 2. Create the photo column
            const photoDiv = document.createElement('div');
            photoDiv.className = 'card-photo';
            photoDiv.textContent = 'FOTO'; // Placeholder text

            // 3. Create the info column
            const infoDiv = document.createElement('div');
            infoDiv.className = 'card-info';
            infoDiv.innerHTML = `
                <p><strong>Nº Medidor:</strong> ${meterId}</p>
                <p><strong>Lectura:</strong> ${reading} kWh</p>
                <p><strong>Fecha:</strong> ${dateTime}</p>
                <p><strong>Ubicación:</strong> ${location}</p>
            `;

            // 4. Assemble the card and add it to the container
            card.appendChild(photoDiv);
            card.appendChild(infoDiv);
            recordsContainer.prepend(card); // Use prepend to show newest first
        }

        // --- Event listener for the form submission ---
        form.addEventListener('submit', (event) => {
            event.preventDefault();

            // Get form data
            const meterId = form.elements['meterId'].value;
            const reading = form.elements['reading'].value;

            // Get current date and time, formatted for readability
            const now = new Date();
            const dateTime = now.toLocaleString('es-ES', {
                year: 'numeric', month: 'short', day: 'numeric',
                hour: '2-digit', minute: '2-digit'
            });

            // Get GPS location
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(
                    (position) => {
                        const latitude = position.coords.latitude.toFixed(5);
                        const longitude = position.coords.longitude.toFixed(5);
                        addRecordCard(meterId, reading, dateTime, `${latitude}, ${longitude}`);
                        form.reset();
                        if (fileNameSpan) fileNameSpan.textContent = '';
                    },
                    (error) => {
                        console.error('Error de geolocalización:', error.message);
                        addRecordCard(meterId, reading, dateTime, 'No disponible');
                        form.reset();
                        if (fileNameSpan) fileNameSpan.textContent = '';
                    }
                );
            } else {
                console.warn('La geolocalización no es compatible con este navegador.');
                addRecordCard(meterId, reading, dateTime, 'No compatible');
                form.reset();
                if (fileNameSpan) fileNameSpan.textContent = '';
            }
        });

        // --- Event listener for the custom upload button ---
        if (uploadButton && meterPhotoInput) {
            uploadButton.addEventListener('click', () => {
                meterPhotoInput.click();
            });
        }

        // --- Event listener to show the selected file name ---
        if (meterPhotoInput && fileNameSpan) {
            meterPhotoInput.addEventListener('change', () => {
                if (meterPhotoInput.files.length > 0) {
                    fileNameSpan.textContent = meterPhotoInput.files[0].name;
                } else {
                    fileNameSpan.textContent = '';
                }
            });
        }
    }
});
