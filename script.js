const menuButton = document.querySelector("[data-menu-button]");
const navigation = document.querySelector("[data-navigation]");

const closeMenu = () => {
  if (!menuButton || !navigation) return;
  const shouldRestoreFocus = navigation.classList.contains("is-open") && navigation.contains(document.activeElement);
  menuButton.setAttribute("aria-expanded", "false");
  menuButton.setAttribute("aria-label", "Open navigation");
  navigation.classList.remove("is-open");
  if (shouldRestoreFocus) menuButton.focus({ preventScroll: true });
};

if (menuButton && navigation) {
  menuButton.addEventListener("click", () => {
    const isOpen = menuButton.getAttribute("aria-expanded") === "true";
    menuButton.setAttribute("aria-expanded", String(!isOpen));
    menuButton.setAttribute("aria-label", isOpen ? "Open navigation" : "Close navigation");
    navigation.classList.toggle("is-open", !isOpen);
  });

  navigation.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", closeMenu);
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeMenu();
  });

  window.matchMedia("(max-width: 800px)").addEventListener("change", closeMenu);
}

const traceButton = document.querySelector("[data-trace-button]");
const traceSteps = [...document.querySelectorAll("[data-trace-step]")];
const traceLive = document.querySelector("[data-trace-live]");
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
let traceTimers = [];
const traceDefaults = ["Ready", "Waiting", "Waiting", "Waiting"];
const traceProgress = ["Observed", "Selected", "Executed", "Verified"];

const clearTrace = () => {
  traceTimers.forEach(window.clearTimeout);
  traceTimers = [];
  traceSteps.forEach((step, index) => {
    step.classList.remove("is-active");
    const status = step.querySelector(".trace-status");
    if (status) status.textContent = traceDefaults[index] || "Waiting";
  });
  if (traceLive) traceLive.textContent = "Ready";
};

const runTrace = () => {
  if (!traceButton) return;
  clearTrace();
  traceButton.setAttribute("aria-pressed", "true");
  const interval = reducedMotion.matches ? 0 : 420;

  traceSteps.forEach((step, index) => {
    traceTimers.push(
      window.setTimeout(() => {
        step.classList.add("is-active");
        const status = step.querySelector(".trace-status");
        if (status) status.textContent = traceProgress[index] || "Verified";
        if (traceLive) traceLive.textContent = traceProgress[index] || "Verified";
      }, interval * index),
    );
  });

  const completionDelay = interval * Math.max(traceSteps.length - 1, 0) + (reducedMotion.matches ? 0 : 300);

  traceTimers.push(
    window.setTimeout(
      () => {
        traceButton.setAttribute("aria-pressed", "false");
        if (traceLive) traceLive.textContent = "Trace complete";
      },
      completionDelay,
    ),
  );

  traceTimers.push(
    window.setTimeout(clearTrace, completionDelay + (reducedMotion.matches ? 900 : 1200)),
  );
};

if (traceButton && traceSteps.length) {
  traceButton.addEventListener("click", runTrace);
}

const experienceDetails = document.querySelector("[data-experience-details]");
const compactExperience = window.matchMedia("(max-width: 800px)");

const syncExperience = () => {
  if (!experienceDetails) return;
  if (compactExperience.matches) {
    if (!experienceDetails.dataset.compactInitialized) {
      experienceDetails.removeAttribute("open");
      experienceDetails.dataset.compactInitialized = "true";
    }
  } else {
    experienceDetails.setAttribute("open", "");
    delete experienceDetails.dataset.compactInitialized;
  }
};

if (experienceDetails) {
  const summary = experienceDetails.querySelector("summary");
  summary?.addEventListener("click", (event) => {
    if (!compactExperience.matches) event.preventDefault();
  });
  compactExperience.addEventListener("change", syncExperience);
  syncExperience();
}

const navigationLinks = [...document.querySelectorAll('.site-navigation a[href^="#"]')];
const observedSections = navigationLinks
  .map((link) => document.querySelector(link.getAttribute("href")))
  .filter(Boolean);

if ("IntersectionObserver" in window && observedSections.length) {
  const sectionObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        navigationLinks.forEach((link) => {
          link.classList.toggle("is-current", link.getAttribute("href") === `#${entry.target.id}`);
        });
      });
    },
    { rootMargin: "-20% 0px -70% 0px" },
  );

  observedSections.forEach((section) => sectionObserver.observe(section));
}
