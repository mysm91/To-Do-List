// Select DOM elements
const toDoApp = document.querySelector(".container");
const taskInput = document.getElementById("task-input");
const submitButton = document.getElementById("task-submit");
const editButton = document.getElementById("task-edit");
const cancelEditButton = document.getElementById("task-edit-cancel");
const toDoList = document.querySelector(".todo-list");
const doneTasksList = document.querySelector(".done-list");
const loaderToDo = document.querySelector(".loader-todo");
const loaderDone = document.querySelector(".loader-done");
// _________________________________________________________
// API URL
const url = `http://localhost:3009`;
const toDoSubdirectory = "/toDoItems";
const doneSubdirectory = "/doneItems";

// _________________________________________________________
// CRUD operations
// GET TASK ITEMS
// Get tasks from the API

const getTasks = async (subdirectory) => {
  const response = await fetch(url + subdirectory);
  const tasks = await response.json();
  subdirectory === toDoSubdirectory
    ? renderToDoTasks(tasks)
    : renderDoneTasks(tasks);
};

// Render tasks which are not done yet
const renderToDoTasks = (tasks) => {
  for (let task of tasks) {
    const { id, title } = task;
    toDoList.innerHTML += `
    <li class="todo-item">
    <span class="task-title">${title}</span>
    <div class="todo-icon-wrapper" data-id="${id}">
      <i class="bx bx-edit edit-task" title="Edit task"></i>
      <i class="bx bx-message-square-check mark-as-done" title="Mark as done"></i>
      <i class="bx bx-message-square-x delete-task delete-todo-task" title="Delete task"></i>
    </div>
  </li>`;
  }
};

// Render tasks which are marked as done
const renderDoneTasks = (tasks) => {
  for (let task of tasks) {
    const { id, title } = task;
    doneTasksList.innerHTML += `
    <li class="done-item">
    <span class="task-title">${title}</span>
    <div class="todo-icon-wrapper" data-id="${id}">
      <i class="bx bx-undo mark-as-undone" title="Mark as undone"></i>
      <i class="bx bx-message-square-x delete-task delete-done-task" title="Delete task"></i>
    </div>
  </li>`;
  }
};
// Get a single to-do task from the API
const getToDoTask = async (id) => {
  const response = await fetch(url + `${toDoSubdirectory}/${id}`);
  const task = await response.json();
  taskInput.value = task.title;
};
// __________________________________________________________
// CREATE AND MARK AS DONE TASK ITEMS
// Create or done task function
const createTask = async (subdirectory, task) => {
  const response = await fetch(url + subdirectory, {
    method: "POST",
    body: JSON.stringify(task),
    headers: {
      "Content-Type": "application/json",
    },
  });
};

// Create task event
submitButton.addEventListener("click", () => {
  const taskTitle = taskInput.value.trim();

  const taskData = {
    title: taskTitle,
  };
  // Task input validation
  if (!taskTitle) {
    alert("Please enter a task title!");
    resetInput();
  } else {
    createTask(toDoSubdirectory, taskData);
    resetInput();
  }
});
// __________________________________________________________
// DELETE AND EDIT TASK ITEMS
// Delete function
const deleteTask = async (subdirectory, id) => {
  await fetch(url + `${subdirectory}/${id}`, {
    method: "DELETE",
  });
};

// Edit function
const editTask = async (id, data) => {
  const response = await fetch(url + `${toDoSubdirectory}/${id}`, {
    method: "PATCH",
    body: JSON.stringify(data),
    headers: {
      "Content-Type": "application/json",
    },
  });
};
// __________________________________________________________
// Delete and edit task event
toDoApp.addEventListener("click", async (e) => {
  const taskId = e.target.parentElement.dataset.id; // getting id from data- attribute

  const taskTitle =
    e.target.parentElement.parentElement.querySelector(".task-title").innerHTML; // getting task title from the list items child

  // Delete task which is not done yet
  if (e.target.classList.contains("delete-todo-task")) {
    const deleteConfirm = confirm("Are you sure to delete this item?");
    if (deleteConfirm) {
      // e.target.parentElement.parentElement.remove();
      deleteTask(toDoSubdirectory, taskId);
    }
  }

  // Delete task which is marked as done
  if (e.target.classList.contains("delete-done-task")) {
    const deleteConfirm = confirm("Are you sure to delete this item?");
    if (deleteConfirm) {
      // e.target.parentElement.parentElement.remove();
      deleteTask(doneSubdirectory, taskId);
    }
  }

  // Mark a task as done
  if (e.target.classList.contains("mark-as-done")) {
    const taskData = {
      title: taskTitle,
    };
    // e.target.parentElement.parentElement.remove();
    await createTask(doneSubdirectory, taskData);
    await deleteTask(toDoSubdirectory, taskId);
  }

  // Mark a task as undone
  if (e.target.classList.contains("mark-as-undone")) {
    const taskData = {
      title: taskTitle,
    };
    // e.target.parentElement.parentElement.remove();
    await createTask(toDoSubdirectory, taskData);
    await deleteTask(doneSubdirectory, taskId);
  }

  // Edit to-do task
  if (e.target.classList.contains("edit-task")) {
    getToDoTask(taskId);
    taskInput.focus();

    // Hiding submit button and showing edit buttons instead
    submitButton.style.display = "none";
    editButton.style.display = "inline-block";
    cancelEditButton.style.display = "inline-block";

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

// loading tasks as the page loads or a response is received
(function initializeTasks() {
  getTasks(toDoSubdirectory);
  getTasks(doneSubdirectory);
  resetInput();
})();

setTimeout(() => {
  if (toDoList.offsetHeight > 360) {
    toDoList.parentElement.style.overflowY = "scroll";
  }
  if (doneTasksList.offsetHeight > 360) {
    doneTasksList.parentElement.style.overflowY = "scroll";
  }
  if (toDoList.children.length < 3) {
    loaderToDo.style.display = "none";
  }
  if (doneTasksList.children.length < 3) {
    loaderDone.style.display = "none";
  }
}, 500);
