/// Select DOM elements ///
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

/// API URL ///
const url = `http://localhost:3000`;
const toDoSubdirectory = "/toDoItems";
const doneSubdirectory = "/doneItems";

/// CRUD operations: Get, Create, Delete, and Edit ///
/// GET TASK ITEMS ///
// Get tasks from the API
const getTasks = async (subdirectory) => {
  try {
    const response = await fetch(url + subdirectory);

    const tasks = await response.json();

    subdirectory === toDoSubdirectory
      ? renderToDoTasks(tasks)
      : renderDoneTasks(tasks);
  } catch (error) {
    console.log(error);
    showAlert("Server is unavailable. Please restart JSON Server.");
  }
};

// Render to-do tasks
const renderToDoTasks = (tasks) => {
  for (let task of tasks) {
    const { id, title } = task;

    toDoList.innerHTML += `
                          <li class="todo-item d-flex .justify-between align-center">
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
                               <li class="done-item d-flex .justify-between align-center">
                                <span class="task-title">${title}</span>
                                <div class="icon-wrapper d-flex" data-id="${id}">
                                  <i class="bx bx-undo mark-as-undone" title="Mark as undone"></i>
                                  <i class="bx bx-message-square-x delete-task delete-done-task" title="Delete task"></i>
                                </div>
                              </li>`;
  }
};

// Get a single to-do task from the API for Edit operation
const getToDoTask = async (id) => {
  try {
    const response = await fetch(url + `${toDoSubdirectory}/${id}`);

    const task = await response.json();

    taskEdit.value = task.title;
  } catch (error) {
    console.log(error);
    showAlert("Server is unavailable. Please restart JSON Server.");
  }
};

/// CREATE TASK ITEMS ///
// Create new task function
const createTask = async (subdirectory, task, list) => {
  try {
    await fetch(url + subdirectory, {
      method: "POST",
      body: JSON.stringify(task),
      headers: {
        "Content-Type": "application/json",
      },
    });

    await updateList(list, subdirectory);
  } catch (error) {
    console.log(error);
    showAlert("Server is unavailable. Please restart JSON Server.");
  }
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
    await createTask(toDoSubdirectory, taskData, toDoList);
    resetInput();
  }
});

/// DELETE, EDIT, AND DONE/UNDONE TASK ITEMS ///
// Delete single task function
const deleteTask = async (subdirectory, id, list) => {
  try {
    await fetch(url + `${subdirectory}/${id}`, {
      method: "DELETE",
    });

    await updateList(list, subdirectory);
  } catch (error) {
    console.log(error);
    showAlert("Server is unavailable. Please restart JSON Server.");
  }
};

// Delete all tasks function
const deleteAllTasks = async (subdirectory, list) => {
  try {
    const response = await fetch(url + subdirectory);

    const tasks = await response.json();

    for (let task of tasks) {
      await fetch(url + `${subdirectory}/${task.id}`, {
        method: "DELETE",
      });
    }

    await updateList(list, subdirectory);
  } catch (error) {
    console.log(error);
    showAlert("Server is unavailable. Please restart JSON Server.");
  }
};

// Edit task function
const editTask = async (id, data) => {
  try {
    await fetch(url + `${toDoSubdirectory}/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json",
      },
    });

    await updateList(toDoList, toDoSubdirectory);
  } catch (error) {
    console.log(error);
    showAlert("Server is unavailable. Please restart JSON Server.");
  }
};

/// Delete, edit, and done/undone task event
toDoApp.addEventListener("click", async (e) => {
  var taskId = e.target.parentElement.dataset.id; // getting id from data- attribute
  const taskTitleElement =
    e.target.parentElement.parentElement.querySelector(".task-title"); // getting task title from the DOM

  /// Delete task/tasks ///
  // Single delete
  // Delete a single to-do task event
  if (e.target.classList.contains("delete-todo-task")) {
    deleteSingleTaskModalActions(toDoSubdirectory, toDoList);
  }

  // Delete a single done task event
  if (e.target.classList.contains("delete-done-task")) {
    deleteSingleTaskModalActions(doneSubdirectory, doneTasksList);
  }

  // Delete single task modal function
  function deleteSingleTaskModalActions(subdirectory, list) {
    changeElementDisplay(deleteModal, "flex");

    deleteModalMessage.innerHTML = "Are you sure to delete the selected task?";

    // Delete task button event
    async function deleteButtonClickHandler() {
      await deleteTask(subdirectory, taskId, list);
      closeDeleteModal();
    }

    // Cancel button event
    function cancelButtonClickHandler() {
      closeDeleteModal();
    }

    // Close delete modal and remove event listeners
    function closeDeleteModal() {
      changeElementDisplay(deleteModal, "none");
      resetInput();

      deleteButton.removeEventListener("click", deleteButtonClickHandler);
      cancelDeleteButton.removeEventListener("click", cancelButtonClickHandler);
    }

    // Add listener for delete events
    deleteButton.addEventListener("click", deleteButtonClickHandler);
    cancelDeleteButton.addEventListener("click", cancelButtonClickHandler);
  }

  // Delete all
  // Delete all to-do tasks event
  if (e.target.classList.contains("delete-all-todo-tasks")) {
    deleteAllTasksModalActions("to-do", toDoSubdirectory, toDoList);
  }

  // Delete all done tasks event
  if (e.target.classList.contains("delete-all-done-tasks")) {
    deleteAllTasksModalActions("done", doneSubdirectory, doneTasksList);
  }

  // Delete all tasks modal function
  function deleteAllTasksModalActions(taskType, subdirectory, list) {
    changeElementDisplay(deleteModal, "flex");

    deleteModalMessage.innerHTML = `Are you sure to delete all ${taskType} tasks?`;

    // Delete all tasks button event
    function deleteAllTasksButtonClickHandler() {
      deleteAllTasks(subdirectory, list);
      closeDeleteModal();
    }

    // Canceling delete task events
    function cancelAllTasksButtonClickHandler() {
      closeDeleteModal();
    }

    // Close delete modal and remove event listeners
    function closeDeleteModal() {
      changeElementDisplay(deleteModal, "none");
      resetInput();

      deleteButton.removeEventListener(
        "click",
        deleteAllTasksButtonClickHandler
      );
      cancelDeleteButton.removeEventListener(
        "click",
        cancelAllTasksButtonClickHandler
      );
    }

    // Add listener for delete all tasks events
    deleteButton.addEventListener("click", deleteAllTasksButtonClickHandler);

    cancelDeleteButton.addEventListener(
      "click",
      cancelAllTasksButtonClickHandler
    );
  }

  /// Edit task ///
  if (e.target.classList.contains("edit-task")) {
    await getToDoTask(taskId);

    changeElementDisplay(editModal, "flex");
    taskEdit.focus();

    // Disable edit button if edit input value is unchanged
    const disableEditButton = () => {
      // If task title is equal to input value this scope will be executed
      if (taskTitleElement.innerHTML === taskEdit.value.trim()) {
        editButton.setAttribute("disabled", true);
        editButtonSibling.style.cursor = "not-allowed";
        changeElementDisplay(editButtonSibling, "block");

        // When edit button is disabled, required event is defined for a sibling element which is in front of the button
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

    // The disable button function will be called when the edit modal is opened and also by each keyup event
    disableEditButton();

    taskEdit.addEventListener("keyup", () => {
      disableEditButton();
    });

    // Edit task event
    async function editFormHandler(e) {
      e.preventDefault();

      const editedTaskTitle = taskEdit.value.trim(); // Getting data from the DOM

      // Edit task validation
      if (!editedTaskTitle) {
        showAlert("Please enter a task title.");
        await getToDoTask(taskId);
        taskEdit.focus();
      } else {
        // Assign received data from the DOM in an object
        const taskData = {
          title: editedTaskTitle,
        };

        await editTask(taskId, taskData);

        changeElementDisplay(editModal, "none");
        resetInput();
        removeAllListeners();
      }
    }

    // Canceling edit task events
    // 1) Click cancel button
    function cancelEditHandler() {
      changeElementDisplay(editModal, "none");
      resetInput();
      removeAllListeners();
    }

    // 2) Press escape key
    function cancelEditWithEscapeHandler() {
      const pressedKey = e.key;

      if (pressedKey === "Escape") {
        changeElementDisplay(editModal, "none");
        resetInput();
        removeAllListeners();
      }
    }

    // Remove all event listeners
    function removeAllListeners() {
      editForm.removeEventListener("submit", editFormHandler);
      cancelEditButton.removeEventListener("click", cancelEditHandler);
      editModal.removeEventListener("keydown", cancelEditWithEscapeHandler);
    }

    // Add listener for edit events
    editForm.addEventListener("submit", editFormHandler);
    cancelEditButton.addEventListener("click", cancelEditHandler);
    editModal.addEventListener("keydown", cancelEditWithEscapeHandler);
  }

  /// Mark a task as done ///
  if (e.target.classList.contains("mark-as-done")) {
    const taskData = {
      title: taskTitleElement.innerHTML,
    };

    await createTask(doneSubdirectory, taskData, doneTasksList);
    await deleteTask(toDoSubdirectory, taskId, toDoList);
    resetInput();
  }

  /// Mark a task as undone ///
  if (e.target.classList.contains("mark-as-undone")) {
    const taskData = {
      title: taskTitleElement.innerHTML,
    };

    await createTask(toDoSubdirectory, taskData, toDoList);
    await deleteTask(doneSubdirectory, taskId, doneTasksList);
    resetInput();
  }
});

/// Icon's hover behavior ///
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

/// Reset input function ///
const resetInput = () => {
  taskInput.value = "";
  taskInput.focus();
};

/// Show/hide alert function ///
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

/// Show/hide 'no task' messages and 'delete all' buttons if required ///
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
    const noTaskMessage = document.querySelector(".to-do");
    if (noTaskMessage) {
      noTaskMessage.remove();
    }
  }

  if (doneChildren < 1) {
    renderNoTaskMessage("done", doneListWrapper);
  } else {
    const noTaskMessage = document.querySelector(".done");
    if (noTaskMessage) {
      noTaskMessage.remove();
    }
  }
}

// Create "no task" message function
function renderNoTaskMessage(taskType, listType) {
  if (listType.children.length < 2) {
    const createNoTaskElement = document.createElement("i");

    const noTaskMessage = `You do not have any ${taskType} tasks at the moment`;

    createNoTaskElement.innerHTML = noTaskMessage;

    createNoTaskElement.classList.add("no-task", taskType);

    listType.prepend(createNoTaskElement);
  }
}

/// Change elements display value ///
function changeElementDisplay(element, displayValue) {
  element.style.display = displayValue;
}

async function updateList(list, subdirectory) {
  list.innerHTML = "";
  await getTasks(subdirectory);
  listChecker();
}

/// Loading tasks list as the page loads ///
(async function initializeTasks() {
  await getTasks(toDoSubdirectory);
  await getTasks(doneSubdirectory);
  listChecker();
  resetInput();
})();
