// DOM Element References
const taskInput = document.getElementById('task-input');
const addBtn = document.getElementById('add-btn');
const taskList = document.getElementById('task-list');

// Load tasks from LocalStorage on initialization
let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
let currentFilter = 'all'; // all, active, completed

// Render existing tasks on app startup
function renderTasks() {
    taskList.innerHTML = '';
    
    // Filter tasks based on current filter
    let filteredTasks = tasks;
    if (currentFilter === 'active') {
        filteredTasks = tasks.filter(task => !task.completed);
    } else if (currentFilter === 'completed') {
        filteredTasks = tasks.filter(task => task.completed);
    }
    
    filteredTasks.forEach((task, index) => {
        const actualIndex = tasks.indexOf(task);
        const li = document.createElement('li');
        if (task.completed) li.classList.add('completed');

        li.innerHTML = `
            <label class="task-label">
                <input type="checkbox" class="task-checkbox" onchange="toggleTask(${actualIndex})" ${task.completed ? 'checked' : ''}>
                <span class="task-text">${task.text}</span>
            </label>
            <button class="delete-btn" onclick="deleteTask(${actualIndex})" aria-label="Delete task ${actualIndex + 1}">Delete</button>
        `;
        taskList.appendChild(li);
    });

    // Update task count and empty state
    const countEl = document.getElementById('task-count');
    const emptyMsg = document.getElementById('empty-msg');
    if (countEl) countEl.textContent = tasks.length;
    if (emptyMsg) emptyMsg.style.display = filteredTasks.length === 0 && tasks.length === 0 ? 'block' : 'none';
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

// Add a brand new task
function addTask() {
    const taskText = taskInput.value.trim();
    if (taskText === '') return;

    tasks.push({ text: taskText, completed: false });
    taskInput.value = '';
    renderTasks();
}

// Toggle completion status
window.toggleTask = function(index) {
    tasks[index].completed = !tasks[index].completed;
    renderTasks();
};

// Delete target task from list
window.deleteTask = function(index) {
    tasks.splice(index, 1);
    renderTasks();
};

// Filter button functionality
window.setFilter = function(filter) {
    currentFilter = filter;
    
    // Update active button state
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    document.getElementById(`filter-${filter}`).classList.add('active');
    
    renderTasks();
};

// Event Listeners for User Actions
addBtn.addEventListener('click', addTask);
taskInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') addTask();
});

// Filter button listeners
document.getElementById('filter-all').addEventListener('click', () => setFilter('all'));
document.getElementById('filter-active').addEventListener('click', () => setFilter('active'));
document.getElementById('filter-completed').addEventListener('click', () => setFilter('completed'));

// Initial Render
renderTasks();
