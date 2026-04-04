
🎹 FM6 Matrix Ultra — Manual de Uso

¡Bienvenido al FM6 Matrix Ultra! Este es un sintetizador de modulación de frecuencia (FM) de 6 operadores que corre directamente en tu navegador utilizando la tecnología AudioWorklet para un rendimiento de audio de alta fidelidad.

🚀 Inicio Rápido (PASO CRUCIAL)

Para que el sintetizador funcione y los presets se carguen en el sistema, debes inicializar el motor de audio:

Abre el archivo index.html en tu navegador.

Haz clic en el botón "Inicializar Motor" ubicado en la parte superior derecha de la cabecera.

¿Por qué este paso? Los navegadores modernos bloquean el audio automático. Al hacer clic, activas el contexto de audio y disparas la función que busca y carga el archivo presets01.json.

📂 Gestión de Presets

Carga Automática

Si estás utilizando un servidor local (como Live Server en VS Code), el sistema intentará cargar automáticamente el archivo presets01.json ubicado en la misma carpeta en cuanto presiones el botón de inicialización.

Carga Manual

Si la carga automática no ocurre (o si tienes otros bancos de sonidos):

Haz clic en "Cargar Banco".

Selecciona tu archivo .json de presets.

Una vez cargado, aparecerán en el menú desplegable "BANCO".

Guardar tus propios sonidos

Ajusta los controles de los operadores, filtros y LFO.

Escribe un nombre en el cuadro de texto que dice "Nombre de preset...".

Haz clic en "Añadir a Lista".

Para no perder tus sonidos al cerrar la página, usa "Descargar Banco (.json)" para exportar tu colección.

🎹 Cómo Tocar

Tienes tres formas de generar sonido:

Teclado en pantalla: Haz clic con el mouse sobre las teclas del piano en la parte inferior.

Teclado QWERTY: Usa las teclas de tu computadora (Fila de las letras 'A', 'S', 'D' para las blancas y 'W', 'E', 'T' para las negras).

Dispositivos MIDI: Conecta un controlador MIDI por USB antes de abrir la página y el sintetizador lo detectará automáticamente.

🛠️ Estructura del Sintetizador

Operadores (1-6): Cada uno tiene su propio control de Ratio (frecuencia relativa), Nivel y envolvente ADSR. Los operadores se modulan entre sí en cadena (el 6 modula al 5, el 5 al 4, etc.).

Filtro Global: Controla el brillo general del sonido. Incluye su propia envolvente ADSR dedicada.

LFO Vibrato: Añade movimiento a la afinación para crear efectos de vibrato o sonidos más orgánicos.

Osciloscopio: En la cabecera verás la forma de onda generada en tiempo real.

⚠️ Resolución de Problemas

"Los presets no aparecen en la lista": Asegúrate de haber hecho clic en "Inicializar Motor". Si aun así no aparecen, revisa la consola del navegador (F12) para ver si hay un error de carga de archivo (CORS).

"No hay sonido": Sube el volumen de tu sistema y asegúrate de que al menos el Operador 1 tenga "Nivel" (Gain) por encima del 0%, ya que es el operador de salida principal.

Error de Archivo Local (CORS): Si abres el archivo directamente (file:///...), el navegador bloqueará la carga automática de presets01.json. Usa un servidor local o carga el archivo manualmente con el botón del panel.

Funcion diagnóstico
```javascript
async function loadDefaultPresets() {

    console.log("🔍 Intentando cargar presets01.json...");

    try {

        const response = await fetch('presets01.json');

        

        console.log("📡 Respuesta del servidor recibida:", response.status, response.statusText);

        

        if (!response.ok) {

            throw new Error(`No se pudo acceder al archivo. Status: ${response.status}`);

        }

        const data = await response.json();

        console.log("📦 Datos JSON decodificados con éxito:", data);

        const newPresets = data.presets || (Array.isArray(data) ? data : []);

        

        if (newPresets.length === 0) {

            console.warn("⚠️ El archivo está vacío o no tiene el formato correcto.");

            return;

        }

        currentBank = [...currentBank, ...newPresets];

        updatePresetList();

        

        console.log(`✅ ¡Éxito! Se cargaron ${newPresets.length} presets.`);

        // Forzar la selección del primero para ver si funciona

        if (currentBank.length > 0) {

            const selector = document.getElementById('preset-select');

            selector.value = 0;

            selector.dispatchEvent(new Event('change'));

            console.log("🎵 Primer preset activado automáticamente.");

        }

    } catch (err) {

        console.error("❌ ERROR EN LA CARGA:");

        console.error("Mensaje:", err.message);

        if (window.location.protocol === 'file:') {

            console.error("💡 DIAGNÓSTICO: Estás abriendo el HTML como archivo local. El navegador bloquea 'fetch' por seguridad (CORS). Necesitas usar un servidor local (Live Server en VS Code) o subirlo a la web.");

        }

    }

}
```
