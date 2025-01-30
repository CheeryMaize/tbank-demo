// Глобальные переменные (можно оформить классом / модулями)
let taskList = [];          // Список задач в памяти
let editTaskId = null;      // ID задачи, которую редактируем

// Селекторы
const taskTitleInput = document.getElementById("task-title");
const taskDescInput = document.getElementById("task-desc");
const taskStatusSelect = document.getElementById("task-status");
const saveTaskBtn = document.getElementById("save-task-btn");
const cancelEditBtn = document.getElementById("cancel-edit-btn");
const taskListContainer = document.getElementById("task-list");

// Инициализация
window.addEventListener("load", () => {
  // Загружаем задачи из LocalStorage при загрузке страницы
  loadTasksFromLocalStorage();
  renderTaskList();
});

// Функция сохранения/добавления задачи
saveTaskBtn.addEventListener("click", () => {
  const title = taskTitleInput.value.trim();
  const desc = taskDescInput.value.trim();
  const status = taskStatusSelect.value;

  if (!title) {
    alert("Введите название задачи!");
    return;
  }

  if (editTaskId === null) {
    // Новая задача
    const newTask = {
      id: Date.now(),
      title,
      desc,
      status
    };
    taskList.push(newTask);
  } else {
    // Редактирование существующей
    const taskIndex = taskList.findIndex(t => t.id === editTaskId);
    if (taskIndex !== -1) {
      taskList[taskIndex].title = title;
      taskList[taskIndex].desc = desc;
      taskList[taskIndex].status = status;
    }
    editTaskId = null;
    cancelEditBtn.classList.add("hidden");
  }

  // Очищаем поля
  taskTitleInput.value = "";
  taskDescInput.value = "";
  taskStatusSelect.value = "Новая";

  // Сохраняем и перерисовываем
  saveTasksToLocalStorage();
  renderTaskList();
});

// Функция отмены редактирования
cancelEditBtn.addEventListener("click", () => {
  editTaskId = null;
  taskTitleInput.value = "";
  taskDescInput.value = "";
  taskStatusSelect.value = "Новая";
  cancelEditBtn.classList.add("hidden");
});

// Отображение списка задач
function renderTaskList() {
  taskListContainer.innerHTML = "";

  if (taskList.length === 0) {
    taskListContainer.innerHTML = "<p>Список задач пуст.</p>";
    return;
  }

  taskList.forEach(task => {
    const taskItem = document.createElement("div");
    taskItem.classList.add("task-item");
    taskItem.setAttribute("data-status", task.status);

    const taskHeader = document.createElement("div");
    taskHeader.classList.add("task-header");

    const taskTitleElem = document.createElement("h3");
    taskTitleElem.textContent = task.title;

    const taskActions = document.createElement("div");
    taskActions.classList.add("task-actions");

    // Кнопка Редактировать
    const editBtn = document.createElement("button");
    editBtn.classList.add("edit-btn");
    editBtn.textContent = "Ред.";
    editBtn.addEventListener("click", () => editTask(task.id));

    // Кнопка Удалить
    const deleteBtn = document.createElement("button");
    deleteBtn.classList.add("delete-btn");
    deleteBtn.textContent = "Удл.";
    deleteBtn.addEventListener("click", () => deleteTask(task.id));

    taskActions.appendChild(editBtn);
    taskActions.appendChild(deleteBtn);

    taskHeader.appendChild(taskTitleElem);
    taskHeader.appendChild(taskActions);

    // Описание задачи
    const taskDescElem = document.createElement("div");
    taskDescElem.classList.add("task-desc");
    taskDescElem.textContent = task.desc;

    // Статус задачи
    const taskStatusElem = document.createElement("div");
    taskStatusElem.classList.add("task-status");
    taskStatusElem.textContent = `Статус: ${task.status}`;

    taskItem.appendChild(taskHeader);
    if (task.desc) taskItem.appendChild(taskDescElem);
    taskItem.appendChild(taskStatusElem);

    taskListContainer.appendChild(taskItem);
  });
}

// Функция для редактирования задачи
function editTask(id) {
  const task = taskList.find(t => t.id === id);
  if (!task) return;

  editTaskId = id;
  taskTitleInput.value = task.title;
  taskDescInput.value = task.desc;
  taskStatusSelect.value = task.status;
  cancelEditBtn.classList.remove("hidden");
}

// Удаление задачи
function deleteTask(id) {
  if (!confirm("Точно удалить задачу?")) return;
  taskList = taskList.filter(t => t.id !== id);
  saveTasksToLocalStorage();
  renderTaskList();
}

// LocalStorage: сохранение
function saveTasksToLocalStorage() {
  localStorage.setItem("tbank_tasks", JSON.stringify(taskList));
}

// LocalStorage: загрузка
function loadTasksFromLocalStorage() {
  const data = localStorage.getItem("tbank_tasks");
  if (data) {
    taskList = JSON.parse(data);
  } else {
    taskList = [];
  }
}
// ... код инициализации, load/save из localStorage, не меняется

function renderTaskList() {
  const container = document.getElementById("task-list");
  container.innerHTML = "";

  if (taskList.length === 0) {
    container.innerHTML = "<p class='text-center text-muted'>Список задач пуст.</p>";
    return;
  }

  taskList.forEach(task => {
    // Создадим карточку
    const card = document.createElement("div");
    card.classList.add("card", "mb-3", "task-item");
    card.setAttribute("data-status", task.status);

    // Вложим в неё body
    const cardBody = document.createElement("div");
    cardBody.classList.add("card-body");

    // Заголовок и статус
    const header = document.createElement("div");
    header.classList.add("d-flex", "justify-content-between", "align-items-center");

    const titleElem = document.createElement("h5");
    titleElem.classList.add("card-title", "mb-0");
    titleElem.textContent = task.title;

    const statusElem = document.createElement("span");
    statusElem.classList.add("badge", "bg-secondary", "ms-2");
    statusElem.textContent = task.status;

    header.appendChild(titleElem);
    header.appendChild(statusElem);

    // Описание
    const descElem = document.createElement("p");
    descElem.classList.add("card-text", "mt-2");
    descElem.textContent = task.desc || "";

    // Кнопки
    const btnGroup = document.createElement("div");
    btnGroup.classList.add("mt-3");

    const editBtn = document.createElement("button");
    editBtn.classList.add("btn", "btn-primary", "me-2");
    editBtn.innerHTML = '<i class="fas fa-edit"></i> Ред.';
    editBtn.addEventListener("click", () => editTask(task.id));

    const deleteBtn = document.createElement("button");
    deleteBtn.classList.add("btn", "btn-danger");
    deleteBtn.innerHTML = '<i class="fas fa-trash"></i> Удл.';
    deleteBtn.addEventListener("click", () => deleteTask(task.id));

    btnGroup.appendChild(editBtn);
    btnGroup.appendChild(deleteBtn);

    // Собираем всё вместе
    cardBody.appendChild(header);
    if (task.desc) cardBody.appendChild(descElem);
    cardBody.appendChild(btnGroup);

    card.appendChild(cardBody);
    container.appendChild(card);
  });
}
// При создании задачи
const link = document.getElementById("task-link").value.trim(); 
// Задаём в HTML <input id="task-link" type="url" placeholder="Ссылка на сервис" />

const newTask = {
  id: Date.now(),
  title,
  desc,
  status,
  date,
  time,
  link
};
if (task.link) {
  const buyBtn = document.createElement("button");
  buyBtn.classList.add("btn", "btn-warning", "me-2");
  buyBtn.innerHTML = 'Купить/Бронь';
  buyBtn.addEventListener("click", () => {
    // Открыть в новой вкладке
    window.open(task.link, '_blank');
  });
  btnGroup.appendChild(buyBtn);
}
