document.addEventListener('DOMContentLoaded', () => {
    // --- THEME SWITCHER ---
    const themeSwitcher = document.getElementById('theme-switcher');
    if (themeSwitcher) {
        themeSwitcher.addEventListener('click', () => {
            const currentTheme = document.documentElement.getAttribute('data-theme');
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
            document.documentElement.setAttribute('data-theme', newTheme);
            themeSwitcher.querySelector('i').className = newTheme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
        });
    }

    // --- PAGE ROUTING LOGIC ---
if (document.querySelector('.dashboard-content')) {
    renderDashboard();
    setupDashboardModals();
} else if (document.querySelector('.kanban-board')) {
        const urlParams = new URLSearchParams(window.location.search);
        const projectId = urlParams.get('id');
        if (projectId) {
            renderKanbanBoard(projectId);
            setupTaskModal(projectId);
        }
    }
});

// --- DASHBOARD PAGE ---
function renderDashboard() {
    const projects = storage.getProjects();
    const grid = document.getElementById('projects-grid');
    grid.innerHTML = projects.map(project => `
        <div class="project-card" data-project-id="${project.id}">
            <h3>${project.name}</h3>
            <p>${Object.values(project.tasks).flat().length} tasks</p>
        </div>
    `).join('');

    // Add event listeners to project cards
    document.querySelectorAll('.project-card').forEach(card => {
        card.addEventListener('click', () => {
            window.location.href = `board.html?id=${card.dataset.projectId}`;
        });
    });
}

function setupDashboardModals() {
    const newProjectBtn = document.getElementById('new-project-btn');
    const modal = document.getElementById('new-project-modal');
    const closeBtn = modal.querySelector('.close-btn');
    const createBtn = document.getElementById('create-project-btn');

    newProjectBtn.onclick = () => modal.style.display = 'flex';
    closeBtn.onclick = () => modal.style.display = 'none';
    window.onclick = (e) => { if (e.target == modal) modal.style.display = 'none'; };

    createBtn.onclick = () => {
        const projectNameInput = document.getElementById('project-name');
        if (projectNameInput.value.trim()) {
            storage.createProject(projectNameInput.value.trim());
            renderDashboard();
            projectNameInput.value = '';
            modal.style.display = 'none';
        }
    };
}

// --- KANBAN BOARD PAGE ---
let currentProjectId = null;
const columns = ['todo', 'inprogress', 'review', 'done'];
const columnTitles = {
    todo: 'To Do',
    inprogress: 'In Progress',
    review: 'In Review',
    done: 'Done'
};

function renderKanbanBoard(projectId) {
    currentProjectId = projectId;
    const project = storage.getProject(projectId);
    if (!project) {
        // Handle project not found
        document.getElementById('project-title').innerText = 'Project Not Found';
        return;
    }

    document.getElementById('project-title').innerText = project.name;
    const board = document.getElementById('kanban-board');
    board.innerHTML = ''; // Clear existing board

    columns.forEach(columnId => {
        const tasks = project.tasks[columnId] || [];
        const columnEl = document.createElement('div');
        columnEl.className = 'kanban-column';
        columnEl.dataset.columnId = columnId;

        columnEl.innerHTML = `
            <div class="column-header">
                <h3 class="column-title">${columnTitles[columnId]}</h3>
                <span class="task-count">${tasks.length}</span>
            </div>
            <div class="task-list" id="${columnId}-list">
                ${tasks.map(task => createTaskCard(task)).join('')}
            </div>
            <button class="add-task-btn" data-column="${columnId}"><i class="fas fa-plus"></i> Add task</button>
        `;
        board.appendChild(columnEl);
    });

    // Setup drag and drop after rendering
    initializeDragAndDrop(handleTaskDrop);
    
    // Add event listeners for task cards and "add task" buttons
    document.querySelectorAll('.task-card').forEach(card => {
        card.addEventListener('click', () => openTaskModal(card.dataset.taskId, card.closest('.kanban-column').dataset.columnId));
    });

    document.querySelectorAll('.add-task-btn').forEach(btn => {
        btn.addEventListener('click', () => openTaskModal(null, btn.dataset.column));
    });
}

function createTaskCard(task) {
    return `
        <div class="task-card" draggable="true" data-task-id="${task.id}" data-priority="${task.labels.includes('High Priority') ? 'High Priority' : ''}">
            <h4>${task.title}</h4>
            <div class="task-labels">
                ${task.labels.map(label => `<span class="task-label">${label}</span>`).join('')}
            </div>
            <div class="task-footer">
                <span class="task-due-date">${task.dueDate ? `<i class="far fa-calendar-alt"></i> ${task.dueDate}` : ''}</span>
                <div class="task-avatar">
                    ${task.assignedTo ? `<img src="https://i.pravatar.cc/28?u=${task.assignedTo}" title="${task.assignedTo}">` : ''}
                </div>
            </div>
        </div>
    `;
}

function handleTaskDrop(taskId, newColumnId) {
    const project = storage.getProject(currentProjectId);
    let task, oldColumnId;

    // Find task and its original column
    for (const col of columns) {
        const taskIndex = project.tasks[col].findIndex(t => t.id === taskId);
        if (taskIndex > -1) {
            task = project.tasks[col][taskIndex];
            oldColumnId = col;
            // Remove from old column
            project.tasks[col].splice(taskIndex, 1);
            break;
        }
    }

    // Add to new column
    if (task) {
        project.tasks[newColumnId].push(task);
        storage.saveProject(project);
        renderKanbanBoard(currentProjectId); // Re-render for simplicity
    }
}

// --- TASK MODAL ---
const taskModal = document.getElementById('task-modal');
let currentOpenTaskId = null;
let currentOpenColumnId = null;

function setupTaskModal(projectId) {
    const closeBtn = taskModal.querySelector('.close-btn');
    closeBtn.onclick = () => taskModal.classList.remove('show');
    window.onclick = (e) => { if (e.target == taskModal) taskModal.classList.remove('show'); };
    
    document.getElementById('save-task-btn').onclick = saveTask;
    document.getElementById('delete-task-btn').onclick = deleteTask;
}

function openTaskModal(taskId, columnId) {
    currentOpenTaskId = taskId;
    currentOpenColumnId = columnId;
    const modalBody = document.getElementById('modal-body');

    let task = { id: `task-${Date.now()}`, title: '', description: '', dueDate: '', assignedTo: '', labels: [] };
    if (taskId) {
        const project = storage.getProject(currentProjectId);
        task = project.tasks[columnId].find(t => t.id === taskId);
    }

    modalBody.innerHTML = `
        <input type="text" id="task-modal-title" class="input-group" placeholder="Task Title" value="${task.title}">
        <textarea id="task-modal-description" class="input-group" placeholder="Add a more detailed description...">${task.description}</textarea>
        <div class="input-group">
            <label>Due Date</label>
            <input type="date" id="task-modal-duedate" value="${task.dueDate}">
        </div>
         <div class="input-group">
            <label>Labels (comma-separated)</label>
            <input type="text" id="task-modal-labels" placeholder="e.g., UI/UX, High Priority" value="${task.labels.join(', ')}">
        </div>
        <div id="ai-summary">
            <strong><i class="fas fa-brain"></i> AI Summary:</strong>
            <p>Generate a checklist or summary for this task.</p>
        </div>
    `;

    taskModal.classList.add('show');
}

function saveTask() {
    const project = storage.getProject(currentProjectId);
    const title = document.getElementById('task-modal-title').value.trim();
    if (!title) return;

    const taskData = {
        id: currentOpenTaskId || `task-${Date.now()}`,
        title: title,
        description: document.getElementById('task-modal-description').value.trim(),
        dueDate: document.getElementById('task-modal-duedate').value,
        labels: document.getElementById('task-modal-labels').value.split(',').map(l => l.trim()).filter(Boolean),
        assignedTo: 'Alex' // Mock assignment
    };

    if (currentOpenTaskId) { // Existing task
        const taskIndex = project.tasks[currentOpenColumnId].findIndex(t => t.id === currentOpenTaskId);
        project.tasks[currentOpenColumnId][taskIndex] = taskData;
    } else { // New task
        project.tasks[currentOpenColumnId].push(taskData);
    }
    
    storage.saveProject(project);
    renderKanbanBoard(currentProjectId);
    taskModal.classList.remove('show');
}

function deleteTask() {
    if (!currentOpenTaskId) return;
    if (confirm('Are you sure you want to delete this task?')) {
        const project = storage.getProject(currentProjectId);
        const taskIndex = project.tasks[currentOpenColumnId].findIndex(t => t.id === currentOpenTaskId);
        project.tasks[currentOpenColumnId].splice(taskIndex, 1);
        storage.saveProject(project);
        renderKanbanBoard(currentProjectId);
        taskModal.classList.remove('show');
    }
}