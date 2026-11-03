// To-Do App
// Each feature (add, complete, delete, edit, filter) is added
// on its own Git branch.

// ===== Elements =====
const form = document.getElementById("task-form");
const input = document.getElementById("task-input");
const list = document.getElementById("task-list");
const emptyMessage = document.getElementById("empty-message");

// ===== State =====
// Each task looks like: { id: 1730000000000, text: "Buy milk", completed: false }
let tasks = loadTasks();

// ===== Storage =====
function loadTasks() {
  const saved = localStorage.getItem("tasks");
  return saved ? JSON.parse(saved) : [];
}

function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

// ===== Display all tasks =====
function renderTasks() {
  list.innerHTML = "";

  tasks.forEach((task) => {
    const li = document.createElement("li");
    li.className = task.completed ? "task-item completed" : "task-item";

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.className = "task-checkbox";
    checkbox.checked = task.completed;
    checkbox.addEventListener("change", () => toggleTask(task.id));

    const text = document.createElement("span");
    text.className = "task-text";
    text.textContent = task.text;

    li.appendChild(checkbox);
    li.appendChild(text);
    list.appendChild(li);
  });

  emptyMessage.hidden = tasks.length > 0;
}

// ===== Add a new task =====
function addTask(text) {
  tasks.push({
    id: Date.now(),
    text: text,
    completed: false,
  });
  saveTasks();
  renderTasks();
}

// ===== Mark a task as completed =====
function toggleTask(id) {
  const task = tasks.find((t) => t.id === id);
  task.completed = !task.completed;
  saveTasks();
  renderTasks();
}

form.addEventListener("submit", (event) => {
  event.preventDefault(); // stop the page from reloading

  const text = input.value.trim();
  if (text === "") return;

  addTask(text);
  input.value = "";
  input.focus();
});

// ===== Start =====
renderTasks();
