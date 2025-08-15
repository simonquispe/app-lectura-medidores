document.addEventListener('DOMContentLoaded', () => {
    // --- 1. Get all elements from the DOM ---
    const form = document.getElementById('reading-form');
    const meterPhotoInput = document.getElementById('meterPhoto');
    const uploadButton = document.getElementById('upload-button');
    const fileNameSpan = document.getElementById('file-name');
    const recordsContainer = document.getElementById('records-container');

    // --- 2. Defensive check ---
    if (!form || !recordsContainer || !uploadButton || !meterPhotoInput) {
        console.error("Error Crítico: Uno o más elementos esenciales del HTML no se encontraron.");
        return;
    }

    // --- 3. Core Logic ---

    // Function to create and add a new record card with an image preview
    const addRecordCard = (meterId, reading, dateTime, location, photoDataUrl) => {
        const card = document.createElement('div');
        card.className = 'record-card';

        const photoDiv = document.createElement('div');
        photoDiv.className = 'card-photo';

        // *** NUEVA LÓGICA DE IMAGEN ***
        if (photoDataUrl) {
            const img = document.createElement('img');
            img.src = photoDataUrl;
            img.alt = 'Foto del medidor';
            photoDiv.appendChild(img);
        } else {
            photoDiv.textContent = 'Sin Foto';
        }

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
        recordsContainer.prepend(card);
    };

    // Event listener for the main form submission
    form.addEventListener('submit', (event) => {
        event.preventDefault();

        const meterId = form.elements['meterId'].value;
        const reading = form.elements['reading'].value;
        const photoFile = meterPhotoInput.files.length > 0 ? meterPhotoInput.files[0] : null;

        const now = new Date();
        const dateTime = now.toLocaleString('es-ES');

        // *** LÓGICA MEJORADA CON FILEREADER ***
        const processRecord = (photoDataUrl = null) => {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(
                    (position) => {
                        const location = `${position.coords.latitude.toFixed(5)}, ${position.coords.longitude.toFixed(5)}`;
                        addRecordCard(meterId, reading, dateTime, location, photoDataUrl);
                        form.reset();
                        if (fileNameSpan) fileNameSpan.textContent = '';
                    },
                    (error) => {
                        console.error('Error de Geolocalización:', error.message);
                        addRecordCard(meterId, reading, dateTime, 'No disponible', photoDataUrl);
                        form.reset();
                        if (fileNameSpan) fileNameSpan.textContent = '';
                    }
                );
            } else {
                addRecordCard(meterId, reading, dateTime, 'No compatible', photoDataUrl);
                form.reset();
                if (fileNameSpan) fileNameSpan.textContent = '';
            }
        };

        if (photoFile) {
            const reader = new FileReader();
            reader.onload = (e) => {
                processRecord(e.target.result); // Pass the Data URL to the processing function
            };
            reader.readAsDataURL(photoFile); // Read the file to get the Data URL
        } else {
            processRecord(); // Process without a photo
        }
    });

    // Event listener for the custom "Upload Photo" button
    uploadButton.addEventListener('click', () => {
        meterPhotoInput.click();
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

/* --- Estilos para la Tarjeta de Registro --- */
.record-card {
    display: flex; /* Pone la foto y la info una al lado de la otra */
    align-items: center; /* Centra verticalmente los contenidos */
    background-color: #f9f9f9;
    border: 1px solid #ddd;
    border-radius: 8px;
    padding: 15px;
    margin-bottom: 15px;
    gap: 15px; /* Espacio entre la foto y la info */
}

.card-photo {
    flex-shrink: 0; /* Evita que la columna de la foto se encoja */
    width: 100px;   /* Ancho fijo para la columna de la foto */
    height: 100px;  /* Alto fijo para la columna de la foto */
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #e9e9e9;
    border-radius: 4px;
    overflow: hidden; /* Esconde cualquier parte de la imagen que se salga */
}

.card-photo img {
    width: 100%;      /* La imagen ocupa todo el ancho de su contenedor */
    height: 100%;     /* La imagen ocupa todo el alto de su contenedor */
    object-fit: cover; /* Redimensiona la imagen para cubrir el espacio, recortando si es necesario. ¡Esta es la magia! */
}

.card-info {
    flex-grow: 1; /* Permite que la columna de información ocupe el espacio restante */
}

.card-info p {
    margin: 5px 0; /* Espaciado entre las líneas de texto */
    word-break: break-word; /* Evita que textos largos se salgan de la tarjeta */
}
























