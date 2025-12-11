console.clear();
console.log("script.js loaded");

window.addEventListener("DOMContentLoaded", () => {
  console.log("DOM ready");

  // ===== Theme Toggle =====
  const root = document.documentElement;
  const themeBtn = document.getElementById("themeToggle");
  const savedTheme = localStorage.getItem("theme") || "light";
  root.setAttribute("data-theme", savedTheme);

  themeBtn?.addEventListener("click", () => {
    const next = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
    root.setAttribute("data-theme", next);
    localStorage.setItem("theme", next);
  });

  // ===== Greeting + Name =====
  const greetEl = document.getElementById("greeting");
  const nameBtn = document.getElementById("setNameBtn");
  const greetingFor = (h) => (h < 12 ? "Good morning" : h < 18 ? "Good afternoon" : "Good evening");

  function renderGreeting() {
    const name = localStorage.getItem("username") || "Shahad";
    if (greetEl) greetEl.textContent = `${greetingFor(new Date().getHours())}, ${name}!`;
  }
  renderGreeting();

  nameBtn?.addEventListener("click", () => {
    const val = prompt("Your name?");
    if (val && val.trim()) {
      localStorage.setItem("username", val.trim());
      renderGreeting();
      updateWelcomeMessage();
    }
  });

  // ===== Coin sound =====
  const coinSound = new Audio("assets/sounds/mario_coin_sound.mp3");

  // ===== Blocks Reveal Skills =====
  document.querySelectorAll(".block").forEach(block => {
    const skill = block.getAttribute("data-skill");

    // Restore revealed state
    if (localStorage.getItem(`skill_${skill}`) === "revealed") {
      block.classList.add("revealed");
      block.textContent = skill;
    }

    block.addEventListener("click", (e) => {
      e.stopPropagation();
      if (block.classList.contains("revealed")) return;

      block.classList.add("revealed");
      block.textContent = skill;

      localStorage.setItem(`skill_${skill}`, "revealed");

      coinSound.currentTime = 0;
      coinSound.volume = 0.3;
      coinSound.play();

      block.animate(
        [{ transform: "scale(1.2)", background: "#fffbe0" }, { transform: "scale(1)", background: "#f6c453" }],
        { duration: 400, easing: "ease-out" }
      );

      const hint = document.getElementById("skillHint");
      if (hint) {
        hint.textContent = `Awesome! "${skill}" is unlocked — keep collecting skills!`;
        hint.classList.add("fade-in");
      }
    });
  });

  // ===== Projects (dynamic grid: search / filter / sort) =====
  const projects = [
    { id:1, title:"To-Do List App", tags:["beginner"], date:"2025-08-10", desc:"Add, complete, and delete tasks.", img:"assets/images/to-doList.png"},
    { id:2, title:"Timer App",       tags:["beginner"],       date:"2025-08-05", desc:"Start, pause, and reset a timer.", img:"assets/images/timer.png"},
    {
        id:3,
        title:"ReFocus Productivity App",
        tags:["advanced"],
        date:"2025-12-11",
        desc:"A productivity web app to track goals, focus sessions, and progress.",
        img:"assets/images/refocus.png"
      }
  ];

  const grid = document.getElementById("projectsGrid");
  const empty = document.getElementById("emptyState");
  const statusEl = document.getElementById("status");
  const search = document.getElementById("searchInput");
  const filter = document.getElementById("tagFilter");
  const sort   = document.getElementById("sortSelect");

  function card(p) {
    const tags = p.tags.map(t=>`<span>#${t}</span>`).join(" ");
    const img  = p.img ? `<img src="${p.img}" alt="${p.title}" style="width:100%;border:4px solid #000;border-radius:8px;margin-bottom:8px;">` : "";
    return `<article class="card">
      ${img}
      <h3>${p.title}</h3>
      <p class="muted">${new Date(p.date).toLocaleDateString()}</p>
      <p>${p.desc}</p>
      <p class="muted">${tags}</p>
    </article>`;
  }

  function render() {
    const q = (search?.value || "").toLowerCase();
    const tag = filter?.value || "all";
    const sortKey = sort?.value || "dateDesc";

    let list = projects.filter(p =>
      (tag === "all" || p.tags.includes(tag)) &&
      (p.title.toLowerCase().includes(q) || p.desc.toLowerCase().includes(q))
    );

    switch (sortKey) {
      case "dateAsc":   list.sort((a,b)=> a.date.localeCompare(b.date)); break;
      case "titleAsc":  list.sort((a,b)=> a.title.localeCompare(b.title)); break;
      case "titleDesc": list.sort((a,b)=> b.title.localeCompare(a.title)); break;
      default:          list.sort((a,b)=> b.date.localeCompare(a.date)); // dateDesc
    }

    if (grid) grid.innerHTML = list.map(card).join("");
    if (empty) empty.classList.toggle("hidden", list.length > 0);
    if (statusEl) statusEl.textContent = `${list.length} project(s) shown`;
  }

  search?.addEventListener("input", render);
  filter?.addEventListener("change", render);
  sort?.addEventListener("change", render);
  render();


  // ===== Contact Form Validation =====
  const contactForm = document.getElementById("contactForm");
  const formFeedback = document.getElementById("formFeedback");

  function showFieldError(name, msg) {
    const el = document.querySelector(`.error[data-for="${name}"]`);
    if (el) el.textContent = msg || "";
  }
  function validateForm(fd) {
    let ok = true;
    const name = fd.get("name")?.trim();
    const email = fd.get("email")?.trim();
    const message = fd.get("message")?.trim();

    if (!name) { showFieldError("name", "Name is required"); ok = false; } else showFieldError("name", "");
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { showFieldError("email", "Valid email required"); ok = false; } else showFieldError("email", "");
    if (!message || message.length < 10) { showFieldError("message", "At least 10 characters"); ok = false; } else showFieldError("message", "");
    return ok;
  }

  contactForm?.addEventListener("submit", (e) => {
    e.preventDefault();
    const fd = new FormData(contactForm);
    if (!validateForm(fd)) {
      if (formFeedback) { formFeedback.className = "feedback err"; formFeedback.textContent = "Please fix the errors above."; }
      return;
    }
    if (formFeedback) { formFeedback.className = "feedback ok"; formFeedback.textContent = "Thanks! Your message was ‘sent’."; }
  });

  // ===== Scroll Fade-In with Stagger =====
  const fadeElements = document.querySelectorAll("section, .block, .project");
  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        setTimeout(() => { entry.target.classList.add("visible"); }, i * 150);
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });
  fadeElements.forEach(el => observer.observe(el));

  // ===== Footer Year =====
  const y = document.getElementById("year");
  if (y) y.textContent = new Date().getFullYear().toString();


  const repoList = document.getElementById("repo-list");

  async function loadRepos() {
    try {
      const res = await fetch("https://api.github.com/users/sh24s/repos");
      if (!res.ok) throw new Error("GitHub API Error");

      const data = await res.json();

      repoList.innerHTML = data.slice(0, 5).map(repo => `
        <div class="repo-card">
          <h3>${repo.name}</h3>
          <p>${repo.description || "No description available."}</p>
          <a href="${repo.html_url}" target="_blank">View Repository</a>
        </div>
      `).join("");
    } catch (err) {
      repoList.innerHTML = `<p class="error">⚠ Could not load repositories. Try again later.</p>`;
    }
  }

  loadRepos();


  // === Visit Counter ===
  const visitCountEl = document.getElementById("visitCount");
  let visits = parseInt(localStorage.getItem("visitCount") || "0") + 1;
  localStorage.setItem("visitCount", visits);
  if (visitCountEl) visitCountEl.textContent = visits;

  // === Timer (seconds on page) ===
  const timerEl = document.getElementById("visitTimer");
  let seconds = 0;
  setInterval(() => {
    seconds++;
    if (timerEl) timerEl.textContent = seconds;
  }, 1000);

  // === Welcome Back Message ===
  const welcomeEl = document.getElementById("welcomeMessage");

  function updateWelcomeMessage() {
    const name = localStorage.getItem("username") || "visitor";
    welcomeEl.textContent = `Welcome back, ${name}! Happy to see you again.`;
  }

  updateWelcomeMessage();

}); 


// ===== Reset Progress Button =====
document.getElementById("resetProgress")?.addEventListener("click", () => {
  if (confirm("Are you sure you want to reset your progress?")) {
    localStorage.clear();
    location.reload();
  }
});