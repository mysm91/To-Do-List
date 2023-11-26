// Select DOM elements
const toDoApp = document.querySelector(".container");
const editModal = document.querySelector(".edit-modal");
const deleteModal = document.querySelector(".delete-modal");
const alertModal = document.querySelector(".alert-modal");
const inputForm = document.querySelector(".input-item-wrapper");
const editForm = document.querySelector(".edit-task-wrapper");
const taskInput = document.getElementById("task-input");
const taskEdit = document.getElementById("edit-task-input");
const deleteAllIToDoTasks = document.querySelector(".delete-all-todo-tasks");
const deleteAllDoneTasks = document.querySelector(".delete-all-done-tasks");
const editButton = document.querySelector(".submit-edit-button");
const cancelEditButton = document.querySelector(".cancel-edit-button");
const deleteButton = document.querySelector(".delete-button");
const cancelDeleteButton = document.querySelector(".cancel-delete-button");
const deleteModalMessage = document.querySelector(".delete-modal-message");
const toDoList = document.querySelector(".todo-list");
const doneTasksList = document.querySelector(".done-list");
const noToDo = document.querySelector(".no-todo-task");
const noDone = document.querySelector(".no-done-task");
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
  listChecker();
};

// Get a single to-do task from the API
const getToDoTask = async (id) => {
  const response = await fetch(url + `${toDoSubdirectory}/${id}`);
  const task = await response.json();
  taskEdit.value = task.title;
};

// Render to-do tasks
const renderToDoTasks = (tasks) => {
  for (let task of tasks) {
    const { id, title } = task;
    toDoList.innerHTML += `
    <li class="todo-item d-flex align-center">
    <span class="task-title">${title}</span>
    <div class="todo-icon-wrapper d-flex" data-id="${id}">
      <i class="bx bx-edit edit-task" title="Edit task"></i>
      <i class="bx bx-message-square-check mark-as-done" title="Mark as done"></i>
      <i class="bx bx-message-square-x delete-task delete-todo-task" title="Delete task"></i>
    </div>
  </li>`;
  }
};

// Render done tasks
const renderDoneTasks = (tasks) => {
  for (let task of tasks) {
    const { id, title } = task;
    doneTasksList.innerHTML += `
    <li class="done-item d-flex align-center">
    <span class="task-title">${title}</span>
    <div class="todo-icon-wrapper d-flex" data-id="${id}">
      <i class="bx bx-undo mark-as-undone" title="Mark as undone"></i>
      <i class="bx bx-message-square-x delete-task delete-done-task" title="Delete task"></i>
    </div>
  </li>`;
  }
};
// __________________________________________________________
// CREATE AND MARK AS DONE TASK ITEMS
// Create task / mark task as done function
const createTask = async (subdirectory, task) => {
  await fetch(url + subdirectory, {
    method: "POST",
    body: JSON.stringify(task),
    headers: {
      "Content-Type": "application/json",
    },
  });
};

// Create task event
inputForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const taskTitle = taskInput.value.trim();

  const taskData = {
    title: taskTitle,
  };
  // Task input validation
  if (!taskTitle) {
    showAlert();
    resetInput();
  } else {
    createTask(toDoSubdirectory, taskData);
    resetInput();
  }
});
// __________________________________________________________
// DELETE AND EDIT TASK ITEMS
// Delete single task function
const deleteTask = async (subdirectory, id) => {
  await fetch(url + `${subdirectory}/${id}`, {
    method: "DELETE",
  });
};

// Delete all tasks function
const deleteAllTasks = async (subdirectory) => {
  const response = await fetch(url + subdirectory);
  const tasks = await response.json();
  for (let task of tasks) {
    await deleteTask(subdirectory, task.id);
  }
};

// Edit task function
const editTask = async (id, data) => {
  await fetch(url + `${toDoSubdirectory}/${id}`, {
    method: "PUT",
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
    e.target.parentElement.parentElement.querySelector(".task-title"); // getting task title from the list items child

  // Delete single to-do task event
  if (e.target.classList.contains("delete-todo-task")) {
    deleteSingleTaskModalActions(toDoSubdirectory);
  }

  // Delete single done task event
  if (e.target.classList.contains("delete-done-task")) {
    deleteSingleTaskModalActions(doneSubdirectory);
  }

  // Delete single task modal function
  function deleteSingleTaskModalActions(subdirectory) {
    deleteModalMessage.innerHTML = "Are you sure to delete the selected task?";
    deleteModal.style.display = "flex";
    // Delete button event
    deleteButton.addEventListener("click", () => {
      deleteTask(subdirectory, taskId);
    });
    // Cancel button event
    cancelDeleteButton.addEventListener("click", () => {
      deleteModal.style.display = "none";
    });
  }

  // Delete all to-do tasks event
  if (e.target.classList.contains("delete-all-todo-tasks")) {
    deleteAllTasksModalActions("to-do", toDoSubdirectory);
  }

  // Delete all done tasks event
  if (e.target.classList.contains("delete-all-done-tasks")) {
    deleteAllTasksModalActions("done", doneSubdirectory);
  }

  // Delete all tasks modal function
  function deleteAllTasksModalActions(taskType, subdirectory) {
    deleteModalMessage.innerHTML = `Are you sure to delete all ${taskType} tasks?`;
    deleteModal.style.display = "flex";

    // Delete button event
    deleteButton.addEventListener("click", () => {
      deleteAllTasks(subdirectory);
      deleteModal.style.display = "none";
    });

    // Cancel button event
    cancelDeleteButton.addEventListener("click", () => {
      deleteModal.style.display = "none";
    });
  }
  // _________________________________________________________
  // Mark task as done
  if (e.target.classList.contains("mark-as-done")) {
    const taskData = {
      title: taskTitle.innerHTML,
    };
    await createTask(doneSubdirectory, taskData);
    await deleteTask(toDoSubdirectory, taskId);
  }

  // Mark task as undone
  if (e.target.classList.contains("mark-as-undone")) {
    const taskData = {
      title: taskTitle.innerHTML,
    };
    await createTask(toDoSubdirectory, taskData);
    await deleteTask(doneSubdirectory, taskId);
  }
  // _________________________________________________________
  // Edit task
  if (e.target.classList.contains("edit-task")) {
    getToDoTask(taskId);
    editModal.style.display = "flex";
    taskEdit.focus();
    editButton.setAttribute("data-edit-id", taskId); //???

    // Edit task event
    editForm.addEventListener("submit", (e) => {
      e.preventDefault();

      // Getting data from DOM
      const editedTaskTitle = taskEdit.value.trim();

      // Edit task validation
      if (!editedTaskTitle) {
        showAlert();
        getToDoTask(taskId);
        taskEdit.focus();
      } else {
        // Put received data from DOM in an object
        const taskData = {
          title: editedTaskTitle,
        };
        editTask(taskId, taskData);
        editModal.style.display = "none";
      }
    });

    // Canceling edit task events
    // Cancel button
    cancelEditButton.addEventListener("click", () => {
      editModal.style.display = "none";
    });

    // Escape key press
    editModal.addEventListener("keydown", (e) => {
      const pressedKey = e.key;
      if (pressedKey === "Escape") {
        editModal.style.display = "none";
      }
    });
  }
});
// _________________________________________________________
// Icons hover behavior
toDoApp.addEventListener("mouseover", (e) => {
  if (e.target.classList.contains("bx")) {
    e.target.classList.add("bx-tada");
  }
});

toDoApp.addEventListener("mouseout", (e) => {
  if (e.target.classList.contains("bx")) {
    e.target.classList.remove("bx-tada");
  }
});

// Page reset function
const resetInput = () => {
  taskInput.value = "";
  taskInput.focus();
};
// _________________________________________________________
// Show validation alert function
function showAlert() {
  alertModal.innerHTML =
    "<i class='bx bxs-error' ></i><span>Please enter a task title.</span>";
  alertModal.style.visibility = "visible";
  alertModal.style.opacity = "1";
  alertModal.style.transform = "translateY(-140%)";

  setTimeout(() => {
    alertModal.style.visibility = "hidden";
    alertModal.style.opacity = "0";
    alertModal.style.transform = "translateY(0)";
  }, 3000);
}
// _________________________________________________________
// default list of tasks for to put show 'no task' message and 'delete all' button if needed
function listChecker() {
  if (toDoList.children.length > 1) {
    deleteAllIToDoTasks.style.display = "block";
  }

  if (doneTasksList.children.length > 1) {
    deleteAllDoneTasks.style.display = "block";
  }
  setTimeout(() => {
    if (toDoList.children.length < 1) {
      noToDo.style.display = "inline-block";
    }

    if (doneTasksList.children.length < 1) {
      noDone.style.display = "inline-block";
    }
  }, 1000);
}
// _________________________________________________________
// Loading tasks as the page loads or a response is received
(function initializeTasks() {
  getTasks(toDoSubdirectory);
  getTasks(doneSubdirectory);
  resetInput();
})();
