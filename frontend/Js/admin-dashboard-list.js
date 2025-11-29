document.addEventListener("DOMContentLoaded", () => {

  const tbody = document.querySelector(".datatable .tbody");
  const datatable = document.querySelector(".datatable");
  const tableEl = document.querySelector(".datatable .table");
  const newLessonBtn = document.querySelector(".frame-28");

  const pageIndicatorEl = document.querySelector(".table-footer .one"); 
  const pageInfoEl = document.querySelector(".table-footer ._1-10-of-14");
  const pageSelectContainer = document.querySelector(".table-footer .select");
  const prevBtn = document.querySelector(".table-footer .frame-2");
  const nextBtn = document.querySelector(".table-footer .frame-1");
  const footer = document.querySelector(".table-footer");

  const logoutIcon = document.querySelector(".solar-logout-outline");
  const searchContainer = document.querySelector(".th4");
  const bellBadge = document.querySelector(".badge-with-notification ._12");
  const bellWrapper = document.querySelector(".badge-with-notification");

  const PAGE_SIZE = 5;
  let currentPage = 1;
  let pageDropdown = null; 
  let globalOverlay = null;

  function createGlobalOverlay() {
    if (globalOverlay) return globalOverlay;

    const overlay = document.createElement("div");
    overlay.className = "global-error-overlay";
    Object.assign(overlay.style, {
      position: "fixed",
      inset: "0",
      background: "rgba(0,0,0,0.45)",
      display: "none",
      alignItems: "center",
      justifyContent: "center",
      zIndex: "9999",
    });

    const box = document.createElement("div");
    box.className = "global-error-box";
    Object.assign(box.style, {
      background: "#ffffff",
      borderRadius: "16px",
      padding: "20px 24px",
      maxWidth: "380px",
      width: "90%",
      boxShadow: "0 10px 35px rgba(0,0,0,0.25)",
      textAlign: "center",
      direction: "rtl",
      fontFamily: "inherit",
    });

    const title = document.createElement("div");
    title.textContent = "پیام سیستم";
    Object.assign(title.style, {
      fontSize: "16px",
      fontWeight: "600",
      marginBottom: "8px",
      color: "#b00020",
    });

    const msgEl = document.createElement("div");
    msgEl.className = "global-error-message";
    Object.assign(msgEl.style, {
      fontSize: "13px",
      color: "#333",
      marginBottom: "16px",
      lineHeight: "1.6",
      whiteSpace: "pre-line",
    });

    const btn = document.createElement("button");
    btn.textContent = "باشه";
    Object.assign(btn.style, {
      border: "none",
      borderRadius: "999px",
      padding: "8px 18px",
      background: "#3b175c",
      color: "#ffffff",
      cursor: "pointer",
      fontSize: "13px",
    });

    btn.addEventListener("click", () => {
      overlay.style.display = "none";
    });

    box.appendChild(title);
    box.appendChild(msgEl);
    box.appendChild(btn);
    overlay.appendChild(box);
    document.body.appendChild(overlay);

    globalOverlay = overlay;
    return overlay;
  }

  
let confirmOverlay = null;
let confirmTitleEl = null;
let confirmMsgEl = null;
let confirmYesBtn = null;
let confirmNoBtn = null;