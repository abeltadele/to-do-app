document.addEventListener('DOMContentLoaded', function() {
            // DOM Elements
            const themeToggle = document.getElementById('theme-toggle');
            const addTodoBtn = document.getElementById('add-todo-btn');
            const todoInput = document.getElementById('todo-input');
            const todosContainer = document.getElementById('todos-container');
            const filterSelect = document.getElementById('filter-select');
            const journalInput = document.getElementById('journal-input');
            const saveJournalBtn = document.getElementById('save-journal-btn');
            const newJournalBtn = document.getElementById('new-journal-btn');
            const wordCount = document.getElementById('word-count');
            const currentDate = document.getElementById('current-date');
            const quoteText = document.getElementById('quote-text');
            const quoteAuthor = document.getElementById('quote-author');
            const totalTasksEl = document.getElementById('total-tasks');
            const completedTasksEl = document.getElementById('completed-tasks');
            const journalsCountEl = document.getElementById('journals-count');
            
            // State
            let todos = JSON.parse(localStorage.getItem('todos')) || [];
            let journals = JSON.parse(localStorage.getItem('journals')) || [];
            let currentFilter = 'all';
            
            // Initialize
            updateDate();
            renderTodos();
            updateStats();
            loadRandomQuote();
            
            // Theme Toggle
            themeToggle.addEventListener('click', function() {
                document.body.classList.toggle('dark-mode');
                const icon = themeToggle.querySelector('i');
                if (document.body.classList.contains('dark-mode')) {
                    icon.classList.remove('fa-moon');
                    icon.classList.add('fa-sun');
                } else {
                    icon.classList.remove('fa-sun');
                    icon.classList.add('fa-moon');
                }
                saveThemePreference();
            });
            
            // Load theme preference
            function loadThemePreference() {
                const isDarkMode = localStorage.getItem('darkMode') === 'true';
                if (isDarkMode) {
                    document.body.classList.add('dark-mode');
                    themeToggle.querySelector('i').classList.remove('fa-moon');
                    themeToggle.querySelector('i').classList.add('fa-sun');
                }
            }
            
            function saveThemePreference() {
                localStorage.setItem('darkMode', document.body.classList.contains('dark-mode'));
            }
            
            // Update current date
            function updateDate() {
                const now = new Date();
                const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
                currentDate.textContent = now.toLocaleDateString('en-US', options);
            }
            
            // Load random quote
            function loadRandomQuote() {
                const quotes = [
                    {
                        text: "The secret of getting ahead is getting started.",
                        author: "Mark Twain"
                    },
                    {
                        text: "Your mind is for having ideas, not holding them.",
                        author: "David Allen"
                    },
                    {
                        text: "The key is not to prioritize what's on your schedule, but to schedule your priorities.",
                        author: "Stephen Covey"
                    },
                    {
                        text: "Productivity is never an accident. It is always the result of a commitment to excellence, intelligent planning, and focused effort.",
                        author: "Paul J. Meyer"
                    },
                    {
                        text: "Do the hard jobs first. The easy jobs will take care of themselves.",
                        author: "Dale Carnegie"
                    }
                ];
                
                const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
                quoteText.textContent = randomQuote.text;
                quoteAuthor.textContent = `– ${randomQuote.author}`;
            }
            
            // Add new todo
            addTodoBtn.addEventListener('click', addTodo);
            todoInput.addEventListener('keypress', function(e) {
                if (e.key === 'Enter') addTodo();
            });
            
            function addTodo() {
                const text = todoInput.value.trim();
                if (text) {
                    const newTodo = {
                        id: Date.now(),
                        text: text,
                        completed: false,
                        createdAt: new Date().toISOString()
                    };
                    
                    todos.push(newTodo);
                    saveTodos();
                    renderTodos();
                    todoInput.value = '';
                    todoInput.focus();
                    updateStats();
                }
            }
            
            // Render todos based on filter
            function renderTodos() {
                todosContainer.innerHTML = '';
                
                const filteredTodos = todos.filter(todo => {
                    if (currentFilter === 'active') return !todo.completed;
                    if (currentFilter === 'completed') return todo.completed;
                    return true;
                });
                
                if (filteredTodos.length === 0) {
                    todosContainer.innerHTML = `
                        <div class="empty-state">
                            <i class="fas fa-check-circle"></i>
                            <p>${currentFilter === 'completed' ? 'No completed tasks yet' : 'No tasks yet. Add your first task!'}</p>
                        </div>
                    `;
                    return;
                }
                
                filteredTodos.forEach(todo => {
                    const todoElement = document.createElement('div');
                    todoElement.className = `todo-item ${todo.completed ? 'completed' : ''}`;
                    todoElement.dataset.id = todo.id;
                    
                    todoElement.innerHTML = `
                        <div class="todo-check ${todo.completed ? 'checked' : ''}">
                            <i class="fas fa-check ${todo.completed ? '' : 'hidden'}"></i>
                        </div>
                        <div class="todo-text">${todo.text}</div>
                        <div class="todo-actions">
                            <button class="edit" title="Edit">
                                <i class="fas fa-edit"></i>
                            </button>
                            <button class="delete" title="Delete">
                                <i class="fas fa-trash"></i>
                            </button>
                        </div>
                    `;
                    
                    const checkBtn = todoElement.querySelector('.todo-check');
                    const editBtn = todoElement.querySelector('.edit');
                    const deleteBtn = todoElement.querySelector('.delete');
                    const todoText = todoElement.querySelector('.todo-text');
                    
                    checkBtn.addEventListener('click', () => toggleTodoComplete(todo.id));
                    deleteBtn.addEventListener('click', () => deleteTodo(todo.id));
                    editBtn.addEventListener('click', () => editTodo(todo.id, todoText));
                    
                    todosContainer.appendChild(todoElement);
                });
            }
            
            // Toggle todo completion
            function toggleTodoComplete(id) {
                todos = todos.map(todo => {
                    if (todo.id === id) {
                        return { ...todo, completed: !todo.completed };
                    }
                    return todo;
                });
                
                saveTodos();
                renderTodos();
                updateStats();
            }
            
            // Delete todo
            function deleteTodo(id) {
                todos = todos.filter(todo => todo.id !== id);
                saveTodos();
                renderTodos();
                updateStats();
            }
            
            // Edit todo
            function editTodo(id, textElement) {
                const todo = todos.find(t => t.id === id);
                if (!todo) return;
                
                const newText = prompt('Edit your task:', todo.text);
                if (newText !== null && newText.trim() !== '') {
                    todo.text = newText.trim();
                    saveTodos();
                    renderTodos();
                }
            }
            
            // Save todos to localStorage
            function saveTodos() {
                localStorage.setItem('todos', JSON.stringify(todos));
            }
            
            // Filter todos
            filterSelect.addEventListener('change', function() {
                currentFilter = this.value;
                renderTodos();
            });
            
            // Journal word count
            journalInput.addEventListener('input', function() {
                const text = this.value.trim();
                const words = text ? text.split(/\s+/).length : 0;
                wordCount.textContent = words;
            });
            
            // Save journal
            saveJournalBtn.addEventListener('click', saveJournal);
            
            function saveJournal() {
                const content = journalInput.value.trim();
                if (content) {
                    const today = new Date().toISOString().split('T')[0];
                    const existingIndex = journals.findIndex(j => j.date === today);
                    
                    if (existingIndex !== -1) {
                        journals[existingIndex].content = content;
                    } else {
                        journals.push({
                            date: today,
                            content: content
                        });
                    }
                    
                    localStorage.setItem('journals', JSON.stringify(journals));
                    updateStats();
                    
                    // Show confirmation
                    saveJournalBtn.innerHTML = '<i class="fas fa-check"></i> Saved!';
                    setTimeout(() => {
                        saveJournalBtn.innerHTML = '<i class="fas fa-save"></i> Save Journal';
                    }, 2000);
                }
            }
            
            // New journal
            newJournalBtn.addEventListener('click', function() {
                if (journalInput.value.trim() && !confirm('Are you sure? Your current journal entry will be cleared.')) {
                    return;
                }
                journalInput.value = '';
                wordCount.textContent = '0';
            });
            
            // Load today's journal if exists
            function loadTodaysJournal() {
                const today = new Date().toISOString().split('T')[0];
                const todaysJournal = journals.find(j => j.date === today);
                
                if (todaysJournal) {
                    journalInput.value = todaysJournal.content;
                    const words = todaysJournal.content.split(/\s+/).length;
                    wordCount.textContent = words;
                }
            }
            
            // Update statistics
            function updateStats() {
                totalTasksEl.textContent = todos.length;
                completedTasksEl.textContent = todos.filter(t => t.completed).length;
                journalsCountEl.textContent = journals.length;
            }
            
            // Initialize
            loadThemePreference();
            loadTodaysJournal();
        });