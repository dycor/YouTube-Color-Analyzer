# Divulgation et consentement relatifs aux données

Ce document consigne les textes intégrés dans l’extension et leur comportement audité. Il ne remplace pas la politique de confidentialité.

## État actuel

**Implémenté et audité le 31 juillet 2026 pour la version 1.1.0.** Au premier clic sur l’icône, le panneau s’ouvre sans démarrer l’observation du lecteur ni la capture. L’observation périodique du contexte YouTube et la capture ne commencent qu’après l’acceptation explicite de la divulgation ci-dessous et uniquement pour la durée de la session d’analyse active. Une annulation ne lance aucun traitement et n’enregistre pas de refus.

## Comportement implémenté

1. À la première utilisation, le panneau s’ouvre sans démarrer la capture ni activer l’observation périodique du lecteur.
2. La divulgation est affichée dans la langue prise en charge correspondant à celle du navigateur, avec l’anglais comme langue de repli.
3. Les actions « Accepter et démarrer l’analyse » et « Annuler » sont disponibles avant tout traitement.
4. L’observation et la capture ne démarrent qu’après « Accepter et démarrer l’analyse » et restent limitées à la session d’analyse active.
5. Le panneau latéral et la fenêtre d’analyse détachable partagent la même session. « Arrêter » depuis l’une ou l’autre interface, une navigation vers une page non prise en charge, la fermeture de l’onglet ou la fin de la capture arrêtent immédiatement l’observation du lecteur et la capture. La fermeture de la dernière interface déclenche le même arrêt après un bref délai technique qui permet de tolérer son rechargement.
6. Aucune image n’est enregistrée automatiquement. Sur une image détaillée en pause uniquement, l’utilisateur peut demander explicitement l’export PNG local de l’image exacte analysée ; aucun fichier n’est uploadé et aucun historique d’export n’est conservé.
7. Seule la version du consentement, `privacyConsentVersion: 2`, est conservée localement avec les préférences d’affichage.
8. La politique de confidentialité reste accessible depuis les interfaces.
9. Une modification future des pratiques de données nécessitera d’augmenter cette version, d’afficher la nouvelle divulgation et de demander un nouveau consentement avant traitement.

## Français

### Titre

Analyse locale de la vidéo

### Texte principal

Pour générer la Parade, le Waveform et le Vecteurscope, Color Analyzer traite les informations suivantes :

- l’adresse de la page YouTube active, l’identifiant vidéo, l’état et la position du lecteur ainsi que ses dimensions ;
- le rendu visuel temporaire de l’onglet sélectionné, sans audio, ensuite recadré sur la zone vidéo ;
- les sous-titres ou superpositions lorsqu’ils sont visibles dans cette zone.

Tout le traitement s’effectue localement dans votre navigateur. Aucune image, adresse de page ou donnée de lecture n’est envoyée à un serveur, à l’éditeur ou à un tiers. Aucune image vidéo n’est enregistrée automatiquement. Un PNG est écrit sur votre appareil uniquement lorsque vous choisissez explicitement Exporter l’image. Vos préférences d’affichage et la version du consentement sont conservées dans le stockage local de Chrome. Un identifiant de capture et le dernier état technique sont conservés temporairement dans le stockage de session et disparaissent au plus tard à la fin de la session du navigateur.

Le contexte du lecteur est observé uniquement pendant la session d’analyse active. Vous pouvez arrêter à tout moment depuis le panneau ou la fenêtre détachable. La capture, l’analyse des pixels et l’observation du contexte du lecteur prennent alors fin. La fermeture de la dernière interface déclenche le même arrêt après un bref délai technique qui permet de tolérer son rechargement.

### Actions

- **Accepter et démarrer l’analyse**
- **Annuler**
- Lien secondaire : **Lire la politique de confidentialité**

### Version courte permanente

> Traitement local du contenu de l’onglet · aucun envoi ni enregistrement automatique d’image

## English

### Title

Local video analysis

### Main copy

To generate the Parade, Waveform, and Vectorscope, Color Analyzer processes:

- the active YouTube page address, video identifier, player state and position, and player dimensions;
- the temporary visual output of the selected tab, without audio, then cropped to the video area;
- captions or overlays when they are visible within that area.

All processing takes place locally in your browser. No image, page address, or playback data is sent to a server, the publisher, or any third party. No video image is saved automatically. A PNG is written to your device only when you explicitly choose Export frame. Your display preferences and consent version are kept in Chrome local storage. A capture identifier and the latest technical state are kept temporarily in session storage and disappear no later than the end of the browser session.

Player context is observed only during the active analysis session. You can stop at any time from the side panel or detached window. Capture, pixel analysis, and player-context observation then end. Closing the last interface triggers the same stop after a short technical grace period that tolerates a reload.

### Actions

- **Accept and start analysis**
- **Cancel**
- Secondary link: **Read the Privacy Policy**

### Persistent short copy

> Local tab-content processing · no upload or automatic image storage

## 中文

### 标题

本地视频分析

### 主要说明

为了生成分量图、波形图和矢量示波器，Color Analyzer 会处理以下信息：

- 当前 YouTube 页面的地址、视频标识符、播放器状态与播放位置，以及播放器尺寸；
- 所选标签页的临时视觉输出（不含音频），随后裁剪到视频区域；
- 在该区域内可见的字幕或叠加元素。

所有处理都在您的浏览器本地进行。任何图像、页面地址或播放数据都不会发送到服务器、发布者或任何第三方。视频图像不会自动保存；仅当您明确选择导出画面时，PNG 才会写入您的设备。您的显示偏好设置和同意版本会保存在 Chrome 本地存储中。捕获标识符和最新技术状态会临时保存在会话存储中，并最迟在浏览器会话结束时消失。

播放器上下文仅在分析会话处于活动状态时被观察。您可以随时从侧边栏或独立窗口停止。停止后，捕获、像素分析和播放器上下文观察都会结束。关闭最后一个界面后，会在一段允许界面重新加载的短暂技术宽限期之后触发相同的停止操作。

### 操作

- **接受并开始分析**
- **取消**
- 次要链接：**阅读隐私政策**

### 常驻简短说明

> 标签页内容在本地处理 · 不上传图像，也不自动保存图像

## Español

### Título

Análisis local del vídeo

### Texto principal

Para generar la Parade, la Forma de onda y el Vectorscopio, Color Analyzer trata la siguiente información:

- la dirección de la página de YouTube activa, el identificador del vídeo, el estado y la posición del reproductor, así como sus dimensiones;
- la salida visual temporal de la pestaña seleccionada, sin audio, que después se recorta al área del vídeo;
- los subtítulos o superposiciones cuando son visibles dentro de esa área.

Todo el tratamiento se realiza localmente en tu navegador. Ninguna imagen, dirección de página ni dato de reproducción se envía a un servidor, al editor o a terceros. Ninguna imagen del vídeo se guarda automáticamente. Solo se escribe un PNG en tu dispositivo cuando eliges explícitamente Exportar imagen. Tus preferencias de visualización y la versión del consentimiento se guardan en el almacenamiento local de Chrome. Un identificador de captura y el último estado técnico se conservan temporalmente en el almacenamiento de sesión y desaparecen, como máximo, al finalizar la sesión del navegador.

El contexto del reproductor se observa únicamente durante la sesión de análisis activa. Puedes detener el proceso en cualquier momento desde el panel lateral o la ventana separada. Entonces finalizan la captura, el análisis de píxeles y la observación del contexto del reproductor. Cerrar la última interfaz activa la misma detención tras un breve periodo de gracia técnico que permite tolerar una recarga.

### Acciones

- **Aceptar e iniciar el análisis**
- **Cancelar**
- Enlace secundario: **Leer la política de privacidad**

### Versión corta permanente

> Tratamiento local del contenido de la pestaña · ninguna imagen enviada ni guardada automáticamente

## Português

### Título

Análise local de vídeo

### Texto principal

Para gerar a Parade, o Waveform e o Vectorscope, o Color Analyzer processa:

- o endereço da página ativa do YouTube, o identificador do vídeo, o estado e a posição do player e as dimensões do player;
- a saída visual temporária da guia selecionada, sem áudio, depois recortada para a área do vídeo;
- legendas ou sobreposições quando estiverem visíveis nessa área.

Todo o processamento ocorre localmente no seu navegador. Nenhuma imagem, endereço de página ou dado de reprodução é enviado a um servidor, ao publicador ou a terceiros. Nenhuma imagem do vídeo é salva automaticamente. Um PNG só é gravado no seu dispositivo quando você escolhe explicitamente Exportar imagem. Suas preferências de exibição e a versão do consentimento são mantidas no armazenamento local do Chrome. Um identificador de captura e o estado técnico mais recente são mantidos temporariamente no armazenamento de sessão e desaparecem, no mais tardar, ao fim da sessão do navegador.

O contexto do player é observado somente durante a sessão de análise ativa. Você pode interromper o processo a qualquer momento pelo painel lateral ou pela janela destacada. A captura, a análise de pixels e a observação do contexto do player são então encerradas. Fechar a última interface aciona a mesma interrupção após um breve período técnico de tolerância que permite um recarregamento.

### Ações

- **Aceitar e iniciar a análise**
- **Cancelar**
- Link secundário: **Ler a Política de Privacidade**

### Versão curta permanente

> Processamento local do conteúdo da guia · nenhuma imagem enviada ou salva automaticamente

## Cohérence obligatoire

Les mêmes catégories de données et finalités doivent apparaître dans :

- cette divulgation ;
- la description Chrome Web Store ;
- la politique de confidentialité publique ;
- les déclarations « Privacy practices » du Dashboard ;
- le comportement réel de l’extension.
