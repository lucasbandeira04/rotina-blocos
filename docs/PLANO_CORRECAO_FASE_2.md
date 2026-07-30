# Plano de Correção — Sincronização Real e Tratamento de Erros no Google Drive

## 1. Diagnóstico dos Problemas
- O badge "Sincronizado" está aparecendo mesmo sem autenticação ativa.
- Em janelas anônimas ou novos navegadores, o app não força o download automático dos dados do Drive após a conexão.
- Falhas de upload ou falta de permissão não estão sendo exibidas visualmente para o usuário.

---

## 2. Ajustes na Lógica (`js/drive.js` e `js/app.js`)

### A. Estado de Conexão e Feedback Visual
- O status inicial no cabeçalho DEVE ser **"Desconectado (Nuvem)"** ou **"Conectar Google Drive"**.
- O badge só deve mudar para **"Sincronizado ✓"** APÓS uma requisição com sucesso (HTTP 200) para a API do Google Drive.
- Se houver falha de token, erro de rede ou o usuário não estiver logado, o badge DEVE exibir **"Desconectado"** ou **"Erro ao Sincronizar"**.

### B. Fluxo de Download e Sobrescrita
1. Ao clicar em **"Conectar Google Drive"** e concluir a autenticação:
   - Executar imediatamente `downloadFromDrive()`.
2. A função `downloadFromDrive()` deve:
   - Buscar o arquivo `energy_blocks_data.json` no Google Drive.
   - Se o arquivo existir no Drive: converter o JSON, atualizar o array global `blocks` na memória, atualizar o `localStorage` e chamar `renderApp()` para atualizar a tela na hora.
   - Se não existir: chamar `uploadToDrive()` para criar o primeiro arquivo na nuvem com os dados locais atuais.

### C. Fluxo de Upload Instantâneo
1. Sempre que uma tarefa for marcada/desmarcada ou editada:
   - Verificar se existe um `accessToken` ativo.
   - Se existir, realizar o `PUT`/`POST` via `fetch` para o Google Drive.
   - Exibir brevemente "Sincronizando..." e depois retornar a "Sincronizado ✓".

---

## 3. Instruções Executáveis para o Agente
1. Atualize o arquivo `js/drive.js` garantindo que:
   - O login do Google dispare a busca e download imediato dos dados do Drive.
   - Os erros de API (como 401 Unauthorized ou 404) atualizem o status na interface corretamente.
   - O arquivo criado na API do Drive tenha o nome exato `energy_blocks_data.json` e tipo `application/json`.
2. Atualize a função `renderApp()` ou `saveToLocalStorage()` no `js/app.js` para garantir que o download do Drive prevaleça sobre os dados zerados do `localStorage` de uma janela anônima.