document.addEventListener('DOMContentLoaded', () => {

    // --- MODAL HANDLING ---
    const newProjectBtn = document.getElementById('new-project-btn');
    const projectModal = document.getElementById('project-modal');
    const taskCards = document.querySelectorAll('.task-card');
    const taskModal = document.getElementById('task-modal');
    const closeModalBtns = document.querySelectorAll('.close-modal-btn');

    // Open New Project Modal
    if (newProjectBtn) {
        newProjectBtn.addEventListener('click', () => {
            projectModal.style.display = 'flex';
        });
    }

    // Open Task Detail Modal
    if (taskCards) {
        taskCards.forEach(card => {
            card.addEventListener('click', () => {
                taskModal.style.display = 'flex';
            });
        });
    }
    
    // Close Modals
    closeModalBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            if(projectModal) projectModal.style.display = 'none';
            if(taskModal) taskModal.style.display = 'none';
        });
    });

    window.addEventListener('click', (event) => {
        if (event.target === projectModal) {
            projectModal.style.display = 'none';
        }
         if (event.target === taskModal) {
            taskModal.style.display = 'none';
        }
    });

    // --- THEME TOGGLE (SETTINGS PAGE) ---
    const themeToggle = document.getElementById('theme-toggle');
    if (themeToggle) {
        themeToggle.addEventListener('change', () => {
            if (themeToggle.checked) {
                document.body.setAttribute('data-theme', 'dark');
            } else {
                document.body.setAttribute('data-theme', 'light');
            }
        });
    }
});