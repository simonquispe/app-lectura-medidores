document.addEventListener('DOMContentLoaded', () => {
    // --- 1. Get all elements from the DOM ---
    const form = document.getElementById('reading-form');
    const meterPhotoInput = document.getElementById('meterPhoto');
    const uploadButton = document.getElementById('upload-button');
    const fileNameSpan = document.getElementById('file-name');
    const recordsContainer = document.getElementById('records-container'); // Correct ID

    // --- 2. Defensive check ---
    // If essential elements are missing, stop the script.
    if (!form || !recordsContainer || !uploadButton || !meterPhotoInput) {
        console.error("Error Crítico: Uno o más elementos esenciales del HTML no se encontraron. Revisa los IDs en index.html. El script se detendrá.");
        return; // Stop execution
    }

    // --- 3. Core Logic (Only runs if the check passes) ---

    // Function to create and add a new record card
    const addRecordCard = (meterId, reading, dateTime, location, photoName) => {
        const card = document.createElement('div');
        card.className = 'record-card';

        const photoDiv = document.createElement('div');
        photoDiv.className = 'card-photo';
        // For now, just show the file name as a placeholder
        photoDiv.textContent = photoName ? `FOTO: ${photoName}` : 'FOTO: No seleccionada';

        const infoDiv = document.createElement('div');
        infoDiv.className = 'card-info';
        infoDiv.innerHTML = `
            <p><strong>Nº Medidor:</strong> ${meterId}</p>
            <p><strong>Lectura:</strong> ${reading} kWh</p>
            <p><strong>Fecha:</strong> ${dateTime}</p>
            <p><strong>Ubicación:</strong> ${location}</p>
        `;

        card.appendChild(photoDiv);
        card.appendChild(infoDiv);
        recordsContainer.prepend(card); // Add the new card at the top
    };

    // Event listener for the main form submission
    form.addEventListener('submit', (event) => {
        event.preventDefault();

        const meterId = form.elements['meterId'].value;
        const reading = form.elements['reading'].value;
        const photoFile = meterPhotoInput.files.length > 0 ? meterPhotoInput.files[0].name : null;

        const now = new Date();
        const dateTime = now.toLocaleString('es-ES');

        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const location = `${position.coords.latitude.toFixed(5)}, ${position.coords.longitude.toFixed(5)}`;
                    addRecordCard(meterId, reading, dateTime, location, photoFile);
                    form.reset();
                    if (fileNameSpan) fileNameSpan.textContent = '';
                },
                (error) => {
                    console.error('Error de Geolocalización:', error.message);
                    addRecordCard(meterId, reading, dateTime, 'No disponible', photoFile);
                    form.reset();
                    if (fileNameSpan) fileNameSpan.textContent = '';
                }
            );
        } else {
            addRecordCard(meterId, reading, dateTime, 'No compatible', photoFile);
            form.reset();
            if (fileNameSpan) fileNameSpan.textContent = '';
        }
    });

    // Event listener for the custom "Upload Photo" button
    uploadButton.addEventListener('click', () => {
        meterPhotoInput.click(); // Trigger the hidden file input
    });

    // Event listener to show the selected file name
    meterPhotoInput.addEventListener('change', () => {
        if (meterPhotoInput.files.length > 0) {
            if(fileNameSpan) fileNameSpan.textContent = meterPhotoInput.files[0].name;
        } else {
            if(fileNameSpan) fileNameSpan.textContent = '';
        }
    });
});
