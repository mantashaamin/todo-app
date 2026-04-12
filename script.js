document.addEventListener("DOMContentLoaded", () => {

  // GREETING
  const greeting = document.getElementById("greeting");
  const hour = new Date().getHours();

  if (hour < 12) greeting.innerText = "Good Morning ☀️";
  else if (hour < 17) greeting.innerText = "Good Afternoon 🌤️";
  else greeting.innerText = "Good Evening 🌙";

  // WEATHER
  const apiKey = "1ac2d1f414dd90bba9d2edfa23c2774f";
  const cityInput = document.getElementById("cityInput");
  const searchBtn = document.getElementById("searchBtn");
  const result = document.getElementById("weatherResult");
  const clearBtn = document.getElementById("clearBtn");

  searchBtn.onclick = getWeather;

  cityInput.addEventListener("input", () => {
    clearBtn.style.display = cityInput.value ? "block" : "none";
  });

  clearBtn.onclick = () => {
    cityInput.value = "";
    clearBtn.style.display = "none";
    result.innerHTML = "<p>Search a city to see weather</p>";
    cityInput.focus();
  };

  cityInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") getWeather();
  });

  function getWeather() {
    const city = cityInput.value.trim();

    if (!city) {
      result.innerHTML = "Enter a city";
      return;
    }

    result.innerHTML = "Loading...";

    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`)
      .then(res => {
        if (!res.ok) {
          throw new Error("City not found");
        }
        return res.json();
      })
      .then(data => {

        const icon = data.weather[0].icon;

        const now = new Date();
        const utc = now.getTime() + now.getTimezoneOffset() * 60000;
        const cityTime = new Date(utc + data.timezone * 1000);

        const time = cityTime.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit"
        });

        result.innerHTML = `
          <h3>${data.name}</h3>

          <!-- IMAGE FIX -->
          <div style="font-size:50px; margin:10px 0;">
  ${getWeatherEmoji(icon)}
</div>

          <h2>${Math.round(data.main.temp)}°C</h2>

          <p>Condition: ${data.weather[0].main}</p>
          <p>Humidity: ${data.main.humidity}%</p>
          <p>Wind: ${data.wind.speed} m/s</p>
          <p>Local Time: ${time}</p>
        `;
      })
      .catch(() => {
        result.innerHTML = "City not found ❌";
      });
  }

  // EMOJI FUNCTION (FIXED)
  function getWeatherEmoji(icon) {
    if (icon.includes("d")) {
      if (icon.startsWith("01")) return "☀️";
      if (icon.startsWith("02") || icon.startsWith("03") || icon.startsWith("04")) return "⛅";
      if (icon.startsWith("09") || icon.startsWith("10")) return "🌧️";
      if (icon.startsWith("11")) return "⛈️";
      if (icon.startsWith("13")) return "❄️";
      if (icon.startsWith("50")) return "🌫️";
    } else {
      if (icon.startsWith("01")) return "🌙";
      if (icon.startsWith("02") || icon.startsWith("03") || icon.startsWith("04")) return "☁️";
      if (icon.startsWith("09") || icon.startsWith("10")) return "🌧️";
      if (icon.startsWith("11")) return "⛈️";
      if (icon.startsWith("13")) return "❄️";
      if (icon.startsWith("50")) return "🌫️";
    }

    return "🌍";
  }

});

  // TODO
  let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

  const taskInput = document.getElementById("taskInput");
  const addBtn = document.getElementById("addBtn");
  const taskList = document.getElementById("taskList");
  const counter = document.getElementById("taskCounter");

  const allBtn = document.getElementById("allBtn");
  const activeBtn = document.getElementById("activeBtn");
  const completedBtn = document.getElementById("completedBtn");
  const clearCompletedBtn = document.getElementById("clearCompleted");

  function renderTasks() {
    taskList.innerHTML = "";

    tasks.forEach((task, index) => {
      const li = document.createElement("li");

      if (task.completed) li.classList.add("completed");

      li.innerHTML = `
        <input type="checkbox" ${task.completed ? "checked" : ""}>
        <span>${task.text}</span>
        <button>🗑️</button>
      `;

      li.querySelector("input").onchange = () => {
        tasks[index].completed = !tasks[index].completed;
        saveTasks();
        renderTasks();
      };

      li.querySelector("button").onclick = () => {
        tasks.splice(index, 1);
        saveTasks();
        renderTasks();
      };

      taskList.appendChild(li);
    });

    updateCounter();
  }

  function saveTasks() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }

  addBtn.onclick = () => {
    const text = taskInput.value.trim();
    if (!text) return;

    tasks.push({ text, completed: false });
    taskInput.value = "";
    saveTasks();
    renderTasks();
  };

  function updateCounter() {
    const remaining = tasks.filter(t => !t.completed).length;
    counter.innerText = tasks.length === 0 ? "No tasks yet" : `${remaining} tasks remaining`;
  }

  allBtn.onclick = () => renderTasks();

  activeBtn.onclick = () => {
    document.querySelectorAll("#taskList li").forEach((li, i) => {
      li.style.display = tasks[i].completed ? "none" : "flex";
    });
  };

  completedBtn.onclick = () => {
    document.querySelectorAll("#taskList li").forEach((li, i) => {
      li.style.display = tasks[i].completed ? "flex" : "none";
    });
  };

  clearCompletedBtn.onclick = () => {
    tasks = tasks.filter(t => !t.completed);
    saveTasks();
    renderTasks();
  };

  renderTasks();
