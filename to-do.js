document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const themeToggle = document.getElementById('theme-toggle');
    const themeIcon = themeToggle.querySelector('.theme-icon');
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
    const navLinks = document.querySelectorAll('.nav-link');
    
    // State
    let todos = JSON.parse(localStorage.getItem('todos')) || [];
    let journals = JSON.parse(localStorage.getItem('journals')) || [];
    let currentFilter = 'all';
    
    // Initialize
    updateDate();
    renderTodos();
    updateStats();
    loadRandomQuote();
    loadTodaysJournal();
    loadThemePreference();
    
    // Theme Toggle
    themeToggle.addEventListener('click', function() {
        document.body.classList.toggle('dark-mode');
        
        if (document.body.classList.contains('dark-mode')) {
            themeIcon.classList.replace('fa-moon', 'fa-sun');
            localStorage.setItem('theme', 'dark');
        } else {
            themeIcon.classList.replace('fa-sun', 'fa-moon');
            localStorage.setItem('theme', 'light');
        }
        
        // Add animation
        themeIcon.style.transform = 'scale(1.2)';
        setTimeout(() => {
            themeIcon.style.transform = 'scale(1)';
        }, 300);
    });
    
    // Load theme preference
    function loadThemePreference() {
        const savedTheme = localStorage.getItem('theme') || 
                          (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
        
        if (savedTheme === 'dark') {
            document.body.classList.add('dark-mode');
            themeIcon.classList.replace('fa-moon', 'fa-sun');
        }
    }
    
    // Navigation Functionality
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Remove active class from all links
            navLinks.forEach(l => l.classList.remove('active'));
            
            // Add active class to clicked link
            this.classList.add('active');
            
            // Get target section
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                // Smooth scroll to section
                targetSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
                
                // Update URL without page reload
                history.pushState(null, null, targetId);
            }
        });
    });
    
    // Scroll Spy - Update active nav based on scroll position
    window.addEventListener('scroll', function() {
        const scrollPosition = window.scrollY + 100;
        const sections = ['todo-section', 'journal-section', 'stats-section'];
        
        sections.forEach(sectionId => {
            const section = document.getElementById(sectionId);
            if (!section) return;
            
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                navLinks.forEach(link => link.classList.remove('active'));
                document.querySelector(`.nav-link[href="#${sectionId}"]`).classList.add('active');
            }
        });
    });
    
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
            
            // Scroll to todo section if not visible
            const todoSection = document.getElementById('todo-section');
            const rect = todoSection.getBoundingClientRect();
            if (rect.top < 0 || rect.bottom > window.innerHeight) {
                todoSection.scrollIntoView({ behavior: 'smooth' });
            }
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
        
        // Update stats in navigation if needed
        const statsBadge = document.querySelector('#stats-link .stats-badge');
        if (statsBadge) {
            const totalCompleted = todos.filter(t => t.completed).length;
            statsBadge.textContent = `${totalCompleted}/${todos.length}`;
        }
    }
    
    // Initialize scroll position
    setTimeout(() => {
        window.dispatchEvent(new Event('scroll'));
    }, 100);
});
// New DOM elements to add
const journalHistoryContainer = document.createElement('div');
journalHistoryContainer.className = 'journal-history-container';
journalHistoryContainer.innerHTML = `
    <h3><i class="fas fa-history"></i> Journal History</h3>
    <div class="journal-entries" id="journal-entries"></div>
`;
document.querySelector('.journal-container').appendChild(journalHistoryContainer);

// Modified saveJournal function
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
        showSavedJournal(today); // Show the saved journal
        
        // Show confirmation
        saveJournalBtn.innerHTML = '<i class="fas fa-check"></i> Saved!';
        setTimeout(() => {
            saveJournalBtn.innerHTML = '<i class="fas fa-save"></i> Save Journal';
        }, 2000);
    }
}

// New function to display saved journal
function showSavedJournal(date) {
    const journalEntries = document.getElementById('journal-entries');
    const savedJournal = journals.find(j => j.date === date);
    
    if (!savedJournal) return;
    
    const formattedDate = new Date(date).toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
    
    const journalEntry = document.createElement('div');
    journalEntry.className = 'journal-entry';
    journalEntry.innerHTML = `
        <div class="journal-entry-header">
            <span class="entry-date">${formattedDate}</span>
            <button class="view-entry-btn" data-date="${date}">
                <i class="fas fa-eye"></i> View
            </button>
        </div>
    `;
    
    // Prepend to show newest first
    journalEntries.prepend(journalEntry);
    
    // Add click handler for view button
    journalEntry.querySelector('.view-entry-btn').addEventListener('click', function() {
        viewJournalEntry(date);
    });
}

// New function to view a journal entry
function viewJournalEntry(date) {
    const entry = journals.find(j => j.date === date);
    if (!entry) return;
    
    const formattedDate = new Date(date).toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
    
    // Create modal
    const modal = document.createElement('div');
    modal.className = 'journal-modal';
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h3>${formattedDate}</h3>
                <button class="close-modal">&times;</button>
            </div>
            <div class="modal-body">
                <div class="journal-content">${entry.content.replace(/\n/g, '<br>')}</div>
            </div>
            <div class="modal-footer">
                <button class="btn edit-entry" data-date="${date}">
                    <i class="fas fa-edit"></i> Edit
                </button>
                <button class="btn delete-entry" data-date="${date}">
                    <i class="fas fa-trash"></i> Delete
                </button>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Add event listeners
    modal.querySelector('.close-modal').addEventListener('click', () => {
        modal.remove();
    });
    
    modal.querySelector('.edit-entry').addEventListener('click', () => {
        editJournalEntry(date);
        modal.remove();
    });
    
    modal.querySelector('.delete-entry').addEventListener('click', () => {
        if (confirm('Are you sure you want to delete this journal entry?')) {
            deleteJournalEntry(date);
            modal.remove();
        }
    });
}

// New function to edit journal entry
function editJournalEntry(date) {
    const entry = journals.find(j => j.date === date);
    if (!entry) return;
    
    // Scroll to journal section
    document.getElementById('journal-section').scrollIntoView({ behavior: 'smooth' });
    
    // Set the journal input
    journalInput.value = entry.content;
    wordCount.textContent = entry.content.trim() ? entry.content.split(/\s+/).length : 0;
}

// New function to delete journal entry
function deleteJournalEntry(date) {
    journals = journals.filter(j => j.date !== date);
    localStorage.setItem('journals', JSON.stringify(journals));
    updateStats();
    
    // Remove from UI
    const entries = document.querySelectorAll('.journal-entry');
    entries.forEach(entry => {
        if (entry.querySelector('.view-entry-btn').dataset.date === date) {
            entry.remove();
        }
    });
}

// Modified initialization to load journal history
function loadTodaysJournal() {
    const today = new Date().toISOString().split('T')[0];
    const todaysJournal = journals.find(j => j.date === today);
    
    if (todaysJournal) {
        journalInput.value = todaysJournal.content;
        const words = todaysJournal.content.split(/\s+/).length;
        wordCount.textContent = words;
    }
    
    // Load all journal entries
    loadJournalHistory();
}

// New function to load journal history
function loadJournalHistory() {
    const journalEntries = document.getElementById('journal-entries');
    journalEntries.innerHTML = '';
    
    // Sort by date (newest first)
    const sortedJournals = [...journals].sort((a, b) => new Date(b.date) - new Date(a.date));
    
    sortedJournals.forEach(journal => {
        const formattedDate = new Date(journal.date).toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
        
        const journalEntry = document.createElement('div');
        journalEntry.className = 'journal-entry';
        journalEntry.innerHTML = `
            <div class="journal-entry-header">
                <span class="entry-date">${formattedDate}</span>
                <button class="view-entry-btn" data-date="${journal.date}">
                    <i class="fas fa-eye"></i> View
                </button>
            </div>
        `;
        
        journalEntries.appendChild(journalEntry);
        
        // Add click handler
        journalEntry.querySelector('.view-entry-btn').addEventListener('click', function() {
            viewJournalEntry(journal.date);
        });
    });
}