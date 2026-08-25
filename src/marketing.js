/**
 * Marketing page behaviour: smooth in-page navigation and a small counter
 * animation on the metric row. Deliberately dependency-free.
 */

for (const link of document.querySelectorAll('a[href^="#"]')) {
  link.addEventListener("click", (event) => {
    const id = link.getAttribute("href");
    if (!id || id === "#") return;
    const target = document.querySelector(id);
    if (!target) return;
    event.preventDefault();
    target.scrollIntoView({ behavior: "smooth", block: "start" });
    history.replaceState(null, "", id);
  });
}

const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
if (!reduced) {
  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        entry.target.animate(
          [
            { opacity: 0, transform: "translateY(8px)" },
            { opacity: 1, transform: "none" },
          ],
          { duration: 320, easing: "cubic-bezier(0.2, 0, 0, 1)", fill: "both" },
        );
        observer.unobserve(entry.target);
      }
    },
    { rootMargin: "-10% 0px" },
  );
  for (const card of document.querySelectorAll(".metric, .feature")) observer.observe(card);
}
