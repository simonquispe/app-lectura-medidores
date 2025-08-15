document.addEventListener('DOMContentLoaded', () => {
  // --- 1. Get all elements from the DOM ---
  const form = document.getElementById('reading-form');
  const meterPhotoInput = document.getElementById('meterPhoto');
  const uploadButton = document.getElementById('upload-button');
  const fileNameSpan = document.getElementById('file-name');
  const recordsContainer = document.getElementById('records-container');
  const previewImg = document.getElementById('preview-img');

  // --- 2. Defensive check ---
  if (!form || !recordsContainer || !uploadButton || !meterPhotoInput) {
    console.error("Error Crítico: Uno o más elementos esenciales del HTML no se encontraron.");
    return;
  }

  // --- 3. Helpers ---
  const LS_KEY = 'meterReadings';

  const readFileAsDataURL = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = e => resolve(e.target.result);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });

  const getLocation = () =>
    new Promise(resolve => {
      if (!navigator.geolocation) {
        resolve({ ok: false, value: 'No compatible' });
        return;
      }
      navigator.geolocation.getCurrentPosition(
        pos => {
          const loc = `${pos.coords.latitude.toFixed(5)}, ${pos.coords.longitude.toFixed(5)}`;
          resolve({ ok: true, value: loc });
        },
        err => {
          console.warn('Geolocalización denegada o falló:', err?.message);
          resolve({ ok: false, value: 'No disponible' });
        },
        { enableHighAccuracy: false, timeout: 10000, maximumAge: 60000 }
      );
    });

  const loadRecords = () => {
    try {
      const raw = localStorage.getItem(LS_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  };

  const saveRecords = (arr) => {
    localStorage.setItem(LS_KEY, JSON.stringify(arr));
  };

  const createRecord = ({ meterId, reading, location, photoDataUrl }) => {
    const now = new Date();
    return {
      id: crypto.randomUUID ? crypto.randomUUID() : String(now.getTime()),
      meterId: meterId.trim(),
      reading: Number(reading),
      dateISO: now.toISOString(),
      dateLocal: now.toLocaleString('es-ES'),
      location,
      photoDataUrl: photoDataUrl || null,
    };
  };

  const renderRecordCard = (rec) => {
    const card = document.createElement('div');
    card.className = 'record-card';
    card.dataset.id = rec.id;

    const photoDiv = document.createElement('div');
    photoDiv.className = 'card-photo';
    if (rec.photoDataUrl) {
      const img = document.createElement('img');
      img.src = rec.photoDataUrl;
      img.alt = 'Foto del medidor';
      photoDiv.appendChild(img);
    } else {
      photoDiv.textContent = 'Sin Foto';
    }

    const infoDiv = document.createElement('div');
    infoDiv.className = 'card-info';
    infoDiv.innerHTML = `
      <p><strong>Nº Medidor:</strong> ${rec.meterId}</p>
      <p><strong>Lectura:</strong> ${rec.reading} kWh</p>
      <p><strong>Fecha:</strong> ${rec.dateLocal}</p>
      <p><strong>Ubicación:</strong> ${rec.location}</p>
    `;

    const actionsDiv = document.createElement('div');
    actionsDiv.className = 'card-actions';

    const delBtn = document.createElement('button');
    delBtn.type = 'button';
    delBtn.className = 'btn-delete';
    delBtn.textContent = 'Eliminar';

    delBtn.addEventListener('click', () => {
      const all = loadRecords().filter(x => x.id !== rec.id);
      saveRecords(all);
      card.remove();
    });

    actionsDiv.appendChild(delBtn);

    card.appendChild(photoDiv);
    card.appendChild(infoDiv);
    card.appendChild(actionsDiv);

    recordsContainer.prepend(card);
  };

  const renderAll = () => {
    recordsContainer.querySelectorAll('.record-card').forEach(n => n.remove());
    const all = loadRecords();
    all.forEach(renderRecordCard);
  };

  // --- 4. Events ---

  // Open file dialog
  uploadButton.addEventListener('click', () => {
    meterPhotoInput.click();
  });

  // Show selected file name + preview
  meterPhotoInput.addEventListener('change', async () => {
    if (meterPhotoInput.files && meterPhotoInput.files.length > 0) {
      const file = meterPhotoInput.files[0];
      if (fileNameSpan) fileNameSpan.textContent = file.name;

      if (previewImg) {
        try {
          const dataUrl = await readFileAsDataURL(file);
          previewImg.src = dataUrl;
          previewImg.style.display = 'block';
        } catch {
          previewImg.removeAttribute('src');
          previewImg.style.display = 'none';
        }
      }
    } else {
      if (fileNameSpan) fileNameSpan.textContent = '';
      if (previewImg) {
        previewImg.removeAttribute('src');
        previewImg.style.display = 'none';
      }
    }
  });

  // Submit form
  form.addEventListener('submit', async (event) => {
    event.preventDefault();

    const meterId = form.elements['meterId']?.value ?? '';
    const reading = form.elements['reading']?.value ?? '';

    // Validaciones simples
    if (!meterId.trim()) {
      alert('Ingrese el número de medidor.');
      return;
    }
    if (reading === '' || isNaN(Number(reading)) || Number(reading) < 0) {
      alert('Ingrese una lectura válida (>= 0).');
      return;
    }
    if (!(meterPhotoInput.files && meterPhotoInput.files[0])) {
      alert('Debe adjuntar la foto del medidor.');
      return;
    }

    // Lee foto
    let photoDataUrl = null;
    try {
      photoDataUrl = await readFileAsDataURL(meterPhotoInput.files[0]);
    } catch (e) {
      console.error('Error leyendo la foto:', e);
    }

    // Geolocalización
    const loc = await getLocation();

    const record = createRecord({
      meterId,
      reading,
      location: loc.value,
      photoDataUrl,
    });

    const all = loadRecords();
    all.push(record);
    saveRecords(all);
    renderRecordCard(record);

    // Reset UI
    form.reset();
    if (fileNameSpan) fileNameSpan.textContent = '';
    if (previewImg) {
      previewImg.removeAttribute('src');
      previewImg.style.display = 'none';
    }
  });

  // --- 5. Init ---
  renderAll();
});



















