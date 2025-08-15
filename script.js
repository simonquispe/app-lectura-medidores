document.addEventListener('DOMContentLoaded', () => {
    // Get all interactive elements from the DOM
    const form = document.getElementById('reading-form');
    const meterPhotoInput = document.getElementById('meterPhoto');
    const uploadButton = document.getElementById('upload-button');
    const fileNameSpan = document.getElementById('file-name');
    const recordsBody = document.getElementById('records-body');

    // Defensive check: if the main form or table body is missing, don't proceed.
    if (!form || !recordsBody) {
        console.error("No se encontraron los elementos esenciales del formulario o de la tabla. El script no puede continuar.");
        return;
    }

    // --- Core function to add a record to the table ---
    function addRecordToTable(meterId, reading, dateTime, location) {
        const newRow = recordsBody.insertRow(0); // Insert new records at the top

        newRow.insertCell(0).textContent = meterId;
        newRow.insertCell(1).textContent = reading;
        newRow.insertCell(2).textContent = dateTime;
        newRow.insertCell(3).textContent = location;
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
                    addRecordToTable(meterId, reading, dateTime, `${latitude}, ${longitude}`);
                    form.reset();
                    if (fileNameSpan) fileNameSpan.textContent = '';
                },
                (error) => {
                    console.error('Error de geolocalización:', error.message);
                    addRecordToTable(meterId, reading, dateTime, 'No disponible');
                    form.reset();
                    if (fileNameSpan) fileNameSpan.textContent = '';
                }
            );
        } else {
            console.warn('La geolocalización no es compatible con este navegador.');
            addRecordToTable(meterId, reading, dateTime, 'No compatible');
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
});
