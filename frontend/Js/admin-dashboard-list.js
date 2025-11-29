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

function createConfirmOverlay() {
  if (confirmOverlay) return confirmOverlay;

  const overlay = document.createElement("div");
  Object.assign(overlay.style, {
    position: "fixed",
    inset: "0",
    background: "rgba(15, 23, 42, 0.55)", 
    display: "none",
    alignItems: "center",
    justifyContent: "center",
    zIndex: "10000",
  });

  const box = document.createElement("div");
  Object.assign(box.style, {
    background: "#ffffff",
    borderRadius: "20px",
    padding: "22px 24px 18px 24px",
    maxWidth: "380px",
    width: "90%",
    boxShadow: "0 18px 45px rgba(15,23,42,0.35)",
    direction: "rtl",
    fontFamily: "inherit",
    position: "relative",
  });


  const iconWrap = document.createElement("div");
  Object.assign(iconWrap.style, {
    width: "42px",
    height: "42px",
    borderRadius: "999px",
    background: "rgba(239, 68, 68, 0.08)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: "12px",
  });

  const iconInner = document.createElement("div");
  iconInner.textContent = "!";
  Object.assign(iconInner.style, {
    width: "24px",
    height: "24px",
    borderRadius: "999px",
    background: "#ef4444",
    color: "#ffffff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: "700",
    fontSize: "16px",
  });

  iconWrap.appendChild(iconInner);

  
  const titleEl = document.createElement("div");
  Object.assign(titleEl.style, {
    fontSize: "15px",
    fontWeight: "600",
    color: "#0f172a",
    marginBottom: "4px",
  });
  titleEl.textContent = "خروج از حساب";


  const msgEl = document.createElement("div");
  Object.assign(msgEl.style, {
    fontSize: "13px",
    color: "#4b5563",
    marginBottom: "16px",
    lineHeight: "1.7",
  });
  msgEl.textContent = "آیا مطمئن هستید که می‌خواهید از حساب خود خارج شوید؟";

  const btnRow = document.createElement("div");
  Object.assign(btnRow.style, {
    display: "flex",
    flexDirection: "row-reverse",
    gap: "8px",
    marginTop: "4px",
  });

  const yesBtn = document.createElement("button");
  yesBtn.textContent = "خروج";
  Object.assign(yesBtn.style, {
    border: "none",
    borderRadius: "999px",
    padding: "8px 18px",
    background: "linear-gradient(135deg, #ef4444, #b91c1c)",
    color: "#ffffff",
    cursor: "pointer",
    fontSize: "13px",
    fontWeight: "500",
    boxShadow: "0 8px 20px rgba(185,28,28,0.35)",
  });

  const noBtn = document.createElement("button");
  noBtn.textContent = "انصراف";
  Object.assign(noBtn.style, {
    border: "1px solid #e5e7eb",
    borderRadius: "999px",
    padding: "8px 16px",
    background: "#ffffff",
    color: "#374151",
    cursor: "pointer",
    fontSize: "13px",
  });

  btnRow.appendChild(yesBtn);
  btnRow.appendChild(noBtn);

  box.appendChild(iconWrap);
  box.appendChild(titleEl);
  box.appendChild(msgEl);
  box.appendChild(btnRow);
  overlay.appendChild(box);
  document.body.appendChild(overlay);

  confirmOverlay = overlay;
  confirmTitleEl = titleEl;
  confirmMsgEl = msgEl;
  confirmYesBtn = yesBtn;
  confirmNoBtn = noBtn;

  overlay.addEventListener("click", (e) => {
    if (e.target === overlay) {
      overlay.style.display = "none";
    }
  });

  return overlay;
}
function showConfirmDialog({ title, message, confirmText, cancelText, onConfirm }) {
  const overlay = createConfirmOverlay();

  if (confirmTitleEl && title) confirmTitleEl.textContent = title;
  if (confirmMsgEl && message) confirmMsgEl.textContent = message;
  if (confirmYesBtn && confirmText) confirmYesBtn.textContent = confirmText;
  if (confirmNoBtn && cancelText) confirmNoBtn.textContent = cancelText;

  // پاک کردن لیسنر قبلی دکمه‌ها
  const newYesBtn = confirmYesBtn.cloneNode(true);
  const newNoBtn = confirmNoBtn.cloneNode(true);

  confirmYesBtn.parentNode.replaceChild(newYesBtn, confirmYesBtn);
  confirmNoBtn.parentNode.replaceChild(newNoBtn, confirmNoBtn);

  confirmYesBtn = newYesBtn;
  confirmNoBtn = newNoBtn;

  confirmYesBtn.addEventListener("click", () => {
    overlay.style.display = "none";
    if (typeof onConfirm === "function") onConfirm();
  });

  confirmNoBtn.addEventListener("click", () => {
    overlay.style.display = "none";
  });

  overlay.style.display = "flex";
}
function showGlobalError(message) {
    const overlay = createGlobalOverlay();
    const msgEl = overlay.querySelector(".global-error-message");
    if (msgEl) msgEl.textContent = message;
    overlay.style.display = "flex";
  }

  const defaultLessons = [
    {
      id: 1,
      name: "ریاضی 1",
      code: "45789",
      capacity: 30,
      units: 3,
      teacher: "فاطمه فتاحی",
      location: "مهندسی - کلاس 200",
      schedule: "شنبه 16-14\nدوشنبه 16-14",
    },
    {
      id: 2,
      name: "برنامه‌نویسی پیشرفته",
      code: "45800",
      capacity: 40,
      units: 3,
      teacher: "علی حسینی",
      location: "مهندسی - کلاس 305",
      schedule: "یکشنبه 10-8\nسه‌شنبه 10-8",
    },
    {
      id: 3,
      name: "ساختمان داده‌ها",
      code: "46012",
      capacity: 35,
      units: 3,
      teacher: "مریم نادری",
      location: "مهندسی - کلاس 150",
      schedule: "شنبه 12-10\nسه‌شنبه 12-10",
    },
    {
      id: 4,
      name: "پایگاه داده‌ها",
      code: "46200",
      capacity: 30,
      units: 3,
      teacher: "سینا کریمی",
      location: "مهندسی - کلاس 210",
      schedule: "دوشنبه 12-10\nچهارشنبه 12-10",
    },
    {
      id: 5,
      name: "سیستم‌عامل",
      code: "46510",
      capacity: 25,
      units: 3,
      teacher: "نرگس آقایی",
      location: "مهندسی - کلاس 120",
      schedule: "یکشنبه 14-12\nسه‌شنبه 14-12",
    },
    {
      id: 6,
      name: "مدار منطقی",
      code: "45220",
      capacity: 28,
      units: 3,
      teacher: "مهدی مرادی",
      location: "مهندسی - کلاس 220",
      schedule: "شنبه 10-8\nدوشنبه 10-8",
    },
  ];

  function loadLessons() {
    try {
      const raw = localStorage.getItem("sabau-lessons");
      if (!raw) return [...defaultLessons];
      const parsed = JSON.parse(raw);
      if (!Array.isArray(parsed) || parsed.length === 0) return [...defaultLessons];
      return parsed;
    } catch (e) {
      console.error("Error reading lessons:", e);
      showGlobalError("خطا در خواندن اطلاعات دروس. لطفاً صفحه را مجدداً باز کنید.");
      return [...defaultLessons];
    }
  }

  function saveLessons() {
    localStorage.setItem("sabau-lessons", JSON.stringify(lessons));
  }

  let lessons = loadLessons();
  let filteredLessons = [...lessons];

  function getTotalPages() {
    if (!filteredLessons.length) return 1;
    return Math.max(1, Math.ceil(filteredLessons.length / PAGE_SIZE));
  }

  function paginate(list, page, size) {
    const start = (page - 1) * size;
    return list.slice(start, start + size);
  }

  function updatePageIndicator() {
    if (pageIndicatorEl) {
      pageIndicatorEl.textContent = String(currentPage);
    }
  }

  function updatePageInfo() {
    if (!pageInfoEl) return;

    const total = filteredLessons.length;
    if (total === 0) {
      pageInfoEl.textContent = "0 of 0";
      return;
    }

    const totalPages = getTotalPages();
    if (currentPage > totalPages) currentPage = totalPages;

    const startIndex = (currentPage - 1) * PAGE_SIZE + 1;
    const endIndex = Math.min(currentPage * PAGE_SIZE, total);

    pageInfoEl.textContent = `${startIndex} - ${endIndex} of ${total}`;
  }

  function createPageDropdown() {
    if (pageDropdown) return pageDropdown;

    const dropdown = document.createElement("div");
    dropdown.className = "page-dropdown";

    Object.assign(dropdown.style, {
      position: "absolute",
      background: "#ffffff",
      borderRadius: "8px",
      boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
      minWidth: "90px",
      zIndex: "9999",
      padding: "4px 0",
      direction: "rtl",
      display: "none",
      fontFamily: "inherit",
      fontSize: "13px",
    });

    document.body.appendChild(dropdown);
    pageDropdown = dropdown;
    return dropdown;
  }

  function renderPageDropdownOptions() {
    const dropdown = createPageDropdown();
    if (!dropdown) return;

    dropdown.innerHTML = "";
    const totalPages = getTotalPages();

    for (let i = 1; i <= totalPages; i++) {
      const item = document.createElement("div");
      item.textContent = `صفحه ${i}`;
      Object.assign(item.style, {
        padding: "6px 12px",
        cursor: "pointer",
        whiteSpace: "nowrap",
        background: i === currentPage ? "#f3f3ff" : "#ffffff",
        color: i === currentPage ? "#3b175c" : "#333",
      });

      item.addEventListener("mouseenter", () => {
        item.style.background = "#f5f5f5";
      });
      item.addEventListener("mouseleave", () => {
        item.style.background = i === currentPage ? "#f3f3ff" : "#ffffff";
      });

      item.addEventListener("click", () => {
        currentPage = i;
        closePageDropdown();
        renderTable();
      });

      dropdown.appendChild(item);
    }
  }
  
  

  function openPageDropdown() {
    const dropdown = createPageDropdown();
    if (!dropdown || !pageSelectContainer) return;

    renderPageDropdownOptions();

    const rect = pageSelectContainer.getBoundingClientRect();

    Object.assign(dropdown.style, {
      display: "block",
      top: rect.bottom + 4 + "px",
      left: rect.left + "px",
      minWidth: rect.width + "px",
    });
  }

  function closePageDropdown() {
    if (!pageDropdown) return;
    pageDropdown.style.display = "none";
  }

  function togglePageDropdown() {
    const dropdown = createPageDropdown();
    if (dropdown.style.display === "block") {
      closePageDropdown();
    } else {
      openPageDropdown();
    }
  }

  document.addEventListener("click", (e) => {
    if (!pageSelectContainer) return;
    if (
      pageDropdown &&
      pageDropdown.style.display === "block" &&
      !pageSelectContainer.contains(e.target) &&
      !pageDropdown.contains(e.target)
    ) {
      closePageDropdown();
    }
  });