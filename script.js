(function () {
  const data = window.PORTFOLIO;
  if (!data) return;

  // Theme
  const root = document.documentElement;
  const toggle = document.getElementById("themeToggle");
  const stored = localStorage.getItem("theme");
  if (stored === "light" || stored === "dark") root.dataset.theme = stored;

  const setPressed = () => {
    const isLight = root.dataset.theme === "light";
    toggle?.setAttribute("aria-pressed", String(isLight));
  };
  setPressed();

  toggle?.addEventListener("click", () => {
    const next = root.dataset.theme === "light" ? "dark" : "light";
    root.dataset.theme = next;
    localStorage.setItem("theme", next);
    setPressed();
  });

  // Hero copy
  document.title = `${data.person.name} — Portfolio`;
  document.querySelector(".brand__text").textContent = data.person.name;
  document.getElementById("heroPill").textContent = data.person.pill;
  document.querySelector(".hero__title").innerHTML = `Building production-ready <span class="grad">Web2 & Web3</span> systems.`;
  document.getElementById("heroSubtitle").textContent = data.person.subtitle;

  // Links
  const setHref = (id, href) => {
    const el = document.getElementById(id);
    if (el) el.href = href;
  };
  setHref("githubA", data.person.github);
  setHref("linkedinA", data.person.linkedin);
  setHref("emailA", `mailto:${data.person.email}`);
  setHref("githubB", data.person.github);
  setHref("linkedinB", data.person.linkedin);

  const emailBtn = document.getElementById("emailBtn");
  emailBtn.href = `mailto:${data.person.email}`;
  emailBtn.textContent = data.person.email;

  const resumeBtn = document.getElementById("resumeBtn");
  if (resumeBtn) resumeBtn.href = data.person.resumeUrl;

  // KPIs
  document.getElementById("kpiProjects").textContent = String(data.kpis.projects);
  document.getElementById("kpiFocus").textContent = String(data.kpis.focus);
  document.getElementById("kpiStack").textContent = String(data.kpis.stack);

  // Highlights + deliverables
  const mountList = (id, items) => {
    const ul = document.getElementById(id);
    ul.innerHTML = "";
    for (const t of items) {
      const li = document.createElement("li");
      li.textContent = t;
      ul.appendChild(li);
    }
  };
  mountList("highlightsList", data.highlights || []);
  mountList("deliverList", data.deliverables || []);

  // About + skills
  document.getElementById("aboutText").textContent = data.about;
  const skillsWrap = document.getElementById("skillsWrap");
  skillsWrap.innerHTML = "";
  for (const s of data.skills || []) {
    const span = document.createElement("span");
    span.className = "skill";
    span.textContent = s;
    skillsWrap.appendChild(span);
  }

  // Capabilities
  const capGrid = document.getElementById("capGrid");
  capGrid.innerHTML = "";
  for (const c of data.capabilities || []) {
    const card = document.createElement("div");
    card.className = "card cap";
    card.innerHTML = `<h3>${escapeHtml(c.title)}</h3><p>${escapeHtml(c.description)}</p>`;
    capGrid.appendChild(card);
  }

  // Projects rendering
  const featuredGrid = document.getElementById("featuredGrid");
  const projectsGrid = document.getElementById("projectsGrid");

  const renderProjectCard = (p, variant = "featured") => {
    const links = [];
    if (p.links?.live) links.push(`<a class="btn btn--ghost" href="${p.links.live}" target="_blank" rel="noreferrer">Live</a>`);
    if (p.links?.code) links.push(`<a class="btn btn--ghost" href="${p.links.code}" target="_blank" rel="noreferrer">Code</a>`);

    const badges = (p.tech || []).map((t) => `<span class="badge">${escapeHtml(t)}</span>`).join("");

    const title = escapeHtml(p.title);
    const desc = escapeHtml(p.description);

    const extra = variant === "featured" ? "" : "";

    const article = document.createElement("article");
    article.className = "card proj";
    article.dataset.tags = (p.tags || []).join(" ");
    article.innerHTML = `
      <div class="proj__top">
        <h3 class="proj__title">${title}</h3>
        <div class="proj__links">${links.join("")}</div>
      </div>
      <p class="proj__desc">${desc}</p>
      <div class="badges">${badges}</div>
      ${extra}
    `;
    return article;
  };

  const mountProjects = (filter = "all") => {
    featuredGrid.innerHTML = "";
    projectsGrid.innerHTML = "";

    const match = (p) => filter === "all" || (p.tags || []).includes(filter);

    for (const p of data.featured || []) {
      if (!match(p)) continue;
      featuredGrid.appendChild(renderProjectCard(p, "featured"));
    }

    for (const p of data.projects || []) {
      if (!match(p)) continue;
      projectsGrid.appendChild(renderProjectCard(p, "normal"));
    }
  };

  // Filters
  const filterButtons = Array.from(document.querySelectorAll("[data-filter]"));
  filterButtons.forEach((b) => {
    b.addEventListener("click", () => {
      filterButtons.forEach((x) => x.classList.remove("is-active"));
      b.classList.add("is-active");
      mountProjects(b.dataset.filter);
    });
  });

  mountProjects("all");

  // Availability + year
  document.getElementById("availabilityText").textContent = data.person.availability;
  document.getElementById("year").textContent = String(new Date().getFullYear());

  function escapeHtml(str) {
    return String(str)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }
})();