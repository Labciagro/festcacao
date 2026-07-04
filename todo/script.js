// To-Do List App with Local Storage

class TodoApp {
  constructor() {
    this.todos = [];
    this.currentFilter = 'all';
    this.storageKey = 'todoList';
    
    // DOM Elements
    this.todoInput = document.getElementById('todoInput');
    this.addBtn = document.getElementById('addBtn');
    this.todoList = document.getElementById('todoList');
    this.emptyState = document.getElementById('emptyState');
    this.clearBtn = document.getElementById('clearBtn');
    this.deleteAllBtn = document.getElementById('deleteAllBtn');
    this.filterBtns = document.querySelectorAll('.filter-btn');
    this.totalCount = document.getElementById('totalCount');
    this.activeCount = document.getElementById('activeCount');
    this.completedCount = document.getElementById('completedCount');

    this.init();
  }

  init() {
    this.loadFromStorage();
    this.attachEventListeners();
    this.render();
  }

  attachEventListeners() {
    // Add todo
    this.addBtn.addEventListener('click', () => this.addTodo());
    this.todoInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') this.addTodo();
    });

    // Filter buttons
    this.filterBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        this.filterBtns.forEach(b => b.classList.remove('active'));
        e.target.classList.add('active');
        this.currentFilter = e.target.dataset.filter;
        this.render();
      });
    });

    // Clear and delete buttons
    this.clearBtn.addEventListener('click', () => this.clearCompleted());
    this.deleteAllBtn.addEventListener('click', () => this.deleteAll());
  }

  addTodo() {
    const text = this.todoInput.value.trim();

    if (text === '') {
      this.todoInput.focus();
      return;
    }

    const todo = {
      id: Date.now(),
      text: text,
      completed: false,
      createdAt: new Date().toLocaleString()
    };

    this.todos.unshift(todo);
    this.saveToStorage();
    this.todoInput.value = '';
    this.todoInput.focus();
    this.render();
  }

  deleteTodo(id) {
    this.todos = this.todos.filter(todo => todo.id !== id);
    this.saveToStorage();
    this.render();
  }

  toggleTodo(id) {
    const todo = this.todos.find(t => t.id === id);
    if (todo) {
      todo.completed = !todo.completed;
      this.saveToStorage();
      this.render();
    }
  }

  clearCompleted() {
    this.todos = this.todos.filter(todo => !todo.completed);
    this.saveToStorage();
    this.render();
  }

  deleteAll() {
    if (this.todos.length === 0) return;
    
    if (confirm('Are you sure you want to delete all tasks? This action cannot be undone.')) {
      this.todos = [];
      this.saveToStorage();
      this.render();
    }
  }

  getFilteredTodos() {
    switch (this.currentFilter) {
      case 'active':
        return this.todos.filter(todo => !todo.completed);
      case 'completed':
        return this.todos.filter(todo => todo.completed);
      default:
        return this.todos;
    }
  }

  updateStats() {
    const total = this.todos.length;
    const active = this.todos.filter(todo => !todo.completed).length;
    const completed = this.todos.filter(todo => todo.completed).length;

    this.totalCount.textContent = total;
    this.activeCount.textContent = active;
    this.completedCount.textContent = completed;
  }

  render() {
    const filteredTodos = this.getFilteredTodos();
    this.todoList.innerHTML = '';

    if (filteredTodos.length === 0) {
      this.emptyState.classList.add('show');
    } else {
      this.emptyState.classList.remove('show');
      filteredTodos.forEach(todo => {
        this.todoList.appendChild(this.createTodoElement(todo));
      });
    }

    this.updateStats();
  }

  createTodoElement(todo) {
    const li = document.createElement('li');
    li.className = `todo-item ${todo.completed ? 'completed' : ''}`;
    li.innerHTML = `
      <input 
        type="checkbox" 
        class="checkbox" 
        ${todo.completed ? 'checked' : ''}
        data-id="${todo.id}"
      >
      <span class="todo-text">${this.escapeHtml(todo.text)}</span>
      <button class="delete-btn" data-id="${todo.id}">×</button>
    `;

    // Checkbox event
    li.querySelector('.checkbox').addEventListener('change', (e) => {
      this.toggleTodo(parseInt(e.target.dataset.id));
    });

    // Delete button event
    li.querySelector('.delete-btn').addEventListener('click', (e) => {
      this.deleteTodo(parseInt(e.target.dataset.id));
    });

    return li;
  }

  escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  saveToStorage() {
    localStorage.setItem(this.storageKey, JSON.stringify(this.todos));
  }

  loadFromStorage() {
    const stored = localStorage.getItem(this.storageKey);
    this.todos = stored ? JSON.parse(stored) : [];
  }
}

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  new TodoApp();
});
