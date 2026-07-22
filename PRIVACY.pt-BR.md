# Política de Privacidade — Color Analyzer for YouTube

[Français](./PRIVACY.fr.md) | [English](./PRIVACY.md) | [中文](./PRIVACY.zh-CN.md) | [Español](./PRIVACY.es.md) | **Português**

Data de vigência: 17 de julho de 2026  
Última atualização: 22 de julho de 2026

Publicador: **Color Analyzer**

Contato de privacidade: **[dyvyn.7@gmail.com](mailto:dyvyn.7@gmail.com)**

## 1. Finalidade da extensão

Color Analyzer for YouTube é uma extensão do Chrome que gera localmente uma Parade, um Waveform e um Vectorscope a partir da imagem visível de um vídeo do YouTube. Sua única finalidade é observar e analisar as cores; ela não modifica o vídeo, seu arquivo de origem nem sua renderização.

## 2. Resumo

- a análise começa somente depois que o usuário clica explicitamente no ícone da extensão e, no primeiro uso ou após uma atualização da divulgação, aceita a divulgação de dados exibida na extensão;
- o contexto da página e o estado do player são observados somente durante uma sessão de análise ativa, e a observação termina com essa sessão;
- os pixels visíveis do vídeo são processados localmente no dispositivo;
- o áudio não é capturado;
- nenhuma imagem do vídeo é salva no disco nem enviada ao publicador;
- a extensão não possui conta de usuário, publicidade, análise de público nem servidor de aplicativo;
- o publicador não vende, compartilha nem recebe nenhum dado produzido pela análise.

## 3. Dados processados

### 3.1 Pixels visíveis do vídeo

Durante uma sessão de análise ativa, a extensão captura temporariamente a saída visual de toda a guia selecionada do YouTube. Em seguida, ela recorta a área visível do vídeo e lê somente os valores dos pixels dessa área para calcular os três instrumentos de análise de cores.

A saída capturada pode incluir elementos visivelmente sobrepostos ao vídeo, como legendas ou controles do player. A extensão alerta sobre alguns desses casos, pois eles podem afetar a medição.

As matrizes de pixels brutos permanecem na memória de trabalho pelo tempo necessário para calcular uma medição e depois suas referências são liberadas. Durante uma sessão ativa, o canvas local pode manter na memória a última imagem recortada até que ela seja substituída por outra imagem. Quando a captura é interrompida, o canvas é redefinido para 1 × 1 pixel e a fonte de vídeo é liberada. Nenhuma imagem é gravada em armazenamento persistente, adicionada a um histórico nem transmitida pela Internet.

### 3.2 Contexto da página e estado do player

Um script local da extensão está presente nas páginas de `youtube.com`, mas permanece inativo até que o usuário aceite a divulgação de dados vigente e inicie explicitamente uma análise. Somente durante uma sessão de análise ativa, ele observa periodicamente o contexto da página e o estado do player. Essa observação é interrompida imediatamente quando o usuário seleciona “Parar”, navega para uma página não compatível, fecha a guia ou quando a captura termina. Ao fechar o painel lateral, ela é interrompida após um breve período técnico de tolerância que permite o recarregamento do painel. O contexto do player não é observado entre sessões de análise. Para localizar corretamente o vídeo, detectar a navegação interna do YouTube e sincronizar as medições durante a sessão ativa, a extensão processa temporariamente:

- o endereço atual da página do YouTube e o identificador do vídeo;
- o tempo de reprodução e o estado de reprodução, pausa ou busca;
- o modo do player, a visibilidade da guia e a presença dos controles ou das legendas;
- as dimensões da janela, do player e do próprio vídeo.

Essas informações são usadas somente para fornecer a análise solicitada, suspender o cálculo das medições quando a fonte não puder ser medida de forma confiável e evitar a análise da área errada. O endereço da página, o identificador do vídeo e o tempo de reprodução não são armazenados de forma persistente nem transmitidos ao publicador.

### 3.3 Preferências locais

A extensão armazena no armazenamento local do Chrome as seguintes preferências de exibição: instrumento selecionado, modo da Parade, canais do Waveform, colorização e visibilidade da linha de tons de pele. Ela também armazena a versão da divulgação de dados aceita pelo usuário. Esse valor técnico não contém identidade, endereço de página nem imagem de vídeo.

Essas preferências permanecem no dispositivo até serem substituídas, até que os dados da extensão sejam apagados ou até que a extensão seja desinstalada.

### 3.4 Dados técnicos da sessão

Durante a sessão do navegador, a extensão pode manter um identificador aleatório de sessão, o identificador interno da guia capturada e o estado mais recente da análise. Essas informações são usadas somente para associar as medições à captura correta e encerrá-la de forma adequada. Elas permanecem no armazenamento de sessão do Chrome e não são enviadas ao publicador.

## 4. Transmissão, compartilhamento e venda

Color Analyzer for YouTube não transmite dados do usuário ao publicador nem a terceiros. As mensagens entre o script da página, o documento offscreen, o Web Worker, o service worker e o painel lateral permanecem internas à extensão no dispositivo.

A extensão:

- não vende nenhum dado;
- não compartilha dados para fins de publicidade, criação de perfis ou avaliação de crédito;
- não usa dados para nenhuma finalidade não relacionada à análise de cores;
- não executa código hospedado remotamente;
- não contém nenhum sistema de telemetria ou análise de público.

O YouTube e o Google podem processar dados de forma independente quando o usuário utiliza seus serviços. Essas atividades são regidas pelas políticas próprias dessas empresas e não são controladas por esta extensão.

## 5. Retenção e exclusão

- **Pixels do vídeo**: memória de trabalho local; as matrizes brutas são liberadas após o cálculo. O último recorte pode permanecer no canvas somente durante a sessão ativa; ao parar, o canvas é redefinido para 1 × 1 pixel e a fonte de vídeo é liberada.
- **Contexto do player**: memória temporária, substituída continuamente somente durante uma sessão de análise ativa. A observação não começa antes do consentimento e é interrompida imediatamente quando a sessão termina.
- **Estado da sessão**: o identificador da captura ativa é removido quando a captura é interrompida; o status mais recente pode permanecer no armazenamento de sessão do Chrome até o fim da sessão do navegador.
- **Preferências de exibição e versão do consentimento**: armazenamento local do Chrome, mantidas até serem alteradas, apagadas ou até que a extensão seja desinstalada.

Selecionar “Parar”, navegar para uma página não compatível, fechar a guia ou o fim da captura interrompem imediatamente a captura, a análise de pixels e a observação do contexto do player. Fechar o painel lateral aciona a mesma limpeza após um breve período técnico de tolerância que permite o recarregamento do painel. Essa limpeza redefine o canvas de análise para 1 × 1 pixel e libera a fonte de vídeo. O contexto do player não é observado antes do consentimento nem depois do fim da sessão de análise ativa. As preferências armazenadas podem ser removidas apagando os dados da extensão no Chrome ou desinstalando a extensão.

O publicador não possui nenhuma cópia remota dessas informações e, portanto, não pode acessá-las nem excluí-las remotamente.

## 6. Permissões do Chrome

A extensão usa somente as permissões necessárias para sua finalidade:

- **tabCapture**: capturar temporariamente a saída visível da guia selecionada, sem áudio;
- **offscreen**: receber e analisar localmente o fluxo capturado em um documento offscreen do Chrome;
- **sidePanel**: exibir os instrumentos e seus controles no painel lateral do Chrome;
- **storage**: manter as preferências locais, a versão do consentimento e o estado técnico da sessão;
- **acesso a `https://www.youtube.com/*`**: somente durante uma sessão de análise ativa, detectar o player do YouTube, sua geometria, seu estado e a navegação para fora do vídeo selecionado. A captura começa somente em uma página `/watch` compatível após o consentimento e uma ação do usuário.

## 7. Segurança

O processamento fica isolado nos componentes locais da extensão. Sua política de segurança de conteúdo permite somente scripts incluídos no pacote da extensão. Nenhum dado capturado é transmitido por uma rede.

## 8. Conformidade com o Uso Limitado

O uso das informações recebidas das APIs do Google obedecerá à Política de Dados do Usuário da Chrome Web Store, incluindo os requisitos de Uso Limitado.

## 9. Alterações nesta política

Esta política será atualizada se as práticas de dados da extensão mudarem. Qualquer mudança nessas práticas será divulgada de forma proativa e destacada na ficha da Chrome Web Store e na interface da extensão antes de entrar em vigor. Um novo consentimento será solicitado antes de qualquer processamento baseado nas práticas alteradas.

## 10. Contato

Para dúvidas sobre esta política ou sobre a extensão, entre em contato pelo endereço: **[dyvyn.7@gmail.com](mailto:dyvyn.7@gmail.com)**.

## 11. Independência

Color Analyzer for YouTube é um projeto independente. Ele não é afiliado, endossado nem patrocinado pelo Google, YouTube ou Blackmagic Design. YouTube e DaVinci Resolve são marcas comerciais de seus respectivos proprietários.
