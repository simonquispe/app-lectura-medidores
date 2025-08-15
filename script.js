document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('reading-form');
    const meterPhotoInput = document.getElementById('meterPhoto');
    const uploadButton = document.getElementById('upload-button');
    const fileNameSpan = document.getElementById('file-name');
    const recordsBody = document.getElementById('records-body');

    // Make the custom button trigger the hidden file input
    uploadButton.addEventListener('click', () => {
        meterPhotoInput.click();
    });

    // Show the selected file name
    meterPhotoInput.addEventListener('change', () => {
        if (meterPhotoInput.files.length > 0) {
            fileNameSpan.textContent = meterPhotoInput.files[0].name;
        } else {
            fileNameSpan.textContent = '';
        }
    });

    form.addEventListener('submit', (event) => {
        event.preventDefault(); // Prevent the form from reloading the page

        // 1. Get form data
        const meterId = document.getElementById('meterId').value;
        const reading = document.getElementById('reading').value;

        // 2. Get current date and time
        const now = new Date();
        const dateTime = now.toLocaleString('es-ES', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });

        // 3. Get GPS location
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const latitude = position.coords.latitude.toFixed(5);
                    const longitude = position.coords.longitude.toFixed(5);
                    const location = `${latitude}, ${longitude}`;

                    // 4. Add data to the table
                    addRecordToTable(meterId, reading, dateTime, location);

                    // 5. Clear the form for the next entry
                    form.reset();
                    fileNameSpan.textContent = '';
                },
                (error) => {
                    console.error('Error al obtener la ubicación:', error);
                    // Add record without location and show a non-blocking notification
                    addRecordToTable(meterId, reading, dateTime, 'No disponible');
                    // Clear the form even if location fails
                    form.reset();
                    fileNameSpan.textContent = '';
                    // Inform the user without a blocking alert
                    console.warn('No se pudo obtener la ubicación GPS. El registro se guardó sin ella.');
                }
            );
        } else {
            // Geolocation not supported by the browser
            console.error('La geolocalización no es compatible con este navegador.');
            addRecordToTable(meterId, reading, dateTime, 'No compatible');
            form.reset();
            fileNameSpan.textContent = '';
        }
    });

    function addRecordToTable(meterId, reading, dateTime, location) {
        const newRow = recordsBody.insertRow(0); // Insert at the top

        newRow.insertCell(0).textContent = meterId;
        newRow.insertCell(1).textContent = reading;
        newRow.insertCell(2).textContent = dateTime;
        newRow.insertCell(3).textContent = location;
    }
});
