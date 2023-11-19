// Select DOM elements
const taskInput = document.getElementById("task-input");
const submitButton = document.getElementById("task-submit");
const toDoList = document.querySelector(".todo-list");
const doneTasksList = document.querySelector(".done-list");

// API URL
const url = `http://localhost:3000`;

// CRUD

// Get task items
// Get toDo items from the API
const getToDoTasks = async () => {
  const response = await fetch(url + "/toDoItems");
  const tasks = await response.json();
  renderToDoTasks(tasks);
  resetInput();
};

// Render tasks which are not done yet
const renderToDoTasks = (tasks) => {
  for (let task of tasks) {
    toDoList.innerHTML += `
    <li class="todo-item">
    <span class="task-title">${task.title}</span>
    <div class="todo-icon-wrapper">
      <i class="bx bx-edit edit-task">
        <div class="edit-legend">Edit</div>
      </i>
      <i class="bx bx-message-square-check mark-as-done">
        <div class="done-task-legend">Done</div>
      </i>
      <i class="bx bx-message-square-x delete-task">
        <div class="delete-legend">Delete</div>
      </i>
    </div>
  </li>`;
  }
};

// Get done tasks from the API
const getDoneTasks = async () => {
  const response = await fetch(url + "/doneItems");
  const tasks = await response.json();
  renderDoneTasks(tasks);
};

// Render tasks which are marked as done
const renderDoneTasks = (tasks) => {
  for (let task of tasks) {
    doneTasksList.innerHTML += `
    <li class="done-item">
    <span class="task-title">${task.title}</span>
    <div class="todo-icon-wrapper">
      <i class="bx bx-undo undo-task">
        <div class="undo-task-legend">Undo</div>
      </i>
      <i class="bx bx-message-square-x delete-task">
        <div class="delete-legend">Delete</div>
      </i>
    </div>
  </li>`;
  }
};

// CREATE TASK ITEM
// Create task function
const createTask = async (task) => {
  const response = await fetch(url + "/toDoItems", {
    method: "POST",
    body: JSON.stringify(task),
    headers: {
      "Content-Type": "application/json",
    },
  });
};

// Create task event
submitButton.addEventListener("click", (e) => {
  e.preventDefault();
  const taskTitle = taskInput.value.trim();

  const taskData = {
    title: taskTitle,
  };
  // Input validation
  if (!taskTitle) {
    alert("Please enter a task title!");
    resetInput();
  } else {
    createTask(taskData);
    resetInput();
  }
});

// Edit item

// Page reset function
const resetInput = () => {
  taskInput.value = "";
  taskInput.focus();
};
// Calling functions as the page loads
getToDoTasks();
getDoneTasks();
