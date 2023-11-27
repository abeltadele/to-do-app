let isAnimating = false;
let timerInterval;
let count = 0;
const maxCount = 3600; // 1 hour in seconds

function startTimer() {
    timerInterval = setInterval(() => {
        count++;
        if (count >= maxCount) {
            stopTimer();
            playAlarm();
        }
         updateTimerDisplay();
    }, 1000);
}

function stopTimer() {
    clearInterval(timerInterval);
    count = 0;
    isAnimating = false;
    updateTimerDisplay();
}

function toggleAnimation() {
    const circle = document.querySelector('.circle');
    isAnimating = !isAnimating;

    if (isAnimating) {
        circle.classList.remove('start');
        circle.classList.add('stop');
        startTimer();
    } else {
        circle.classList.remove('stop');
        circle.classList.add('start');
        stopTimer();
    }
}

function updateTimerDisplay() {
    const timerDisplay = document.querySelector('.timer-display');
    const hours = Math.floor(count / 3600);
    const minutes = Math.floor((count % 3600) / 60);
    const seconds = count % 60;
    timerDisplay.textContent = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

function playAlarm() {
    const alarmSound = new Audio('alarm.mp3'); // Replace 'alarm.mp3' with the path to your alarm sound file
    alarmSound.play();
}
const inputBox = document.getElementById( 'input-box');
const listContainer = document.getElementById('list-container');

function addTask() {
    const inputBox = document.getElementById('input-box');
    const taskText = inputBox.value.trim();
  
    if (taskText !== '') {
      const listContainer = document.getElementById('list-container');
      const listItem = document.createElement('li');
  
      const label = document.createElement('label');
      const checkbox = document.createElement('input');
      checkbox.type = 'checkbox';
      checkbox.className = 'checkbox';
  
      const taskTextSpan = document.createElement('span');
      taskTextSpan.textContent = taskText;
  
      const clearButton = document.createElement('span');
      clearButton.textContent = 'X';
      clearButton.className = 'clear-button';
      clearButton.addEventListener('click', function() {
        listItem.remove(); // Clear the task when the cross is clicked
      });
  
      label.appendChild(checkbox);
      label.appendChild(taskTextSpan);
      label.appendChild(clearButton);
  
      listItem.appendChild(label);
      listContainer.appendChild(listItem);
  
      inputBox.value = ''; // Clear the input box after adding the task
    }
  }
  
  // Optional: Clear the input box when the user presses Enter key
  document.getElementById('input-box').addEventListener('keyup', function(event) {
    if (event.key === 'Enter') {
      addTask();
    }
  });
  // Function to load saved tasks from LocalStorage
function loadSavedTasks() {
  const savedTasks = localStorage.getItem('tasks');
  if (savedTasks) {
    const listContainer = document.getElementById('list-container');
    listContainer.innerHTML = savedTasks;
    initializeCheckboxes();
  }
}

// Function to save the tasks to LocalStorage
function saveTasks() {
  const listContainer = document.getElementById('list-container');
  localStorage.setItem('tasks', listContainer.innerHTML);
}

// Function to initialize checkbox functionality
function initializeCheckboxes() {
  const checkboxes = document.querySelectorAll('.checkbox');
  checkboxes.forEach(checkbox => {
    checkbox.addEventListener('change', saveTasks);
  });
}

// Function to add a new task to the list
function addTask() {
  const inputBox = document.getElementById('input-box');
  const taskText = inputBox.value.trim();

  if (taskText !== '') {
    const listContainer = document.getElementById('list-container');
    const listItem = document.createElement('li');

    const label = document.createElement('label');
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.className = 'checkbox';

    const taskTextSpan = document.createElement('span');
    taskTextSpan.textContent = taskText;

    const clearButton = document.createElement('span');
    clearButton.textContent = 'X';
    clearButton.className = 'clear-button';
    clearButton.addEventListener('click', function() {
      listItem.remove();
      saveTasks(); // Save the tasks after removing a task
    });

    label.appendChild(checkbox);
    label.appendChild(taskTextSpan);
    label.appendChild(clearButton);

    listItem.appendChild(label);
    listContainer.appendChild(listItem);

    inputBox.value = ''; // Clear the input box after adding the task
    saveTasks(); // Save the tasks after adding a new task
    initializeCheckboxes();
  }
}

// Optional: Clear the input box when the user presses Enter key
document.getElementById('input-box').addEventListener('keyup', function(event) {
  if (event.key === 'Enter') {
    addTask();
  }
});

// Load saved tasks when the page is loaded
window.addEventListener('load', function() {
  loadSavedTasks();
});

  
  
  