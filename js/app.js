// Constantes dos Blocos Padrão
const DEFAULT_BLOCKS = [
    {
        id: 'bloco-1',
        title: 'Bloco I: Matinal & Foco',
        icon: 'fa-sun',
        colorVar: 'var(--block-1-color)',
        trigger: 'Gatilho: Acordar -> Saída para o trabalho',
        tasks: [
            { id: 't1-1', description: 'FullStack com IA', completed: false },
            { id: 't1-2', description: 'Pets', completed: false },
            { id: 't1-3', description: 'Estatística', completed: false },
            { id: 't1-4', description: 'Orçamento', completed: false },
            { id: 't1-5', description: 'Supermercado + Café da manhã', completed: false }
        ]
    },
    {
        id: 'bloco-2',
        title: 'Bloco II: Trabalho - Manhã',
        icon: 'fa-briefcase',
        colorVar: 'var(--block-2-color)',
        trigger: 'Gatilho: Chegada -> Almoço',
        tasks: [
            { id: 't2-1', description: 'Ir para o trabalho', completed: false },
            { id: 't2-2', description: 'TEC Parte I', completed: false },
            { id: 't2-3', description: 'Regimento Interno e Comum', completed: false },
            { id: 't2-4', description: 'Trilha IA', completed: false },
            { id: 't2-5', description: 'Operacionais do Senado', completed: false }
        ]
    },
    {
        id: 'bloco-3',
        title: 'Bloco III: Trabalho - Tarde',
        icon: 'fa-laptop-code',
        colorVar: 'var(--block-3-color)',
        trigger: 'Gatilho: Pós-almoço -> Saída',
        tasks: [
            { id: 't3-1', description: 'TEC Parte II', completed: false },
            { id: 't3-2', description: 'Operacionais do Senado II', completed: false },
            { id: 't3-3', description: 'Trilha IA', completed: false },
            { id: 't3-4', description: 'Especialista em IA Alura', completed: false }
        ]
    },
    {
        id: 'bloco-4',
        title: 'Bloco IV: Transição & Casa',
        icon: 'fa-house',
        colorVar: 'var(--block-4-color)',
        trigger: 'Gatilho: Chegada em casa -> Jantar',
        tasks: [
            { id: 't4-1', description: 'Cafézin', completed: false },
            { id: 't4-2', description: 'Arrumar casa', completed: false },
            { id: 't4-3', description: 'Pets', completed: false },
            { id: 't4-4', description: 'Inglês', completed: false }
        ]
    },
    {
        id: 'bloco-5',
        title: 'Bloco V: Saúde & Desconexão',
        icon: 'fa-moon',
        colorVar: 'var(--block-5-color)',
        trigger: 'Gatilho: Pós-jantar -> Dormir',
        tasks: [
            { id: 't5-1', description: 'Piano Clássica', completed: false },
            { id: 't5-2', description: 'Piano Jazz', completed: false },
            { id: 't5-3', description: 'Academia', completed: false },
            { id: 't5-4', description: 'Pets', completed: false },
            { id: 't5-5', description: 'Leituras', completed: false },
            { id: 't5-6', description: 'Dormir', completed: false }
        ]
    }
];

// Estado da Aplicação
let blocks = [];
let isEditMode = false;

// Elementos DOM
const blocksContainer = document.getElementById('blocks-container');
const currentDateEl = document.getElementById('current-date');
const overallProgressText = document.getElementById('overall-progress-text');
const overallProgressFill = document.getElementById('overall-progress-fill');
const resetDayBtn = document.getElementById('reset-day-btn');
const editModeBtn = document.getElementById('edit-mode-btn');

// Inicialização
function init() {
    setupDate();
    loadFromLocalStorage();
    renderApp();
    setupEventListeners();
}

// Configurar Data Atual
function setupDate() {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    const today = new Date();
    let dateString = today.toLocaleDateString('pt-BR', options);
    dateString = dateString.charAt(0).toUpperCase() + dateString.slice(1);
    currentDateEl.textContent = dateString;
}

// LocalStorage
function loadFromLocalStorage() {
    const savedBlocks = localStorage.getItem('energyBlocksData');
    if (savedBlocks) {
        blocks = JSON.parse(savedBlocks);
    } else {
        blocks = JSON.parse(JSON.stringify(DEFAULT_BLOCKS));
    }
}

function saveToLocalStorage(skipUpload = false) {
    const jsonString = JSON.stringify(blocks);
    localStorage.setItem('energyBlocksData', jsonString);
    
    // Sincroniza com o Drive se estiver autenticado
    if (!skipUpload && window.uploadToDrive) {
        window.uploadToDrive(jsonString);
    }
}

// Recebe dados atualizados da nuvem
window.syncDataFromDrive = function(jsonData) {
    try {
        blocks = JSON.parse(jsonData);
        // Atualiza interface com os novos dados
        saveToLocalStorage(true); // Salva apenas localmente para evitar upload redundante
        renderApp();
    } catch(e) {
        console.error('Erro ao fazer parse dos dados da nuvem:', e);
    }
}

// Renderização
function renderApp() {
    blocksContainer.innerHTML = '';
    
    // Alterna visibilidade baseada no modo
    if (isEditMode) {
        document.body.classList.add('edit-mode');
        editModeBtn.innerHTML = '<i class="fa-solid fa-check"></i> Modo Execução';
        editModeBtn.classList.add('active');
        resetDayBtn.style.display = 'none';
    } else {
        document.body.classList.remove('edit-mode');
        editModeBtn.innerHTML = '<i class="fa-solid fa-gear"></i> Gerenciar Rotina';
        editModeBtn.classList.remove('active');
        resetDayBtn.style.display = 'flex';
    }
    
    blocks.forEach(block => {
        const blockCard = document.createElement('article');
        blockCard.className = 'block-card';
        blockCard.style.setProperty('--block-color', block.colorVar);
        
        // Calcular progresso do bloco
        const totalTasks = block.tasks.length;
        const completedTasks = block.tasks.filter(t => t.completed).length;
        const progressPercentage = totalTasks === 0 ? 0 : Math.round((completedTasks / totalTasks) * 100);

        // Header do Bloco
        const headerHTML = `
            <div class="block-header">
                <div class="block-title-row">
                    <i class="fa-solid ${block.icon}"></i>
                    <h2>${block.title}</h2>
                </div>
                <span class="block-trigger" ${isEditMode ? 'contenteditable="true"' : ''} onblur="updateBlockTrigger('${block.id}', this.innerText)" onkeydown="if(event.key==='Enter'){event.preventDefault();this.blur();}">${block.trigger}</span>
                <div class="block-progress-bg">
                    <div class="block-progress-fill" style="width: ${progressPercentage}%"></div>
                </div>
            </div>
        `;
        
        // Lista de Tarefas
        const taskList = document.createElement('ul');
        taskList.className = 'task-list';
        
        block.tasks.forEach(task => {
            const li = document.createElement('li');
            li.className = `task-item ${task.completed ? 'completed' : ''}`;
            
            li.innerHTML = `
                <div class="task-content" ${!isEditMode ? `onclick="toggleTask('${block.id}', '${task.id}')"` : ''}>
                    <div class="custom-checkbox">
                        <i class="fa-solid fa-check"></i>
                    </div>
                    <span class="task-text" ${isEditMode ? 'contenteditable="true"' : ''} onblur="updateTaskDescription('${block.id}', '${task.id}', this.innerText)" onkeydown="if(event.key==='Enter'){event.preventDefault();this.blur();}">${task.description}</span>
                </div>
                <button class="btn-delete" onclick="deleteTask('${block.id}', '${task.id}')" aria-label="Excluir tarefa">
                    <i class="fa-solid fa-trash"></i>
                </button>
            `;
            taskList.appendChild(li);
        });

        // Formulário de Adicionar Tarefa
        const formHTML = `
            <form class="add-task-form" onsubmit="event.preventDefault(); handleAddTask('${block.id}')">
                <input type="text" class="add-task-input" id="input-${block.id}" placeholder="Nova tarefa..." autocomplete="off">
                <button type="submit" class="btn-add"><i class="fa-solid fa-plus"></i></button>
            </form>
        `;
        
        blockCard.innerHTML = headerHTML;
        blockCard.appendChild(taskList);
        blockCard.insertAdjacentHTML('beforeend', formHTML);
        
        blocksContainer.appendChild(blockCard);
    });

    calculateProgress();
    saveToLocalStorage();
}

// Ações
function toggleTask(blockId, taskId) {
    if (isEditMode) return;
    const block = blocks.find(b => b.id === blockId);
    if (block) {
        const task = block.tasks.find(t => t.id === taskId);
        if (task) {
            task.completed = !task.completed;
            renderApp();
        }
    }
}

function toggleEditMode() {
    isEditMode = !isEditMode;
    renderApp();
}

window.handleAddTask = function(blockId) {
    const inputEl = document.getElementById(`input-${blockId}`);
    const description = inputEl.value.trim();
    if (description) {
        addTask(blockId, description);
        inputEl.value = '';
    }
};

function addTask(blockId, description) {
    const block = blocks.find(b => b.id === blockId);
    if (block) {
        const newTask = {
            id: 't' + Date.now(),
            description: description,
            completed: false
        };
        block.tasks.push(newTask);
        renderApp();
    }
}

window.deleteTask = function(blockId, taskId) {
    const block = blocks.find(b => b.id === blockId);
    if (block) {
        block.tasks = block.tasks.filter(t => t.id !== taskId);
        renderApp();
    }
};

window.updateTaskDescription = function(blockId, taskId, newText) {
    const block = blocks.find(b => b.id === blockId);
    if (block) {
        const task = block.tasks.find(t => t.id === taskId);
        if (task && newText.trim() !== '') {
            task.description = newText.trim();
            saveToLocalStorage();
        } else if (task && newText.trim() === '') {
            renderApp(); // Restaura valor anterior se ficar vazio
        }
    }
};

window.updateBlockTrigger = function(blockId, newText) {
    const block = blocks.find(b => b.id === blockId);
    if (block && newText.trim() !== '') {
        block.trigger = newText.trim();
        saveToLocalStorage();
    } else if (block && newText.trim() === '') {
        renderApp(); // Restaura valor anterior se ficar vazio
    }
};

function resetDay() {
    if(confirm('Tem certeza que deseja resetar todas as tarefas de hoje?')) {
        blocks.forEach(block => {
            block.tasks.forEach(task => {
                task.completed = false;
            });
        });
        renderApp();
    }
}

function calculateProgress() {
    let totalTasks = 0;
    let completedTasks = 0;
    
    blocks.forEach(block => {
        totalTasks += block.tasks.length;
        completedTasks += block.tasks.filter(t => t.completed).length;
    });
    
    const progressPercentage = totalTasks === 0 ? 0 : Math.round((completedTasks / totalTasks) * 100);
    
    overallProgressText.textContent = `${progressPercentage}%`;
    overallProgressFill.style.width = `${progressPercentage}%`;
}

// Event Listeners Globais
function setupEventListeners() {
    resetDayBtn.addEventListener('click', resetDay);
    editModeBtn.addEventListener('click', toggleEditMode);
    
    window.toggleTask = toggleTask;
}

// Iniciar aplicação quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', init);
