# Soporte — YouTube Color Analyzer

[Français](./SUPPORT.fr.md) | [English](./SUPPORT.md) | [中文](./SUPPORT.zh-CN.md) | **Español** | [Português](./SUPPORT.pt-BR.md)

## Obtener ayuda

- Correo electrónico de soporte: **[dyvyn.7@gmail.com](mailto:dyvyn.7@gmail.com)**
- Seguimiento de problemas: **[GitHub Issues](https://github.com/dycor/YouTube-Color-Analyzer/issues)**
- Política de privacidad: [PRIVACY.es.md](./PRIVACY.es.md)
- Plazo de respuesta orientativo: **5 días laborables**

No envíes capturas de pantalla que contengan información personal, una cuenta privada o contenido confidencial. La extensión nunca necesita tu contraseña de YouTube o Google.

## Comprobaciones rápidas

### El panel permanece en espera

1. Utiliza Google Chrome 116 o una versión posterior.
2. Abre una página estándar `https://www.youtube.com/watch?...`.
3. Vuelve a cargar la página después de instalar o actualizar la extensión.
4. Haz clic en el icono de la extensión y acepta la divulgación de datos durante el primer uso.

### El análisis está suspendido

- utiliza el modo normal o cine;
- sal de la pantalla completa, del minirreproductor de YouTube y de Picture-in-Picture;
- activa la pestaña de YouTube;
- comprueba que la imagen completa del vídeo sea visible;
- aleja el puntero para ocultar los controles de YouTube.

### Los instrumentos no se actualizan

- comprueba que el vídeo ya tenga una imagen decodificada;
- selecciona «Detener» y vuelve a hacer clic en el icono de la extensión;
- vuelve a cargar la página de YouTube si acabas de actualizar la extensión;
- prueba con otro vídeo público para descartar una restricción específica de la fuente.

### Las mediciones son diferentes de las de DaVinci Resolve

La versión 1 analiza la salida SDR visible renderizada por Chrome. No accede al archivo de vídeo original, a la señal anterior al renderizado en pantalla ni a los metadatos colorimétricos completos. Los instrumentos están destinados a la observación y no constituyen mediciones broadcast calibradas.

Los subtítulos, los controles y otras superposiciones visibles también pueden afectar al resultado.

## Alcance compatible

- páginas estándar `youtube.com/watch`;
- modos normal y cine;
- Parade YRGB/RGB, Forma de onda YRGB y Vectorscopio Rec.709;
- análisis en directo y una imagen más detallada en pausa.

La versión 1 no es compatible con Shorts, YouTube Music, reproductores integrados, pantalla completa, el minirreproductor de YouTube, Picture-in-Picture ni el análisis HDR calibrado.

## Informar de un problema

Incluye la siguiente información sin adjuntar datos sensibles:

1. versión de Chrome;
2. sistema operativo;
3. versión de la extensión;
4. tipo de página y modo del reproductor;
5. pasos para reproducir el problema;
6. resultado observado y resultado esperado;
7. cualquier error mostrado en `chrome://extensions`.

## Privacidad y seguridad

Para formular una pregunta sobre los datos o informar de una vulnerabilidad, escribe a **[dyvyn.7@gmail.com](mailto:dyvyn.7@gmail.com)**. No publiques los detalles de una vulnerabilidad que todavía no se haya corregido.

## Independencia

YouTube Color Analyzer es un proyecto independiente. No está afiliado, respaldado ni patrocinado por Google, YouTube o Blackmagic Design.
