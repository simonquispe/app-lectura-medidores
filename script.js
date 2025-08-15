document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('reading-form');
    const meterPhotoInput = document.getElementById('meterPhoto');
    const uploadButton = document.getElementById('upload-button');
    const fileNameSpan = document.getElementById('file-name');

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
        const photoFile = meterPhotoInput.files[0];
        const photoName = photoFile ? photoFile.name : 'No se seleccionó archivo.';

        // 2. Get current date and time
        const now = new Date();
        const date = now.toLocaleDateString('es-ES', {
            year: 'numeric', month: 'long', day: 'numeric'
        });
        const time = now.toLocaleTimeString('es-ES');

        // 3. Get GPS location
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const latitude = position.coords.latitude;
                    const longitude = position.coords.longitude;

                    // 4. Display all data
                    displayData(meterId, reading, photoName, date, time, latitude, longitude);
                },
                (error) => {
                    console.error('Error al obtener la ubicación:', error);
                    // Display data without location
                    displayData(meterId, reading, photoName, date, time, 'No disponible', 'No disponible');
                    alert('No se pudo obtener la ubicación GPS. Asegúrate de haber concedido los permisos.');
                }
            );
        } else {
            // Geolocation not supported by the browser
            alert('La geolocalización no es compatible con este navegador.');
            displayData(meterId, reading, photoName, date, time, 'No compatible', 'No compatible');
        }
    });

    function displayData(meterId, reading, photoName, date, time, latitude, longitude) {
        const message = `
            --- Datos del Registro ---
            Número de Medidor: ${meterId}
            Lectura (kWh): ${reading}
            Nombre de la Foto: ${photoName}
            Fecha: ${date}
            Hora: ${time}
            Latitud: ${latitude}
            Longitud: ${longitude}
        `;

        console.log(message);
        alert(message);
    }
});
