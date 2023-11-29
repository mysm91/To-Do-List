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
const editButtonSibling = document.querySelector(".edit-button-sibling");
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

// const refreshProblem = async () => {
//   toDoList.innerHTML = "";
//   doneTasksList.innerHTML = "";
//   await getTasks(toDoSubdirectory);
//   await getTasks(doneSubdirectory);
//   listChecker();
// };
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
    showAlert("Please enter a task title.");
    resetInput();
  } else {
    await createTask(toDoSubdirectory, taskData);
    resetInput();
    // refreshProblem();
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
    changeElementDisplay(deleteModal, "flex");
    deleteModalMessage.innerHTML = "Are you sure to delete the selected task?";

    // Delete single button event
    deleteButton.addEventListener("click", async () => {
      await deleteTask(subdirectory, taskId);
      changeElementDisplay(deleteModal, "none");
    });
    // Cancel button event
    cancelDeleteButton.addEventListener("click", () => {
      changeElementDisplay(deleteModal, "none");
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
    changeElementDisplay(deleteModal, "flex");

    deleteModalMessage.innerHTML = `Are you sure to delete all ${taskType} tasks?`;

    // Delete all button event
    deleteButton.addEventListener("click", async () => {
      await deleteAllTasks(subdirectory);
      changeElementDisplay(deleteModal, "none");
    });

    // Cancel button event
    cancelDeleteButton.addEventListener("click", () => {
      changeElementDisplay(deleteModal, "none");
    });
  }

  // Close delete modal if user clicked outside of modal area
  if (e.target.classList.contains("delete-modal")) {
    changeElementDisplay(deleteModal, "none");
  }
  // _________________________________________________________
  // Edit task
  if (e.target.classList.contains("edit-task")) {
    await getToDoTask(taskId);
    changeElementDisplay(editModal, "flex");

    taskEdit.focus();
    // editButton.setAttribute("data-edit-id", taskId); //???

    // Disable edit button if edit input is unchanged
    const disableEditButton = () => {
      if (taskTitleElement.innerHTML === taskEdit.value.trim()) {
        editButton.setAttribute("disabled", true);
        editButtonSibling.style.cursor = "not-allowed";
        changeElementDisplay(editButtonSibling, "block");
        editModal.addEventListener("click", (e) => {
          if (e.target.classList.contains("edit-button-sibling")) {
            taskEdit.focus();
            showAlert("The new task title must differ from previous one.");
          }
        });
      } else {
        editButton.removeAttribute("disabled");
        editButton.style.cursor = "pointer";
        changeElementDisplay(editButtonSibling, "none");
      }
    };

    disableEditButton();

    taskEdit.addEventListener("keyup", () => {
      disableEditButton();
    });

    // Edit task event
    editForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      // Getting data from DOM
      const editedTaskTitle = taskEdit.value.trim();

      // Edit task validation
      if (!editedTaskTitle) {
        showAlert("Please enter a task title.");
        await getToDoTask(taskId);
        taskEdit.focus();
      } else {
        // Put received data from DOM in an object
        const taskData = {
          title: editedTaskTitle,
        };
        await editTask(taskId, taskData);
        changeElementDisplay(editModal, "none");
      }
    });

    // Canceling edit task events
    // Cancel button
    cancelEditButton.addEventListener("click", () => {
      changeElementDisplay(editModal, "none");
    });

    // Escape key press
    editModal.addEventListener("keydown", (e) => {
      const pressedKey = e.key;
      if (pressedKey === "Escape") {
        changeElementDisplay(editModal, "none");
      }
    });
  }
  // Close edit modal if user clicked outside of modal area
  if (e.target.classList.contains("edit-modal")) {
    changeElementDisplay(editModal, "none");
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
// Icon's hover behavior
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
function showAlert(message) {
  alertModal.innerHTML = `<i class='bx bxs-error' ></i><span>${message}</span>`;
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
function listChecker() {
  const toDoChildren = toDoList.children.length;
  const doneChildren = doneTasksList.children.length;

  // Show/hide delete all tasks button
  if (toDoChildren > 1) {
    changeElementDisplay(deleteAllIToDoButton, "block");
  } else {
    changeElementDisplay(deleteAllIToDoButton, "none");
  }
  if (doneChildren > 1) {
    changeElementDisplay(deleteAllDoneButton, "block");
  } else {
    changeElementDisplay(deleteAllDoneButton, "none");
  }

  // Show/hide "no task" message
  if (toDoChildren < 1) {
    renderNoTaskMessage("to-do", toDoListWrapper);
  } else {
    if (document.querySelector(".to-do")) {
      document.querySelector(".to-do").remove();
    }
  }

  if (doneChildren < 1) {
    renderNoTaskMessage("done", doneListWrapper);
  } else {
    if (document.querySelector(".done")) {
      document.querySelector(".done").remove();
    }
  }
}

// Create "no task" message function
function renderNoTaskMessage(taskType, listType) {
  const createNoTaskElement = document.createElement("i");
  const noTaskMessage = `You do not have any ${taskType} tasks at the moment`;
  createNoTaskElement.innerHTML = noTaskMessage;
  createNoTaskElement.classList.add("no-task", taskType);
  listType.prepend(createNoTaskElement);
}
// _________________________________________________________
// Change elements display value
function changeElementDisplay(element, displayValue) {
  element.style.display = displayValue;
}
// _________________________________________________________
// Loading tasks as the page loads or a response is received
(async function initializeTasks() {
  await getTasks(toDoSubdirectory);
  await getTasks(doneSubdirectory);
  listChecker();
  resetInput();
})();
