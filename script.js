document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('guardarBtn').addEventListener('click', guardarRegistro);
  cargarRegistros();
});

function guardarRegistro() {
  const medidor = document.getElementById('medidor').value;
  const lectura = document.getElementById('lectura').value;
  const fotoInput = document.getElementById('foto');
  const guardarBtn = document.getElementById('guardarBtn');

  if (!medidor || !lectura || !fotoInput.files[0]) {
    alert("Completa todos los campos.");
    return;
  }

  guardarBtn.disabled = true;
  guardarBtn.textContent = 'Cargando...';

  const reader = new FileReader();
  reader.readAsDataURL(fotoInput.files[0]);
  reader.onload = () => {
    const fotoURL = reader.result;
    const fecha = new Date().toLocaleString();

    navigator.geolocation.getCurrentPosition(pos => {
      const lat = pos.coords.latitude;
      const lon = pos.coords.longitude;

      const registro = {
        id: Date.now(), // Unique ID for each record
        medidor,
        lectura,
        fotoURL,
        fecha,
        lat,
        lon
      };

      let registros = JSON.parse(localStorage.getItem('registros')) || [];
      registros.push(registro);
      localStorage.setItem('registros', JSON.stringify(registros));

      mostrarRegistros();
      document.getElementById('registroForm').reset();
      guardarBtn.disabled = false;
      guardarBtn.textContent = 'Guardar Registro';

    }, err => {
      alert("No se pudo obtener la ubicación: " + err.message);
      guardarBtn.disabled = false;
      guardarBtn.textContent = 'Guardar Registro';
    });
  };
}

function cargarRegistros() {
  mostrarRegistros();
}

function mostrarRegistros() {
  const registrosDiv = document.getElementById('registros');
  registrosDiv.innerHTML = '';
  let registros = JSON.parse(localStorage.getItem('registros')) || [];

  registros.forEach(registro => {
    const mapaURL = `https://www.openstreetmap.org/export/embed.html?bbox=${registro.lon-0.001},${registro.lat-0.001},${registro.lon+0.001},${registro.lat+0.001}&layer=mapnik&marker=${registro.lat},${registro.lon}`;
    const registroDiv = document.createElement('div');
    registroDiv.className = "registro";
    registroDiv.innerHTML = `
      <button class="delete-btn" onclick="eliminarRegistro(${registro.id})">X</button>
      <p><b>N° Medidor:</b> ${registro.medidor}</p>
      <p><b>Lectura:</b> ${registro.lectura} kWh</p>
      <p><b>Fecha:</b> ${registro.fecha}</p>
      <p><b>Ubicación:</b> ${registro.lat.toFixed(5)}, ${registro.lon.toFixed(5)}<br>
         <a href="https://www.openstreetmap.org/?mlat=${registro.lat}&mlon=${registro.lon}#map=18/${registro.lat}/${lon}" target="_blank">Ver en Mapa</a></p>
      <p><b>Foto:</b><br><img src="${registro.fotoURL}" alt="Foto Medidor"></p>
      <p><b>Mapa:</b><br><iframe src="${mapaURL}"></iframe></p>
    `;
    registrosDiv.appendChild(registroDiv);
  });
}

function eliminarRegistro(id) {
  let registros = JSON.parse(localStorage.getItem('registros')) || [];
  registros = registros.filter(registro => registro.id !== id);
  localStorage.setItem('registros', JSON.stringify(registros));
  mostrarRegistros();
}
