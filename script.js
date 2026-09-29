/* Progressive enhancement only: the CV content is fully readable without JavaScript. */
(function () {
  "use strict";

  var doc = document;
  var root = doc.documentElement;
  var body = doc.body;

  var motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");

  /* ---------------------------------------------------------------- Reveals */

  var revealTargets = Array.prototype.slice.call(doc.querySelectorAll("[data-reveal]"));

  function revealAll() {
    revealTargets.forEach(function (el) { el.classList.add("is-visible"); });
  }

  function initReveals() {
    if (motionQuery.matches || !("IntersectionObserver" in window)) {
      revealAll();
      return;
    }

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.08 });

    revealTargets.forEach(function (el) { observer.observe(el); });

    // Safety net: anything already inside the first viewport is revealed once loaded.
    window.addEventListener("load", function () {
      window.setTimeout(function () {
        revealTargets.forEach(function (el) {
          if (el.classList.contains("is-visible")) { return; }
          var rect = el.getBoundingClientRect();
          if (rect.top < window.innerHeight * 0.95) { el.classList.add("is-visible"); }
        });
      }, 250);
    });
  }

  /* ----------------------------------------------------------------- Header */

  var header = doc.getElementById("site-header");

  /* ------------------------------------------------------- Language selector */

  var i18n = window.SITE_I18N || null;
  var DEFAULT_LOCALE = i18n && i18n.defaultLocale ? i18n.defaultLocale : "en";
  var currentLocale = DEFAULT_LOCALE;

  var langToggle = doc.getElementById("lang-toggle");
  var langMenu = doc.getElementById("lang-menu");
  var langOptions = langMenu ? Array.prototype.slice.call(langMenu.querySelectorAll("[data-locale]")) : [];

  function dictFor(locale) {
    return i18n && i18n.strings[locale] ? i18n.strings[locale] : null;
  }

  function tr(locale, key) {
    var pack = dictFor(locale);
    var value = pack ? pack[key] : undefined;
    if (value === undefined) {
      var fallback = dictFor(DEFAULT_LOCALE);
      value = fallback ? fallback[key] : undefined;
    }
    return value;
  }

  function isSupportedLocale(locale) {
    return !!i18n && !!locale && i18n.supported.indexOf(locale) !== -1;
  }

  function localeMeta(locale) {
    if (i18n && i18n.locales && i18n.locales[locale]) { return i18n.locales[locale]; }
    return { endonym: "English", htmlLang: "en", flag: "gb" };
  }

  /* Persist only an explicit choice; a browser-detected default is never
     written to storage, so a changed system language takes effect next visit. */
  function readStoredLocale() {
    try {
      var stored = window.localStorage.getItem(i18n.storageKey);
      return isSupportedLocale(stored) ? stored : null;
    } catch (error) {
      return null;
    }
  }

  function writeStoredLocale(locale) {
    try {
      window.localStorage.setItem(i18n.storageKey, locale);
    } catch (error) {
      /* localStorage unavailable (private mode, blocked storage): ignore. */
    }
  }

  /* Initial default from the browser: the first supported match in
     navigator.languages (falling back to navigator.language), else null.
     Case and separators are normalised; Norwegian no/nn map to nb. */
  var BROWSER_LOCALE_ALIASES = { no: "nb", nn: "nb" };

  function normalizePrimaryTag(value) {
    if (typeof value !== "string") { return null; }
    var tag = value.trim().toLowerCase().replace(/_/g, "-");
    if (!tag) { return null; }
    var primary = tag.split("-")[0];
    return /^[a-z]{2,3}$/.test(primary) ? primary : null;
  }

  function browserLocaleCandidate(value) {
    var primary = normalizePrimaryTag(value);
    if (!primary) { return null; }
    if (isSupportedLocale(primary)) { return primary; }
    var alias = BROWSER_LOCALE_ALIASES[primary];
    return alias && isSupportedLocale(alias) ? alias : null;
  }

  function detectBrowserLocale() {
    var nav = window.navigator || {};
    var requested = [];
    if (nav.languages && typeof nav.languages.length === "number" && nav.languages.length) {
      requested = Array.prototype.slice.call(nav.languages);
    }
    if (!requested.length && typeof nav.language === "string") { requested = [nav.language]; }
    for (var i = 0; i < requested.length; i++) {
      var candidate = browserLocaleCandidate(requested[i]);
      if (candidate) { return candidate; }
    }
    return null;
  }

  function setMeta(attr, name, value) {
    if (!value) { return; }
    var el = doc.querySelector("meta[" + attr + '="' + name + '"]');
    if (el) { el.setAttribute("content", value); }
  }

  function updateLangUI() {
    var meta = localeMeta(currentLocale);
    if (langToggle) {
      var selectLabel = tr(currentLocale, "lang.select") || "Language";
      langToggle.setAttribute("aria-label", selectLabel + ": " + meta.endonym);
      var flag = langToggle.querySelector(".lang__flag");
      if (flag) { flag.setAttribute("src", "assets/flags/" + meta.flag + ".svg"); }
      var nameEl = langToggle.querySelector(".lang__name");
      if (nameEl) { nameEl.textContent = meta.endonym; }
    }
    langOptions.forEach(function (option) {
      option.setAttribute("aria-selected",
        option.getAttribute("data-locale") === currentLocale ? "true" : "false");
    });
  }

  function syncNavToggleLabel() {
    if (!toggle) { return; }
    var label = tr(currentLocale, panelIsOpen() ? "nav.toggleClose" : "nav.toggleOpen");
    if (label) { toggle.setAttribute("aria-label", label); }
  }

  /* Applies only values coming from the local dictionary — never from URLs or
     storage, so there is no injection surface. */
  function applyLocale(locale) {
    if (!i18n) { return; }
    if (!isSupportedLocale(locale)) { locale = DEFAULT_LOCALE; }

    Array.prototype.slice.call(doc.querySelectorAll("[data-i18n]")).forEach(function (el) {
      var value = tr(locale, el.getAttribute("data-i18n"));
      if (value !== undefined) { el.textContent = value; }
    });
    Array.prototype.slice.call(doc.querySelectorAll("[data-i18n-html]")).forEach(function (el) {
      var value = tr(locale, el.getAttribute("data-i18n-html"));
      if (value !== undefined) { el.innerHTML = value; }
    });
    Array.prototype.slice.call(doc.querySelectorAll("[data-i18n-aria-label]")).forEach(function (el) {
      var value = tr(locale, el.getAttribute("data-i18n-aria-label"));
      if (value !== undefined) { el.setAttribute("aria-label", value); }
    });
    Array.prototype.slice.call(doc.querySelectorAll("[data-i18n-alt]")).forEach(function (el) {
      var value = tr(locale, el.getAttribute("data-i18n-alt"));
      if (value !== undefined) { el.setAttribute("alt", value); }
    });

    currentLocale = locale;
    root.setAttribute("lang", localeMeta(locale).htmlLang);
    doc.title = tr(locale, "meta.title") || doc.title;
    setMeta("name", "description", tr(locale, "meta.description"));
    setMeta("property", "og:locale", tr(locale, "meta.ogLocale"));
    setMeta("property", "og:title", tr(locale, "meta.ogTitle"));
    setMeta("property", "og:description", tr(locale, "meta.ogDescription"));

    updateLangUI();
    syncNavToggleLabel();
  }

  function langOpen() {
    return !!langMenu && langMenu.classList.contains("is-open");
  }

  function openLangMenu() {
    if (!langMenu || !langToggle || langOpen()) { return; }
    if (panelIsOpen()) { closeNav(false); }
    langMenu.classList.add("is-open");
    langToggle.setAttribute("aria-expanded", "true");
    var selected = langOptions.filter(function (option) {
      return option.getAttribute("data-locale") === currentLocale;
    })[0] || langOptions[0];
    window.requestAnimationFrame(function () {
      if (langOpen() && selected) { selected.focus(); }
    });
  }

  function closeLangMenu(restoreFocus) {
    if (!langOpen()) { return; }
    langMenu.classList.remove("is-open");
    if (langToggle) {
      langToggle.setAttribute("aria-expanded", "false");
      if (restoreFocus) { langToggle.focus(); }
    }
  }

  function selectLocale(locale) {
    if (!isSupportedLocale(locale)) { return; }
    writeStoredLocale(locale);
    applyLocale(locale);
    closeLangMenu(false);
    if (langToggle) { langToggle.focus(); }
  }

  function moveLangFocus(from, delta) {
    var index = langOptions.indexOf(from);
    if (index === -1) { index = 0; }
    var next = (index + delta + langOptions.length) % langOptions.length;
    langOptions[next].focus();
  }

  function initLang() {
    if (!langToggle || !langMenu || !langOptions.length) { return; }

    langToggle.addEventListener("click", function () {
      if (langOpen()) { closeLangMenu(false); } else { openLangMenu(); }
    });
    langToggle.addEventListener("keydown", function (event) {
      if (event.key === "ArrowDown" || event.key === "ArrowUp") {
        event.preventDefault();
        openLangMenu();
      }
    });

    langOptions.forEach(function (option) {
      option.addEventListener("click", function () {
        selectLocale(option.getAttribute("data-locale"));
      });
    });

    langMenu.addEventListener("keydown", function (event) {
      if (event.key === "ArrowDown") { event.preventDefault(); moveLangFocus(doc.activeElement, 1); }
      else if (event.key === "ArrowUp") { event.preventDefault(); moveLangFocus(doc.activeElement, -1); }
      else if (event.key === "Home") { event.preventDefault(); langOptions[0].focus(); }
      else if (event.key === "End") { event.preventDefault(); langOptions[langOptions.length - 1].focus(); }
    });

    doc.addEventListener("click", function (event) {
      if (!langOpen()) { return; }
      if (langMenu.contains(event.target) || langToggle.contains(event.target)) { return; }
      closeLangMenu(false);
    });
  }

  /* ------------------------------------------------------- Mobile navigation */

  var toggle = doc.getElementById("nav-toggle");
  var nav = doc.getElementById("site-nav");
  var navLinks = nav ? Array.prototype.slice.call(nav.querySelectorAll('a[href^="#"]')) : [];
  var mobileQuery = window.matchMedia("(max-width: 980px)");

  function panelIsOpen() {
    return nav && nav.classList.contains("is-open");
  }

  function closeNav(restoreFocus) {
    if (!panelIsOpen()) { return; }
    nav.classList.remove("is-open");
    body.classList.remove("nav-open");
    if (toggle) {
      toggle.setAttribute("aria-expanded", "false");
      syncNavToggleLabel();
      if (restoreFocus) { toggle.focus(); }
    }
  }

  function openNav() {
    if (!nav || !toggle || panelIsOpen()) { return; }
    closeLangMenu(false);
    nav.classList.add("is-open");
    body.classList.add("nav-open");
    toggle.setAttribute("aria-expanded", "true");
    syncNavToggleLabel();
    var first = nav.querySelector("a");
    if (first) {
      window.requestAnimationFrame(function () {
        if (panelIsOpen()) { first.focus(); }
      });
    }
  }

  function initNav() {
    if (!toggle || !nav) { return; }

    toggle.addEventListener("click", function () {
      if (panelIsOpen()) { closeNav(false); } else { openNav(); }
    });

    doc.addEventListener("keydown", function (event) {
      if (event.key !== "Escape") { return; }
      if (langOpen()) { closeLangMenu(true); return; }
      if (panelIsOpen()) { closeNav(true); }
    });

    nav.addEventListener("click", function (event) {
      var link = event.target.closest ? event.target.closest("a") : null;
      if (link) { closeNav(false); }
    });

    doc.addEventListener("click", function (event) {
      if (!panelIsOpen() || !mobileQuery.matches) { return; }
      if (nav.contains(event.target) || toggle.contains(event.target)) { return; }
      closeNav(false);
    });

    var handleViewportChange = function () { closeNav(false); };
    if (mobileQuery.addEventListener) {
      mobileQuery.addEventListener("change", handleViewportChange);
    } else if (mobileQuery.addListener) {
      mobileQuery.addListener(handleViewportChange);
    }
  }

  function onScroll() {
    if (header) {
      header.classList.toggle("is-scrolled", window.scrollY > 8);
    }
    updateCurrentLink();
  }

  /* -------------------------------------------------------------- Scroll spy */

  var tracked = navLinks
    .map(function (link) {
      var id = link.getAttribute("href").slice(1);
      var section = doc.getElementById(id);
      return section ? { link: link, section: section } : null;
    })
    .filter(Boolean);

  var currentLink = null;

  function setCurrent(link) {
    if (link === currentLink) { return; }
    if (currentLink) { currentLink.removeAttribute("aria-current"); }
    currentLink = link;
    if (currentLink) { currentLink.setAttribute("aria-current", "location"); }
  }

  function updateCurrentLink() {
    if (!tracked.length) { return; }
    if (window.scrollY + window.innerHeight >= doc.documentElement.scrollHeight - 4) {
      setCurrent(tracked[tracked.length - 1].link);
      return;
    }
    var marker = window.scrollY + (header ? header.offsetHeight : 0) + window.innerHeight * 0.28;
    var match = tracked[0].link;
    tracked.forEach(function (item) {
      if (item.section.offsetTop <= marker) { match = item.link; }
    });
    setCurrent(match);
  }

  /* ------------------------------------------------------------------- Boot */

  var ticking = false;
  window.addEventListener("scroll", function () {
    if (ticking) { return; }
    ticking = true;
    window.requestAnimationFrame(function () {
      ticking = false;
      onScroll();
    });
  }, { passive: true });

  window.addEventListener("resize", function () {
    if (!mobileQuery.matches) { closeNav(false); }
  });

  var year = doc.getElementById("year");
  if (year) { year.textContent = String(new Date().getFullYear()); }

  initLang();
  applyLocale(readStoredLocale() || detectBrowserLocale() || DEFAULT_LOCALE);
  initNav();
  initReveals();
  onScroll();
  if (root.classList.contains("no-js")) { root.classList.remove("no-js"); }
})();
