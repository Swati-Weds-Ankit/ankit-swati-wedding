(() => {
  const cfg = window.WEDDING_CONFIG || {};
  const $ = (selector) => document.querySelector(selector);

  const escapeHTML = (value) =>
    String(value ?? "").replace(/[&<>"']/g, c =>
      ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;"
      }[c])
    );

  // Groom's name
  document.querySelectorAll('[data-name="groom"]').forEach(el => {
    el.textContent = cfg.groom || "Ankit";
  });

  // Bride's name: keep the initial separate for styling.
  // This section must appear only once.
  document.querySelectorAll('[data-name="bride"]').forEach(el => {
    const brideName = cfg.bride || "Swati";
    el.textContent = "";

    const initial = document.createElement("span");
    initial.className = "bride-initial";
    initial.textContent = brideName.charAt(0).toUpperCase();

    el.append(
      initial,
      document.createTextNode(brideName.slice(1))
    );
  });

  // Wedding details
  $("#heroDate").textContent = cfg.dateLabel || "Wedding day";
  $("#venueName").textContent =
    cfg.venueName || "Venue to be announced";
  $("#venueAddress").textContent =
    cfg.venueAddress || "Venue details coming soon";
  $("#mapLink").href = cfg.mapUrl || "https://maps.google.com";
  $("#footerYear").textContent = new Date().getFullYear();

  // Event cards
  const eventGrid = $("#eventGrid");

  eventGrid.innerHTML = (cfg.events || []).map(event => `
    <article class="event-card">
      <div class="event-icon">${escapeHTML(event.icon || "✧")}</div>
      <h3>${escapeHTML(event.name)}</h3>
      <div class="event-date">${escapeHTML(event.date)}</div>
      <p>${escapeHTML(event.note || "")}</p>
      ${event.time ? `<p><strong>${escapeHTML(event.time)}</strong></p>` : ""}
      <p class="event-venue">${escapeHTML(event.venue || "")}</p>
    </article>
  `).join("");

  // Gallery
  const gallery = $("#galleryGrid");

  gallery.innerHTML = (cfg.gallery || []).map((photo, i) => `
    <button class="gallery-item" type="button"
      aria-label="Gallery photo ${i + 1}">
      <img loading="lazy"
        src="${escapeHTML(photo.image)}"
        alt="${escapeHTML(photo.alt || "Wedding gallery photo")}">
    </button>
  `).join("");

  gallery.querySelectorAll("img").forEach(img => {
    img.addEventListener("error", () => {
      img.style.display = "none";
      img.parentElement.style.background =
        "linear-gradient(145deg,#e6d3b5,#a87965)";
    });
  });

  // Countdown
  const targetDate = new Date(
    cfg.weddingDate || "2027-02-14T18:00:00+05:30"
  );

  const pad = n => String(Math.max(0, n)).padStart(2, "0");

  function tick() {
    let diff = targetDate.getTime() - Date.now();

    if (Number.isNaN(targetDate.getTime())) diff = 0;

    if (diff <= 0) {
      ["days", "hours", "minutes", "seconds"].forEach(id => {
        $("#" + id).textContent = "00";
      });

      $("#countdownNote").textContent =
        "Today is the beginning of forever ♡";
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

    $("#countdownNote").textContent =
      "Every second brings us closer to our forever.";
  }

  tick();
  setInterval(tick, 1000);

  // Background music
  const music = $("#weddingMusic");
  const musicToggle = $("#musicToggle");
  const musicLabel = $("#musicLabel");

  function updateMusicButton(isPlaying) {
    musicLabel.textContent = isPlaying ? "Pause music" : "Play music";

    musicToggle.setAttribute(
      "aria-label",
      isPlaying ? "Pause background music" : "Play background music"
    );
  }

  async function tryStartMusic() {
    try {
      music.volume = 0.65;
      await music.play();
      updateMusicButton(true);
      return true;
    } catch {
      updateMusicButton(false);
      return false;
    }
  }

  musicToggle.addEventListener("click", async () => {
    if (music.paused) {
      const playing = await tryStartMusic();

      if (!playing) {
        alert(
          "The music could not start. Check that " +
          "assets/music/wedding-song.mp3.mp3 exists in GitHub " +
          "and is a valid MP3 file."
        );
      }
    } else {
      music.pause();
      updateMusicButton(false);
    }
  });

  // Share invitation through WhatsApp
  const shareButton = $("#shareInvitation");

  if (shareButton) {
    shareButton.addEventListener("click", () => {
      const url = window.location.href.split("#")[0];

      const message =
        `You are warmly invited to the wedding of ` +
        `${cfg.groom || "Ankit"} & ${cfg.bride || "Swati"} on ` +
        `${cfg.dateLabel || "25 November 2026"}. Venue: ` +
        `${cfg.venueName || "Deepak Line Hotel"}, ` +
        `${cfg.venueAddress || "Jaiprakash Nagar, Muzaffarpur"}. ` +
        `Invitation: ${url}`;

      window.open(
        "https://wa.me/?text=" + encodeURIComponent(message),
        "_blank",
        "noopener,noreferrer"
      );
    });
  }

  // RSVP form
  $("#rsvpForm").addEventListener("submit", event => {
    event.preventDefault();

    const data = Object.fromEntries(
      new FormData(event.currentTarget).entries()
    );

    const phone = String(cfg.whatsappNumber || "").replace(/\D/g, "");

    if (
      !phone ||
      phone.includes("XXXXXXXXXX") ||
      phone.length < 10
    ) {
      $("#formNote").textContent =
        "Please add your WhatsApp number in config.js " +
        "(country code + mobile number, digits only), " +
        "then commit the file.";

      alert(
        "Please add your WhatsApp number in config.js before using RSVP."
      );
      return;
    }

    const message =
      `Wedding RSVP for ${cfg.groom || "Ankit"} & ` +
      `${cfg.bride || "Swati"}\n` +
      `Name: ${data.guestName}\n` +
      `Attendance: ${data.attendance}\n` +
      `Message: ${data.message || "No message"}`;

    const url =
      "https://wa.me/" + phone +
      "?text=" + encodeURIComponent(message);

    window.open(url, "_blank", "noopener,noreferrer");

    $("#formNote").textContent =
      "WhatsApp opened with your response. Tap Send in WhatsApp to deliver it.";
  });

  // Reveal sections when they enter the screen
  const observer = new IntersectionObserver(
    entries => entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      }
    }),
    { threshold: 0.12 }
  );

  document.querySelectorAll(".reveal").forEach(el => {
    observer.observe(el);
  });

  // Invitation navigation
  const openButton = $("#openInvitation");
  const topNav = document.querySelector(".top-nav");
  const navLinks = document.querySelectorAll(
    '.top-nav a[href^="#"]'
  );

  if (
    topNav &&
    document.body.classList.contains("invitation-closed")
  ) {
    topNav.style.display = "none";
    topNav.setAttribute("aria-hidden", "true");

    topNav.querySelectorAll("a").forEach(link => {
      link.setAttribute("tabindex", "-1");
    });
  }

  function openInvitation(targetSelector = "#invitation") {
    if (document.body.classList.contains("invitation-closed")) {
      document.body.classList.remove("invitation-closed");

      if (topNav) {
        topNav.style.display = "";
        topNav.setAttribute("aria-hidden", "false");

        topNav.querySelectorAll("a").forEach(link => {
          link.removeAttribute("tabindex");
        });
      }

      openButton.setAttribute("aria-expanded", "true");
      document.body.style.overflow = "";

      window.setTimeout(() => {
        const target = document.querySelector(targetSelector);

        if (target) {
          target.scrollIntoView({
            behavior: "smooth",
            block: "start"
          });
        }
      }, 80);
    } else {
      const target = document.querySelector(targetSelector);

      if (target) {
        target.scrollIntoView({
          behavior: "smooth",
          block: "start"
        });
      }
    }
  }

  openButton.addEventListener("click", event => {
    event.preventDefault();
    openInvitation("#invitation");
  });

  navLinks.forEach(link => {
    link.addEventListener("click", event => {
      event.preventDefault();
      openInvitation(link.getAttribute("href"));
    });
  });

  document.body.style.overflow = "hidden";

  // Sacred gate and Ganesha opening sequence
  const ganeshaIntro = $("#ganeshaIntro");
  const openGatesButton = $("#openGates");

  if (ganeshaIntro && openGatesButton) {
    let introStarted = false;

    const startSacredOpening = () => {
      if (introStarted || !ganeshaIntro.isConnected) return;

      introStarted = true;

      // Music failure must not stop the visual sequence.
      tryStartMusic();

      ganeshaIntro.classList.add("is-opening");
      openGatesButton.disabled = true;
      openGatesButton.textContent = "Opening the gates…";

      window.setTimeout(() => {
        ganeshaIntro.classList.add("show-ganesha");
      }, 3500);

      window.setTimeout(() => {
        ganeshaIntro.classList.add("is-done");
      }, 10000);

      window.setTimeout(() => {
        ganeshaIntro.remove();
      }, 11000);
    };

    openGatesButton.addEventListener(
      "click",
      startSacredOpening
    );
  }

  // Falling flower petals and leaves
  if (
    !window.matchMedia("(prefers-reduced-motion: reduce)").matches
  ) {
    const petalLayer = $(".petals");
    const flowers = ["✿", "❀", "✽", "❁", "✾"];

    function makeFallingPiece() {
      const piece = document.createElement("span");
      const kindRoll = Math.random();

      const kind =
        kindRoll < 0.28
          ? "leaf"
          : kindRoll < 0.64
            ? "rose-petal"
            : "flower";

      piece.className = "petal " + kind;

      piece.textContent =
        kind === "leaf"
          ? (Math.random() < 0.5 ? "❧" : "🍃")
          : kind === "flower"
            ? flowers[Math.floor(Math.random() * flowers.length)]
            : "";

      piece.style.left = (Math.random() * 100) + "%";

      piece.style.setProperty(
        "--drift",
        ((Math.random() * 260) - 130) + "px"
      );

      piece.style.fontSize =
        (12 + Math.random() * 16) + "px";

      if (kind === "rose-petal") {
        piece.style.width =
          (9 + Math.random() * 10) + "px";

        piece.style.height =
          (14 + Math.random() * 12) + "px";
      }

      piece.style.animationDuration =
        (7 + Math.random() * 8) + "s";

      piece.style.opacity =
        (0.45 + Math.random() * 0.45).toFixed(2);

      petalLayer.appendChild(piece);

      piece.addEventListener(
        "animationend",
        () => piece.remove(),
        { once: true }
      );
    }

    for (let i = 0; i < 36; i++) {
      makeFallingPiece();

      const piece = petalLayer.lastElementChild;

      if (piece) {
        piece.style.animationDelay =
          (-Math.random() * 12) + "s";
      }
    }

    window.setInterval(makeFallingPiece, 320);
  }
})();
