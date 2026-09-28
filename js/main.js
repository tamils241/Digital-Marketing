/* =========================================================
   STACKLY — Digital Marketing Theme JS
   Preloader, nav, 3D scroll reveal, tilt cards, counters, FAQ accordion
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {
  "use strict";

  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const isTouch = window.matchMedia("(hover: none)").matches;

  /* ---------------- Preloader ---------------- */
  const preloader = document.getElementById("preloader");
  let preloaderHidden = false;

  const hidePreloader = () => {
    if (preloaderHidden) return;
    preloaderHidden = true;
    if (preloader) preloader.classList.add("hidden");
    startReveals();
  };

  window.addEventListener("load", () => setTimeout(hidePreloader, 250));
  // Safety: never let a slow third-party embed (e.g. the map iframe) gate the page
  setTimeout(hidePreloader, 900);

  /* ---------------- Navbar scroll state + progress ---------------- */
  const navbar = document.getElementById("navbar");
  const progressBar = document.getElementById("scrollProgress");

  const onScrollChrome = () => {
    if (!navbar && !progressBar) return;
    const y = window.scrollY;
    if (navbar) navbar.classList.toggle("scrolled", y > 40);
    if (progressBar) {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      progressBar.style.width = `${max > 0 ? (y / max) * 100 : 0}%`;
    }
  };
  onScrollChrome();
  window.addEventListener("scroll", onScrollChrome, { passive: true });

  /* ---------------- Mobile menu ---------------- */
  const hamburger = document.getElementById("hamburger");
  const navMenu = document.getElementById("navMenu");

  const toggleMenu = (open) => {
    if (!navMenu || !hamburger) return;
    navMenu.classList.toggle("open", open);
    hamburger.classList.toggle("open", open);
    hamburger.setAttribute("aria-expanded", open);
    document.body.style.overflow = open ? "hidden" : "";
  };

  if (hamburger && navMenu) {
    hamburger.addEventListener("click", () =>
      toggleMenu(!navMenu.classList.contains("open"))
    );

    document.querySelectorAll(".nav-link, .nav-menu .btn").forEach((link) =>
      link.addEventListener("click", () => toggleMenu(false))
    );
  }

  /* ---------------- Active nav state ---------------- */
  // Each page ships its own `active` class; the site is multi-page, so there is
  // no in-page section spy to run.

  /* ---------------- 3D scroll reveal ---------------- */
  const revealEls = document.querySelectorAll(".reveal-up");
  revealEls.forEach((el, i) => (el.style.setProperty("--i", i)));

  // Stagger card grids
  document.querySelectorAll(".cards-3d-grid .card-3d").forEach((c, i) =>
    c.style.setProperty("--i", i % 3)
  );
  document.querySelectorAll(".work-grid .work-card").forEach((c, i) =>
    c.style.setProperty("--i", i % 3)
  );
  document.querySelectorAll(".testi-grid .testi-card").forEach((c, i) =>
    c.style.setProperty("--i", i % 3)
  );
  document.querySelectorAll(".pricing-grid .price-card").forEach((c, i) =>
    c.style.setProperty("--i", i)
  );
  document.querySelectorAll(".process-grid .process-step").forEach((c, i) =>
    c.style.setProperty("--i", i)
  );

  // 3D rotate entrance for all cards (works alongside hover tilt)
  document
    .querySelectorAll(
      ".cards-3d-grid .card-3d, .work-grid .work-card, .testi-grid .testi-card, .pricing-grid .price-card, .process-grid .process-step"
    )
    .forEach((el) => el.classList.add("fx-rotate"));

  const revealObserver = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("in-view");
          obs.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
  );

  const startReveals = () => {
    revealEls.forEach((el) => revealObserver.observe(el));
    applyScrollTilt();
  };

  /* ---------------- Scroll-driven hero tilt (3D parallax) ---------------- */
  const hero = document.querySelector(".hero");
  const heroVisual = document.querySelector(".hero-visual");
  const aboutVisual = document.querySelector(".about-visual");

  const applyScrollTilt = () => {
    if (prefersReducedMotion) return;
    if (heroVisual && hero) {
      const rect = hero.getBoundingClientRect();
      const progress = Math.min(Math.max((window.innerHeight - rect.top) / window.innerHeight, 0), 1);
      const rotX = (0.5 - progress) * 14;
      const rotY = (progress - 0.5) * 10;
      heroVisual.style.transform = `rotateX(${rotX}deg) rotateY(${rotY}deg)`;
    }
    if (aboutVisual) {
      const rect = aboutVisual.getBoundingClientRect();
      if (rect.top < window.innerHeight && rect.bottom > 0) {
        const progress = 1 - rect.top / window.innerHeight;
        const rotX = (0.5 - progress) * 10;
        aboutVisual.style.transform = `rotateX(${rotX}deg)`;
      }
    }
  };
  window.addEventListener("scroll", applyScrollTilt, { passive: true });
  applyScrollTilt();

  /* ---------------- Card tilt on hover (mouse only) ---------------- */
  if (!prefersReducedMotion) {
    document.querySelectorAll("[data-tilt]").forEach((card) => {
      if (isTouch) return;

      const maxTilt = 10;
      card.addEventListener("mousemove", (e) => {
        const rect = card.getBoundingClientRect();
        const px = (e.clientX - rect.left) / rect.width;
        const py = (e.clientY - rect.top) / rect.height;
        const rotY = (px - 0.5) * (maxTilt * 2);
        const rotX = (0.5 - py) * (maxTilt * 2);

        card.style.transform =
          `perspective(900px) rotateX(${rotX.toFixed(2)}deg) rotateY(${rotY.toFixed(2)}deg) translateZ(6px)`;
        card.style.setProperty("--mx", `${px * 100}%`);
        card.style.setProperty("--my", `${py * 100}%`);
      });
      card.addEventListener("mouseleave", () => {
        card.style.transform = "";
      });
    });

    /* Hero / about visual tilt follows cursor */
    [heroVisual, aboutVisual].forEach((wrap) => {
      if (!wrap) return;
      const layer = wrap.firstElementChild;
      wrap.addEventListener("mousemove", (e) => {
        const rect = wrap.getBoundingClientRect();
        const px = (e.clientX - rect.left) / rect.width;
        const py = (e.clientY - rect.top) / rect.height;
        wrap.classList.add("tilted");
        layer.style.transform =
          `rotateY(${((px - 0.5) * 16).toFixed(2)}deg) rotateX(${((0.5 - py) * 16).toFixed(2)}deg)`;
      });
      wrap.addEventListener("mouseleave", () => {
        wrap.classList.remove("tilted");
        applyScrollTilt(); // restore scroll-driven pose
        layer.style.transform = "";
      });
    });
  }

  /* ---------------- Animated counters ---------------- */
  const counters = document.querySelectorAll(".counter");

  const runCounter = (el) => {
    const target = parseInt(el.dataset.target, 10) || 0;
    const duration = 1600;
    const start = performance.now();
    const tick = (now) => {
      const t = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - t, 3);
      el.textContent = Math.round(target * eased);
      if (t < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  };

  const counterObserver = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          runCounter(entry.target);
          obs.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.6 }
  );
  counters.forEach((c) => counterObserver.observe(c));

  /* ---------------- Animated progress bar ---------------- */
  const progressTrack = document.querySelector(".progress-track span");
  if (progressTrack) {
    const progressObserver = new IntersectionObserver(
      ([entry], obs) => {
        if (entry.isIntersecting) {
          progressTrack.style.width = "98%";
          obs.unobserve(entry.target);
        }
      },
      { threshold: 0.5 }
    );
    progressObserver.observe(progressTrack);
  }

  /* ---------------- Hero typing effect removed ---------------- */

  /* ---------------- FAQ: single-open accordion ---------------- */
  const faqItems = [...document.querySelectorAll(".faq-item")];
  faqItems.forEach((item) => {
    item.addEventListener("toggle", () => {
      if (!item.open) return;
      faqItems.forEach((other) => {
        if (other !== item) other.open = false;
      });
    });
  });

  /* ---------------- Dashboard shell ---------------- */
  const dash = document.getElementById("dash");
  if (dash) {
    const burger = document.getElementById("dashBurger");
    const scrim = document.getElementById("dashScrim");
    const side = document.getElementById("dashSide");

    const setDrawer = (open) => {
      dash.classList.toggle("open", open);
      if (burger) burger.setAttribute("aria-expanded", String(open));
      document.body.style.overflow = open ? "hidden" : "";
    };

    if (burger) {
      burger.addEventListener("click", () => setDrawer(!dash.classList.contains("open")));
    }
    if (scrim) scrim.addEventListener("click", () => setDrawer(false));
    if (side) {
      side.addEventListener("click", (e) => {
        if (e.target.closest(".dash-link") && window.innerWidth <= 1023) setDrawer(false);
      });
    }
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && dash.classList.contains("open")) setDrawer(false);
    });
    window.addEventListener("resize", () => {
      if (window.innerWidth > 1023 && dash.classList.contains("open")) setDrawer(false);
    });

    /* sidebar #anchors: reveal the target immediately, then keep .active in sync.
       Without the reveal the jump lands on a still-transparent card, so the link
       reads as dead even though the browser scrolled correctly. */
    const sideLinks = side ? [...side.querySelectorAll(".dash-link[href*='#']")] : [];
    const sideTargets = sideLinks
      .map((a) => document.getElementById(a.getAttribute("href").split("#")[1]))
      .filter(Boolean);

    const revealTarget = (id) => {
      if (!id) return;
      const el = document.getElementById(id);
      if (!el) return;
      revealObserver.unobserve(el);
      el.classList.add("in-view");
      const nested = el.querySelectorAll(".reveal-up");
      nested.forEach((n) => {
        revealObserver.unobserve(n);
        n.classList.add("in-view");
      });
    };

    if (sideTargets.length) {
      const overview = side ? side.querySelector(".dash-link:not([href*='#'])") : null;
      // grid siblings (e.g. leads + billing) share a docTop, so hold the last
      // picked section while its twin is equally in view
      let pinned = null;
      // set only by a deliberate click, so the page-end branch can honour it
      let sticky = null;

      const paint = (link) => {
        [overview, ...sideLinks].forEach((a) => {
          if (!a) return;
          const on = a === link;
          a.classList.toggle("active", on);
          if (on) a.setAttribute("aria-current", "page");
          else a.removeAttribute("aria-current");
        });
      };

      const show = (el) => paint(sideLinks.find((a) => a.getAttribute("href").endsWith(`#${el.id}`)));

      const syncActive = () => {
        const pad = parseFloat(getComputedStyle(document.documentElement).scrollPaddingTop) || 0;
        const line = window.scrollY + pad + 8;
        // sidebar order != document order, so rank by real page position
        const ordered = sideTargets
          .map((t) => ({ t, top: t.getBoundingClientRect().top + window.scrollY }))
          .sort((a, b) => a.top - b.top);

        const reached = ordered.filter(({ top }) => top <= line);
        if (!reached.length) {
          pinned = null;
          sticky = null;
          return paint(overview);
        }

        // page end: the final section can never cross the line, so claim it here
        const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
        if (maxScroll - window.scrollY <= 2) {
          const held = sticky && sticky.getBoundingClientRect().bottom > 0 ? sticky : ordered[ordered.length - 1].t;
          return show(held);
        }

        // grid twins (leads/billing) share a row -- keep the one already picked,
        // else take the left-most card so it follows reading order
        const last = reached[reached.length - 1];
        const row = reached.filter((r) => Math.abs(r.top - last.top) < 2);
        pinned = row.some((r) => r.t === pinned) ? pinned : row[0].t;
        show(pinned);
      };

      window.addEventListener("scroll", syncActive, { passive: true });
      window.addEventListener("resize", syncActive, { passive: true });
      window.addEventListener("hashchange", () => revealTarget(location.hash.slice(1)));

      sideLinks.forEach((a) =>
        a.addEventListener("click", () => {
          const el = document.getElementById(a.getAttribute("href").split("#")[1]);
          revealTarget(el && el.id);
          if (el) {
            pinned = el;
            sticky = el;
          }
          paint(a);
        })
      );

      const initial = document.getElementById(location.hash.slice(1));
      if (initial) {
        pinned = initial;
        sticky = initial;
      }
      revealTarget(location.hash.slice(1));
      syncActive();
    }

    /* The current page's own link ("Overview") has no hash, so the browser does
       nothing when clicked. Scroll back to the top instead. */
    if (side) {
      side.querySelectorAll(".dash-link:not([href*='#'])").forEach((a) =>
        a.addEventListener("click", (e) => {
          if (a.getAttribute("href").split("#")[0] !== location.pathname.split("/").pop()) return;
          e.preventDefault();
          window.scrollTo({ top: 0, behavior: "smooth" });
        })
      );
    }

    /* date-range chips */
    const range = document.getElementById("dashRange");
    if (range) {
      range.addEventListener("click", (e) => {
        const chip = e.target.closest(".dash-chip");
        if (!chip) return;
        range.querySelectorAll(".dash-chip").forEach((c) => c.classList.toggle("active", c === chip));
      });
    }

    /* task checkboxes */
    const tasks = document.getElementById("dashTasks");
    if (tasks) {
      tasks.addEventListener("click", (e) => {
        const btn = e.target.closest(".dash-check");
        if (!btn) return;
        const item = btn.closest("li");
        const done = item.classList.toggle("done");
        const when = item.querySelector(".dash-task-when");
        if (when) when.textContent = done ? "Done" : "Open";
        btn.setAttribute("aria-label", done ? "Mark as not done" : "Mark as done");
      });
    }
  }

  /* ---------------- Shared form helpers ---------------- */
  /* accepts sun@gmail.com / sin123@yahoo.com — every domain label must start with a
     letter, so 123.com and 123gami.com are rejected */
  const EMAIL_RE = /^[A-Za-z0-9._%+-]+@[A-Za-z][A-Za-z0-9-]*(?:\.[A-Za-z][A-Za-z0-9-]*)*\.[A-Za-z]{2,}$/;
  const EMAIL_STRIP_RE = /[\s"'<>()[\],;:\\]/g;
  const NAME_RE = /^[A-Za-z]{1,16}$/;
  const NAME_MAX = 16;
  const WEAK_PW = new Set([
    "password", "password1", "password123", "12345678", "123456789", "1234567890",
    "qwerty123", "letmein1", "welcome1", "iloveyou", "admin123", "abc12345", "passw0rd",
  ]);

  /* strong = 8+ chars, a letter and a number/symbol, not a common password */
  const isStrongPassword = (v) => {
    const val = v || "";
    if (val.length < 8) return false;
    if (WEAK_PW.has(val.toLowerCase())) return false;
    const hasLetter = /[A-Za-z]/.test(val);
    const hasNumber = /[0-9]/.test(val);
    const hasSymbol = /[^A-Za-z0-9]/.test(val);
    const mixedCase = /[a-z]/.test(val) && /[A-Z]/.test(val);
    return hasLetter && ((hasNumber && hasSymbol) || (hasNumber && mixedCase) || (hasSymbol && mixedCase));
  };

  const passwordScore = (val) => {
    let score = 0;
    if (val.length >= 8) score++;
    if (val.length >= 12) score++;
    if (/[0-9]/.test(val)) score++;
    if (/[^A-Za-z0-9]/.test(val)) score++;
    if (/[A-Z]/.test(val) && /[a-z]/.test(val)) score++;
    return Math.min(score, 5);
  };

  const setMsg = (el, text, isError = false) => {
    if (!el) return;
    el.textContent = text;
    el.classList.toggle("err", isError);
  };

  const clearFormMsg = (el, ms = 6000) => {
    if (!el) return;
    setTimeout(() => setMsg(el, ""), ms);
  };

  /* Inline hint under a field: "" = idle, ok = green, err = red */
  const setHint = (el, text, state = "") => {
    if (!el) return;
    el.textContent = text;
    el.classList.toggle("ok", state === "ok");
    el.classList.toggle("err", state === "err");
  };

  /* Keep the caret stable while stripping characters the user just typed */
  const sanitize = (input, re, max) => {
    const before = input.value;
    const start = input.selectionStart;
    let next = before.replace(re, "");
    if (max && next.length > max) next = next.slice(0, max);
    if (next === before) return false;
    const removed = before.length - next.length;
    input.value = next;
    try {
      const pos = Math.max(0, start - removed);
      input.setSelectionRange(pos, pos);
    } catch (e) {}
    return true;
  };

  /* Sanitize pasted text through the same rules as typing */
  const bindPaste = (input, clean) => {
    input.addEventListener("paste", (e) => {
      e.preventDefault();
      const text = (e.clipboardData || window.clipboardData).getData("text");
      const cleaned = clean(text);
      if (!cleaned) return;
      const start = input.selectionStart ?? input.value.length;
      const end = input.selectionEnd ?? input.value.length;
      input.value = input.value.slice(0, start) + cleaned + input.value.slice(end);
      const pos = start + cleaned.length;
      input.setSelectionRange(pos, pos);
      input.dispatchEvent(new Event("input", { bubbles: true }));
    });
  };

  /* Name: letters only, hard 16-char cap, live counter */
  const attachNameRule = (input) => {
    if (!input) return;
    const hint = input.parentElement?.querySelector(".form-hint");
    input.maxLength = NAME_MAX;
    input.setAttribute("inputmode", "text");
    input.setAttribute("pattern", "[A-Za-z]{1,16}");
    input.setAttribute("data-rule", "name");

    const check = () => {
      const v = input.value;
      if (hint) {
        if (!v) setHint(hint, "Letters only, up to 16 characters.");
        else setHint(hint, `${v.length}/${NAME_MAX} · letters only`, v.length > NAME_MAX ? "err" : "");
      }
      return v.length === 0 || NAME_RE.test(v);
    };

    input.addEventListener("input", () => {
      sanitize(input, /[^A-Za-z]/g, NAME_MAX);
      check();
    });
    input.addEventListener("blur", check);
    bindPaste(input, (t) => t.replace(/[^A-Za-z]/g, "").slice(0, NAME_MAX));
    check();
  };

  /* Email: only mail-safe characters typed/pasted, live validity alert */
  const attachEmailRule = (input) => {
    if (!input) return;
    const hint = input.parentElement?.querySelector(".form-hint");
    input.setAttribute("data-rule", "email");
    input.setAttribute("autocapitalize", "off");
    input.setAttribute("spellcheck", "false");

    const check = () => {
      const v = input.value.trim();
      if (!v) {
        input.removeAttribute("aria-invalid");
        if (hint) setHint(hint, "We'll send the plan and audit to this inbox.");
        return true;
      }
      const ok = EMAIL_RE.test(v);
      input.toggleAttribute("aria-invalid", !ok);
      if (hint) {
        setHint(
          hint,
          ok ? "✓ Valid email address." : "Invalid email — use name@domain.com",
          ok ? "ok" : "err"
        );
      }
      return ok;
    };

    input.addEventListener("input", () => {
      sanitize(input, EMAIL_STRIP_RE, 0);
      check();
    });
    input.addEventListener("blur", check);
    bindPaste(input, (t) => t.replace(EMAIL_STRIP_RE, ""));
    check();
  };

  document.querySelectorAll('input[data-rule="name"], input[name="name"]').forEach(attachNameRule);
  document.querySelectorAll('input[type="email"]').forEach(attachEmailRule);

  /* ---------------- Validate-everything-then-submit ---------------- */
  const fieldByName = (form, name) => (name ? form.querySelector(`[name="${name}"]`) : null);
  const isChecked = (form, name) => !!form.querySelector(`input[name="${name}"]:checked`);

  const formAlertBox = (form) => {
    let box = form.querySelector(".form-alert");
    if (!box) {
      box = document.createElement("div");
      box.className = "form-alert";
      box.setAttribute("role", "alert");
      box.setAttribute("aria-live", "assertive");
      box.hidden = true;
      form.prepend(box);
    }
    return box;
  };

  const shake = (el) => {
    el.classList.remove("shake");
    void el.offsetWidth;
    el.classList.add("shake");
  };

  /* rules: [{ field, test(value, form), msg, note? }] — every failure is reported at once */
  const validateAll = (form, msgEl, rules) => {
    const box = formAlertBox(form);
    form.querySelectorAll("[aria-invalid]").forEach((el) => el.removeAttribute("aria-invalid"));
    form.querySelectorAll("[data-rule-note]").forEach((el) => {
      el.hidden = true;
    });

    const problems = [];
    for (const rule of rules) {
      const field = typeof rule.field === "function" ? rule.field(form) : fieldByName(form, rule.field);
      const value = field ? field.value : "";
      const ok = rule.test(value, form);
      if (field) field.toggleAttribute("aria-invalid", !ok);
      if (rule.note) {
        const note = typeof rule.note === "string" ? document.getElementById(rule.note) : rule.note;
        if (note) {
          note.hidden = ok;
          note.dataset.ruleNote = "1";
        }
      }
      if (!ok) problems.push({ msg: rule.msg, field });
    }

    if (!problems.length) {
      box.hidden = true;
      box.textContent = "";
      return true;
    }

    box.hidden = false;
    box.innerHTML =
      `<span class="form-alert-title">⚠ ${problems.length} field${problems.length > 1 ? "s" : ""} need${problems.length > 1 ? "" : "s"} attention before you continue</span>` +
      "<ul>" + problems.map((p) => `<li>${p.msg}</li>`).join("") + "</ul>";
    setMsg(msgEl, problems[0].msg, true);
    shake(form);
    const first = problems[0].field;
    if (first && first.focus) first.focus();
    return false;
  };

  // Fake async submit with a pending state on the button
  const fakeSubmit = (form, btn, msgEl, valid, pendingText, doneText, success, redirect) => {
    if (!form) return;
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      if (!valid(form)) return;

      btn.textContent = pendingText;
      btn.disabled = true;

      setTimeout(() => {
        // read the outcome BEFORE reset() wipes the form
        const doneText2 = typeof success === "function" ? success(form) : success;
        const target = typeof redirect === "function" ? redirect(form) : redirect;

        btn.textContent = doneText;
        btn.disabled = false;
        setMsg(msgEl, target ? `${doneText2} Redirecting…` : doneText2);
        form.reset();
        formAlertBox(form).hidden = true;
        form.querySelectorAll("[aria-invalid]").forEach((el) => el.removeAttribute("aria-invalid"));
        form.querySelectorAll("[data-rule-note]").forEach((el) => {
          el.hidden = true;
        });
        form.querySelectorAll(".form-hint").forEach((h) => h.classList.remove("err", "ok"));
        if (form.id === "registerForm") {
          const bar = document.getElementById("pwBar");
          if (bar) bar.style.width = "0";
        }
        if (form.id === "loginForm") {
          const bar = document.getElementById("pwBar");
          const hint = document.getElementById("pwHint");
          if (bar) bar.style.width = "0";
          if (hint) hint.textContent = "Strong only: 8+ characters with a number and a symbol.";
        }
        clearFormMsg(msgEl);
        if (target) setTimeout(() => { window.location.href = target; }, 900);
      }, 1200);
    });
  };

  /* ---------------- Contact form ---------------- */
  const contactForm = document.getElementById("contactForm");
  if (contactForm) {
    fakeSubmit(
      contactForm,
      document.getElementById("contactSubmit"),
      document.getElementById("formMsg"),
      (form) =>
        validateAll(form, document.getElementById("formMsg"), [
          { field: "name", test: (v) => NAME_RE.test(v.trim()), msg: "Name must be letters only, up to 16 characters (no spaces or digits)." },
          { field: "email", test: (v) => EMAIL_RE.test(v.trim()), msg: "Enter a valid email like name@domain.com." },
          { field: "interest", test: (v) => !!v, msg: "Pick the service you're interested in." },
          { field: "message", test: (v) => v.trim().length >= 10, msg: "Tell us a little about the project (10+ characters)." },
        ]),
      "Sending…",
      "Book My Free Call →",
      "✓ Thanks! We'll reach out within 24 hours."
    );
  }

  /* ---------------- Support form (client console) ---------------- */
  const supportForm = document.getElementById("supportForm");
  if (supportForm) {
    fakeSubmit(
      supportForm,
      document.getElementById("supportSubmit"),
      document.getElementById("supportMsg"),
      (form) =>
        validateAll(form, document.getElementById("supportMsg"), [
          { field: "name", test: (v) => NAME_RE.test(v.trim()), msg: "Name must be letters only, up to 16 characters (no spaces or digits)." },
          { field: "email", test: (v) => EMAIL_RE.test(v.trim()), msg: "Enter a valid email like name@domain.com." },
          { field: "topic", test: (v) => !!v, msg: "Pick what this is about so it reaches the right person." },
          { field: "message", test: (v) => v.trim().length >= 10, msg: "Add a little more detail (10+ characters) so we can help faster." },
        ]),
      "Sending…",
      "Message sent →",
      "✓ Message sent. Mara usually replies within 4 business hours."
    );
  }

  /* ---------------- Login form ---------------- */
  const loginForm = document.getElementById("loginForm");
  if (loginForm) {
    const loginPw = document.getElementById("password");
    const loginBar = document.getElementById("pwBar");
    const loginPwHint = document.getElementById("pwHint");
    const rememberBox = document.getElementById("remember");
    const rememberHint = document.getElementById("rememberHint");

    if (loginPw && loginBar && loginPwHint) {
      loginPw.addEventListener("input", () => {
        const val = loginPw.value;
        if (!val) {
          loginBar.style.width = "0";
          loginPwHint.textContent = "Strong only: 8+ characters with a number and a symbol.";
          loginPwHint.classList.remove("err", "ok");
          return;
        }
        const strong = isStrongPassword(val);
        loginBar.style.width = (strong ? 100 : Math.max((passwordScore(val) / 5) * 100, 12)) + "%";
        loginBar.style.background = strong ? "var(--accent)" : "var(--danger)";
        loginPwHint.textContent = strong
          ? "✓ Strong password."
          : "Too weak — use 8+ characters with a number and a symbol.";
        loginPwHint.classList.toggle("ok", strong);
        loginPwHint.classList.toggle("err", !strong);
      });
    }

    if (rememberBox && rememberHint) {
      rememberBox.addEventListener("change", () => {
        if (rememberBox.checked) {
          rememberHint.hidden = true;
          rememberBox.removeAttribute("aria-invalid");
        }
      });
    }
  }

  fakeSubmit(
    document.getElementById("loginForm"),
    document.getElementById("loginSubmit"),
    document.getElementById("loginMsg"),
    (form) =>
      validateAll(form, document.getElementById("loginMsg"), [
        { field: (f) => f.querySelector('input[name="role"]:checked'), test: (v) => !!v, msg: "Choose an account type." },
        { field: "email", test: (v) => EMAIL_RE.test(v.trim()), msg: "Enter a valid email like name@domain.com." },
        { field: "password", test: (v) => v.length >= 8, msg: "Password must be at least 8 characters." },
        { field: "password", test: (v) => isStrongPassword(v), msg: "Password is too weak — use 8+ characters with a number and a symbol." },
        { field: (f) => f.querySelector("#remember"), test: (v, f) => isChecked(f, "remember"), msg: "You must tick \"Keep me signed in\" to continue.", note: "rememberHint" },
      ]),
    "Logging in…",
    "Log In",
    (form) => {
      const role = form.querySelector('input[name="role"]:checked');
      return `✓ Welcome back — taking you to your ${role ? role.value : "client"} dashboard.`;
    },
    (form) => {
      const role = form.querySelector('input[name="role"]:checked');
      return role && role.value === "admin" ? "admin-dashboard.html" : "client-dashboard.html";
    }
  );

  /* ---------------- Register form ---------------- */
  const registerForm = document.getElementById("registerForm");
  if (registerForm) {
    const pwInput = document.getElementById("password");
    const pwBar = document.getElementById("pwBar");
    const pwHint = document.getElementById("pwHint");
    const confirmInput = document.getElementById("confirmPassword");
    const confirmHint = document.getElementById("confirmHint");

    const scorePassword = (val) => passwordScore(val);
    if (pwInput) {
      pwInput.addEventListener("input", () => {
        const val = pwInput.value;
        if (!pwBar || !pwHint) return;
        if (!val) {
          pwBar.style.width = "0";
          pwHint.textContent = "Strong only: 8+ characters with a number and a symbol.";
          pwHint.classList.remove("err", "ok");
          return;
        }
        const strong = isStrongPassword(val);
        pwBar.style.width = (strong ? 100 : Math.max((scorePassword(val) / 5) * 100, 12)) + "%";
        pwBar.style.background = strong ? "var(--accent)" : "var(--danger)";
        pwHint.textContent = strong ? "✓ Strong password." : "Too weak — use 8+ characters with a number and a symbol.";
        pwHint.classList.toggle("ok", strong);
        pwHint.classList.toggle("err", !strong);
        if (val) pwInput.toggleAttribute("aria-invalid", !strong);
        if (confirmInput) syncConfirmHint();
      });
    }

    function syncConfirmHint() {
      if (!confirmInput || !confirmHint) return;
      const val = confirmInput.value;
      if (!val) {
        confirmHint.textContent = "Both passwords must match.";
        confirmHint.style.color = "";
        confirmHint.classList.remove("err", "ok");
        confirmInput.removeAttribute("aria-invalid");
        return;
      }
      const match = val === pwInput.value && isStrongPassword(pwInput.value);
      confirmHint.textContent = match
        ? "✓ Passwords match."
        : val !== pwInput.value
          ? "Passwords don't match yet."
          : "Password must be strong before it can match.";
      confirmHint.style.color = match ? "var(--accent)" : "var(--danger)";
      confirmHint.classList.toggle("ok", match);
      confirmHint.classList.toggle("err", !match);
      confirmInput.toggleAttribute("aria-invalid", !match);
    }

    if (confirmInput) confirmInput.addEventListener("input", syncConfirmHint);

    const termsBox = document.getElementById("terms");
    const termsHint = document.getElementById("termsHint");
    if (termsBox && termsHint) {
      termsBox.addEventListener("change", () => {
        if (termsBox.checked) {
          termsHint.hidden = true;
          termsBox.removeAttribute("aria-invalid");
        }
      });
    }

    fakeSubmit(
      registerForm,
      document.getElementById("registerSubmit"),
      document.getElementById("registerMsg"),
      (form) =>
        validateAll(form, document.getElementById("registerMsg"), [
          { field: "name", test: (v) => NAME_RE.test(v.trim()), msg: "Name must be letters only, up to 16 characters." },
          { field: "company", test: (v) => v.trim().length > 0, msg: "Please enter your company name." },
          { field: "email", test: (v) => EMAIL_RE.test(v.trim()), msg: "Enter a valid email like name@domain.com." },
          { field: "password", test: (v) => v.length >= 8, msg: "Password must be at least 8 characters." },
          { field: "password", test: (v) => isStrongPassword(v), msg: "Password is too weak — use 8+ characters with a number and a symbol." },
          {
            field: "confirmPassword",
            test: (v, f) => v.length >= 8 && v === f.password.value,
            msg: "Passwords must match, and be at least 8 characters.",
          },
          { field: "interest", test: (v) => !!v, msg: "Pick your primary interest." },
          { field: (f) => f.querySelector('input[name="role"]:checked'), test: (v) => !!v, msg: "Choose an account type." },
          { field: "terms", test: (v, f) => isChecked(f, "terms"), msg: "Please accept the terms to continue.", note: "termsHint" },
        ]),
      "Creating account…",
      "Create Account",
      (form) => {
        const role = form.querySelector('input[name="role"]:checked');
        return `✓ Account created — sign in to your ${role ? role.value : "client"} dashboard.`;
      },
      "login.html"
    );
  }
});
