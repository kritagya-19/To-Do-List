class TodoItem {
  constructor(task) {
    this.task = task;
    this.completed = false;
    this.id = Date.now().toString();
  }

  toggleCompletion() {
    this.completed = !this.completed;
  }

  createElement() {
    const todoItem = document.createElement("div");
    todoItem.classList.add("todo-item");
    todoItem.dataset.id = this.id;

    const todoContent = document.createElement("div");
    todoContent.classList.add("todo-content");

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.id = `task-${this.id}`;
    checkbox.checked = this.completed;

    const label = document.createElement("label");
    label.htmlFor = `task-${this.id}`;
    label.textContent = this.task;
    if (this.completed) {
      label.classList.add("completed");
    }

    const deleteBtn = document.createElement("button");
    deleteBtn.classList.add("delete-btn");
    deleteBtn.innerHTML = '<i class="fas fa-trash"></i>';

    todoContent.appendChild(checkbox);
    todoContent.appendChild(label);
    todoItem.appendChild(todoContent);
    todoItem.appendChild(deleteBtn);

    return todoItem;
  }
}

class TodoList {
  constructor(containerSelector) {
    this.container = document.querySelector(containerSelector);
    this.tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    this.initialize();
    this.loadTasks();
  }

  initialize() {
    this.addTaskButton = document.getElementById("add-btn");
    this.taskInput = document.getElementById("new-task");
    this.todoList = document.querySelector(".todo-list");

    this.addTaskButton.addEventListener("click", () => this.addTask());
    this.taskInput.addEventListener("keypress", (e) => {
      if (e.key === "Enter") {
        this.addTask();
      }
    });

    this.todoList.addEventListener("click", (e) => {
      const todoItem = e.target.closest(".todo-item");
      if (!todoItem) return;

      if (e.target.type === "checkbox") {
        this.toggleTask(todoItem.dataset.id);
      }

      if (e.target.closest(".delete-btn")) {
        this.deleteTask(todoItem.dataset.id);
      }
    });
  }

  loadTasks() {
    this.tasks = this.tasks.map(taskData => {
      const task = new TodoItem(taskData.task);
      task.completed = taskData.completed;
      task.id = taskData.id;
      return task;
    });
    this.updateList();
  }

  saveTasks() {
    localStorage.setItem('tasks', JSON.stringify(this.tasks));
  }

  addTask() {
    const taskText = this.taskInput.value.trim();
    if (taskText) {
      const newTask = new TodoItem(taskText);
      this.tasks.push(newTask);
      this.updateList();
      this.saveTasks();
      this.taskInput.value = "";
      
      // Add animation class to the new task
      const newTaskElement = this.todoList.lastElementChild;
      newTaskElement.style.animation = "slideIn 0.3s ease forwards";
    }
  }

  toggleTask(taskId) {
    const task = this.tasks.find(t => t.id === taskId);
    if (task) {
      task.toggleCompletion();
      this.updateList();
      this.saveTasks();
    }
  }

  deleteTask(taskId) {
    const taskElement = this.todoList.querySelector(`[data-id="${taskId}"]`);
    if (taskElement) {
      taskElement.style.animation = "slideOut 0.3s ease forwards";
      setTimeout(() => {
        this.tasks = this.tasks.filter(t => t.id !== taskId);
        this.updateList();
        this.saveTasks();
      }, 300);
    }
  }

  updateList() {
    this.todoList.innerHTML = "";
    this.tasks.forEach((task) => {
      this.todoList.appendChild(task.createElement());
    });
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const todoList = new TodoList(".container");
});
