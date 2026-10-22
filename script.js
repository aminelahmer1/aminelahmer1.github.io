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
  const words = ["full stack", "sécurisées", "scalables", "event-driven", "cloud-ready"];
  if (!reduceMotion) {
    let w = 0, c = words[0].length, deleting = true;
    const tick = () => {
      const word = words[w];
      typed.textContent = word.slice(0, c);
      if (deleting) {
        c--;
        if (c < 0) { deleting = false; w = (w + 1) % words.length; c = 0; }
      } else {
        c++;
        if (c > words[w].length) { deleting = true; c = words[w].length; return setTimeout(tick, 1800); }
      }
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

  /* ---------- Contact form (mailto, no backend needed) ---------- */
  $("#contactForm").addEventListener("submit", (e) => {
    e.preventDefault();
    const f = e.target;
    const subject = encodeURIComponent(`Contact portfolio — ${f.name.value}`);
    const body = encodeURIComponent(`${f.message.value}\n\n— ${f.name.value} (${f.email.value})`);
    window.location.href = `mailto:medaminelahmer@hotmail.com?subject=${subject}&body=${body}`;
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
