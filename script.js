(() => {
  const cfg = window.WEDDING_CONFIG || {};
  const $ = (selector) => document.querySelector(selector);
  const escapeHTML = (value) => String(value ?? "").replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
  document.querySelectorAll('[data-name="groom"]').forEach(el => el.textContent = cfg.groom || "Ankit");
  document.querySelectorAll('[data-name="bride"]').forEach(el => el.textContent = cfg.bride || "Swati");
  $("#heroDate").textContent = cfg.dateLabel || "Wedding day";
  $("#venueName").textContent = cfg.venueName || "Venue to be announced";
  $("#venueAddress").textContent = cfg.venueAddress || "Venue details coming soon";
  $("#mapLink").href = cfg.mapUrl || "https://maps.google.com";
  $("#footerYear").textContent = new Date().getFullYear();

  const eventGrid = $("#eventGrid");
  eventGrid.innerHTML = (cfg.events || []).map(event => `
    <article class="event-card">
      <div class="event-icon">${escapeHTML(event.icon || "✧")}</div>
      <h3>${escapeHTML(event.name)}</h3>
      <div class="event-date">${escapeHTML(event.date)}</div>
      <p>${escapeHTML(event.note || "")}</p>
      <p><strong>${escapeHTML(event.time || "")}</strong></p>
      <p class="event-venue">${escapeHTML(event.venue || "")}</p>
    </article>`).join("");

  const gallery = $("#galleryGrid");
  gallery.innerHTML = (cfg.gallery || []).map((photo, i) => `
    <button class="gallery-item" type="button" aria-label="Gallery photo ${i + 1}">
      <img loading="lazy" src="${escapeHTML(photo.image)}" alt="${escapeHTML(photo.alt || "Wedding gallery photo")}">
    </button>`).join("");
  gallery.querySelectorAll("img").forEach(img => img.addEventListener("error", () => {
    img.style.display = "none";
    img.parentElement.style.background = "linear-gradient(145deg,#e6d3b5,#a87965)";
  }));

  const targetDate = new Date(cfg.weddingDate || "2027-02-14T18:00:00+05:30");
  const pad = n => String(Math.max(0, n)).padStart(2, "0");
  function tick() {
    let diff = targetDate.getTime() - Date.now();
    if (Number.isNaN(targetDate.getTime())) diff = 0;
    if (diff <= 0) {
      ["days","hours","minutes","seconds"].forEach(id => $("#" + id).textContent = "00");
      $("#countdownNote").textContent = "Today is the beginning of forever ♡";
      return;
    }
    const days = Math.floor(diff / 86400000);
    const hours = Math.floor((diff % 86400000) / 3600000);
    const minutes = Math.floor((diff % 3600000) / 60000);
    const seconds = Math.floor((diff % 60000) / 1000);
    $("#days").textContent = pad(days);
    $("#hours").textContent = pad(hours);
    $("#minutes").textContent = pad(minutes);
    $("#seconds").textContent = pad(seconds);
    $("#countdownNote").textContent = "Every second brings us closer to our forever.";
  }
  tick(); setInterval(tick, 1000);

  const music = $("#weddingMusic"), musicToggle = $("#musicToggle"), musicLabel = $("#musicLabel");
  musicToggle.addEventListener("click", async () => {
    if (music.paused) {
      try { await music.play(); musicLabel.textContent = "Pause music"; musicToggle.setAttribute("aria-label", "Pause background music"); }
      catch { musicLabel.textContent = "Add your MP3"; alert("Add your licensed MP3 to assets/music/replace-with-your-song.mp3, then try again."); }
    } else { music.pause(); musicLabel.textContent = "Play music"; musicToggle.setAttribute("aria-label", "Play background music"); }
  });

  $("#rsvpForm").addEventListener("submit", event => {
    event.preventDefault();
    const data = Object.fromEntries(new FormData(event.currentTarget).entries());
    const saved = JSON.parse(localStorage.getItem("weddingDemoRsvps") || "[]");
    saved.push({...data, submittedAt: new Date().toISOString()});
    localStorage.setItem("weddingDemoRsvps", JSON.stringify(saved));
    $("#formNote").textContent = "Thank you, " + data.guestName + "! Your demo response is saved in this browser only. To collect replies from guests online, connect a form service.";
    event.currentTarget.reset();
  });

  const observer = new IntersectionObserver(entries => entries.forEach(entry => {
    if (entry.isIntersecting) { entry.target.classList.add("visible"); observer.unobserve(entry.target); }
  }), {threshold: 0.12});
  document.querySelectorAll(".reveal").forEach(el => observer.observe(el));

  if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    const petalLayer = $(".petals");
    for (let i = 0; i < 12; i++) {
      const petal = document.createElement("span");
      petal.className = "petal";
      petal.style.left = (Math.random() * 100) + "%";
      petal.style.setProperty("--drift", ((Math.random() * 180) - 90) + "px");
      petal.style.animationDuration = (9 + Math.random() * 10) + "s";
      petal.style.animationDelay = (Math.random() * -15) + "s";
      petalLayer.appendChild(petal);
    }
  }
})();