// Select DOM elements
const toDoApp = document.querySelector(".container");
const editModal = document.querySelector(".edit-modal");
const deleteModal = document.querySelector(".delete-modal");
const alertModal = document.querySelector(".alert-modal");
const inputForm = document.querySelector(".input-item-wrapper");
const editForm = document.querySelector(".edit-task-wrapper");
const taskInput = document.getElementById("task-input");
const taskEdit = document.getElementById("edit-task-input");
const deleteAllIToDoButton = document.querySelector(".delete-all-todo-tasks");
const deleteAllDoneButton = document.querySelector(".delete-all-done-tasks");
const editButton = document.querySelector(".submit-edit-button");
const cancelEditButton = document.querySelector(".cancel-edit-button");
const deleteButton = document.querySelector(".delete-button");
const cancelDeleteButton = document.querySelector(".cancel-delete-button");
const deleteModalMessage = document.querySelector(".delete-modal-message");
const toDoListWrapper = document.querySelector(".todo-list-wrapper");
const doneListWrapper = document.querySelector(".done-list-wrapper");
const toDoList = document.querySelector(".todo-list");
const doneTasksList = document.querySelector(".done-list");
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
  //  ? renderTasks(tasks, toDoList, "todo", "done")
  // : renderTasks(tasks, doneTasksList, "done", "undone");
};

// Render tasks
// const renderTasks = (tasks, DOMTarget, className, taskDestination) => {
//   for (let task of tasks) {
//     const { id, title } = task;
//     DOMTarget.innerHTML += `
//     <li class="${className}-item d-flex align-center">
//     <span class="task-title">${title}</span>
//     <div class="${className}-icon-wrapper d-flex" data-id="${id}">
//       <i class="bx bx-edit edit-task" title="Edit task"></i>
//       <i class="bx bx-message-square-check mark-as-${taskDestination}" title="Mark as ${taskDestination}"></i>
//       <i class="bx bx-message-square-x delete-task delete-${className}-task" title="Delete task"></i>
//     </div>
//   </li>`;
//   }
// };

const renderToDoTasks = (tasks) => {
  for (let task of tasks) {
    const { id, title } = task;
    toDoList.innerHTML += `
    <li class="todo-item d-flex align-center">
    <span class="task-title">${title}</span>
    <div class="icon-wrapper d-flex" data-id="${id}">
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
    <div class="icon-wrapper d-flex" data-id="${id}">
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
  taskEdit.value = task.title;
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
inputForm.addEventListener("submit", async (e) => {
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
    await createTask(toDoSubdirectory, taskData);
    resetInput();
  }
});
// __________________________________________________________
// DELETE, EDIT, AND DONE/UNDONE TASK ITEMS
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

  const taskTitleElement =
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
    deleteModal.style.display = "flex";
    deleteModalMessage.innerHTML = "Are you sure to delete the selected task?";

    // Delete single button event
    deleteButton.addEventListener("click", async () => {
      await deleteTask(subdirectory, taskId);
      deleteModal.style.display = "none";
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
    deleteModal.style.display = "flex";
    deleteModalMessage.innerHTML = `Are you sure to delete all ${taskType} tasks?`;

    // Delete all button event
    deleteButton.addEventListener("click", async () => {
      await deleteAllTasks(subdirectory);
      deleteModal.style.display = "none";
    });

    // Cancel button event
    cancelDeleteButton.addEventListener("click", () => {
      deleteModal.style.display = "none";
    });
  }
  // _________________________________________________________
  // Edit task
  if (e.target.classList.contains("edit-task")) {
    await getToDoTask(taskId);
    editModal.style.display = "flex";
    taskEdit.focus();
    // editButton.setAttribute("data-edit-id", taskId); //???

    // Edit task event
    editForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      // Getting data from DOM
      const editedTaskTitle = taskEdit.value.trim();

      // Edit task validation
      if (!editedTaskTitle) {
        showAlert();
        await getToDoTask(taskId);
        taskEdit.focus();
      } else {
        // Put received data from DOM in an object
        const taskData = {
          title: editedTaskTitle,
        };
        await editTask(taskId, taskData);
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
  // _________________________________________________________
  // Mark task as done
  if (e.target.classList.contains("mark-as-done")) {
    const taskData = {
      title: taskTitleElement.innerHTML,
    };
    await createTask(doneSubdirectory, taskData);
    await deleteTask(toDoSubdirectory, taskId);
  }

  // Mark task as undone
  if (e.target.classList.contains("mark-as-undone")) {
    const taskData = {
      title: taskTitleElement.innerHTML,
    };
    await createTask(toDoSubdirectory, taskData);
    await deleteTask(doneSubdirectory, taskId);
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
// Show/hide validation alert function
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
// Show/hide 'no task' message and 'delete all' button if required
const listChecker = () => {
  const toDoChildren = toDoList.children.length;
  const doneChildren = doneTasksList.children.length;

  // Create "no task" message function
  const renderNoTaskMessage = (taskType, listType) => {
    const createNoTaskElement = document.createElement("i");
    const noTaskMessage = `You do not have any ${taskType} tasks at the moment`;
    createNoTaskElement.innerHTML = noTaskMessage;
    createNoTaskElement.classList.add("no-task");
    listType.prepend(createNoTaskElement);
  };

  // Show/hide "no task" message
  if (toDoChildren < 1) {
    renderNoTaskMessage("to-do", toDoListWrapper);
  }

  if (doneChildren < 1) {
    renderNoTaskMessage("done", doneListWrapper);
  }

  // Show/hide delete all tasks button
  if (toDoChildren > 1) {
    deleteAllIToDoButton.style.display = "block";
  } else {
    deleteAllIToDoButton.style.display = "none";
  }
  if (doneChildren > 1) {
    deleteAllDoneButton.style.display = "block";
  } else {
    deleteAllDoneButton.style.display = "none";
  }
};
// _________________________________________________________
// Loading tasks as the page loads or a response is received
(async function initializeTasks() {
  await getTasks(toDoSubdirectory);
  await getTasks(doneSubdirectory);
  listChecker();
  resetInput();
})();
