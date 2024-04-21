<?php
// Directorio donde se guardarán los archivos de audio
$directorioDestino = 'audios/';

// Nombre del archivo de audio
$nombreArchivo = 'grabacion_' . date('Ymd_His') . '.wav';

// Ruta completa del archivo de audio
$rutaCompleta = $directorioDestino . $nombreArchivo;

// Guardar el archivo de audio en el servidor
if (move_uploaded_file($_FILES['audio']['tmp_name'], $rutaCompleta)) {
    // Ruta relativa del archivo de audio (desde la raíz del servidor)
    $rutaRelativa = '/' . $rutaCompleta;

    // Devolver la ruta del archivo de audio en formato JSON
    echo json_encode(['audioPath' => $rutaRelativa]);
} else {
    // Si hubo un error al guardar el archivo, devolver un mensaje de error en formato JSON
    echo json_encode(['error' => 'Error al guardar el archivo de audio']);
}
?>
