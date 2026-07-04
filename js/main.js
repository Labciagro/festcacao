// Festival de Cacao y Chocolate de Especialidad de Costa Rica
// Comportamiento mínimo: menú móvil, aparición al hacer scroll, envío del formulario.

// ── Menú móvil ──────────────────────────────────────────────
const toggle = document.querySelector(".nav-toggle");
const nav = document.querySelector(".site-nav");

if (toggle && nav) {
  toggle.addEventListener("click", () => {
    const open = nav.classList.toggle("open");
    toggle.setAttribute("aria-expanded", String(open));
  });
  // Cierra el menú al elegir un enlace
  nav.addEventListener("click", (e) => {
    if (e.target.matches("a")) {
      nav.classList.remove("open");
      toggle.setAttribute("aria-expanded", "false");
    }
  });
}

// ── Aparición suave al hacer scroll ─────────────────────────
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const revealables = document.querySelectorAll(".reveal");

if (reduceMotion || !("IntersectionObserver" in window)) {
  revealables.forEach((el) => el.classList.add("in"));
} else {
  const io = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          entry.target.classList.add("in");
          io.unobserve(entry.target);
        }
      }
    },
    { threshold: 0.15 }
  );
  revealables.forEach((el) => io.observe(el));
}

// ── Formulario de registro ──────────────────────────────────
// Envía a Formspree (u otro endpoint definido en action=) sin salir de la página.
// Si el endpoint aún no está configurado, muestra un aviso claro.
const form = document.querySelector(".reg-form");

if (form) {
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const status = form.querySelector(".form-status");
    const button = form.querySelector('button[type="submit"]');

    if (form.action.includes("SU_CODIGO")) {
      status.textContent =
        "El formulario aún no está conectado. Configure el endpoint de Formspree o el enlace al Google Form (vea el README).";
      return;
    }

    button.disabled = true;
    status.textContent = "Enviando…";

    try {
      const res = await fetch(form.action, {
        method: "POST",
        body: new FormData(form),
        headers: { Accept: "application/json" },
      });
      if (res.ok) {
        form.reset();
        status.textContent = "¡Registro recibido! Le escribiremos al correo indicado.";
      } else {
        status.textContent = "No se pudo enviar el registro. Intente de nuevo en unos minutos.";
      }
    } catch {
      status.textContent = "Sin conexión. Revise su internet e intente de nuevo.";
    } finally {
      button.disabled = false;
    }
  });
}