
import {
  getClassDate,
  formatTime,
  getClassStatus,
  getCountdown,
  scheduleReminder
} from "./timer.js";

const $ = (selector) => document.querySelector(selector);

const ui = {
  addButton: $("#add-class-btn"),
  bannerAdd: $("#banner-add-btn"),
  emptyAdd: $("#empty-add-btn"),
  modal: $("#modal-overlay"),
  closeModal: $("#close-modal"),
  cancelModal: $("#cancel-modal"),
  form: $("#class-form"),
  subject: $("#subject"),
  time: $("#class-time"),
  room: $("#class-room"),
  duration: $("#class-duration"),
  schedule: $("#schedule-list"),
  empty: $("#empty-state"),
  total: $("#total-classes"),
  upcoming: $("#upcoming-classes"),
  completed: $("#completed-classes"),
  nextName: $("#next-class-name"),
  nextMeta: $("#next-class-meta"),
  countdown: $("#countdown"),
  date: $("#date-pill"),
  today: $("#today-label"),
  toast: $("#toast")
};

let nextId = 1;
let toastTimeout;
const notifiedClasses = new Set();
const reminderTimeouts = new Map();

// Sample classes make the dashboard look populated.
// You can delete these or add your own classes.
function makeSampleClass(subject, offsetMinutes, room, duration) {
  const start = new Date(Date.now() + offsetMinutes * 60000);

  return {
    id: nextId++,
    subject,
    time: `${String(start.getHours()).padStart(2, "0")}:${String(start.getMinutes()).padStart(2, "0")}`,
    room,
    duration
  };
}

let classes = [
  makeSampleClass("Data Structures", 35, "Room 204", 60),
  makeSampleClass("Machine Learning", 120, "Computer Lab", 60),
  makeSampleClass("Web Development", 240, "Room 108", 45)
];

function showToast(message) {
  ui.toast.textContent = message;
  ui.toast.classList.add("show");

  clearTimeout(toastTimeout);
  toastTimeout = setTimeout(() => {
    ui.toast.classList.remove("show");
  }, 2800);
}

function openModal() {
  ui.modal.classList.remove("hidden");

  // Give the time input a convenient default, rounded up to 5 minutes.
  const defaultDate = new Date(Date.now() + 10 * 60000);
  defaultDate.setMinutes(Math.ceil(defaultDate.getMinutes() / 5) * 5, 0, 0);

  if (!ui.time.value) {
    ui.time.value =
      `${String(defaultDate.getHours()).padStart(2, "0")}:` +
      `${String(defaultDate.getMinutes()).padStart(2, "0")}`;
  }

  setTimeout(() => ui.subject.focus(), 50);
}

function closeModal() {
  ui.modal.classList.add("hidden");
}

function escapeHTML(value) {
  return String(value).replace(/[&<>"']/g, character => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;"
  })[character]);
}

function getSortedClasses() {
  return [...classes].sort(
    (a, b) => getClassDate(a.time) - getClassDate(b.time)
  );
}

function renderSchedule() {
  const sorted = getSortedClasses();

  ui.schedule.innerHTML = "";
  ui.empty.classList.toggle("hidden", sorted.length > 0);

  sorted.forEach(item => {
    const status = getClassStatus(item);
    const startDate = getClassDate(item.time);
    const endDate = new Date(startDate.getTime() + item.duration * 60000);

    const statusLabels = {
      upcoming: "Upcoming",
      ongoing: "In progress",
      completed: "Completed"
    };

    const row = document.createElement("article");
    row.className = "class-row";

    row.innerHTML = `
      <div class="time-block">
        <strong>${formatTime(item.time)}</strong>
        <span>${item.duration} min</span>
      </div>

      <div class="class-details">
        <h3>${escapeHTML(item.subject)}</h3>
        <p>
          <span class="room-dot">●</span>
          ${escapeHTML(item.room)}
          &nbsp; · &nbsp;
          Ends ${endDate.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit"
          })}
        </p>
      </div>

      <div class="class-actions">
        <span class="status-pill ${status}">${statusLabels[status]}</span>
        <button class="delete-btn" type="button"
          data-delete-id="${item.id}"
          aria-label="Delete ${escapeHTML(item.subject)}"
          title="Delete class">×</button>
      </div>
    `;

    ui.schedule.appendChild(row);
  });
}

function renderStats() {
  const statuses = classes.map(item => getClassStatus(item));

  ui.total.textContent = classes.length;
  ui.upcoming.textContent = statuses.filter(
    status => status === "upcoming"
  ).length;

  ui.completed.textContent = statuses.filter(
    status => status === "completed"
  ).length;
}

function renderCountdown() {
  const now = new Date();

  const nextClass = getSortedClasses().find(
    item => getClassDate(item.time) > now
  );

  const ongoingClass = getSortedClasses().find(
    item => getClassStatus(item) === "ongoing"
  );

  if (ongoingClass) {
    ui.nextName.textContent = ongoingClass.subject;
    ui.nextMeta.textContent =
      `${ongoingClass.room} · Class in progress`;

    const end = new Date(
      getClassDate(ongoingClass.time).getTime() +
      ongoingClass.duration * 60000
    );

    ui.countdown.textContent = getCountdown(end);
    return;
  }

  if (!nextClass) {
    ui.nextName.textContent = "You're all caught up!";
    ui.nextMeta.textContent = "Add another class to plan ahead.";
    ui.countdown.textContent = "--:--:--";
    return;
  }

  ui.nextName.textContent = nextClass.subject;
  ui.nextMeta.textContent =
    `${formatTime(nextClass.time)} · ${nextClass.room}`;

  ui.countdown.textContent = getCountdown(
    getClassDate(nextClass.time)
  );
}

function renderAll() {
  const now = new Date();

  ui.today.textContent = now.toLocaleDateString([], {
    weekday: "long"
  }).toUpperCase() + " · YOUR PERSONAL PLANNER";

  ui.date.textContent = now.toLocaleDateString([], {
    weekday: "short",
    month: "short",
    day: "numeric"
  });

  renderSchedule();
  renderStats();
  renderCountdown();
}

function refreshReminders() {
  // Clear previous timers so schedule edits don't leave stale reminders.
  reminderTimeouts.forEach(timeoutId => clearTimeout(timeoutId));
  reminderTimeouts.clear();

  classes.forEach(item => {
    if (notifiedClasses.has(item.id)) return;

    const timeoutId = scheduleReminder(item, () => {
      notifiedClasses.add(item.id);
      showToast(`♡ ${item.subject} is starting now!`);
      renderAll();
      refreshReminders();
    });

    if (timeoutId !== null) {
      reminderTimeouts.set(item.id, timeoutId);
    }
  });
}

// All Add Class buttons open the same form.
ui.addButton.addEventListener("click", openModal);
ui.bannerAdd.addEventListener("click", openModal);
ui.emptyAdd.addEventListener("click", openModal);

ui.closeModal.addEventListener("click", closeModal);
ui.cancelModal.addEventListener("click", closeModal);

// Close when clicking outside the modal.
ui.modal.addEventListener("click", event => {
  if (event.target === ui.modal) closeModal();
});

// Close with Escape.
document.addEventListener("keydown", event => {
  if (event.key === "Escape" && !ui.modal.classList.contains("hidden")) {
    closeModal();
  }
});

// ADD CLASS: this is the form submission handler.
ui.form.addEventListener("submit", event => {
  event.preventDefault();

  const subject = ui.subject.value.trim();
  const time = ui.time.value;
  const room = ui.room.value.trim();
  const duration = Number(ui.duration.value);

  if (!subject || !time || !room || !duration) {
    showToast("Please complete all the fields.");
    return;
  }

  // A new class is created and added to the schedule.
  const newClass = {
    id: nextId++,
    subject,
    time,
    room,
    duration
  };

  classes.push(newClass);
  notifiedClasses.delete(newClass.id);

  ui.form.reset();
  closeModal();

  renderAll();
  refreshReminders();

  showToast(`♡ ${subject} added to your schedule!`);
});

// Delete classes using event delegation.
ui.schedule.addEventListener("click", event => {
  const deleteButton = event.target.closest("[data-delete-id]");
  if (!deleteButton) return;

  const id = Number(deleteButton.dataset.deleteId);
  const removed = classes.find(item => item.id === id);

  classes = classes.filter(item => item.id !== id);

  if (reminderTimeouts.has(id)) {
    clearTimeout(reminderTimeouts.get(id));
    reminderTimeouts.delete(id);
  }

  notifiedClasses.delete(id);
  renderAll();
  refreshReminders();

  if (removed) showToast(`${removed.subject} removed from your schedule.`);
});

// Update the countdown and class status in real time.
renderAll();
refreshReminders();

setInterval(() => {
  renderAll();
}, 1000);
