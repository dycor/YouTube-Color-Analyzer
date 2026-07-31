# Color Analyzer for YouTube

[Français](./README.fr.md) | [English](./README.md) | [中文](./README.zh-CN.md) | [Español](./README.es.md) | **Português**

Extensão para Google Chrome que analisa localmente os pixels visíveis de um vídeo do YouTube com três instrumentos inspirados no DaVinci Resolve:

- Parade `YRGB` ou `RGB`;
- Waveform com canais `Y`, `R`, `G`, `B` e modo colorido ou monocromático;
- Vetorscópio Rec.709 com referências de matiz e linha de tons de pele.

A extensão observa a imagem sem modificar o vídeo, seu arquivo-fonte ou sua renderização. Ela não possui backend nem envia dados pela Internet. Nunca salva imagens automaticamente; em um quadro detalhado com o vídeo pausado, o usuário pode exportar explicitamente a imagem exata analisada como um PNG local.

A interface acompanha automaticamente o idioma do navegador. Ela oferece suporte a francês, inglês, chinês, espanhol e português; qualquer outro idioma utiliza o inglês.

## Estado do projeto

A versão 1.1.0 inclui:

- um manifesto Chrome MV3 para Chrome 116 ou versão posterior;
- um painel lateral e uma janela de análise destacável que compartilham a mesma sessão de captura;
- análise ao vivo com até 512 colunas horizontais e análise detalhada em pausa com até 1920 colunas;
- controle de intensidade do traço, valores RGB mínimos/máximos e exportação PNG local explícita do quadro detalhado em pausa;
- um pipeline local `tabCapture` → documento fora da tela → Web Worker → painel;
- um núcleo colorimétrico TypeScript independente das APIs do Chrome;
- testes unitários, de desempenho e de carregamento no Chromium.

O projeto é destinado às páginas clássicas `youtube.com/watch`, nos modos normal e cinema. Shorts, players incorporados, tela cheia, miniplayer, Picture-in-Picture e análise HDR calibrada não fazem parte da V1.

## Desenvolvimento

Pré-requisitos: Node.js 22.12 ou versão posterior e pnpm 10 ou versão posterior.

```bash
pnpm install
pnpm verify
```

Comandos disponíveis:

```bash
pnpm dev        # reconstrói a extensão quando há alterações
pnpm ui:preview # abre o servidor de pré-visualização da interface
pnpm typecheck  # verifica os tipos TypeScript
pnpm test       # executa os testes unitários
pnpm build      # gera o diretório dist/
pnpm test:e2e   # compila e depois carrega a extensão no Chromium
pnpm site:build # gera o site público do GitHub Pages
pnpm assets:store # regenera as imagens da Chrome Web Store
pnpm package:store # cria e verifica o ZIP de envio
```

Para pré-visualizar apenas a interface com dados sintéticos, execute `pnpm ui:preview` e abra `/preview.html` no endereço local exibido pelo Vite. O parâmetro `?lang=` permite verificar um idioma, por exemplo, `/preview.html?lang=zh-CN`.

## Carregar a extensão no Chrome

1. Execute `pnpm build`.
2. Abra `chrome://extensions`.
3. Ative o modo de desenvolvedor.
4. Clique em “Carregar sem compactação”.
5. Selecione o diretório `dist/`.
6. Abra uma página `https://www.youtube.com/watch?...`.
7. Clique no ícone, leia a divulgação do primeiro uso e aceite-a explicitamente para iniciar a análise.
8. Opcionalmente, selecione “Abrir em uma janela” para a visualização destacável. Pause o vídeo para ativar a medição detalhada e a exportação PNG explícita.

## Arquitetura

```text
src/
├── analyzer-worker/  cálculo das densidades dos três instrumentos
├── content-script/   estado e geometria do player do YouTube
├── core/             matemática colorimétrica testável
├── offscreen/        captura, recorte e amostragem
├── service-worker/   ciclo de vida MV3 e autorização do usuário
├── shared/           contratos de mensagens e constantes
└── sidepanel/        interface e renderização Canvas 2D
```

As imagens RGBA permanecem no documento fora da tela e no worker de cálculo. O painel lateral e a janela destacável recebem somente os mapas de intensidade compactos necessários para desenhar os scopes. O quadro detalhado exato só é disponibilizado à interface quando o usuário solicita explicitamente uma exportação PNG local; ele nunca é salvo nem enviado automaticamente.

## Documentação de design

- [`CONTEXT.md`](./CONTEXT.md) define o vocabulário e o escopo do domínio.
- [`docs/adr/`](./docs/adr/) contém as decisões de produto e técnicas validadas durante a definição do projeto.

## Publicação, privacidade e suporte

- O [site público](https://dycor.github.io/YouTube-Color-Analyzer/pt-BR/) oferece as páginas em português e o seletor de idioma.
- [`PRIVACY.pt-BR.md`](./PRIVACY.pt-BR.md) contém a Política de Privacidade e links para as traduções.
- [`SUPPORT.pt-BR.md`](./SUPPORT.pt-BR.md) contém informações de suporte e solução de problemas.
- [`docs/chrome-web-store/`](./docs/chrome-web-store/) contém o pacote de publicação da Chrome Web Store: fichas localizadas, divulgações de dados, instruções de teste e checklist.
- [`store-assets/`](./store-assets/) contém as capturas de tela e peças promocionais geradas.

## Licença

O código-fonte é distribuído sob a [Mozilla Public License 2.0](./LICENSE). As modificações redistribuídas dos arquivos cobertos devem continuar disponíveis sob a MPL 2.0. Esta licença não concede direitos sobre marcas, nomes comerciais ou logotipos.
