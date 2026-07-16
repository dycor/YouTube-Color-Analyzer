# YouTube Color Analyzer

[Français](./README.fr.md) | [English](./README.md) | [中文](./README.zh-CN.md) | **Español** | [Português](./README.pt-BR.md)

Extensión para Google Chrome que analiza localmente los píxeles visibles de un vídeo de YouTube con tres instrumentos inspirados en DaVinci Resolve:

- Parade `YRGB` o `RGB`;
- Waveform con canales `Y`, `R`, `G`, `B` y modo coloreado o monocromático;
- Vectorescopio Rec.709 con referencias de matiz y línea de tonos de piel.

La extensión observa la imagen sin modificar el vídeo, su archivo fuente ni su renderizado. No incluye ningún backend, no guarda ninguna imagen ni envía ningún dato a Internet.

La interfaz sigue automáticamente el idioma del navegador. Es compatible con francés, inglés, chino, español y portugués; cualquier otro idioma utiliza el inglés.

## Estado del proyecto

La base funcional incluye:

- un manifiesto Chrome MV3 para Chrome 116 o una versión posterior;
- un panel lateral con los tres instrumentos y sus ajustes;
- un pipeline local `tabCapture` → documento fuera de pantalla → Web Worker → panel;
- un núcleo colorimétrico TypeScript independiente de las API de Chrome;
- pruebas unitarias, de rendimiento y de carga en Chromium.

El proyecto está dirigido a las páginas clásicas `youtube.com/watch`, en los modos normal y cine. Shorts, reproductores integrados, pantalla completa, minirreproductor, Picture-in-Picture y el análisis HDR calibrado no forman parte de la V1.

## Desarrollo

Requisitos previos: Node.js 22.12 o una versión posterior y pnpm 10 o una versión posterior.

```bash
pnpm install
pnpm verify
```

Comandos disponibles:

```bash
pnpm dev        # reconstruye la extensión cuando hay cambios
pnpm ui:preview # abre el servidor de vista previa de la interfaz
pnpm typecheck  # comprueba los tipos TypeScript
pnpm test       # ejecuta las pruebas unitarias
pnpm build      # genera el directorio dist/
pnpm test:e2e   # compila y luego carga la extensión en Chromium
```

Para obtener una vista previa únicamente de la interfaz con datos sintéticos, ejecuta `pnpm ui:preview` y abre `/preview.html` en la dirección local mostrada por Vite. El parámetro `?lang=` permite comprobar un idioma, por ejemplo, `/preview.html?lang=zh-CN`.

## Cargar la extensión en Chrome

1. Ejecutar `pnpm build`.
2. Abrir `chrome://extensions`.
3. Activar el modo desarrollador.
4. Hacer clic en «Cargar descomprimida».
5. Seleccionar el directorio `dist/`.
6. Abrir una página `https://www.youtube.com/watch?...`.
7. Hacer clic en el icono de la extensión para abrir el panel e iniciar el análisis.

## Arquitectura

```text
src/
├── analyzer-worker/  cálculo de las densidades de los tres instrumentos
├── content-script/   estado y geometría del reproductor de YouTube
├── core/             matemáticas colorimétricas comprobables
├── offscreen/        captura, recorte y muestreo
├── service-worker/   ciclo de vida MV3 y autorización del usuario
├── shared/           contratos de mensajes y constantes
└── sidepanel/        interfaz y renderizado Canvas 2D
```

Las imágenes RGBA permanecen en el documento fuera de pantalla y en el worker de cálculo. El panel solo recibe mapas de intensidad compactos necesarios para dibujar los scopes.

## Documentación de diseño

- [`CONTEXT.md`](./CONTEXT.md) define el vocabulario y el alcance del dominio.
- [`docs/adr/`](./docs/adr/) contiene las decisiones de producto y técnicas validadas durante la definición del proyecto.

## Publicación, privacidad y soporte

- [`PRIVACY.es.md`](./PRIVACY.es.md) contiene la política de privacidad y enlaces a sus traducciones.
- [`SUPPORT.es.md`](./SUPPORT.es.md) contiene información de soporte y solución de problemas.
- [`docs/chrome-web-store/`](./docs/chrome-web-store/) contiene el paquete de publicación de Chrome Web Store: fichas localizadas, divulgaciones de datos, instrucciones de prueba y checklist.

## Licencia

El código fuente se distribuye bajo la [Mozilla Public License 2.0](./LICENSE). Las modificaciones redistribuidas de los archivos cubiertos deben seguir estando disponibles bajo la MPL 2.0. Esta licencia no concede derechos sobre marcas, nombres comerciales ni logotipos.
