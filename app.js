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

    const editBtn = document.createElement("button");
    editBtn.className = "btn btn-secondary";
    editBtn.textContent = "Edit";
    editBtn.addEventListener("click", () => startEdit(task.id, li));

    const deleteBtn = document.createElement("button");
    deleteBtn.className = "btn btn-danger";
    deleteBtn.textContent = "Delete";
    deleteBtn.addEventListener("click", () => deleteTask(task.id));

    li.appendChild(checkbox);
    li.appendChild(text);
    li.appendChild(editBtn);
    li.appendChild(deleteBtn);
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

// ===== Delete a task =====
function deleteTask(id) {
  tasks = tasks.filter((t) => t.id !== id);
  saveTasks();
  renderTasks();
}

// ===== Edit a task =====
// Replaces the task text with an input box.
// Enter or clicking away = save, Escape = cancel.
function startEdit(id, li) {
  const task = tasks.find((t) => t.id === id);
  const textEl = li.querySelector(".task-text");

  const editInput = document.createElement("input");
  editInput.type = "text";
  editInput.className = "task-input edit-input";
  editInput.value = task.text;

  li.replaceChild(editInput, textEl);
  editInput.focus();
  editInput.select();

  let finished = false;
  function finishEdit(save) {
    if (finished) return;
    finished = true;

    const newText = editInput.value.trim();
    if (save && newText !== "") {
      task.text = newText;
      saveTasks();
    }
    renderTasks();
  }

  editInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter") finishEdit(true);
    if (event.key === "Escape") finishEdit(false);
  });
  editInput.addEventListener("blur", () => finishEdit(true));
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
