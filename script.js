let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
let darkMode = localStorage.getItem("darkMode") === "true";

if (darkMode) document.body.classList.add("dark");

function saveTasks() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

function saveDarkMode() {
    localStorage.setItem("darkMode", document.body.classList.contains("dark"));
}

function addTask() {
    const title = document.getElementById("taskTitle").value.trim();
    const date = document.getElementById("taskDate").value;
    const priority = document.getElementById("taskPriority").value;
    const category = document.getElementById("taskCategory").value;

    if (!title) return alert("Task title required!");

    tasks.push({
        id: Date.now(),
        title,
        date,
        priority,
        category,
        completed: false
    });

    saveTasks();
    clearForm();
    renderTasks();
}

function clearForm() {
    document.getElementById("taskTitle").value = "";
    document.getElementById("taskDate").value = "";
    document.getElementById("taskCategory").value = "";
}

function clearAllTasks() {
    if (confirm("Are you sure you want to delete all tasks?")) {
        tasks = [];
        saveTasks();
        renderTasks();
    }
}

function deleteTask(id) {
    if (confirm("Delete this task?")) {
        tasks = tasks.filter(task => task.id !== id);
        saveTasks();
        renderTasks();
    }
}

function toggleComplete(id) {
    tasks = tasks.map(task =>
        task.id === id ? { ...task, completed: !task.completed } : task
    );
    saveTasks();
    renderTasks();
}

function editTask(id) {
    const newTitle = prompt("Edit task title:");
    if (!newTitle) return;

    tasks = tasks.map(task =>
        task.id === id ? { ...task, title: newTitle } : task
    );

    saveTasks();
    renderTasks();
}

function renderTasks() {
    const list = document.getElementById("taskList");
    const search = document.getElementById("searchInput").value.toLowerCase();
    const filter = document.getElementById("filterStatus").value;
    const sortOption = document.getElementById("sortOption").value;

    list.innerHTML = "";

    let filteredTasks = tasks.filter(task =>
        task.title.toLowerCase().includes(search)
    );

    if (filter === "Completed")
        filteredTasks = filteredTasks.filter(task => task.completed);

    if (filter === "Pending")
        filteredTasks = filteredTasks.filter(task => !task.completed);

    if (sortOption === "Date") {
        filteredTasks.sort((a, b) => new Date(a.date) - new Date(b.date));
    }

    if (sortOption === "Priority") {
        const priorityOrder = { High: 1, Medium: 2, Low: 3 };
        filteredTasks.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);
    }

    filteredTasks.forEach(task => {
        const li = document.createElement("li");
        li.className = `task-item ${task.priority} ${task.completed ? "completed" : ""}`;

        li.innerHTML = `
            <div>
                <strong>${task.title}</strong><br>
                📅 ${task.date || "No Date"} | 
                📂 ${task.category || "General"} | 
                🔥 ${task.priority}
            </div>
            <div class="task-actions">
                <button onclick="toggleComplete(${task.id})">✔</button>
                <button onclick="editTask(${task.id})">✏</button>
                <button onclick="deleteTask(${task.id})">🗑</button>
            </div>
        `;

        list.appendChild(li);
    });

    updateStats();
}

function updateStats() {
    document.getElementById("totalTasks").textContent = tasks.length;
    document.getElementById("completedTasks").textContent =
        tasks.filter(t => t.completed).length;
    document.getElementById("pendingTasks").textContent =
        tasks.filter(t => !t.completed).length;
}

document.getElementById("darkModeToggle").addEventListener("click", () => {
    document.body.classList.toggle("dark");
    saveDarkMode();
});

document.getElementById("taskTitle").addEventListener("keypress", function(e) {
    if (e.key === "Enter") addTask();
});

renderTasks();