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
      catch { musicLabel.textContent = "Add your MP3"; alert("The music file could not be played. Check that assets/music/wedding-song.mp3.mp3 exists in GitHub and is a valid MP3 file."); }
    } else { music.pause(); musicLabel.textContent = "Play music"; musicToggle.setAttribute("aria-label", "Play background music"); }
  });

  // Share the invitation link through WhatsApp without needing a recipient number.
  const shareButton = $("#shareInvitation");
  if (shareButton) {
    shareButton.addEventListener("click", () => {
      const url = window.location.href.split("#")[0];
      const message = `You are warmly invited to the wedding of ${cfg.groom || "Ankit"} & ${cfg.bride || "Swati"} on ${cfg.dateLabel || "25 November 2026"}. Venue: ${cfg.venueName || "Deepak Line Hotel"}, ${cfg.venueAddress || "Jaiprakash Nagar, Muzaffarpur"}. Invitation: ${url}`;
      window.open("https://wa.me/?text=" + encodeURIComponent(message), "_blank", "noopener,noreferrer");
    });
  }

  // RSVP sends the guest's response to the couple's WhatsApp number.
  $("#rsvpForm").addEventListener("submit", event => {
    event.preventDefault();
    const data = Object.fromEntries(new FormData(event.currentTarget).entries());
    const phone = String(cfg.whatsappNumber || "").replace(/\D/g, "");
    if (!phone || phone.includes("XXXXXXXXXX") || phone.length < 10) {
      $("#formNote").textContent = "Please add your WhatsApp number in config.js (country code + mobile number, digits only), then commit the file.";
      alert("Please add your WhatsApp number in config.js before using RSVP.");
      return;
    }
    const message = `Wedding RSVP for ${cfg.groom || "Ankit"} & ${cfg.bride || "Swati"}%0AName: ${data.guestName}%0AAttendance: ${data.attendance}%0AMessage: ${data.message || "No message"}`;
    const url = "https://wa.me/" + phone + "?text=" + encodeURIComponent(message.replace(/%0A/g, "\n"));
    window.open(url, "_blank", "noopener,noreferrer");
    $("#formNote").textContent = "WhatsApp opened with your response. Tap Send in WhatsApp to deliver it.";
  });

  const observer = new IntersectionObserver(entries => entries.forEach(entry => {
    if (entry.isIntersecting) { entry.target.classList.add("visible"); observer.unobserve(entry.target); }
  }), {threshold: 0.12});
  document.querySelectorAll(".reveal").forEach(el => observer.observe(el));

  // The invitation opens only after a guest taps the cover button.
  const openButton = $("#openInvitation");
  const navLinks = document.querySelectorAll('.top-nav a[href^="#"]');
  function openInvitation(targetSelector = "#invitation") {
    if (document.body.classList.contains("invitation-closed")) {
      document.body.classList.remove("invitation-closed");
      openButton.setAttribute("aria-expanded", "true");
      document.body.style.overflow = "";
      // Give the page a moment to reveal its sections before scrolling.
      window.setTimeout(() => {
        const target = document.querySelector(targetSelector);
        if (target) target.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 80);
    } else {
      const target = document.querySelector(targetSelector);
      if (target) target.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }
  openButton.addEventListener("click", event => {
    event.preventDefault();
    openInvitation("#invitation");
  });
  navLinks.forEach(link => link.addEventListener("click", event => {
    event.preventDefault();
    openInvitation(link.getAttribute("href"));
  }));
  document.body.style.overflow = "hidden";

  // Continuous shower of flower petals and little leaves across the whole page.
  if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    const petalLayer = $(".petals");
    const flowers = ["✿", "❀", "✽", "❁", "✾"];
    function makeFallingPiece() {
      const piece = document.createElement("span");
      const isLeaf = Math.random() < 0.42;
      piece.className = "petal " + (isLeaf ? "leaf" : "flower");
      piece.textContent = isLeaf ? (Math.random() < 0.5 ? "❧" : "🍃") : flowers[Math.floor(Math.random() * flowers.length)];
      piece.style.left = (Math.random() * 100) + "%";
      piece.style.setProperty("--drift", ((Math.random() * 240) - 120) + "px");
      piece.style.fontSize = (12 + Math.random() * 16) + "px";
      piece.style.animationDuration = (7 + Math.random() * 8) + "s";
      piece.style.opacity = (0.45 + Math.random() * 0.45).toFixed(2);
      petalLayer.appendChild(piece);
      piece.addEventListener("animationend", () => piece.remove(), { once: true });
    }
    for (let i = 0; i < 36; i++) {
      makeFallingPiece();
      // Stagger the first shower so it is already in motion on page load.
      const piece = petalLayer.lastElementChild;
      if (piece) piece.style.animationDelay = (-Math.random() * 12) + "s";
    }
    window.setInterval(makeFallingPiece, 320);
  }
})();
