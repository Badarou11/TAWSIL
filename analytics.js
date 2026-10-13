/**
 * TAWSIL - ANALYTICS & CONSENTEMENT RGPD
 * Google Analytics 4 (visites, sources, pays, appareils, événements)
 * Microsoft Clarity (heatmaps + enregistrements de sessions)
 * Aucun script de tracking n'est chargé avant le consentement de l'utilisateur.
 */

// ⚠️ Remplacez ces identifiants par les vôtres
const ANALYTICS_CONFIG = {
  ga4Id: "G-TR6DW97N1W",      // Google Analytics 4 > Admin > Flux de données > ID de mesure
  clarityId: "XXXXXXXXXX",    // clarity.microsoft.com > Settings > Overview > Project ID
  consentKey: "tawsil_consent_v1"
};

const isConfigured = (id) => id && !/X{6,}/.test(id);

// ---------- Google Consent Mode v2 (défaut : refusé) ----------
window.dataLayer = window.dataLayer || [];
function gtag() { window.dataLayer.push(arguments); }
gtag("consent", "default", {
  ad_storage: "denied",
  ad_user_data: "denied",
  ad_personalization: "denied",
  analytics_storage: "denied"
});

function loadGA4() {
  if (!isConfigured(ANALYTICS_CONFIG.ga4Id) || window.__ga4Loaded) return;
  window.__ga4Loaded = true;
  const s = document.createElement("script");
  s.async = true;
  s.src = `https://www.googletagmanager.com/gtag/js?id=${ANALYTICS_CONFIG.ga4Id}`;
  document.head.appendChild(s);
  gtag("js", new Date());
  gtag("config", ANALYTICS_CONFIG.ga4Id, { anonymize_ip: true });
}

function loadClarity() {
  if (!isConfigured(ANALYTICS_CONFIG.clarityId) || window.__clarityLoaded) return;
  window.__clarityLoaded = true;
  (function (c, l, a, r, i, t, y) {
    c[a] = c[a] || function () { (c[a].q = c[a].q || []).push(arguments); };
    t = l.createElement(r); t.async = 1; t.src = "https://www.clarity.ms/tag/" + i;
    y = l.getElementsByTagName(r)[0]; y.parentNode.insertBefore(t, y);
  })(window, document, "clarity", "script", ANALYTICS_CONFIG.clarityId);
  window.clarity("consent");
}

function grantConsent() {
  gtag("consent", "update", { analytics_storage: "granted" });
  loadGA4();
  loadClarity();
}

// ---------- Suivi des événements ----------
function trackEvent(name, params = {}) {
  if (localStorage.getItem(ANALYTICS_CONFIG.consentKey) !== "granted") return;
  gtag("event", name, params);
  if (window.clarity) window.clarity("event", name);
}
window.trackEvent = trackEvent;

function initEventTracking() {
  // Clics WhatsApp (conversion principale)
  document.querySelectorAll(".js-whatsapp-btn").forEach((btn, i) => {
    btn.addEventListener("click", () => {
      trackEvent("whatsapp_click", {
        button_id: btn.id || `whatsapp-btn-${i}`,
        button_text: btn.innerText.trim().slice(0, 60)
      });
    });
  });

  // Copie du numéro
  const copyBtn = document.getElementById("js-copy-number");
  if (copyBtn) copyBtn.addEventListener("click", () => trackEvent("copy_phone_number"));

  // Navigation
  document.querySelectorAll(".nav-link, .mobile-nav-link, .footer-links a[href^='#']").forEach(link => {
    link.addEventListener("click", () => trackEvent("nav_click", { target: link.getAttribute("href") }));
  });

  // FAQ ouverte
  document.querySelectorAll(".faq-question").forEach(q => {
    q.addEventListener("click", () => trackEvent("faq_open", { question: q.innerText.trim().slice(0, 80) }));
  });

  // Sections vues (une seule fois chacune)
  const seen = new Set();
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting && !seen.has(e.target.id)) {
        seen.add(e.target.id);
        trackEvent("section_view", { section: e.target.id });
      }
    });
  }, { threshold: 0.4 });
  document.querySelectorAll("section[id]").forEach(s => obs.observe(s));
}

// ---------- Bannière cookies ----------
function initConsentBanner() {
  const choice = localStorage.getItem(ANALYTICS_CONFIG.consentKey);
  if (choice === "granted") { grantConsent(); return; }
  if (choice === "denied") return;

  const banner = document.createElement("div");
  banner.className = "cookie-banner";
  banner.id = "cookie-banner";
  banner.setAttribute("role", "dialog");
  banner.setAttribute("aria-label", "Consentement aux cookies");
  banner.innerHTML = `
    <div class="cookie-banner-text">
      <strong>🍪 Votre vie privée compte</strong>
      <p>Nous utilisons des cookies de mesure d'audience pour comprendre comment notre site est utilisé et l'améliorer. Aucune donnée n'est revendue.</p>
    </div>
    <div class="cookie-banner-actions">
      <button class="btn btn-secondary" id="cookie-refuse">Refuser</button>
      <button class="btn btn-whatsapp" id="cookie-accept">Accepter</button>
    </div>`;
  document.body.appendChild(banner);
  requestAnimationFrame(() => banner.classList.add("visible"));

  const close = () => { banner.classList.remove("visible"); setTimeout(() => banner.remove(), 400); };
  banner.querySelector("#cookie-accept").addEventListener("click", () => {
    localStorage.setItem(ANALYTICS_CONFIG.consentKey, "granted");
    grantConsent();
    close();
  });
  banner.querySelector("#cookie-refuse").addEventListener("click", () => {
    localStorage.setItem(ANALYTICS_CONFIG.consentKey, "denied");
    close();
  });
}

document.addEventListener("DOMContentLoaded", () => {
  initConsentBanner();
  initEventTracking();
});
