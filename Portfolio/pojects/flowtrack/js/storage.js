const storage = {
    _DB_NAME: 'flowtrack_db',

    // Initialize with sample data if DB is empty
    init() {
        if (!localStorage.getItem(this._DB_NAME)) {
            fetch('./data/sample-project.json')
                .then(response => response.json())
                .then(data => {
                    localStorage.setItem(this._DB_NAME, JSON.stringify(data));
                });
        }
    },

    getDB() {
        return JSON.parse(localStorage.getItem(this._DB_NAME)) || { projects: [] };
    },

    saveDB(db) {
        localStorage.setItem(this._DB_NAME, JSON.stringify(db));
    },

    getProjects() {
        return this.getDB().projects;
    },

    getProject(projectId) {
        const projects = this.getProjects();
        return projects.find(p => p.id === parseInt(projectId));
    },

    saveProject(projectData) {
        const db = this.getDB();
        const projectIndex = db.projects.findIndex(p => p.id === projectData.id);

        if (projectIndex > -1) {
            db.projects[projectIndex] = projectData;
        } else {
            db.projects.push(projectData);
        }
        this.saveDB(db);
    },
    
    createProject(projectName) {
        const db = this.getDB();
        const newProject = {
            id: Date.now(),
            name: projectName,
            tasks: {
                todo: [],
                inprogress: [],
                review: [],
                done: []
            }
        };
        db.projects.push(newProject);
        this.saveDB(db);
        return newProject;
    },
};

storage.init();