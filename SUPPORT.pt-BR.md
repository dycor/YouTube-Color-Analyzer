# Suporte — YouTube Color Analyzer

[Français](./SUPPORT.fr.md) | [English](./SUPPORT.md) | [中文](./SUPPORT.zh-CN.md) | [Español](./SUPPORT.es.md) | **Português**

## Obter ajuda

- E-mail de suporte: **[dyvyn.7@gmail.com](mailto:dyvyn.7@gmail.com)**
- Rastreador de problemas: **[URL PÚBLICA DO RASTREADOR DE PROBLEMAS A PREENCHER]**
- Política de Privacidade: [PRIVACY.pt-BR.md](./PRIVACY.pt-BR.md)
- Prazo estimado de resposta: **[PRAZO A PREENCHER, POR EXEMPLO, 5 DIAS ÚTEIS]**

Não envie capturas de tela que contenham informações pessoais, uma conta privada ou conteúdo confidencial. A extensão nunca precisa da sua senha do YouTube ou do Google.

## Verificações rápidas

### O painel permanece em estado de espera

1. Use o Google Chrome 116 ou uma versão posterior.
2. Abra uma página padrão `https://www.youtube.com/watch?...`.
3. Recarregue a página depois de instalar ou atualizar a extensão.
4. Clique no ícone da extensão e aceite a divulgação no primeiro uso.

### A análise está suspensa

- use o modo normal ou cinema;
- saia do modo de tela cheia, do miniplayer do YouTube e do Picture-in-Picture;
- deixe a guia do YouTube ativa;
- verifique se a imagem completa do vídeo está visível;
- afaste o ponteiro para ocultar os controles do YouTube.

### Os instrumentos não são atualizados

- verifique se o vídeo já possui um quadro decodificado;
- selecione “Parar” e clique novamente no ícone da extensão;
- recarregue a página do YouTube se a extensão tiver acabado de ser atualizada;
- tente outro vídeo público para descartar uma restrição específica da fonte.

### As medições diferem do DaVinci Resolve

A versão 1 analisa a saída SDR visível renderizada pelo Chrome. Ela não acessa o arquivo de vídeo original, o sinal antes da renderização para exibição nem os metadados completos de cor. Os instrumentos destinam-se à observação e não são medições broadcast calibradas.

Legendas, controles e outras sobreposições visíveis também podem afetar o resultado.

## Escopo compatível

- páginas padrão `youtube.com/watch`;
- modos normal e cinema;
- Parade YRGB/RGB, Waveform YRGB e Vectorscope Rec.709;
- análise ao vivo e um quadro mais detalhado quando o vídeo está pausado.

A versão 1 não é compatível com Shorts, YouTube Music, players incorporados, tela cheia, o miniplayer do YouTube, Picture-in-Picture nem análise HDR calibrada.

## Relatar um problema

Inclua as seguintes informações sem anexar dados sensíveis:

1. versão do Chrome;
2. sistema operacional;
3. versão da extensão;
4. tipo de página e modo do player;
5. etapas para reproduzir o problema;
6. o resultado observado e o resultado esperado;
7. eventuais erros exibidos em `chrome://extensions`.

## Privacidade e segurança

Para fazer uma pergunta sobre dados ou relatar uma vulnerabilidade, envie um e-mail para **[dyvyn.7@gmail.com](mailto:dyvyn.7@gmail.com)**. Não divulgue publicamente os detalhes de uma vulnerabilidade ainda não corrigida.

## Independência

O YouTube Color Analyzer é um projeto independente. Ele não é afiliado, endossado nem patrocinado pelo Google, YouTube ou Blackmagic Design.
