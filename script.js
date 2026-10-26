(() => {
  const root = document.documentElement;
  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- Theme ---------- */
  const store = {
    get(k) { try { return localStorage.getItem(k); } catch { return null; } },
    set(k, v) { try { localStorage.setItem(k, v); } catch {} },
  };
  const saved = store.get("theme");
  if (saved) root.dataset.theme = saved;
  else if (window.matchMedia("(prefers-color-scheme: light)").matches) root.dataset.theme = "light";
  $("#themeToggle").addEventListener("click", () => {
    const next = root.dataset.theme === "dark" ? "light" : "dark";
    root.dataset.theme = next;
    store.set("theme", next);
  });

  /* ---------- Nav ---------- */
  const nav = $("#nav");
  const burger = $("#burger");
  const links = $("#navLinks");
  const onScroll = () => nav.classList.toggle("scrolled", window.scrollY > 20);
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  burger.addEventListener("click", () => {
    const open = links.classList.toggle("open");
    burger.classList.toggle("open", open);
    nav.classList.toggle("menu-open", open);
  });
  $$("a", links).forEach((a) =>
    a.addEventListener("click", () => {
      links.classList.remove("open");
      burger.classList.remove("open");
      nav.classList.remove("menu-open");
    })
  );

  // Active link on scroll
  const sections = $$("section[id]");
  const navMap = new Map($$(".nav-links a[href^='#']").map((a) => [a.getAttribute("href").slice(1), a]));
  const spy = new IntersectionObserver(
    (entries) =>
      entries.forEach((e) => {
        const link = navMap.get(e.target.id);
        if (link && e.isIntersecting) {
          navMap.forEach((l) => l.classList.remove("active"));
          if (!link.classList.contains("nav-cta")) link.classList.add("active");
        }
      }),
    { rootMargin: "-45% 0px -50% 0px" }
  );
  sections.forEach((s) => spy.observe(s));

  /* ---------- Reveal on scroll ---------- */
  const revealer = new IntersectionObserver(
    (entries) =>
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add("visible");
          revealer.unobserve(e.target);
        }
      }),
    { threshold: 0.12 }
  );
  $$(".reveal").forEach((el, i) => {
    el.style.transitionDelay = `${(i % 4) * 80}ms`;
    revealer.observe(el);
  });

  /* ---------- Typing effect ---------- */
  const typed = $("#typed");
  const WORDS = {
    fr: ["full stack", "sécurisées", "scalables", "event-driven"],
    en: ["full stack apps", "secure apps", "scalable apps", "event-driven apps"],
  };
  let words = WORDS.fr;
  window.__setTypedWords = (l) => { words = WORDS[l]; typed.textContent = words[0]; tw = 0; tc = words[0].length; };
  let tw = 0, tc = 0;
  if (!reduceMotion) {
    tc = words[0].length; let deleting = true;
    const tick = () => {
      let w = tw % words.length, c = tc;
      const word = words[w];
      typed.textContent = word.slice(0, c);
      if (deleting) {
        c--;
        if (c < 0) { deleting = false; w = (w + 1) % words.length; c = 0; }
      } else {
        c++;
        if (c > words[w].length) { deleting = true; c = words[w].length; tw = w; tc = c; return setTimeout(tick, 1800); }
      }
      tw = w; tc = c;
      setTimeout(tick, deleting ? 45 : 90);
    };
    setTimeout(tick, 2200);
  }

  /* ---------- Counters ---------- */
  const counter = new IntersectionObserver(
    (entries) =>
      entries.forEach((e) => {
        if (!e.isIntersecting) return;
        const el = e.target;
        const target = +el.dataset.count;
        const start = performance.now();
        const dur = 1400;
        const step = (t) => {
          const p = Math.min((t - start) / dur, 1);
          el.textContent = Math.round(target * (1 - Math.pow(1 - p, 3)));
          if (p < 1) requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
        counter.unobserve(el);
      }),
    { threshold: 0.6 }
  );
  $$("[data-count]").forEach((el) => counter.observe(el));

  /* ---------- Cursor glow + card spotlight ---------- */
  const glow = $(".cursor-glow");
  const fine = window.matchMedia("(pointer: fine)").matches;
  if (fine && !reduceMotion) {
    window.addEventListener("pointermove", (e) => {
      glow.style.left = e.clientX + "px";
      glow.style.top = e.clientY + "px";
    }, { passive: true });

    $$(".skill-card").forEach((card) =>
      card.addEventListener("pointermove", (e) => {
        const r = card.getBoundingClientRect();
        card.style.setProperty("--mx", `${e.clientX - r.left}px`);
        card.style.setProperty("--my", `${e.clientY - r.top}px`);
      })
    );

    /* Subtle 3D tilt */
    $$(".tilt").forEach((card) => {
      card.addEventListener("pointermove", (e) => {
        const r = card.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width - 0.5;
        const y = (e.clientY - r.top) / r.height - 0.5;
        card.style.transform = `perspective(900px) rotateX(${-y * 4}deg) rotateY(${x * 4}deg) translateY(-4px)`;
      });
      card.addEventListener("pointerleave", () => (card.style.transform = ""));
    });
  } else {
    glow.style.display = "none";
  }

  /* ---------- Language: FR in the HTML, EN here ---------- */
  const EN = {
    "nav.about": "About", "nav.skills": "Stack", "nav.exp": "Experience", "nav.edu": "Education", "nav.proj": "Projects",
    "nav.serv": "Services", "nav.contact": "Contact me",
    "hero.badge": "Open to freelance work and new opportunities",
    "hero.h1a": "I build", "hero.h1b": "solid backends", "hero.h1c": "and",
    "hero.sub": "Software engineer in Tunis. I build <strong>Java / Spring Boot</strong> and <strong>Angular</strong> applications, from understanding the need to running them in production: microservices, Keycloak security, Kafka, Docker and CI/CD.",
    "hero.cta1": "See my projects", "hero.cta2": "Download my resume",
    "hero.m1": "microservices designed", "hero.m2": "live concurrent users", "hero.m3": "languages spoken",
    "hero.alt": "Portrait of Mohamed Amine Lahmer",
    "hero.card": "Full Stack Java · Tunis · Remote",
    "about.eye": "01 — About",
    "about.h2": "I turn a need into <span class=\"grad\">software that runs</span>.",
    "about.p1": "I'm a software engineer specialized in <strong>Java backend</strong> work and <strong>microservices</strong> architectures. What drives me: taking a real problem, understanding it with the people who live it, and shipping a solution that is <strong>reliable, secure and easy to evolve</strong>.",
    "about.p2": "I've designed real-time microservices platforms, a complete CRM built from scratch and APIs for freelance clients. Every time, I follow the project from the first conversation to <strong>production</strong>, and beyond.",
    "about.p3": "I care as much about the code as everything around it: testing, CI/CD pipelines, deployment and monitoring. And I work just as comfortably in <strong>Arabic</strong>, <strong>French</strong> or <strong>English</strong>.",
    "about.c1": "Secure REST APIs, microservices, event-driven communication.",
    "about.c2": "Docker, GitLab CI / Jenkins pipelines, deployment and monitoring.",
    "about.c3t": "Quality &amp; testing",
    "about.c3": "Postman API tests, Selenium, SonarQube code analysis.",
    "about.c4": "Angular 17, multilingual websites, SEO.",
    "sk.eye": "02 — Tech stack",
    "sk.h2": "The tools I use <span class=\"grad\">every day</span>.",
    "sk.sec": "Security &amp; Messaging", "sk.ops": "DevOps &amp; Quality", "sk.k8s": "Kubernetes (basics)",
    "exp.eye": "03 — Experience",
    "exp.h2": "Professional <span class=\"grad\">experience</span>.",
    "exp.1.title": "Technology manager — Software engineer", "exp.1.when": "Aug 2026 — present",
    "exp.1.a": "I design and build a real estate management CRM end to end: gathering requirements with management, architecture, development, testing and production deployment.",
    "exp.1.b": "I built the brand's multilingual website, orzeta.com (FR / EN / AR), and manage its hosting.",
    "exp.2.title": "Freelance backend developer", "exp.2.when": "Jan 2026 — present",
    "exp.2.a": "Spring Boot REST APIs (Data JPA, PostgreSQL / MySQL) for clients: requirements, development, JWT security, Docker deployment and maintenance.",
    "exp.3.title": "Backend engineer — Full stack", "exp.3.when": "Feb 2025 — Nov 2025",
    "exp.3.a": "Real-time e-learning platform: 7 Spring Boot / Spring Cloud microservices behind an API Gateway, secured with Keycloak (OAuth2, JWT).",
    "exp.3.b": "Service-to-service messaging with Kafka, live classes for 50+ concurrent users (WebRTC, LiveKit), Angular 17 front end.",
    "exp.3.c": "GitLab CI and Jenkins pipelines, SonarQube analysis, Selenium and Postman tests.",
    "exp.4.title": ".NET developer (internship)", "exp.4.when": "Jul 2024 — Sep 2024",
    "exp.4.a": "Management application for a medical practice in ASP.NET MVC and SQL Server, in a Scrum team.",
    "edu.eye": "04 — Education",
    "edu.h2": "Education &amp; <span class=\"grad\">certifications</span>.",
    "edu.1.title": "National engineering degree in computer science",
    "edu.1.org": "ESPRIT — Private Higher School of Engineering and Technology · Tunis · Software engineering track",
    "edu.2.title": "National bachelor's degree in electrical engineering",
    "edu.2.org": "ISET Mahdia — Higher Institute of Technological Studies · Automation and industrial computing track",
    "edu.3.title": "Certifications",
    "edu.3.a": "Cisco — Networking (2023)",
    "edu.3.b": "Artificial intelligence — Coursera (2024)",
    "proj.eye": "05 — Projects",
    "proj.h2": "What I've <span class=\"grad\">built</span>.",
    "p1.tag": "Microservices · Real time · ArabSoft",
    "p1.title": "Real-time e-learning platform",
    "p1.fig": "Architecture diagram",
    "p1.cap": "Services exchange events through Kafka; authentication is handled by Keycloak at the gateway.",
    "p1.desc": "A skill-sharing platform with live classes, chat and notifications. I designed the split into 7 services, Keycloak security at the gateway and event-driven communication with Kafka. Live classes handle 50+ concurrent users.",
    "p2.tag": "Full stack · PROMED GROUP · ongoing",
    "p2.title": "Real estate management CRM",
    "p2.desc": "An internal tool to track properties, clients and operations. I own it alone, from design to production, working directly with management. Private code.",
    "p2.t3": "Testing", "p2.t4": "Deployment",
    "p3.desc": "Three-language showcase website for a Tunisian olive oil brand: build, media, SEO and hosting.",
    "p3.link": "Visit the site ↗",
    "p4.tag": "DevOps · Personal project",
    "p4.title": "End-to-end CI/CD pipeline",
    "p4.desc": "Automated build, testing and deployment of a Spring Boot / Angular app, with quality gates and monitoring.",
    "proj.more": "My code on GitHub",
    "sv.eye": "06 — Freelance services",
    "sv.h2": "How I can <span class=\"grad\">help you</span>.",
    "sv.1t": "Spring Boot APIs &amp; backend", "sv.1": "Building or extending REST APIs, bug fixing, performance tuning.",
    "sv.2t": "Security &amp; SSO", "sv.2": "Keycloak integration, OAuth2 / OpenID Connect, JWT and role management.",
    "sv.3": "Splitting a monolith, event-driven communication, API Gateway.",
    "sv.4": "Containerization, GitLab CI / Jenkins pipelines, SonarQube quality and deployment.",
    "c.eye": "07 — Contact",
    "c.h2": "A project, a mission?<br /><span class=\"grad\">Let's talk.</span>",
    "c.lead": "Write to me with this form, or directly by email or WhatsApp.",
    "c.name": "Your name", "c.email": "Your email", "c.msg": "Tell me about your project…",
    "c.send": "Send message",
    "c.cv": "Mohamed Amine Lahmer · 1 page · EN",
    "c.cvalt": "Version française (PDF)",
  };
  const META = {
    fr: { title: document.title, cv: "assets/CV_Mohamed_Amine_Lahmer_FR.pdf", alt: "assets/CV_Mohamed_Amine_Lahmer_EN.pdf", btn: "EN", aria: "Switch to English" },
    en: { title: "Mohamed Amine Lahmer — Java / Spring Boot software engineer", cv: "assets/CV_Mohamed_Amine_Lahmer_EN.pdf", alt: "assets/CV_Mohamed_Amine_Lahmer_FR.pdf", btn: "FR", aria: "Passer en français" },
  };
  const MSG = {
    fr: { sending: "Envoi…", ok: "Merci, votre message est bien parti. Je reviens vers vous rapidement.",
          invalid: "Merci de remplir les trois champs avec un e-mail valide.",
          err: "L'envoi n'a pas fonctionné. Écrivez-moi directement à medaminelahmer@hotmail.com." },
    en: { sending: "Sending…", ok: "Thanks, your message has been sent. I'll get back to you soon.",
          invalid: "Please fill in all three fields with a valid email.",
          err: "Sending failed. Please email me directly at medaminelahmer@hotmail.com." },
  };
  const FR = {};
  $$("[data-i18n]").forEach((el) => (FR[el.dataset.i18n] = el.innerHTML));
  $$("[data-i18n-alt]").forEach((el) => (FR[el.dataset.i18nAlt] = el.alt));
  $$("[data-i18n-ph]").forEach((el) => (FR[el.dataset.i18nPh] = el.placeholder));
  $$("[data-i18n-aria]").forEach((el) => (FR[el.dataset.i18nAria] = el.getAttribute("aria-label")));

  let lang = "fr";
  const applyLang = (l) => {
    lang = l;
    const d = l === "en" ? EN : FR;
    $$("[data-i18n]").forEach((el) => { const v = d[el.dataset.i18n]; if (v != null) el.innerHTML = v; });
    $$("[data-i18n-alt]").forEach((el) => { const v = d[el.dataset.i18nAlt]; if (v != null) el.alt = v; });
    $$("[data-i18n-ph]").forEach((el) => { const v = d[el.dataset.i18nPh]; if (v != null) el.placeholder = v; });
    $$("[data-i18n-aria]").forEach((el) => { const v = d[el.dataset.i18nAria]; if (v != null) el.setAttribute("aria-label", v); });
    document.documentElement.lang = l;
    document.title = META[l].title;
    $$(".cv-link").forEach((a) => (a.href = META[l].cv));
    $("#cvAlt").href = META[l].alt;
    const b = $("#langBtn");
    b.textContent = META[l].btn;
    b.setAttribute("aria-label", META[l].aria);
    $("#formStatus").textContent = "";
    if (window.__setTypedWords) window.__setTypedWords(l);
    store.set("lang", l);
  };
  $("#langBtn").addEventListener("click", () => applyLang(lang === "fr" ? "en" : "fr"));
  const savedLang = store.get("lang");
  const nav0 = (navigator.language || "").toLowerCase();
  if (savedLang === "en" || (!savedLang && !nav0.startsWith("fr") && !nav0.startsWith("ar"))) applyLang("en");

  /* ---------- Contact form → FormSubmit (delivered to my inbox) ---------- */
  const form = $("#contactForm");
  const fStatus = $("#formStatus");
  const sendBtn = $("#sendBtn");
  // Web3Forms: free form-to-email service. Paste the access key received by email at https://web3forms.com
  const WEB3FORMS_KEY = "COLLE-TA-CLE-ICI";
  const USE_WEB3 = /^[0-9a-f-]{36}$/i.test(WEB3FORMS_KEY);
  // Fallback while no Web3Forms key: FormSubmit (works after one-time activation, but can be slow)
  const ENDPOINT = USE_WEB3 ? "https://api.web3forms.com/submit" : "https://formsubmit.co/ajax/medaminelahmer@hotmail.com";
  const setStatus = (t, cls) => { fStatus.textContent = t; fStatus.className = "form-status " + (cls || ""); };
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const m = MSG[lang];
    const name = form.name.value.trim(), email = form.email.value.trim(), message = form.message.value.trim();
    if (!name || !message || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return setStatus(m.invalid, "err");
    if (form._honey.value) return setStatus(m.ok, "ok");
    sendBtn.disabled = true;
    setStatus(m.sending);
    const ctl = new AbortController();
    const timer = setTimeout(() => ctl.abort(), 90000);
    try {
      const res = await fetch(ENDPOINT, {
        method: "POST",
        signal: ctl.signal,
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(USE_WEB3
          ? { access_key: WEB3FORMS_KEY, name, email, message, subject: `Portfolio — message de ${name}`,
              from_name: "Portfolio Amine Lahmer", replyto: email }
          : { name, email, message, _subject: `Portfolio — message de ${name}`, _replyto: email,
              _template: "table", _captcha: "false" }),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok && String(data.success) === "true") { form.reset(); setStatus(m.ok, "ok"); }
      else throw new Error(String(data.message || res.status));
    } catch {
      setStatus(m.err, "err");
    } finally {
      clearTimeout(timer);
      sendBtn.disabled = false;
    }
  });

  /* ---------- Scroll progress ---------- */
  const bar = $("#progress");
  const prog = () => {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    bar.style.transform = `scaleX(${max > 0 ? window.scrollY / max : 0})`;
  };
  window.addEventListener("scroll", prog, { passive: true });
  prog();

  /* ---------- Magnetic buttons ---------- */
  if (fine && !reduceMotion) {
    $$(".magnetic, .cv-dl").forEach((el) => {
      el.addEventListener("pointermove", (e) => {
        const r = el.getBoundingClientRect();
        el.style.transform = `translate(${(e.clientX - r.left - r.width / 2) * 0.25}px, ${(e.clientY - r.top - r.height / 2) * 0.35}px)`;
      });
      el.addEventListener("pointerleave", () => (el.style.transform = ""));
    });
  }

  /* ---------- Footer year ---------- */
  $("#year").textContent = new Date().getFullYear();
})();
