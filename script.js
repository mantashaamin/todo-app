function addEmoji(emoji) {
  let input = document.getElementById("text");
  input.value += emoji;
  input.focus();
}

function saveTasks() {
  let tasks = [];

  document.querySelectorAll("li").forEach(li => {
    let text = li.querySelector(".task-text").textContent;
    let priority = li.querySelector(".badge").textContent;
    let done = li.querySelector("input").checked;

    tasks.push({ text, priority, done });
  });

  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function updateProgress() {
  let tasks = document.querySelectorAll("li");
  let done = document.querySelectorAll("li input:checked").length;

  let percent = tasks.length ? Math.round((done / tasks.length) * 100) : 0;

  document.getElementById("progress").textContent = percent + "% completed";
}

function createTaskElement(text, priority, done = false) {
  let li = document.createElement("li");

  let check = document.createElement("input");
  check.type = "checkbox";
  check.checked = done;

  let span = document.createElement("span");
  span.textContent = text;
  span.className = "task-text";

  if (done) span.style.textDecoration = "line-through";

  check.onchange = function() {
    span.style.textDecoration = check.checked ? "line-through" : "none";
    saveTasks();
    updateProgress();
  };

  let badge = document.createElement("span");
  badge.textContent = priority;
  badge.className = "badge " + priority;

  let editBtn = document.createElement("button");
  editBtn.textContent = "Edit";
  editBtn.className = "edit";

  editBtn.onclick = function() {
    let newValue = prompt("Edit task:", span.textContent);
    if (newValue) {
      span.textContent = newValue;
      saveTasks();
    }
  };

  let delBtn = document.createElement("button");
  delBtn.textContent = "X";
  delBtn.className = "delete";

  delBtn.onclick = function() {
    li.remove();
    saveTasks();
    updateProgress();
  };

  li.appendChild(check);
  li.appendChild(span);
  li.appendChild(badge);
  li.appendChild(editBtn);
  li.appendChild(delBtn);

  return li;
}

document.getElementById("add").addEventListener("click", function() {
  let text = document.getElementById("text").value;
  let priority = document.getElementById("priority").value;

  if (text === "") {
    alert("Enter task");
    return;
  }

  let li = createTaskElement(text, priority);
  document.getElementById("list").appendChild(li);

  document.getElementById("text").value = "";

  saveTasks();
  updateProgress();
});

document.getElementById("text").addEventListener("keypress", function(e) {
  if (e.key === "Enter") {
    document.getElementById("add").click();
  }
});

window.onload = function() {
  let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

  tasks.forEach(task => {
    let li = createTaskElement(task.text, task.priority, task.done);
    document.getElementById("list").appendChild(li);
  });

  updateProgress();
};