# Plano de Desenvolvimento — Fase 1: MVP do Gerenciador por Blocos de Energia

## 1. Objetivo


---

## 2. Estrutura de Arquivos Apropriada
Crie a seguinte estrutura de diretórios e arquivos:

/-
index.html
css/
styles.css
js/
app.js

## 3. Especificação dos Componentes

### Step 1: Markup Base (index.html)

#### Cabeçalho (Header)
    Título da Aplicação: "Rotina por Blocos de Energia"
    Exibição da data atual: "Hoje: [DD/MM/AAAA]" (Ex. Quarta-feira, 29 de Julho)
    Barra de progresso Geral do Dia (0% a 100%) indicando o progresso geral das tarefas do dia.
    Botão "Resetar Dia" (desmarca todas as tarefas para começar um novo dia).
#### Conteúdo Principal (main)
    Grid/Layout responsivo contendo os 5 Blocos de Energia:
        Bloco I: Matinal & Foco (Gatilho: Acordar -> Saída para o trabalho)
        Bloco II: Trabalho - Manhã (Gatilho: Chegada -> Almoço)
        Bloco III: Trabalho - Tarde (Gatilho: Pós-almoço -> Saída)
        Bloco IV: Transição & Casa (Gatilho: Chegada em casa -> Jantar)
        Bloco V: Saúde & Desconexão (Gatilho: Pós-jantar -> Dormir)
    Estrutura do Card de Bloco:
        Cabeçalho do Bloco (Nome do bloco + ícone/cor + Gatilho/Condição de término).
        Barra de progresso individual do Bloco.
        Lista de Tarefas (<ul> com checkbox, descrição da tarefa e botão de excluir).  
            BLOCO I
                FullStack com IA
                Pets
                Estatística
                Orçamento
                Supermercado + Café da manhã
            BLOCO II
                Ir para o trabalho
                TEC Parte I
                Regimento Interno e Comum
                Trilha IA
                Operacionais do Senado
            BLOCO III
                TEC Parte II
                Operacionais do Senado II
                Trilha IA
                Especialista em IA Alura
            BLOCO IV
                Cafézin
                Arrumar casa
                Pets
                Inglês
            BLOCO V
                Piano Clássica
                Piano Jazz
                Academia
                Pets
                Leituras
                Dormir
        Campo de entrada + botão "+" para adicionar novas tarefas dinamicamente àquele bloco.
### Step 2: Estilização Inicial (styles.css)
    Design System & Temas:
        Estilo moderno, limpo e minimalista (suporte a Dark Mode por padrão ou cores neutras e agradáveis).
        Variáveis CSS (:root) para cores dos blocos, fontes, espaçamentos e sombras.
        Cores sutis diferenciando visualmente cada um dos 5 blocos.
    Interatividade Visual:
        Tarefas marcadas devem ter texto tachado (line-through) e opacidade reduzida.
        Efeitos de hover nos botões, cards e checkboxes.
        Layout totalmente responsivo (Mobile-first ou adaptável para telas de celular e desktop via Flexbox/CSS Grid).
### Step 3: Lógica de Estados (app.js)
    Estrutura de Dados Inicial (Data Model):
        Criar um array blocos contendo os 5 blocos pré-configurados e suas tarefas padrão.
    Funcionalidades Obrigatórias:
        renderApp(): Renderiza dinamicamente os 5 blocos e suas tarefas na tela com base no estado.
        toggleTask(blocoId, taskId): Alterna o status concluida da tarefa e atualiza a interface.
        addTask(blocoId, descricao): Adiciona uma nova tarefa ao bloco específico.
        deleteTask(blocoId, taskId): Remove uma tarefa do bloco.
        resetDay(): Mantém a lista de tarefas, mas define concluida = false em todas elas.
        calculateProgress(): Atualiza a porcentagem concluída de cada bloco e do dia como um todo.
        Persistência (localStorage):
            Função saveToLocalStorage(): Salva o estado atual do array de blocos no browser.
            Função loadFromLocalStorage(): Carrega o estado salvo ou inicializa com os dados padrão se estiver vazio.
## 4. Tarefa Executável para o Agente
    Crie os arquivos index.html, css/styles.css e js/app.js.
    Implemente o código funcional completo para cada um dos arquivos respeitando as especificações acima.
    Garanta que o código esteja limpo, comentado e pronto para ser aberto diretamente no navegador.

        
                
            

