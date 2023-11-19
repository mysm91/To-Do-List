// Select DOM elements
const toDoApp = document.querySelector(".container");
const taskInput = document.getElementById("task-input");
const submitButton = document.getElementById("task-submit");
const editButton = document.getElementById("task-edit");
const cancelEditButton = document.getElementById("task-edit-cancel");
const toDoList = document.querySelector(".todo-list");
const doneTasksList = document.querySelector(".done-list");

// API URL
const url = `http://localhost:3000`;

// CRUD operations
// GET TASK ITEMS
// Get tasks which are not done yet from the API
const getToDoTasks = async () => {
  const response = await fetch(url + "/toDoItems");
  const tasks = await response.json();
  renderToDoTasks(tasks);
  resetInput();
};

// Render tasks which are not done yet
const renderToDoTasks = (tasks) => {
  for (let task of tasks) {
    const { id, title } = task;
    toDoList.innerHTML += `
    <li class="todo-item">
    <span class="task-title">${title}</span>
    <div class="todo-icon-wrapper" data-id="${id}">
      <i class="bx bx-edit edit-task">
        <div class="edit-legend">Edit</div>
      </i>
      <i class="bx bx-message-square-check mark-as-done">
        <div class="done-task-legend">Done</div>
      </i>
      <i class="bx bx-message-square-x delete-task delete-todo-task">
        <div class="delete-legend">Delete</div>
      </i>
    </div>
  </li>`;
  }
};

// Get tasks which are marked as done from the API
const getDoneTasks = async () => {
  const response = await fetch(url + "/doneItems");
  const tasks = await response.json();
  renderDoneTasks(tasks);
};

// Render tasks which are marked as done
const renderDoneTasks = (tasks) => {
  for (let task of tasks) {
    const { id, title } = task;
    doneTasksList.innerHTML += `
    <li class="done-item">
    <span class="task-title">${title}</span>
    <div class="todo-icon-wrapper" data-id="${id}">
      <i class="bx bx-undo undo-task">
        <div class="undo-task-legend">Undo</div>
      </i>
      <i class="bx bx-message-square-x delete-task delete-done-task">
        <div class="delete-legend">Delete</div>
      </i>
    </div>
  </li>`;
  }
};
// Get a single task which is not done yet from the API
const getToDoTask = async (id) => {
  const response = await fetch(url + `/toDoItems/${id}`);
  const task = await response.json();
  taskInput.value = task.title;
};

// CREATE TASK ITEMS
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
  // Task input validation
  if (!taskTitle) {
    alert("Please enter a task title!");
    resetInput();
  } else {
    createTask(taskData);
    resetInput();
  }
});

// DELETE AND EDIT TASK ITEMS
// Delete function for tasks which are not done yet
const deleteToDoTask = async (id) => {
  await fetch(url + `/toDoItems/${id}`, {
    method: "DELETE",
  });
};

// Delete function for tasks which are marked as done
const deleteDoneTask = async (id) => {
  await fetch(url + `/doneItems/${id}`, {
    method: "DELETE",
  });
};

// Edit function for tasks which are not done yet
const editTask = async (id, data) => {
  const response = await fetch(url + `/toDoItems/${id}`, {
    method: "PATCH",
    body: JSON.stringify(data),
    headers: {
      "Content-Type": "application/json",
    },
  });
};

// Delete and edit task event
toDoApp.addEventListener("click", (e) => {
  const taskId = e.target.parentElement.dataset.id; // getting id from data- attribute

  // Delete task which is not done yet
  if (e.target.classList.contains("delete-todo-task")) {
    const deleteConfirm = confirm("Are you sure to delete this item?");
    if (deleteConfirm) {
      deleteToDoTask(taskId);
    }
  }

  // Delete task which is marked as done
  if (e.target.classList.contains("delete-done-task")) {
    const deleteConfirm = confirm("Are you sure to delete this item?");
    if (deleteConfirm) {
      deleteDoneTask(taskId);
    }
  }

  // Edit task which is not done yet
  if (e.target.classList.contains("edit-task")) {
    getToDoTask(taskId);

    // Hiding submit button and showing edit buttons instead
    submitButton.style.display = "none";
    editButton.style.display = "inline-block";
    cancelEditButton.style.display = "inline-block";
    // taskInput.style.width = "62%";
    // editButton.style.width = "60px";
    // cancelEditButton.style.width = "60px";

    editButton.setAttribute("data-edit-id", taskId);

    // Edit task event
    editButton.addEventListener("click", () => {
      // Getting data from DOM
      const taskTitle = taskInput.value.trim();

      // Put received data from DOM in an object
      const taskData = {
        title: taskTitle,
      };

      // Edit task validation
      if (!taskTitle) {
        alert("Please enter a task title!");
      } else {
        editTask(taskId, taskData);

        // Hiding edit button and showing submit button instead
        submitButton.style.display = "inline-block";
        editButton.style.display = "none";
        cancelEditButton.style.display = "none";
      }
    });

    // Canceling edit task event
    cancelEditButton.addEventListener("click", () => {
      resetInput();
      submitButton.style.display = "inline-block";
      editButton.style.display = "none";
      cancelEditButton.style.display = "none";
    });
  }
});

// Page reset function
const resetInput = () => {
  taskInput.value = "";
  taskInput.focus();
};

// Calling functions as the page loads
getToDoTasks();
getDoneTasks();
