# Ficha da Chrome Web Store — Português (Brasil)

> Conteúdo pronto para copiar no Painel do Desenvolvedor.

## Informações gerais

- **Nome**: Color Analyzer for YouTube
- **Resumo curto**: Analise localmente as cores de vídeos do YouTube com Parade YRGB/RGB, Waveform e Vectorscope Rec.709.
- **Idioma**: português (Brasil)
- **Categoria recomendada**: Produtividade
- **URL da página inicial**: `https://dycor.github.io/YouTube-Color-Analyzer/pt-BR/`
- **URL de suporte**: `https://dycor.github.io/YouTube-Color-Analyzer/pt-BR/support/`
- **URL da política de privacidade**: `https://dycor.github.io/YouTube-Color-Analyzer/pt-BR/privacy/`

## Divulgação destacada sobre os dados do usuário

Coloque este texto próximo ao início da descrição, sem ocultá-lo em uma seção secundária:

> **Processamento de dados:** somente depois que você aceita a divulgação vigente na extensão e inicia explicitamente a análise, ela lê localmente o endereço da página do YouTube, o identificador do vídeo e o estado do player necessários para detectar e enquadrar um vídeo compatível. Esse contexto é observado somente durante a sessão de análise ativa compartilhada pelo painel lateral e pela janela destacada. A extensão captura temporariamente a saída visual da guia ativa, sem áudio, e recorta a área do vídeo para calcular os instrumentos. Selecionar “Parar” em qualquer interface, navegar para outra página ou o fim da captura interrompem imediatamente tanto a observação do contexto quanto a captura; fechar a última interface aciona a mesma interrupção após um breve período de tolerância para recarregamentos. Os pixels, o endereço da página e o estado de reprodução permanecem no seu navegador. Nenhuma imagem ou dado de reprodução é enviado a um servidor, ao publicador ou a terceiros. Nenhuma imagem é salva automaticamente; um PNG local do quadro detalhado exato em pausa só é criado quando você escolhe explicitamente Exportar imagem. As preferências de exibição e a versão do consentimento são mantidas no armazenamento local do Chrome. Um identificador de captura e o estado técnico mais recente são mantidos temporariamente no armazenamento de sessão e desaparecem, no mais tardar, ao fim da sessão do navegador.

## Descrição detalhada

Color Analyzer for YouTube exibe instrumentos de análise de cores no painel lateral do Chrome ou em uma janela de análise destacável usando os pixels visíveis do vídeo em reprodução.

Ele foi criado para editores, coloristas e criadores que desejam estudar um vídeo de referência antes de recriar uma estética semelhante em seu próprio projeto.

PROCESSAMENTO DE DADOS

Somente depois que você aceita a divulgação vigente na extensão e inicia explicitamente a análise, ela lê localmente o endereço da página do YouTube, o identificador do vídeo e o estado do player necessários para detectar e enquadrar um vídeo compatível. Esse contexto é observado somente durante a sessão de análise ativa. A extensão captura temporariamente a saída visual da guia ativa, sem áudio, e recorta a área do vídeo para calcular os instrumentos.

Selecionar “Parar” em qualquer interface, navegar para outra página ou o fim da captura interrompem imediatamente tanto a observação do contexto quanto a captura. O painel lateral e a janela destacada compartilham uma sessão; fechar a última interface aciona a mesma interrupção após um breve período de tolerância para recarregamentos. Os pixels, o endereço da página e o estado de reprodução permanecem no seu navegador. Nenhuma imagem ou dado de reprodução é enviado a um servidor, ao publicador ou a terceiros. Nenhuma imagem é salva automaticamente; um PNG local do quadro detalhado exato em pausa só é criado quando você escolhe explicitamente Exportar imagem. As preferências de exibição e a versão do consentimento são mantidas no armazenamento local do Chrome. Um identificador de captura e o estado técnico mais recente são mantidos temporariamente no armazenamento de sessão e desaparecem, no mais tardar, ao fim da sessão do navegador.

INSTRUMENTOS INCLUÍDOS

• Parade YRGB ou RGB com escala normalizada de 0 a 100.  
• Waveform com canais Y, R, G e B selecionáveis individualmente, em exibição colorida ou monocromática.  
• Vectorscope derivado do Rec.709, com referências de matiz e uma linha de referência opcional para tons de pele.

COMO FUNCIONA

Abra uma página padrão de exibição do YouTube, clique no ícone da extensão e aceite a divulgação mostrada no primeiro uso. O painel lateral é aberto e a análise começa para o vídeo visível na guia selecionada. Depois, você pode abrir uma janela destacada sem iniciar uma segunda captura.

Durante a reprodução, os instrumentos são atualizados ao vivo com até 512 colunas horizontais. Quando o vídeo é pausado, o quadro detalhado usa até 1920 colunas. Os três instrumentos são calculados a partir do mesmo quadro. Você pode ajustar a intensidade do traço, consultar os valores RGB mínimos/máximos e exportar explicitamente o quadro detalhado exato em pausa como PNG local. As configurações selecionadas são salvas localmente.

PRIVACIDADE

Todos os cálculos são realizados no dispositivo. Os pixels do vídeo permanecem na memória de trabalho local durante a sessão de análise ativa. Quando a análise para, a fonte de vídeo é liberada e o canvas é redefinido para 1 × 1 pixel. Nenhuma imagem é salva automaticamente nem enviada a um servidor. Um PNG só é gravado no dispositivo depois que o usuário escolhe explicitamente Exportar imagem em uma medição detalhada em pausa; a extensão não mantém histórico de exportação. Ela não possui backend, publicidade nem análise de público e não captura áudio.

COMPATIBILIDADE

• Google Chrome 116 ou posterior.  
• Páginas padrão `youtube.com/watch`.  
• Modos normal e cinema do player.  
• Interface disponível em português, inglês, francês, chinês e espanhol.

RECURSOS E LIMITAÇÕES DA VERSÃO 1.1

A extensão analisa a saída SDR renderizada pelo Chrome, e não o arquivo de vídeo original nem o sinal de origem. Portanto, os valores normalizados de 0 a 100 não são medições broadcast calibradas.

Análise HDR calibrada, Shorts, YouTube Music, players incorporados, tela cheia, o miniplayer do YouTube e Picture-in-Picture não são compatíveis.

Legendas e outros elementos sobrepostos ao vídeo visível podem afetar as medições. A análise é suspensa enquanto os controles do player do YouTube estão visíveis.

A extensão fornece somente instrumentos de medição. Ela não modifica o vídeo, não aplica correções de cor nem fornece recomendações automáticas de correção de cor.

INDEPENDÊNCIA

Esta é uma extensão independente. Ela não é afiliada, patrocinada, endossada nem oficialmente vinculada ao YouTube, à Google LLC, à Blackmagic Design Pty. Ltd. ou a qualquer uma de suas afiliadas. YouTube, DaVinci Resolve e todas as outras marcas comerciais mencionadas pertencem a seus respectivos proprietários.

## Textos sugeridos para as capturas de tela

1. **Três instrumentos de análise de cores diretamente no Chrome**  
   Parade YRGB/RGB, Waveform e Vectorscope no painel lateral ou em uma janela destacada.
2. **Análise ao vivo durante a reprodução**  
   Acompanhe a luminância, os canais RGB e a saturação enquanto o vídeo é reproduzido.
3. **Um quadro detalhado e exportável quando você pausa**
   Examine até 1920 colunas horizontais e salve explicitamente o quadro exato analisado como PNG local.
4. **Controles familiares para coloristas**  
   Canais YRGB, intensidade do traço, valores RGB mínimos/máximos, exibição colorida ou monocromática e linha opcional de tons de pele.
5. **Processamento local e não destrutivo**  
   Nenhuma imagem é enviada ou salva automaticamente, e o vídeo nunca é modificado.

## Texto para o bloco promocional de 440 × 280

Prefira um bloco sem texto para que ele funcione em todos os idiomas. Se for necessário incluir texto:

> COLOR ANALYZER  
> PARADE · WAVEFORM · VECTORSCOPE
