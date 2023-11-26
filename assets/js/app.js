// Select DOM elements
const toDoApp = document.querySelector(".container");
const editModal = document.querySelector(".edit-modal");
const deleteModal = document.querySelector(".delete-modal");
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
// const toDoLoader = document.querySelector(".loader-todo");
// const doneLoader = document.querySelector(".loader-done");
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
  // showToDoLoader();
  // showDoneLoader();
  const response = await fetch(url + subdirectory);
  const tasks = await response.json();
  // setTimeout(() => {
  subdirectory === toDoSubdirectory
    ? renderToDoTasks(tasks)
    : renderDoneTasks(tasks);
  //   hideLoaders();
  // }, 500); // لودر
  listChecker();
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
  taskEdit.value = task.title;
};

// __________________________________________________________
// CREATE AND MARK AS DONE TASK ITEMS
// Create or done task function
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
    alert("Please enter a task title!");
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

// Edit function
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

  // Delete task which is not done yet
  if (e.target.classList.contains("delete-todo-task")) {
    deleteSingleTaskModalActions(toDoSubdirectory);

    // deleteModal.style.display = "flex";
    // deleteButton.addEventListener("click", () => {
    //   deleteTask(toDoSubdirectory, taskId);
    // });

    // cancelDeleteButton.addEventListener("click", () => {
    //   deleteModal.style.display = "none";
    // });

    // const deleteConfirm = confirm("Are you sure to delete this item?");
    // if (deleteConfirm) {
    //   // e.target.parentElement.parentElement.remove();
    //   deleteTask(toDoSubdirectory, taskId);
    // }
  }

  // Delete task which is marked as done
  if (e.target.classList.contains("delete-done-task")) {
    deleteSingleTaskModalActions(doneSubdirectory);

    // deleteModal.style.display = "flex";
    // deleteButton.addEventListener("click", () => {
    //   deleteTask(doneSubdirectory, taskId);
    // });

    // cancelDeleteButton.addEventListener("click", () => {
    //   deleteModal.style.display = "none";
    // });

    // const deleteConfirm = confirm("Are you sure to delete this item?");
    // if (deleteConfirm) {
    // e.target.parentElement.parentElement.remove();
    // deleteTask(doneSubdirectory, taskId);
    // }
  }

  function deleteSingleTaskModalActions(subdirectory) {
    deleteModalMessage.innerHTML = "Are you sure to delete the selected task?";
    deleteModal.style.display = "flex";
    deleteButton.addEventListener("click", () => {
      deleteTask(subdirectory, taskId);
    });

    cancelDeleteButton.addEventListener("click", () => {
      deleteModal.style.display = "none";
    });
  }

  if (e.target.classList.contains("delete-all-todo-tasks")) {
    deleteAllTasksModalActions("to-do", toDoSubdirectory);

    // deleteModalMessage.innerHTML = "Are you sure to delete all task?";
    // deleteModal.style.display = "flex";
    // deleteButton.addEventListener("click", () => {
    //   deleteAllTasks(toDoSubdirectory);
    //   deleteModal.style.display = "none";
    // });
    // cancelDeleteButton.addEventListener("click", () => {
    //   deleteModal.style.display = "none";
    // });
  }

  if (e.target.classList.contains("delete-all-done-tasks")) {
    deleteAllTasksModalActions("done", doneSubdirectory);
    // deleteModalMessage.innerHTML = "Are you sure to delete all task?";
    // deleteModal.style.display = "flex";
    // deleteButton.addEventListener("click", () => {
    //   deleteAllTasks(doneSubdirectory);
    //   deleteModal.style.display = "none";
    // });
    // cancelDeleteButton.addEventListener("click", () => {
    //   deleteModal.style.display = "none";
    // });
  }

  function deleteAllTasksModalActions(taskType, subdirectory) {
    deleteModalMessage.innerHTML = `Are you sure to delete all ${taskType} tasks?`;
    deleteModal.style.display = "flex";
    deleteButton.addEventListener("click", () => {
      deleteAllTasks(subdirectory);
      deleteModal.style.display = "none";
    });

    cancelDeleteButton.addEventListener("click", () => {
      deleteModal.style.display = "none";
    });
  }

  // Mark a task as done
  if (e.target.classList.contains("mark-as-done")) {
    const taskData = {
      title: taskTitle.innerHTML,
    };
    // e.target.parentElement.parentElement.remove();
    await createTask(doneSubdirectory, taskData);
    await deleteTask(toDoSubdirectory, taskId);
  }

  // Mark a task as undone
  if (e.target.classList.contains("mark-as-undone")) {
    const taskData = {
      title: taskTitle.innerHTML,
    };
    // e.target.parentElement.parentElement.remove();
    await createTask(toDoSubdirectory, taskData);
    await deleteTask(doneSubdirectory, taskId);
  }

  // Edit task
  if (e.target.classList.contains("edit-task")) {
    getToDoTask(taskId);
    editModal.style.display = "flex";
    taskEdit.focus();

    // Hiding submit button and showing edit buttons instead
    // submitButton.style.display = "none";
    // editButton.style.display = "inline-block";
    // cancelEditButton.style.display = "inline-block";

    editButton.setAttribute("data-edit-id", taskId); //???

    // Edit task event
    editForm.addEventListener("submit", (e) => {
      e.preventDefault();
      // Getting data from DOM

      const editedTaskTitle = taskEdit.value.trim();

      // Edit task validation
      if (!editedTaskTitle) {
        alert("Please enter a task title!");
        getToDoTask(taskId);
        taskEdit.focus();
      } else {
        // Put received data from DOM in an object
        const taskData = {
          title: editedTaskTitle,
        };
        editTask(taskId, taskData);

        // Hiding edit button and showing submit button instead
        // submitButton.style.display = "inline-block";
        // editButton.style.display = "none";
        // cancelEditButton.style.display = "none";
        editModal.style.display = "none";
      }
    });

    // Canceling edit task event
    cancelEditButton.addEventListener("click", () => {
      // resetInput();
      // submitButton.style.display = "inline-block";
      // editButton.style.display = "none";
      // cancelEditButton.style.display = "none";
      editModal.style.display = "none";
    });

    editModal.addEventListener("keydown", (e) => {
      const pressedKey = e.key;
      if (pressedKey === "Escape") {
        editModal.style.display = "none";
      }
    });
  }
});

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
// Delete all tasks
// const deleteAllTasks = async (subdirectory) => {
//   const response = await fetch(url + subdirectory);
//   const tasks = await response.json();
//   for (let task of tasks) {
//     await deleteTask(subdirectory, task.id);
//   }
// };
// deleteAllIToDoTasks.addEventListener("click", async () => {
//   deleteModal.style.display = "flex";
//   deleteButton.addEventListener("click", () => {
//     deleteAllTasks(toDoSubdirectory);
//     deleteModal.style.display = "none";
//   });

//   cancelDeleteButton.addEventListener("click", () => {
//     deleteModal.style.display = "none";
//   });
// });

// deleteAllDoneTasks.addEventListener("click", async () => {
//   deleteModal.style.display = "flex";
//   deleteButton.addEventListener("click", () => {
//     deleteAllTasks(doneSubdirectory);
//     deleteModal.style.display = "none";
//   });

//   cancelDeleteButton.addEventListener("click", () => {
//     deleteModal.style.display = "none";
//   });
// });

// _________________________________________________________
// loading tasks as the page loads or a response is received
(function initializeTasks() {
  getTasks(toDoSubdirectory);
  getTasks(doneSubdirectory);
  resetInput();
  // showToDoLoader();
  // showDoneLoader();
  // hideLoaders();
  // listChanges();
})();

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

// function listChanges() {
//   // if (toDoList.offsetHeight > 360) {
//   //   toDoList.parentElement.style.overflowY = "scroll";
//   // }
//   // if (doneTasksList.offsetHeight > 360) {
//   //   doneTasksList.parentElement.style.overflowY = "scroll";
//   // }
//   if (toDoList.children.length < 2) {
//     noToDo.style.display = "inline-block";
//   }
//   if (doneTasksList.children.length < 2) {
//     noDone.style.display = "inline-block";
//   }
// }
// _________________________________________________________
// Show and hide loader functions
// function showToDoLoader() {
//   toDoLoader.style.display = "block";
// }

// function showDoneLoader() {
//   doneLoader.style.display = "block";
// }

// function hideLoaders() {
//   doneLoader.style.display = "none";
//   toDoLoader.style.display = "none";
// setTimeout(() => {
//   doneLoader.style.display = "none";
//   toDoLoader.style.display = "none";
// }, 2000);
// }

// function hideToDoLoader() {
//   setTimeout(() => {
//     loaderToDo.style.display = "none";
//   }, 1000);
// }

// function hideDoneLoader() {
//   setTimeout(() => {
//     loaderDone.style.display = "none";
//   }, 1000);
// }`
