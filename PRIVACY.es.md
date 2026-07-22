# Política de privacidad — YouTube Color Analyzer

[Français](./PRIVACY.fr.md) | [English](./PRIVACY.md) | [中文](./PRIVACY.zh-CN.md) | **Español** | [Português](./PRIVACY.pt-BR.md)

Fecha de entrada en vigor: 17 de julio de 2026  
Última actualización: 22 de julio de 2026

Editor: **Color Analyzer**

Contacto de privacidad: **[dyvyn.7@gmail.com](mailto:dyvyn.7@gmail.com)**

## 1. Finalidad de la extensión

YouTube Color Analyzer es una extensión de Chrome que genera localmente una Parade, una Forma de onda y un Vectorscopio a partir de la imagen visible de un vídeo de YouTube. Su única finalidad es observar y analizar el color; no modifica el vídeo, su archivo fuente ni su renderizado.

## 2. Resumen

- el análisis solo comienza después de que el usuario haga clic explícitamente en el icono de la extensión y, durante el primer uso o tras actualizarse la divulgación, acepte la divulgación de datos mostrada en la extensión;
- el contexto de la página y el estado del reproductor se observan únicamente durante una sesión de análisis activa, y la observación termina con dicha sesión;
- los píxeles visibles del vídeo se procesan localmente en el dispositivo;
- no se captura el audio;
- ninguna imagen del vídeo se guarda en el disco ni se envía al editor;
- la extensión no incluye cuentas de usuario, publicidad, análisis de audiencia ni un servidor de aplicación;
- el editor no vende, comparte ni recibe ningún dato generado por el análisis.

## 3. Datos tratados

### 3.1 Píxeles visibles del vídeo

Durante una sesión de análisis activa, la extensión captura temporalmente la salida visual de toda la pestaña de YouTube seleccionada. A continuación, recorta el área visible del vídeo y lee únicamente los valores de píxel de esa área para calcular los tres instrumentos colorimétricos.

La salida capturada puede incluir elementos superpuestos de forma visible sobre el vídeo, como subtítulos o controles del reproductor. La extensión avisa de algunos de estos casos porque pueden afectar a la medición.

Las matrices de píxeles sin procesar se conservan en la memoria de trabajo durante el tiempo necesario para calcular una medición y después se liberan sus referencias. Durante una sesión activa, el lienzo local puede conservar en memoria la última imagen recortada hasta que otra imagen la sustituya. Cuando se detiene la captura, el lienzo se restablece a 1 × 1 píxel y se libera la fuente de vídeo. Ninguna imagen se escribe en un almacenamiento persistente, se añade a un historial ni se transmite por Internet.

### 3.2 Contexto de la página y estado del reproductor

Un script local de la extensión está presente en las páginas de `youtube.com`, pero permanece inactivo hasta que el usuario haya aceptado la divulgación de datos vigente e inicie explícitamente un análisis. Únicamente durante una sesión de análisis activa, observa periódicamente el contexto de la página y el estado del reproductor. Esta observación se detiene de inmediato cuando el usuario selecciona «Detener», navega a una página no compatible, cierra la pestaña o finaliza la captura. Al cerrar el panel lateral, se detiene tras un breve periodo de gracia técnico que permite tolerar una recarga del panel. El contexto del reproductor no se observa entre sesiones de análisis. Para localizar correctamente el vídeo, detectar la navegación interna de YouTube y sincronizar las mediciones durante la sesión activa, la extensión trata temporalmente:

- la dirección de la página de YouTube actual y el identificador del vídeo;
- el tiempo de reproducción y el estado de reproducción, pausa o búsqueda;
- el modo del reproductor, la visibilidad de la pestaña y la presencia de controles o subtítulos;
- las dimensiones de la ventana, del reproductor y del vídeo original.

Esta información se utiliza únicamente para proporcionar el análisis solicitado, suspender el cálculo de las mediciones cuando la fuente no puede medirse de forma fiable y evitar analizar un área incorrecta. La dirección de la página, el identificador del vídeo y el tiempo de reproducción no se almacenan de forma persistente ni se transmiten al editor.

### 3.3 Preferencias locales

La extensión guarda las siguientes preferencias de visualización en el almacenamiento local de Chrome: instrumento seleccionado, modo de Parade, canales de la Forma de onda, visualización en color y visibilidad de la línea de tonos de piel. También conserva la versión de la divulgación relativa a los datos que haya aceptado el usuario. Este valor técnico no contiene ninguna identidad, dirección de página ni imagen de vídeo.

Estas preferencias permanecen en el dispositivo hasta que se sustituyen, se borran los datos de la extensión o se desinstala la extensión.

### 3.4 Datos técnicos de la sesión

Durante la sesión del navegador, la extensión puede conservar un identificador aleatorio de sesión, el identificador interno de la pestaña capturada y el último estado del análisis. Esta información se utiliza únicamente para asociar las mediciones con la captura correcta y detenerla de forma adecuada. Permanece en el almacenamiento de sesión de Chrome y no se envía al editor.

## 4. Transmisión, intercambio y venta

YouTube Color Analyzer no transmite datos del usuario al editor ni a terceros. Los mensajes entre el script de la página, el documento fuera de pantalla, el Web Worker, el service worker y el panel lateral permanecen dentro de la extensión en el dispositivo.

La extensión:

- no vende ningún dato;
- no comparte datos con fines publicitarios, de creación de perfiles o de evaluación de solvencia;
- no utiliza los datos para ninguna finalidad ajena al análisis colorimétrico;
- no ejecuta código alojado de forma remota;
- no contiene ningún sistema de telemetría ni de análisis de audiencia.

YouTube y Google pueden tratar datos de forma independiente cuando el usuario utiliza sus servicios. Dichos tratamientos se rigen por sus propias políticas y esta extensión no los controla.

## 5. Conservación y eliminación

- **Píxeles del vídeo**: memoria de trabajo local; las matrices sin procesar se liberan después del cálculo. El último recorte solo puede permanecer en el lienzo durante la sesión activa; al detenerse, el lienzo se restablece a 1 × 1 píxel y se libera la fuente de vídeo.
- **Contexto del reproductor**: memoria temporal, sustituida continuamente solo durante una sesión de análisis activa. La observación no comienza antes del consentimiento y se detiene de inmediato cuando termina la sesión.
- **Estado de la sesión**: el identificador de la captura activa se elimina cuando se detiene la captura; el último estado puede permanecer en el almacenamiento de sesión de Chrome hasta que termine la sesión del navegador.
- **Preferencias de visualización y versión del consentimiento**: almacenamiento local de Chrome, conservadas hasta que se modifican, se eliminan o se desinstala la extensión.

Seleccionar «Detener», navegar a una página no compatible, cerrar la pestaña o el fin de la captura detienen de inmediato la captura, el análisis de píxeles y la observación del contexto del reproductor. Cerrar el panel lateral activa la misma limpieza tras un breve periodo de gracia técnico que permite tolerar una recarga del panel. Esta limpieza restablece el lienzo de análisis a 1 × 1 píxel y libera la fuente de vídeo. El contexto del reproductor no se observa antes del consentimiento ni después de que termine la sesión de análisis activa. Las preferencias guardadas se pueden eliminar borrando los datos de la extensión en Chrome o desinstalando la extensión.

El editor no posee ninguna copia remota de esta información y, por tanto, no puede consultarla ni eliminarla de forma remota.

## 6. Permisos de Chrome

La extensión utiliza únicamente los permisos necesarios para su finalidad:

- **tabCapture**: capturar temporalmente la salida visible de la pestaña seleccionada, sin audio;
- **offscreen**: recibir y analizar localmente el flujo capturado en un documento fuera de pantalla de Chrome;
- **sidePanel**: mostrar los instrumentos y sus controles en el panel lateral de Chrome;
- **storage**: conservar las preferencias locales, la versión del consentimiento y el estado técnico de la sesión;
- **acceso a `https://www.youtube.com/*`**: únicamente durante una sesión de análisis activa, detectar el reproductor de YouTube, su geometría, su estado y la navegación fuera del vídeo seleccionado. La captura solo comienza en una página `/watch` compatible después del consentimiento y de una acción del usuario.

## 7. Seguridad

El tratamiento está aislado en los componentes locales de la extensión. Su política de seguridad de contenido solo permite los scripts incluidos en el paquete de la extensión. Ningún dato capturado se transmite a través de una red.

## 8. Cumplimiento del Uso limitado

El uso de la información recibida de las API de Google cumplirá la Política de datos de usuario de Chrome Web Store, incluidos los requisitos de Uso limitado.

## 9. Cambios en esta política

Esta política se actualizará si cambian las prácticas de tratamiento de datos de la extensión. Cualquier cambio en estas prácticas se comunicará de forma activa y visible en la ficha de Chrome Web Store y en la interfaz de la extensión antes de que entre en vigor. Se solicitará un nuevo consentimiento antes de cualquier tratamiento basado en las prácticas modificadas.

## 10. Contacto

Para cualquier pregunta sobre esta política o la extensión, escribe a: **[dyvyn.7@gmail.com](mailto:dyvyn.7@gmail.com)**.

## 11. Independencia

YouTube Color Analyzer es un proyecto independiente. No está afiliado, respaldado ni patrocinado por Google, YouTube o Blackmagic Design. YouTube y DaVinci Resolve son marcas de sus respectivos propietarios.
