$(document).ready(function () {
  const STORAGE_KEY = "eventoraRegistrations";
  const CUSTOM_KEY = "eventoraCustomEvents";
  let allEvents = [];
  let activeCategory = "All";
  let toastTimer;

  const icons = { Hackathon: "⌘", Workshop: "✳", Meetup: "◉", Conference: "✦" };
  const palettes = ["purple", "green", "orange", "blue", "pink", "yellow"];

  // AJAX: load event data from the local JSON file.
  $.ajax({
    url: "events.json",
    method: "GET",
    dataType: "json",
    success: function (data) {
      allEvents = data.concat(readCustomEvents());
      renderEvents();
      $("#event-status").text("Showing " + allEvents.length + " hand-picked experiences");
    },
    error: function () {
      $("#event-status").text("Could not load events.json. Start the project with VS Code Live Server.");
      $("#event-grid").html('<div class="empty-saved">AJAX could not load the event list. Make sure events.json is in the same folder and use Live Server.</div>');
    }
  });

  function readRegistrations() {
    try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || []; }
    catch (error) { return []; }
  }
  function saveRegistrations(items) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }
  function readCustomEvents() {
    try { return JSON.parse(localStorage.getItem(CUSTOM_KEY)) || []; }
    catch (error) { return []; }
  }
  function escapeHtml(value) {
    return String(value ?? "").replace(/[&<>"']/g, function (char) {
      return {"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[char];
    });
  }
  function niceDate(dateString) {
    const date = new Date(dateString + "T12:00:00");
    return { day: date.getDate(), month: date.toLocaleDateString("en-US", { month: "short" }), full: date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) };
  }
  function getEvent(id) { return allEvents.find(event => String(event.id) === String(id)); }

  // DOM manipulation: cards are generated dynamically from AJAX-loaded JSON.
  function renderEvents() {
    const query = $("#search-input").val().trim().toLowerCase();
    let filtered = allEvents.filter(function (event) {
      const matchesCategory = activeCategory === "All" || event.category === activeCategory;
      const searchable = [event.title, event.description, event.location, event.category].join(" ").toLowerCase();
      return matchesCategory && searchable.includes(query);
    });
    if ($("#sort-select").val() === "name") filtered.sort((a,b) => a.title.localeCompare(b.title));
    else filtered.sort((a,b) => new Date(a.date) - new Date(b.date));

    $("#event-grid").empty();
    filtered.forEach(function (event, index) {
      const date = niceDate(event.date);
      const isRegistered = readRegistrations().some(item => String(item.eventId) === String(event.id));
      const palette = event.palette || palettes[index % palettes.length];
      const card = `
        <article class="event-card">
          <div class="event-visual ${escapeHtml(palette)}">
            <span class="category-tag">${escapeHtml(event.category)}</span>
            <span class="visual-symbol">${icons[event.category] || "✳"}</span>
            <div class="date-chip"><b>${date.day}</b><small>${date.month}</small></div>
          </div>
          <div class="event-body">
            <div class="event-meta"><span>⌖ ${escapeHtml(event.location)}</span><span>·</span><span>${escapeHtml(event.format || "In person")}</span></div>
            <h3>${escapeHtml(event.title)}</h3>
            <p>${escapeHtml(event.description)}</p>
            <div class="event-footer">
              <span class="attendee-info"><b>${escapeHtml(event.attendees || "Open community")}</b><br>${escapeHtml(date.full)}</span>
              <div class="event-actions">
                <button class="small-btn save-btn" data-id="${escapeHtml(event.id)}">${isRegistered ? "✓ Saved" : "Details"}</button>
                <button class="small-btn join" data-id="${escapeHtml(event.id)}">${isRegistered ? "Registered" : "Join ↗"}</button>
              </div>
            </div>
          </div>
        </article>`;
      $("#event-grid").append(card);
    });
    $("#event-status").text("Showing " + filtered.length + " of " + allEvents.length + " events");
    $("#empty-state").toggleClass("hidden", filtered.length !== 0);
    updateMyEvents();
  }

  function openRegistration(eventId) {
    const event = getEvent(eventId);
    if (!event) return;
    if (readRegistrations().some(item => String(item.eventId) === String(eventId))) {
      showToast("You're already registered for this event.");
      return;
    }
    $("#modal-event-id").val(event.id);
    $("#modal-title").text("Join " + event.title);
    $("#modal-description").text(niceDate(event.date).full + " · " + event.location);
    $("#register-modal").removeClass("hidden");
    $("#attendee-name").trigger("focus");
  }
  function updateMyEvents() {
    const registrations = readRegistrations();
    $("#nav-count, #saved-count").text(registrations.length);
    $("#my-events-list").empty();
    if (!registrations.length) {
      $("#my-events-list").html('<div class="empty-saved">No registrations yet. Find an event that sparks something ✨</div>');
      return;
    }
    registrations.forEach(function (item) {
      const event = getEvent(item.eventId);
      if (!event) return;
      const date = niceDate(event.date);
      $("#my-events-list").append(`
        <div class="saved-event">
          <div class="saved-icon">${icons[event.category] || "✳"}</div>
          <div class="saved-details"><b>${escapeHtml(event.title)}</b><small>${escapeHtml(date.full)} · ${escapeHtml(event.location)} · Registered by ${escapeHtml(item.name)}</small></div>
          <button class="cancel-btn" data-id="${escapeHtml(event.id)}" title="Cancel registration" aria-label="Cancel registration">×</button>
        </div>`);
    });
  }
  function showToast(message) {
    clearTimeout(toastTimer);
    $("#toast").text(message).addClass("show");
    toastTimer = setTimeout(() => $("#toast").removeClass("show"), 2600);
  }

  // jQuery events: search, category filters, sorting, registration and cancellation.
  $("#search-input").on("input", renderEvents);
  $("#sort-select").on("change", renderEvents);
  $("#category-filters").on("click", ".filter", function () {
    activeCategory = $(this).data("category");
    $(".filter").removeClass("active");
    $(this).addClass("active");
    renderEvents();
  });
  $("#event-grid").on("click", ".join", function () { openRegistration($(this).data("id")); });
  $("#event-grid").on("click", ".save-btn", function () {
    const event = getEvent($(this).data("id"));
    if (!event) return;
    $("#modal-event-id").val(event.id);
    $("#modal-title").text(event.title);
    $("#modal-description").text(event.description);
    $("#register-modal").removeClass("hidden");
  });
  $("#registration-form").on("submit", function (event) {
    event.preventDefault();
    const eventId = $("#modal-event-id").val();
    const registrations = readRegistrations();
    if (registrations.some(item => String(item.eventId) === String(eventId))) {
      showToast("You're already registered for this event.");
      $("#register-modal").addClass("hidden");
      return;
    }
    registrations.push({
      eventId: eventId,
      name: $("#attendee-name").val().trim(),
      email: $("#attendee-email").val().trim(),
      registeredAt: new Date().toISOString()
    });
    saveRegistrations(registrations);
    $("#registration-form")[0].reset();
    $("#register-modal").addClass("hidden");
    renderEvents();
    showToast("You're on the list. See you there! ✨");
  });
  $("#my-events-list").on("click", ".cancel-btn", function () {
    const id = $(this).data("id");
    saveRegistrations(readRegistrations().filter(item => String(item.eventId) !== String(id)));
    renderEvents();
    showToast("Registration cancelled.");
  });
  $("#clear-filters").on("click", function () {
    $("#search-input").val("");
    activeCategory = "All";
    $(".filter").removeClass("active").filter('[data-category="All"]').addClass("active");
    $("#sort-select").val("soon");
    renderEvents();
  });
  $("[data-close]").on("click", function () { $("#" + $(this).data("close")).addClass("hidden"); });
  $(".modal-backdrop").on("click", function (event) {
    if (event.target === this) $(this).addClass("hidden");
  });
  $(document).on("keydown", function (event) {
    if (event.key === "Escape") $(".modal-backdrop").addClass("hidden");
  });

  function openHostModal() {
    const today = new Date();
    today.setMinutes(today.getMinutes() - today.getTimezoneOffset());
    $("#host-date").attr("min", today.toISOString().slice(0,10));
    $("#host-modal").removeClass("hidden");
  }
  $("#host-btn, #cta-host-btn").on("click", openHostModal);
  $("#host-form").on("submit", function (event) {
    event.preventDefault();
    const customEvents = readCustomEvents();
    const newEvent = {
      id: "custom-" + Date.now(),
      title: $("#host-title").val().trim(),
      category: $("#host-category").val(),
      date: $("#host-date").val(),
      location: $("#host-location").val().trim(),
      description: $("#host-description").val().trim(),
      attendees: "Just announced",
      format: $("#host-location").val().trim().toLowerCase() === "online" ? "Online" : "In person",
      palette: palettes[Math.floor(Math.random() * palettes.length)]
    };
    customEvents.push(newEvent);
    localStorage.setItem(CUSTOM_KEY, JSON.stringify(customEvents));
    allEvents.push(newEvent);
    $("#host-form")[0].reset();
    $("#host-modal").addClass("hidden");
    activeCategory = "All";
    $(".filter").removeClass("active").filter('[data-category="All"]').addClass("active");
    $("#search-input").val("");
    renderEvents();
    $("#event-status").text("Your event has been published locally!");
    showToast("Your event is live on this device! ✨");
    $("#discover")[0].scrollIntoView({ behavior: "smooth" });
  });
});
