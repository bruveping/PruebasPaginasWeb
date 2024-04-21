 // Inicializar el mapa
 let map = L.map('map').setView([0, 0], 2);

 // Añadir capa de OpenStreetMap
 L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
     maxZoom: 20,
     attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
 }).addTo(map);

 // Obtener la ubicación del dispositivo si el navegador lo permite
 navigator.geolocation.getCurrentPosition(function (position) {
     var lat = position.coords.latitude;
     var lon = position.coords.longitude;

     console.log(lat);
     console.log(lon);

     // Añadir marcador de la ubicación del dispositivo
     L.marker([lat, lon]).addTo(map)
         .bindPopup('¡Estás aquí!')
         .openPopup();

     // Centrar el mapa en la ubicación del dispositivo
     map.setView([lat, lon], 15);
 });

 // Cargar las localizaciones guardadas desde un archivo JSON
 fetch('localizaciones.json')
     .then(response => response.json())
     .then(data => {
         data.forEach(location => {
             // Añadir marcador para cada localización
             var pathCoords = [
                 [-0.001 + location.lat, 0.0006 + location.lon],
                 [-0.0006 + location.lat, 0.001 + location.lon],
                 [location.lat, 0.0003 + location.lon],
                 [0.0006 + location.lat, 0.001 + location.lon],
                 [0.001 + location.lat, 0.0006 + location.lon],
                 [0.0003 + location.lat, location.lon],
                 [0.001 + location.lat, -0.0006 + location.lon],
                 [0.0006 + location.lat, -0.001 + location.lon],
                 [location.lat, -0.0003 + location.lon],
                 [-0.0006 + location.lat, -0.001 + location.lon],
                 [-0.001 + location.lat, -0.0006 + location.lon],
                 [-0.0003 + location.lat, location.lon],
                 [-0.001 + location.lat, 0.0006 + location.lon]
             ];

             // Crea un polígono utilizando las coordenadas del camino
             var polygon = L.polygon(pathCoords, {
                 color: '#000000', // Color del borde
                 fillColor: '#ff0000', // Color de relleno
                 fillOpacity: 0.4, // Opacidad del relleno
                 weight: 1 // Grosor del borde
             }).addTo(map).bindPopup(location.name);

             // Adjunta un evento de clic al polígono
             polygon.on('click', function () {
                 // Cargar y reproducir el audio asociado
                 var audioPath = location.audio;
                 if (audioPath) {
                     var audio = new Audio(audioPath);
                     audio.play();
                 }
             });
         });
     })
     .catch(error => console.error('Error cargando localizaciones:', error));
 var popup = L.popup();

 function onMapClick(e) {
     popup
         .setLatLng(e.latlng)
         .setContent("You clicked the map at " + e.latlng.toString())
         .openOn(map);
 }

 map.on('click', onMapClick);


 // Variables para guardar el stream de audio y el objeto MediaRecorder
 let audioStream;
let mediaRecorder;
let chunks = [];

const startRecordingBtn = document.getElementById('startRecording');
const stopRecordingBtn = document.getElementById('stopRecording');
const playRecordingBtn = document.getElementById('playRecording');

startRecordingBtn.addEventListener('click', async () => {
    try {
        audioStream = await navigator.mediaDevices.getUserMedia({ audio: true });
        mediaRecorder = new MediaRecorder(audioStream);

        mediaRecorder.ondataavailable = function(e) {
            chunks.push(e.data);
        };

        mediaRecorder.onstop = function(e) {
            const audioBlob = new Blob(chunks, { type: 'audio/wav' });
            const formData = new FormData();
            formData.append('audio', audioBlob, 'recording.wav');

            fetch('guardar_audio.php', {
                method: 'POST',
                body: formData
            })
            .then(response => response.json())
            .then(data => {
                // Actualizar el archivo JSON con la nueva ubicación y el path del audio
                const newLocation = {
                    name: 'Nueva Ubicación',
                    lat: 0, // Reemplaza con la latitud real del usuario
                    lon: 0, // Reemplaza con la longitud real del usuario
                    audioPath: data.audioPath
                };
                // Añadir la nueva ubicación al arreglo de ubicaciones
                // data.locations.push(newLocation);

                // Aquí puedes llamar a una función que agregue el nuevo polígono al mapa con el audio asociado
            })
            .catch(error => console.error('Error al guardar el audio:', error));
        };

        mediaRecorder.start();

        startRecordingBtn.disabled = true;
        stopRecordingBtn.disabled = false;
        playRecordingBtn.disabled = true;
    } catch (error) {
        console.error('Error al comenzar la grabación:', error);
    }
});

stopRecordingBtn.addEventListener('click', () => {
    if (mediaRecorder && mediaRecorder.state !== 'inactive') {
        mediaRecorder.stop();
        audioStream.getTracks().forEach(track => track.stop());

        startRecordingBtn.disabled = false;
        stopRecordingBtn.disabled = true;
        playRecordingBtn.disabled = false;
    }
});

playRecordingBtn.addEventListener('click', () => {
    if (chunks.length > 0) {
        const audioBlob = new Blob(chunks, { type: 'audio/wav' });
        const audioUrl = URL.createObjectURL(audioBlob);

        const audioElement = new Audio(audioUrl);
        audioElement.play();
    }
});