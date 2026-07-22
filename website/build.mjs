import { copyFile, mkdir, readFile, rm, writeFile } from "node:fs/promises";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const websiteDir = dirname(fileURLToPath(import.meta.url));
const rootDir = resolve(websiteDir, "..");
const outputDir = join(websiteDir, "dist");
const siteOrigin = "https://dycor.github.io";
const basePath = "/YouTube-Color-Analyzer";
const siteUrl = `${siteOrigin}${basePath}`;

const languages = {
  en: {
    code: "en",
    label: "English",
    prefix: "",
    privacyFile: "PRIVACY.md",
    supportFile: "SUPPORT.md",
    nav: { home: "Overview", privacy: "Privacy", support: "Support" },
    common: {
      product: "YouTube Color Analyzer",
      publisher: "Publisher",
      developer: "Developer",
      contact: "Contact",
      issues: "Report an issue",
      independent:
        "Independent project — not affiliated with Google, YouTube, or Blackmagic Design.",
      language: "Language",
      skip: "Skip to content",
      primaryNav: "Primary navigation",
    },
    home: {
      meta: "Local Parade, Waveform, and Vectorscope for YouTube videos in Chrome.",
      eyebrow: "LOCAL COLOR ANALYSIS · CHROME SIDE PANEL",
      title: "Read the color. Keep the video untouched.",
      intro:
        "Analyze the visible image of a YouTube video with familiar color scopes, then use those observations to recreate a look in DaVinci Resolve.",
      privacyCta: "How your data stays local",
      supportCta: "Get support",
      facts: ["Local processing", "No audio capture", "No account or analytics"],
      monitorActive: "Instrument active",
      monitorMode: "SDR · RGB overlay",
      monitorFrame: "Live frame",
      monitorLocal: "Local · 0 uploads",
      privacyEyebrow: "Local by design",
      scopesEyebrow: "THREE INSTRUMENTS · ONE FRAME",
      scopesTitle: "A focused reference monitor in your browser",
      scopesIntro:
        "All scopes are calculated from the same visible frame so spatial, luminance, and chroma readings stay aligned.",
      scopes: [
        {
          name: "YRGB / RGB Parade",
          description:
            "Compare luminance and RGB channels side by side on a normalized 0–100 scale.",
        },
        {
          name: "Waveform",
          description:
            "Read luminance and selectable Y, R, G, and B channels across the width of the image.",
        },
        {
          name: "Rec.709 Vectorscope",
          description:
            "Inspect hue and saturation with color targets and an optional skin-tone reference line.",
        },
      ],
      workflowEyebrow: "WORKFLOW",
      workflowTitle: "From reference to grade",
      steps: [
        ["01", "Open", "Load a standard YouTube watch page in normal or theater mode."],
        ["02", "Analyze", "Start the extension and inspect the scopes live or on a detailed paused frame."],
        ["03", "Recreate", "Use the readings as visual references while grading your own project."],
      ],
      privacyTitle: "The frame stays on your device.",
      privacyText:
        "Video pixels are processed in local working memory. No image, page address, or playback data is sent to the publisher or a third party.",
      privacyLink: "Read the full Privacy Policy",
      limitsTitle: "Version 1 scope",
      limits:
        "Built for standard YouTube watch pages, SDR output, and normal or theater mode. It does not support calibrated HDR, Shorts, fullscreen, miniplayer, embedded players, or Picture-in-Picture.",
    },
    pages: {
      privacy: { eyebrow: "PUBLIC DOCUMENT", title: "Privacy Policy" },
      support: { eyebrow: "HELP CENTER", title: "Support" },
    },
  },
  fr: {
    code: "fr",
    label: "Français",
    prefix: "fr",
    privacyFile: "PRIVACY.fr.md",
    supportFile: "SUPPORT.fr.md",
    nav: { home: "Aperçu", privacy: "Confidentialité", support: "Assistance" },
    common: {
      product: "YouTube Color Analyzer",
      publisher: "Éditeur",
      developer: "Développeur",
      contact: "Contact",
      issues: "Signaler un problème",
      independent:
        "Projet indépendant — sans affiliation avec Google, YouTube ou Blackmagic Design.",
      language: "Langue",
      skip: "Aller au contenu",
      primaryNav: "Navigation principale",
    },
    home: {
      meta: "Parade, Waveform et Vecteurscope locaux pour les vidéos YouTube dans Chrome.",
      eyebrow: "ANALYSE COLORIMÉTRIQUE LOCALE · PANNEAU CHROME",
      title: "Lisez la couleur. Laissez la vidéo intacte.",
      intro:
        "Analysez l’image visible d’une vidéo YouTube avec des instruments familiers, puis utilisez ces observations pour recréer un rendu dans DaVinci Resolve.",
      privacyCta: "Comment vos données restent locales",
      supportCta: "Obtenir de l’aide",
      facts: ["Traitement local", "Aucune capture audio", "Aucun compte ni analytics"],
      monitorActive: "Instrument actif",
      monitorMode: "SDR · Superposition RGB",
      monitorFrame: "Image en direct",
      monitorLocal: "Local · 0 envoi",
      privacyEyebrow: "Local par conception",
      scopesEyebrow: "TROIS INSTRUMENTS · UNE MÊME IMAGE",
      scopesTitle: "Un moniteur de référence ciblé dans votre navigateur",
      scopesIntro:
        "Tous les instruments sont calculés à partir de la même image visible afin de garder les lectures spatiales, lumineuses et chromatiques alignées.",
      scopes: [
        {
          name: "Parade YRGB / RGB",
          description:
            "Comparez la luminance et les canaux RGB côte à côte sur une échelle normalisée de 0 à 100.",
        },
        {
          name: "Waveform",
          description:
            "Lisez la luminance et les canaux Y, R, G et B sélectionnables sur toute la largeur de l’image.",
        },
        {
          name: "Vecteurscope Rec.709",
          description:
            "Observez la teinte et la saturation avec des cibles couleur et une ligne de carnation optionnelle.",
        },
      ],
      workflowEyebrow: "MÉTHODE",
      workflowTitle: "De la référence à l’étalonnage",
      steps: [
        ["01", "Ouvrir", "Chargez une page YouTube classique en mode normal ou cinéma."],
        ["02", "Analyser", "Lancez l’extension et observez les instruments en direct ou sur une image détaillée en pause."],
        ["03", "Recréer", "Utilisez les mesures comme références visuelles pendant l’étalonnage de votre projet."],
      ],
      privacyTitle: "L’image reste sur votre appareil.",
      privacyText:
        "Les pixels vidéo sont traités dans la mémoire de travail locale. Aucune image, adresse de page ou donnée de lecture n’est envoyée à l’éditeur ou à un tiers.",
      privacyLink: "Lire la politique de confidentialité complète",
      limitsTitle: "Périmètre de la version 1",
      limits:
        "Conçue pour les pages YouTube classiques, le rendu SDR et les modes normal ou cinéma. Le HDR calibré, les Shorts, le plein écran, le mini-lecteur, les lecteurs intégrés et Picture-in-Picture ne sont pas pris en charge.",
    },
    pages: {
      privacy: { eyebrow: "DOCUMENT PUBLIC", title: "Politique de confidentialité" },
      support: { eyebrow: "CENTRE D’AIDE", title: "Assistance" },
    },
  },
  es: {
    code: "es",
    label: "Español",
    prefix: "es",
    privacyFile: "PRIVACY.es.md",
    supportFile: "SUPPORT.es.md",
    nav: { home: "Resumen", privacy: "Privacidad", support: "Soporte" },
    common: {
      product: "YouTube Color Analyzer",
      publisher: "Editor",
      developer: "Desarrollador",
      contact: "Contacto",
      issues: "Informar de un problema",
      independent:
        "Proyecto independiente, sin afiliación con Google, YouTube ni Blackmagic Design.",
      language: "Idioma",
      skip: "Ir al contenido",
      primaryNav: "Navegación principal",
    },
    home: {
      meta: "Parade, Forma de onda y Vectorscopio locales para vídeos de YouTube en Chrome.",
      eyebrow: "ANÁLISIS DE COLOR LOCAL · PANEL LATERAL DE CHROME",
      title: "Lee el color. Mantén el vídeo intacto.",
      intro:
        "Analiza la imagen visible de un vídeo de YouTube con instrumentos conocidos y utiliza esas observaciones para recrear un aspecto en DaVinci Resolve.",
      privacyCta: "Cómo permanecen locales tus datos",
      supportCta: "Obtener soporte",
      facts: ["Procesamiento local", "Sin captura de audio", "Sin cuenta ni analíticas"],
      monitorActive: "Instrumento activo",
      monitorMode: "SDR · Superposición RGB",
      monitorFrame: "Fotograma en directo",
      monitorLocal: "Local · 0 envíos",
      privacyEyebrow: "Local por diseño",
      scopesEyebrow: "TRES INSTRUMENTOS · UN MISMO FOTOGRAMA",
      scopesTitle: "Un monitor de referencia específico en tu navegador",
      scopesIntro:
        "Todos los instrumentos se calculan desde el mismo fotograma visible para mantener alineadas las lecturas espaciales, de luminancia y de color.",
      scopes: [
        {
          name: "Parade YRGB / RGB",
          description:
            "Compara la luminancia y los canales RGB en paralelo sobre una escala normalizada de 0 a 100.",
        },
        {
          name: "Forma de onda",
          description:
            "Lee la luminancia y los canales Y, R, G y B seleccionables a lo largo del ancho de la imagen.",
        },
        {
          name: "Vectorscopio Rec.709",
          description:
            "Examina tono y saturación con objetivos de color y una línea de tono de piel opcional.",
        },
      ],
      workflowEyebrow: "FLUJO DE TRABAJO",
      workflowTitle: "De la referencia al etalonaje",
      steps: [
        ["01", "Abrir", "Carga una página de visualización estándar de YouTube en modo normal o cine."],
        ["02", "Analizar", "Inicia la extensión y consulta los instrumentos en directo o sobre un fotograma detallado en pausa."],
        ["03", "Recrear", "Usa las lecturas como referencias visuales mientras etalonas tu propio proyecto."],
      ],
      privacyTitle: "El fotograma permanece en tu dispositivo.",
      privacyText:
        "Los píxeles del vídeo se procesan en la memoria de trabajo local. No se envía ninguna imagen, dirección de página ni dato de reproducción al editor o a terceros.",
      privacyLink: "Leer la Política de privacidad completa",
      limitsTitle: "Alcance de la versión 1",
      limits:
        "Diseñada para páginas estándar de YouTube, salida SDR y modos normal o cine. No admite HDR calibrado, Shorts, pantalla completa, minirreproductor, reproductores integrados ni Picture-in-Picture.",
    },
    pages: {
      privacy: { eyebrow: "DOCUMENTO PÚBLICO", title: "Política de privacidad" },
      support: { eyebrow: "CENTRO DE AYUDA", title: "Soporte" },
    },
  },
  "pt-BR": {
    code: "pt-BR",
    label: "Português",
    prefix: "pt-BR",
    privacyFile: "PRIVACY.pt-BR.md",
    supportFile: "SUPPORT.pt-BR.md",
    nav: { home: "Visão geral", privacy: "Privacidade", support: "Suporte" },
    common: {
      product: "YouTube Color Analyzer",
      publisher: "Publicador",
      developer: "Desenvolvedor",
      contact: "Contato",
      issues: "Relatar um problema",
      independent:
        "Projeto independente, sem afiliação com Google, YouTube ou Blackmagic Design.",
      language: "Idioma",
      skip: "Ir para o conteúdo",
      primaryNav: "Navegação principal",
    },
    home: {
      meta: "Parade, Waveform e Vectorscope locais para vídeos do YouTube no Chrome.",
      eyebrow: "ANÁLISE DE CORES LOCAL · PAINEL LATERAL DO CHROME",
      title: "Leia a cor. Mantenha o vídeo intacto.",
      intro:
        "Analise a imagem visível de um vídeo do YouTube com instrumentos familiares e use essas observações para recriar um visual no DaVinci Resolve.",
      privacyCta: "Como seus dados permanecem locais",
      supportCta: "Obter suporte",
      facts: ["Processamento local", "Sem captura de áudio", "Sem conta nem análise de público"],
      monitorActive: "Instrumento ativo",
      monitorMode: "SDR · Sobreposição RGB",
      monitorFrame: "Quadro ao vivo",
      monitorLocal: "Local · 0 envios",
      privacyEyebrow: "Local desde a concepção",
      scopesEyebrow: "TRÊS INSTRUMENTOS · UM MESMO QUADRO",
      scopesTitle: "Um monitor de referência focado no seu navegador",
      scopesIntro:
        "Todos os instrumentos são calculados a partir do mesmo quadro visível para manter alinhadas as leituras espaciais, de luminância e de cor.",
      scopes: [
        {
          name: "Parade YRGB / RGB",
          description:
            "Compare a luminância e os canais RGB lado a lado em uma escala normalizada de 0 a 100.",
        },
        {
          name: "Waveform",
          description:
            "Leia a luminância e os canais Y, R, G e B selecionáveis ao longo da largura da imagem.",
        },
        {
          name: "Vectorscope Rec.709",
          description:
            "Examine matiz e saturação com alvos de cor e uma linha opcional de tom de pele.",
        },
      ],
      workflowEyebrow: "FLUXO DE TRABALHO",
      workflowTitle: "Da referência à correção de cor",
      steps: [
        ["01", "Abrir", "Carregue uma página padrão de exibição do YouTube no modo normal ou cinema."],
        ["02", "Analisar", "Inicie a extensão e inspecione os instrumentos ao vivo ou em um quadro detalhado pausado."],
        ["03", "Recriar", "Use as leituras como referências visuais ao trabalhar nas cores do seu projeto."],
      ],
      privacyTitle: "O quadro permanece no seu dispositivo.",
      privacyText:
        "Os pixels do vídeo são processados na memória de trabalho local. Nenhuma imagem, endereço de página ou dado de reprodução é enviado ao publicador ou a terceiros.",
      privacyLink: "Ler a Política de Privacidade completa",
      limitsTitle: "Escopo da versão 1",
      limits:
        "Desenvolvida para páginas padrão do YouTube, saída SDR e modos normal ou cinema. Não oferece suporte a HDR calibrado, Shorts, tela cheia, miniplayer, players incorporados ou Picture-in-Picture.",
    },
    pages: {
      privacy: { eyebrow: "DOCUMENTO PÚBLICO", title: "Política de Privacidade" },
      support: { eyebrow: "CENTRAL DE AJUDA", title: "Suporte" },
    },
  },
  "zh-CN": {
    code: "zh-CN",
    label: "中文",
    prefix: "zh-CN",
    privacyFile: "PRIVACY.zh-CN.md",
    supportFile: "SUPPORT.zh-CN.md",
    nav: { home: "概览", privacy: "隐私", support: "支持" },
    common: {
      product: "YouTube 色彩分析器",
      publisher: "发布者",
      developer: "开发者",
      contact: "联系方式",
      issues: "报告问题",
      independent: "独立项目，与 Google、YouTube 或 Blackmagic Design 无隶属关系。",
      language: "语言",
      skip: "跳到主要内容",
      primaryNav: "主导航",
    },
    home: {
      meta: "在 Chrome 中为 YouTube 视频提供本地分量图、波形图和矢量示波器。",
      eyebrow: "本地色彩分析 · CHROME 侧边栏",
      title: "读取色彩，不改变视频。",
      intro:
        "使用熟悉的色彩示波器分析 YouTube 视频的可见画面，再将观察结果作为在 DaVinci Resolve 中重现风格的参考。",
      privacyCta: "了解数据如何保留在本地",
      supportCta: "获取支持",
      facts: ["本地处理", "不捕获音频", "无账户或受众分析"],
      monitorActive: "示波器已启用",
      monitorMode: "SDR · RGB 叠加",
      monitorFrame: "实时画面",
      monitorLocal: "本地 · 0 次上传",
      privacyEyebrow: "本地化设计",
      scopesEyebrow: "三种示波器 · 同一帧画面",
      scopesTitle: "浏览器中的专注参考监视器",
      scopesIntro: "所有示波器均根据同一可见帧计算，确保空间、亮度和色彩读数保持一致。",
      scopes: [
        {
          name: "YRGB / RGB 分量图",
          description: "在标准化的 0–100 刻度上并排比较亮度和 RGB 通道。",
        },
        {
          name: "波形图",
          description: "读取图像宽度范围内可单独选择的 Y、R、G、B 通道及亮度。",
        },
        {
          name: "Rec.709 矢量示波器",
          description: "通过色彩目标和可选肤色参考线检查色相与饱和度。",
        },
      ],
      workflowEyebrow: "工作流程",
      workflowTitle: "从参考画面到调色",
      steps: [
        ["01", "打开", "在普通模式或影院模式下加载标准 YouTube 观看页面。"],
        ["02", "分析", "启动扩展程序，实时检查示波器，或在暂停时分析更详细的画面。"],
        ["03", "重现", "在为自己的项目调色时，将读数作为视觉参考。"],
      ],
      privacyTitle: "画面始终保留在您的设备上。",
      privacyText:
        "视频像素仅在本地工作内存中处理。任何图像、页面地址或播放数据都不会发送给发布者或第三方。",
      privacyLink: "阅读完整隐私政策",
      limitsTitle: "版本 1 支持范围",
      limits:
        "适用于标准 YouTube 观看页面、SDR 输出以及普通或影院模式。不支持校准 HDR、Shorts、全屏、迷你播放器、嵌入式播放器或画中画。",
    },
    pages: {
      privacy: { eyebrow: "公开文件", title: "隐私政策" },
      support: { eyebrow: "帮助中心", title: "支持" },
    },
  },
};

const routeFor = (language, page = "home") => {
  const prefix = language.prefix ? `/${language.prefix}` : "";
  const suffix = page === "home" ? "" : `/${page}`;
  return `${basePath}${prefix}${suffix}/`;
};

const absoluteRouteFor = (language, page = "home") =>
  `${siteOrigin}${routeFor(language, page)}`;

const outputPathFor = (language, page = "home") => {
  const segments = [outputDir];
  if (language.prefix) segments.push(language.prefix);
  if (page !== "home") segments.push(page);
  segments.push("index.html");
  return join(...segments);
};

const escapeHtml = (value) =>
  value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");

const inlineMarkdown = (value, language) => {
  const tokens = [];
  let html = escapeHtml(value);

  html = html.replace(/`([^`]+)`/g, (_, code) => {
    const token = `@@CODE${tokens.length}@@`;
    tokens.push(`<code>${code}</code>`);
    return token;
  });

  html = html.replace(/\[([^\]]+)]\(([^)]+)\)/g, (_, label, rawHref) => {
    let href = rawHref;
    if (/^\.\/PRIVACY(?:\.[^)]+)?\.md$/.test(rawHref)) {
      href = routeFor(language, "privacy");
    }
    const external = /^https:\/\//.test(href);
    const attributes = external ? ' target="_blank" rel="noreferrer"' : "";
    return `<a href="${escapeHtml(href)}"${attributes}>${label}</a>`;
  });

  html = html.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
  html = html.replace(/@@CODE(\d+)@@/g, (_, index) => tokens[Number(index)]);
  return html;
};

const renderMarkdown = (source, language) => {
  const lines = source.replaceAll("\r\n", "\n").split("\n");
  if (lines[0]?.startsWith("# ")) lines.shift();
  while (lines[0] === "") lines.shift();
  if (lines[0]?.includes("English") && lines[0]?.includes("Français")) lines.shift();
  while (lines[0] === "") lines.shift();

  const html = [];
  let paragraph = [];
  let listType = null;
  let headingIndex = 0;

  const closeList = () => {
    if (!listType) return;
    html.push(`</${listType}>`);
    listType = null;
  };

  const flushParagraph = () => {
    if (!paragraph.length) return;
    const content = paragraph
      .map((line, index) => {
        const hardBreak = /\s{2}$/.test(line);
        const rendered = inlineMarkdown(line.trimEnd(), language);
        if (index === paragraph.length - 1) return rendered;
        return `${rendered}${hardBreak ? "<br>" : " "}`;
      })
      .join("");
    html.push(`<p>${content}</p>`);
    paragraph = [];
  };

  for (const line of lines) {
    const heading = line.match(/^(#{2,3})\s+(.+)$/);
    const unordered = line.match(/^-\s+(.+)$/);
    const ordered = line.match(/^\d+\.\s+(.+)$/);

    if (heading) {
      flushParagraph();
      closeList();
      headingIndex += 1;
      const level = heading[1].length;
      html.push(
        `<h${level} id="section-${headingIndex}">${inlineMarkdown(heading[2], language)}</h${level}>`,
      );
      continue;
    }

    if (unordered || ordered) {
      flushParagraph();
      const nextListType = unordered ? "ul" : "ol";
      if (listType !== nextListType) {
        closeList();
        listType = nextListType;
        html.push(`<${listType}>`);
      }
      html.push(`<li>${inlineMarkdown((unordered ?? ordered)[1], language)}</li>`);
      continue;
    }

    if (!line.trim()) {
      flushParagraph();
      closeList();
      continue;
    }

    if (listType) closeList();
    paragraph.push(line);
  }

  flushParagraph();
  closeList();
  return html.join("\n");
};

const languageLinks = (page, currentLanguage) =>
  Object.values(languages)
    .map(
      (language) =>
        `<a href="${routeFor(language, page)}" hreflang="${language.code}" lang="${language.code}"${
          language.code === currentLanguage.code ? ' aria-current="page"' : ""
        }>${language.label}</a>`,
    )
    .join("");

const alternateLinks = (page) =>
  Object.values(languages)
    .map(
      (language) =>
        `<link rel="alternate" hreflang="${language.code}" href="${absoluteRouteFor(language, page)}">`,
    )
    .concat(`<link rel="alternate" hreflang="x-default" href="${absoluteRouteFor(languages.en, page)}">`)
    .join("\n    ");

const header = (language, page) => `
  <a class="skip-link" href="#main">${language.common.skip}</a>
  <header class="site-header">
    <a class="brand" href="${routeFor(language)}" aria-label="${escapeHtml(language.common.product)}">
      <img src="${basePath}/assets/icon-128.png" width="40" height="40" alt="">
      <span><b>YOUTUBE</b><strong>COLOR ANALYZER</strong></span>
    </a>
    <nav class="primary-nav" aria-label="${escapeHtml(language.common.primaryNav)}">
      <a href="${routeFor(language)}"${page === "home" ? ' aria-current="page"' : ""}>${language.nav.home}</a>
      <a href="${routeFor(language, "privacy")}"${page === "privacy" ? ' aria-current="page"' : ""}>${language.nav.privacy}</a>
      <a href="${routeFor(language, "support")}"${page === "support" ? ' aria-current="page"' : ""}>${language.nav.support}</a>
    </nav>
  </header>`;

const footer = (language, page) => `
  <footer class="site-footer">
    <div>
      <p class="footer-brand">YouTube Color Analyzer</p>
      <p>${language.common.independent}</p>
    </div>
    <dl>
      <div><dt>${language.common.publisher}</dt><dd>Color Analyzer</dd></div>
      <div><dt>${language.common.developer}</dt><dd>dycor</dd></div>
      <div><dt>${language.common.contact}</dt><dd><a href="mailto:dyvyn.7@gmail.com">dyvyn.7@gmail.com</a></dd></div>
    </dl>
    <div class="language-switcher" aria-label="${language.common.language}">
      <span>${language.common.language}</span>
      <nav>${languageLinks(page, language)}</nav>
    </div>
  </footer>`;

const layout = ({ language, page, title, description, body }) => {
  const canonical = absoluteRouteFor(language, page);
  return `<!doctype html>
<html lang="${language.code}">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="theme-color" content="#071110">
    <meta name="color-scheme" content="dark">
    <meta name="description" content="${escapeHtml(description)}">
    <meta property="og:type" content="website">
    <meta property="og:title" content="${escapeHtml(title)}">
    <meta property="og:description" content="${escapeHtml(description)}">
    <meta property="og:url" content="${canonical}">
    <meta property="og:site_name" content="YouTube Color Analyzer">
    <meta name="twitter:card" content="summary">
    <link rel="canonical" href="${canonical}">
    ${alternateLinks(page)}
    <link rel="icon" type="image/png" href="${basePath}/assets/icon-128.png">
    <link rel="stylesheet" href="${basePath}/assets/styles.css">
    <title>${escapeHtml(title)}</title>
  </head>
  <body>
    <div class="ambient-grid" aria-hidden="true"></div>
    <div class="shell">
      ${header(language, page)}
      ${body}
      ${footer(language, page)}
    </div>
  </body>
</html>
`;
};

const scopeVisual = (index) => {
  if (index === 0) {
    return `<div class="scope-visual parade" aria-hidden="true"><i></i><i></i><i></i><i></i></div>`;
  }
  if (index === 1) {
    return `<div class="scope-visual waveform" aria-hidden="true">${Array.from(
      { length: 28 },
      (_, item) => `<i style="--i:${item}"></i>`,
    ).join("")}</div>`;
  }
  return `<div class="scope-visual vectorscope" aria-hidden="true"><i></i><i></i><i></i><i></i><i></i></div>`;
};

const renderHome = (language) => {
  const content = language.home;
  const body = `
    <main id="main">
      <section class="hero">
        <div class="hero-copy">
          <p class="eyebrow"><span>01</span>${content.eyebrow}</p>
          <h1>${content.title}</h1>
          <p class="lede">${content.intro}</p>
          <div class="hero-actions">
            <a class="button primary" href="${routeFor(language, "privacy")}">${content.privacyCta}</a>
            <a class="button" href="${routeFor(language, "support")}">${content.supportCta}</a>
          </div>
          <ul class="facts">${content.facts.map((fact) => `<li>${fact}</li>`).join("")}</ul>
        </div>
        <div class="monitor" aria-hidden="true">
          <div class="monitor-top"><span>${content.monitorActive}</span><b>${content.monitorMode}</b></div>
          <div class="monitor-screen">
            <span class="axis-label top">100</span><span class="axis-label mid">50</span><span class="axis-label bottom">0</span>
            <div class="monitor-trace red"></div><div class="monitor-trace green"></div><div class="monitor-trace blue"></div><div class="monitor-trace white"></div>
          </div>
          <div class="monitor-bottom"><span>${content.monitorFrame}</span><span>${content.monitorLocal}</span></div>
        </div>
      </section>

      <section class="section scopes-section" aria-labelledby="scopes-title">
        <div class="section-heading">
          <p class="eyebrow"><span>02</span>${content.scopesEyebrow}</p>
          <h2 id="scopes-title">${content.scopesTitle}</h2>
          <p>${content.scopesIntro}</p>
        </div>
        <div class="scope-cards">
          ${content.scopes
            .map(
              (scope, index) => `<article class="scope-card">
                <div class="card-number">0${index + 1}</div>
                ${scopeVisual(index)}
                <h3>${scope.name}</h3>
                <p>${scope.description}</p>
              </article>`,
            )
            .join("")}
        </div>
      </section>

      <section class="section workflow" aria-labelledby="workflow-title">
        <div class="section-heading compact">
          <p class="eyebrow"><span>03</span>${content.workflowEyebrow}</p>
          <h2 id="workflow-title">${content.workflowTitle}</h2>
        </div>
        <ol>${content.steps
          .map(
            ([number, title, text]) => `<li><span>${number}</span><div><h3>${title}</h3><p>${text}</p></div></li>`,
          )
          .join("")}</ol>
      </section>

      <section class="privacy-callout" aria-labelledby="privacy-title">
        <div class="lock-mark" aria-hidden="true"><span></span></div>
        <div>
          <p class="eyebrow"><span>04</span>${content.privacyEyebrow}</p>
          <h2 id="privacy-title">${content.privacyTitle}</h2>
          <p>${content.privacyText}</p>
          <a href="${routeFor(language, "privacy")}">${content.privacyLink}<span aria-hidden="true"> →</span></a>
        </div>
      </section>

      <section class="limits" aria-labelledby="limits-title">
        <h2 id="limits-title">${content.limitsTitle}</h2>
        <p>${content.limits}</p>
        <a href="https://github.com/dycor/YouTube-Color-Analyzer/issues" target="_blank" rel="noreferrer">${language.common.issues}<span aria-hidden="true"> ↗</span></a>
      </section>
    </main>`;

  return layout({
    language,
    page: "home",
    title: `YouTube Color Analyzer — ${content.title}`,
    description: content.meta,
    body,
  });
};

const renderDocument = async (language, page) => {
  const config = language.pages[page];
  const filename = page === "privacy" ? language.privacyFile : language.supportFile;
  const markdown = await readFile(join(rootDir, filename), "utf8");
  const body = `
    <main id="main" class="document-layout">
      <header class="document-hero">
        <p class="eyebrow"><span>${page === "privacy" ? "P" : "S"}</span>${config.eyebrow}</p>
        <h1>${config.title}</h1>
        <p class="document-path">color-analyzer / ${page} / ${language.code}</p>
      </header>
      <article class="legal-document">
        ${renderMarkdown(markdown, language)}
      </article>
    </main>`;

  return layout({
    language,
    page,
    title: `${config.title} — YouTube Color Analyzer`,
    description: language.home.meta,
    body,
  });
};

const writePage = async (path, content) => {
  await mkdir(dirname(path), { recursive: true });
  await writeFile(path, content, "utf8");
};

await rm(outputDir, { recursive: true, force: true });
await mkdir(join(outputDir, "assets"), { recursive: true });
await copyFile(join(websiteDir, "assets", "styles.css"), join(outputDir, "assets", "styles.css"));
await copyFile(join(rootDir, "public", "icons", "icon-128.png"), join(outputDir, "assets", "icon-128.png"));
await writeFile(join(outputDir, ".nojekyll"), "", "utf8");

const sitemapRoutes = [];
for (const language of Object.values(languages)) {
  await writePage(outputPathFor(language), renderHome(language));
  sitemapRoutes.push(absoluteRouteFor(language));
  for (const page of ["privacy", "support"]) {
    await writePage(outputPathFor(language, page), await renderDocument(language, page));
    sitemapRoutes.push(absoluteRouteFor(language, page));
  }
}

const notFound = layout({
  language: languages.en,
  page: "home",
  title: "Page not found — YouTube Color Analyzer",
  description: languages.en.home.meta,
  body: `<main id="main" class="not-found"><p class="eyebrow"><span>404</span>PAGE NOT FOUND</p><h1>Signal lost.</h1><p>The requested page does not exist.</p><a class="button primary" href="${routeFor(languages.en)}">Return to overview</a></main>`,
});
await writeFile(join(outputDir, "404.html"), notFound, "utf8");
await writeFile(
  join(outputDir, "robots.txt"),
  `User-agent: *\nAllow: /\nSitemap: ${siteUrl}/sitemap.xml\n`,
  "utf8",
);
await writeFile(
  join(outputDir, "sitemap.xml"),
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${sitemapRoutes
    .map((route) => `  <url><loc>${route}</loc></url>`)
    .join("\n")}\n</urlset>\n`,
  "utf8",
);

console.log(`Built ${sitemapRoutes.length} localized pages in ${outputDir}`);
