const days = [
    { full: "Sunday", short: "Sun" },
    { full: "Monday", short: "Mon" },
    { full: "Tuesday", short: "Tue" },
    { full: "Wednesday", short: "Wed" },
    { full: "Thursday", short: "Thu" },
    { full: "Friday", short: "Fri" },
    { full: "Saturday", short: "Sat" }
  ];
  
  function loadSettings() {
    chrome.storage.sync.get("schedule", (data) => {
      const schedule = data.schedule || {};
      const container = document.getElementById("schedule");
      container.innerHTML = "";
  
      days.forEach(({ full, short }) => {
        const times = schedule[full] || { start: "08:00", end: "20:00" };
        container.innerHTML += `
          <div class="day-config">
            <div class="day-label">${short}:</div>
            <div class="time-inputs">
              <input type="time" id="start-${full}" value="${times.start}">
              <input type="time" id="end-${full}" value="${times.end}">
            </div>
          </div>
        `;
      });
    });
  }
  
  document.getElementById("save").addEventListener("click", () => {
    const newSchedule = {};
    days.forEach(({ full }) => {
      const start = document.getElementById(`start-${full}`).value;
      const end = document.getElementById(`end-${full}`).value;
      newSchedule[full] = { start, end };
    });
    chrome.storage.sync.set({ schedule: newSchedule });
  });
  
  loadSettings();