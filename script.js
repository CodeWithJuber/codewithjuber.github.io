const menuButton = document.querySelector("[data-menu-button]");
const navigation = document.querySelector("[data-navigation]");

const closeMenu = () => {
  if (!menuButton || !navigation) return;
  menuButton.setAttribute("aria-expanded", "false");
  menuButton.setAttribute("aria-label", "Open navigation");
  navigation.classList.remove("is-open");
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
}

const traceButton = document.querySelector("[data-trace-button]");
const traceSteps = [...document.querySelectorAll("[data-trace-step]")];
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
let traceTimers = [];

const clearTrace = () => {
  traceTimers.forEach(window.clearTimeout);
  traceTimers = [];
  traceSteps.forEach((step) => step.classList.remove("is-active"));
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
      }, interval * index),
    );
  });

  traceTimers.push(
    window.setTimeout(
      () => traceButton.setAttribute("aria-pressed", "false"),
      interval * Math.max(traceSteps.length - 1, 0) + (reducedMotion.matches ? 0 : 300),
    ),
  );
};

if (traceButton && traceSteps.length) {
  traceButton.addEventListener("click", runTrace);
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
