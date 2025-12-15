document.addEventListener("DOMContentLoaded", () => {
  const API_BASE = "http://127.0.0.1:8000/api";
const TOKEN_KEY = "sabau-token";

  const $ = (s) => document.querySelector(s);
const prereqWrapper = document.querySelector(".frame-3-pr");
const prereqValueEl = document.querySelector(".frame-3-pr ._1-pr");
const prereqMinusBtn = document.querySelector(".frame-3-pr .bitcoin-icons-minus-filled1");
const lessonManagementBtn = document.querySelector(".sidenav-link");
const unitManagementBtn = document.querySelector(".sidenav-link3");


 
  const saveBtn = $(".group-98 .login-submit");
  const cancelBtn = $(".group-98 .login-submit2");

  const nameEl = $(".group-65 ._1");
  const codeEl = $(".group-66 ._493284");
  const capacityEl = $(".group-67 ._30");
  const teacherEl = $(".group-652 .p-name");
  const searchEl = $(".th4 .search");


  const unitsWrapper = $(".group-68 .frame-34");
  const unitsTextEl = $(".group-68 ._3");

  
  const dayWrapper1 = $(".group-102 .select");
  const timeWrapper1 = $(".group-102 .select2");
  const dayTextEl1 = dayWrapper1 ? dayWrapper1.querySelector(".one") : null;
  const timeTextEl1 = timeWrapper1 ? timeWrapper1.querySelector(".one") : null;

  const roomWrapper1 = $(".group-101 .select3");
  const facultyWrapper1 = $(".group-101 .select4");
  const roomTextEl1 = roomWrapper1 ? roomWrapper1.querySelector(".one2") : null;
  const facultyTextEl1 = facultyWrapper1 ? facultyWrapper1.querySelector(".one") : null;

  
  const gp1Wrapper = $(".group-102 .gp1"); 
  const gp2Wrapper = $(".group-102 .gp2"); 
  const gp1TextEl = gp1Wrapper ? gp1Wrapper.querySelector(".one") : null;
  const gp2TextEl = gp2Wrapper ? gp2Wrapper.querySelector(".one") : null;

  const gp3Wrapper = $(".group-101 .gp3"); 
  const gp4Wrapper = $(".group-101 .gp4"); 
  const gp3TextEl = gp3Wrapper ? gp3Wrapper.querySelector(".one2") : null;
  const gp4TextEl = gp4Wrapper ? gp4Wrapper.querySelector(".my-gp") : null;

  const gp1InitialDisplay = gp1Wrapper ? getComputedStyle(gp1Wrapper).display : null;
  const gp2InitialDisplay = gp2Wrapper ? getComputedStyle(gp2Wrapper).display : null;
  const gp3InitialDisplay = gp3Wrapper ? getComputedStyle(gp3Wrapper).display : null;
  const gp4InitialDisplay = gp4Wrapper ? getComputedStyle(gp4Wrapper).display : null;

  const logoutIcon = $(".solar-logout-outline");
  const bellWrapper = $(".badge-with-notification");
  const bellBadge = $(".badge-with-notification ._12");


  let globalOverlay = null;

  function createGlobalOverlay() {
    if (globalOverlay) return globalOverlay;

    const overlay = document.createElement("div");
    overlay.className = "global-message-overlay";
    Object.assign(overlay.style, {
      position: "fixed",
      inset: "0",
      background: "rgba(15,23,42,0.45)",
      display: "none",
      alignItems: "center",
      justifyContent: "center",
      zIndex: "9999",
    });

    const box = document.createElement("div");
    box.className = "global-message-box";
    Object.assign(box.style, {
      background: "#ffffff",
      borderRadius: "16px",
      padding: "18px 22px 14px 22px",
      maxWidth: "400px",
      width: "90%",
      boxShadow: "0 12px 40px rgba(15,23,42,0.35)",
      direction: "rtl",
      fontFamily: "inherit",
      textAlign: "right",
    });

    const titleEl = document.createElement("div");
    titleEl.className = "global-message-title";
    Object.assign(titleEl.style, {
      fontSize: "15px",
      fontWeight: "600",
      marginBottom: "8px",
      color: "#b91c1c",
      display: "flex",
      alignItems: "center",
      gap: "6px",
    });

    const dot = document.createElement("span");
    dot.textContent = "!";
    Object.assign(dot.style, {
      width: "20px",
      height: "20px",
      borderRadius: "50%",
      background: "#fee2e2",
      color: "#b91c1c",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontSize: "12px",
      fontWeight: "700",
    });

    const titleTextNode = document.createElement("span");
    titleTextNode.textContent = "خطا در ثبت درس";
    titleEl.appendChild(dot);
    titleEl.appendChild(titleTextNode);

    const msgEl = document.createElement("div");
    msgEl.className = "global-message-text";
    Object.assign(msgEl.style, {
      fontSize: "13px",
      color: "#4b5563",
      lineHeight: "1.8",
      marginBottom: "12px",
      whiteSpace: "pre-line",
    });

    const btnRow = document.createElement("div");
    Object.assign(btnRow.style, {
      display: "flex",
      justifyContent: "flex-end",
    });

    const btn = document.createElement("button");
    btn.textContent = "متوجه شدم";
    Object.assign(btn.style, {
      border: "none",
      borderRadius: "999px",
      padding: "7px 18px",
      background: "#3b175c",
      color: "#ffffff",
      cursor: "pointer",
      fontSize: "13px",
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
    });
    btn.addEventListener("click", () => {
      overlay.style.display = "none";
    });
    btnRow.appendChild(btn);

    box.appendChild(titleEl);
    box.appendChild(msgEl);
    box.appendChild(btnRow);
    overlay.appendChild(box);
    document.body.appendChild(overlay);
    globalOverlay = overlay;
    return overlay;
  }

  function showGlobalErrorList(items) {
    const overlay = createGlobalOverlay();
    const msgEl = overlay.querySelector(".global-message-text");

    let text = "لطفاً خطاهای زیر را بررسی کنید:\n\n";
    text += items
      .map((e) => `• ${e.field ? e.field + ": " : ""}${e.message}`)
      .join("\n");

    if (msgEl) msgEl.textContent = text;
    const titleEl = overlay.querySelector(".global-message-title span:last-child");
    if (titleEl) titleEl.textContent = "خطا در ثبت درس";

    overlay.style.display = "flex";
  }

  function showGlobalSuccess(message, onClose) {
    const overlay = createGlobalOverlay();
    const msgEl = overlay.querySelector(".global-message-text");
    const titleEl = overlay.querySelector(".global-message-title span:last-child");
    const dot = overlay.querySelector(".global-message-title span:first-child");

    if (titleEl) {
      titleEl.textContent = "ثبت موفق";
      titleEl.style.color = "#16a34a";
    }
    if (dot) {
      dot.textContent = "✓";
      dot.style.background = "#dcfce7";
      dot.style.color = "#16a34a";
    }
    if (msgEl) msgEl.textContent = message;

    overlay.style.display = "flex";

    const btn = overlay.querySelector(".global-message-box button");
    if (btn) {
      const oldHandler = btn._onclick;
      if (oldHandler) btn.removeEventListener("click", oldHandler);
      const handler = () => {
        overlay.style.display = "none";
        if (typeof onClose === "function") onClose();
      };
      btn._onclick = handler;
      btn.addEventListener("click", handler);
    }
  }

  function highlightField(el) {
    if (!el) return;
    const prevOutline = el.style.outline;
    const prevBoxShadow = el.style.boxShadow;
    el.scrollIntoView({ behavior: "smooth", block: "center" });
    el.style.outline = "2px solid #dc2626";
    el.style.boxShadow = "0 0 0 2px rgba(220,38,38,0.3)";
    setTimeout(() => {
      el.style.outline = prevOutline || "none";
      el.style.boxShadow = prevBoxShadow || "none";
    }, 1800);
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
      background: "rgba(15,23,42,0.55)",
      display: "none",
      alignItems: "center",
      justifyContent: "center",
      zIndex: "10000",
    });

    const box = document.createElement("div");
    Object.assign(box.style, {
      background: "#ffffff",
      borderRadius: "20px",
      padding: "20px 24px 16px 24px",
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
      background: "rgba(59,23,92,0.06)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      marginBottom: "10px",
    });
    const iconInner = document.createElement("div");
    Object.assign(iconInner.style, {
      width: "24px",
      height: "24px",
      borderRadius: "999px",
      background: "#3b175c",
      color: "#ffffff",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontWeight: "700",
      fontSize: "15px",
    });
    iconInner.textContent = "?";
    iconWrap.appendChild(iconInner);

    const title = document.createElement("div");
    Object.assign(title.style, {
      fontSize: "15px",
      fontWeight: "600",
      color: "#0f172a",
      marginBottom: "4px",
    });

    const msg = document.createElement("div");
    Object.assign(msg.style, {
      fontSize: "13px",
      color: "#4b5563",
      marginBottom: "16px",
      lineHeight: "1.7",
    });

    const btnRow = document.createElement("div");
    Object.assign(btnRow.style, {
      display: "flex",
      flexDirection: "row-reverse",
      gap: "8px",
      marginTop: "4px",
    });

    const yesBtn = document.createElement("button");
    Object.assign(yesBtn.style, {
      border: "none",
      borderRadius: "999px",
      padding: "8px 18px",
      background: "linear-gradient(135deg, #3b175c, #6d28d9)",
      color: "#ffffff",
      cursor: "pointer",
      fontSize: "13px",
      fontWeight: "500",
    });

    const noBtn = document.createElement("button");
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
    box.appendChild(title);
    box.appendChild(msg);
    box.appendChild(btnRow);
    overlay.appendChild(box);
    document.body.appendChild(overlay);

    confirmOverlay = overlay;
    confirmTitleEl = title;
    confirmMsgEl = msg;
    confirmYesBtn = yesBtn;
    confirmNoBtn = noBtn;

    overlay.addEventListener("click", (e) => {
      if (e.target === overlay) overlay.style.display = "none";
    });

    return overlay;
  }

  function showConfirmDialog({ title, message, confirmText, cancelText, onConfirm }) {
    const overlay = createConfirmOverlay();
    if (confirmTitleEl) confirmTitleEl.textContent = title || "تأیید عملیات";
    if (confirmMsgEl) confirmMsgEl.textContent = message || "";
    if (confirmYesBtn) confirmYesBtn.textContent = confirmText || "تأیید";
    if (confirmNoBtn) confirmNoBtn.textContent = cancelText || "انصراف";

    const newYes = confirmYesBtn.cloneNode(true);
    const newNo = confirmNoBtn.cloneNode(true);
    confirmYesBtn.parentNode.replaceChild(newYes, confirmYesBtn);
    confirmNoBtn.parentNode.replaceChild(newNo, confirmNoBtn);
    confirmYesBtn = newYes;
    confirmNoBtn = newNo;

    confirmYesBtn.addEventListener("click", () => {
      overlay.style.display = "none";
      if (typeof onConfirm === "function") onConfirm();
    });
    confirmNoBtn.addEventListener("click", () => {
      overlay.style.display = "none";
    });

    overlay.style.display = "flex";
  }

 
  function initTextPlaceholder(el) {
    if (!el) return;
    const placeholder = (el.textContent || "").trim();
    el.dataset.placeholder = placeholder;
    el.dataset.cleared = "false";
    el.style.opacity = "0.6";
    el.style.cursor = "text";
    el.setAttribute("contenteditable", "true");

    const clearHandler = () => {
      if (el.dataset.cleared === "false") {
        el.textContent = "";
        el.dataset.cleared = "true";
        el.style.opacity = "1";
      }
    };
    el.addEventListener("focus", clearHandler);
    el.addEventListener("click", clearHandler);
  }

  [nameEl, codeEl, capacityEl, teacherEl, searchEl].forEach(initTextPlaceholder);

  if (searchEl) {
    searchEl.setAttribute("contenteditable", "false");
    searchEl.style.pointerEvents = "none";
    searchEl.style.opacity = "0.55";
    searchEl.style.userSelect = "none";
  }

  
  let openDropdown = null;

  function closeDropdown() {
    if (openDropdown) {
      openDropdown.style.display = "none";
      openDropdown = null;
    }
  }

  document.addEventListener("click", (e) => {
    if (openDropdown && !openDropdown.contains(e.target)) {
      closeDropdown();
    }
  });

  function createDropdown(anchorEl, options, onSelect) {
    const dropdown = document.createElement("div");
    dropdown.className = "lesson-dropdown";
    Object.assign(dropdown.style, {
      position: "absolute",
      background: "#ffffff",
      borderRadius: "8px",
      boxShadow: "0 4px 16px rgba(0,0,0,0.15)",
      minWidth: "100px",
      zIndex: "9999",
      padding: "4px 0",
      direction: "rtl",
      fontFamily: "inherit",
      fontSize: "13px",
      maxHeight: "220px",
      overflowY: "auto",
      display: "none",
    });

    options.forEach((opt) => {
      const item = document.createElement("div");
      item.textContent = opt.label;
      Object.assign(item.style, {
        padding: "6px 12px",
        cursor: "pointer",
        whiteSpace: "nowrap",
      });
      item.addEventListener("mouseenter", () => {
        item.style.background = "#f5f5f5";
      });
      item.addEventListener("mouseleave", () => {
        item.style.background = "#ffffff";
      });
      item.addEventListener("click", () => {
        onSelect(opt);
        closeDropdown();
      });
      dropdown.appendChild(item);
    });

    document.body.appendChild(dropdown);

    anchorEl.style.cursor = "pointer";
    anchorEl.addEventListener("click", (e) => {
      e.stopPropagation();
      const rect = anchorEl.getBoundingClientRect();
      dropdown.style.left = rect.left + "px";
      dropdown.style.top = rect.bottom + 4 + "px";
      dropdown.style.minWidth = rect.width + "px";

      if (openDropdown && openDropdown !== dropdown) {
        closeDropdown();
      }
      dropdown.style.display = "block";
      openDropdown = dropdown;
    });

    return dropdown;
  }

// -------------------- Prerequisites (chips + dropdown) --------------------
let prereqCourseOptions = [];
let selectedPrereqIds = [];

async function loadPrereqCourses() {
  const token = localStorage.getItem(TOKEN_KEY);

  if (!token) {
    console.error("No token in localStorage:", TOKEN_KEY);
    prereqCourseOptions = [];
    return;
  }

  const res = await fetch(`${API_BASE}/courses/`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  console.log("courses status:", res.status);

  if (!res.ok) {
    console.error("courses error:", await res.text());
    prereqCourseOptions = [];
    return;
  }

  const data = await res.json();
  const items = Array.isArray(data) ? data : (data.results || []);

  prereqCourseOptions = items.map((c) => ({
    value: c.id,
    label: c.name || c.title || `Course #${c.id}`,
  }));

  console.log("courses count:", prereqCourseOptions.length);
}


function renderSelectedPrereqs() {
  if (!prereqValueEl) return;

  const selected = prereqCourseOptions.filter(o => selectedPrereqIds.includes(o.value));

  const chipsHtml = selected.map(o => `
    <span class="pr-chip" data-id="${o.value}">
      ${o.label}
      <span class="pr-chip-x">×</span>
    </span>
  `).join("");

  prereqValueEl.innerHTML = chipsHtml || `<span class="pr-placeholder">انتخاب درس‌های پیش‌نیاز…</span>`;

  // چون شما گفتی “× روی چیپ‌ها” مدنظر نیست، کلیکش کاری نکنه
  // (اگر بعداً خواستی هر چیپ جدا حذف بشه، می‌گم چطور)
}

function addPrereq(id) {
  if (!selectedPrereqIds.includes(id)) {
    selectedPrereqIds.push(id);
    renderSelectedPrereqs();
  }
}

function initPrereqDropdown() {
  if (!prereqWrapper || !prereqValueEl) return;

  // اولین رندر
  renderSelectedPrereqs();

  // dropdown روی همین باکس پیش‌نیاز
  createDropdown(
    prereqWrapper,
    () => prereqCourseOptions
      .filter(o => !selectedPrereqIds.includes(o.value)), // تکراری نیاد
    (opt) => {
      addPrereq(opt.value);

      // برای اینکه کاربر پشت سر هم انتخاب کنه:
      // dropdown بسته میشه، دوباره بازش می‌کنیم
      setTimeout(() => prereqWrapper.click(), 0);
    }
  );
}

// نکته مهم: createDropdown شما "options" رو آرایه می‌گیره، نه تابع.
// پس یک نسخه کوچک از createDropdown برای options داینامیک می‌سازیم:
function createDropdown(anchorEl, optionsOrFn, onSelect) {
  const options = typeof optionsOrFn === "function" ? optionsOrFn() : optionsOrFn;

  const dropdown = document.createElement("div");
  dropdown.className = "lesson-dropdown";
  Object.assign(dropdown.style, {
    position: "absolute",
    background: "#ffffff",
    borderRadius: "8px",
    boxShadow: "0 4px 16px rgba(0,0,0,0.15)",
    minWidth: "100px",
    zIndex: "9999",
    padding: "4px 0",
    direction: "rtl",
    fontFamily: "inherit",
    fontSize: "13px",
    maxHeight: "220px",
    overflowY: "auto",
    display: "none",
  });

  function rebuild() {
    dropdown.innerHTML = "";
    const opts = typeof optionsOrFn === "function" ? optionsOrFn() : optionsOrFn;

    opts.forEach((opt) => {
      const item = document.createElement("div");
      item.textContent = opt.label;
      Object.assign(item.style, {
        padding: "6px 12px",
        cursor: "pointer",
        whiteSpace: "nowrap",
      });
      item.addEventListener("mouseenter", () => (item.style.background = "#f5f5f5"));
      item.addEventListener("mouseleave", () => (item.style.background = "#ffffff"));
      item.addEventListener("click", () => {
        onSelect(opt);
        closeDropdown();
      });
      dropdown.appendChild(item);
    });
  }

  document.body.appendChild(dropdown);

  anchorEl.style.cursor = "pointer";
  anchorEl.addEventListener("click", (e) => {
    e.stopPropagation();
    rebuild();

    const rect = anchorEl.getBoundingClientRect();
    dropdown.style.left = rect.left + "px";
    dropdown.style.top = rect.bottom + 4 + "px";
    dropdown.style.minWidth = rect.width + "px";

    if (openDropdown && openDropdown !== dropdown) closeDropdown();
    dropdown.style.display = "block";
    openDropdown = dropdown;
  });

  return dropdown;
}

function bindPrereqClearAll() {
  if (!prereqMinusBtn) return;
  prereqMinusBtn.style.cursor = "pointer";

  prereqMinusBtn.addEventListener("click", (e) => {
    e.preventDefault();
    e.stopPropagation(); // dropdown باز نشه
    selectedPrereqIds = [];
    renderSelectedPrereqs();
  });
}







 
function createDropdown(anchorEl, optionsOrFn, onSelect) {
  const options = typeof optionsOrFn === "function" ? optionsOrFn() : optionsOrFn;

  const dropdown = document.createElement("div");
  dropdown.className = "lesson-dropdown";
  Object.assign(dropdown.style, {
    position: "absolute",
    background: "#ffffff",
    borderRadius: "8px",
    boxShadow: "0 4px 16px rgba(0,0,0,0.15)",
    minWidth: "100px",
    zIndex: "9999",
    padding: "4px 0",
    direction: "rtl",
    fontFamily: "inherit",
    fontSize: "13px",
    maxHeight: "220px",
    overflowY: "auto",
    display: "none",
  });

  function rebuild() {
    dropdown.innerHTML = "";
    const opts = typeof optionsOrFn === "function" ? optionsOrFn() : optionsOrFn;

    opts.forEach((opt) => {
      const item = document.createElement("div");
      item.textContent = opt.label;
      Object.assign(item.style, {
        padding: "6px 12px",
        cursor: "pointer",
        whiteSpace: "nowrap",
      });
      item.addEventListener("mouseenter", () => (item.style.background = "#f5f5f5"));
      item.addEventListener("mouseleave", () => (item.style.background = "#ffffff"));
      item.addEventListener("click", () => {
        onSelect(opt);
        closeDropdown();
      });
      dropdown.appendChild(item);
    });
  }

  document.body.appendChild(dropdown);

  anchorEl.style.cursor = "pointer";
  anchorEl.addEventListener("click", (e) => {
    e.stopPropagation();
    rebuild();

    const rect = anchorEl.getBoundingClientRect();
    dropdown.style.left = rect.left + "px";
    dropdown.style.top = rect.bottom + 4 + "px";
    dropdown.style.minWidth = rect.width + "px";

    if (openDropdown && openDropdown !== dropdown) closeDropdown();
    dropdown.style.display = "block";
    openDropdown = dropdown;
  });

  return dropdown;
}

function bindPrereqClearAll() {
  if (!prereqMinusBtn) return;
  prereqMinusBtn.style.cursor = "pointer";

  prereqMinusBtn.addEventListener("click", (e) => {
    e.preventDefault();
    e.stopPropagation(); // dropdown باز نشه
    selectedPrereqIds = [];
    renderSelectedPrereqs();
  });
}







  function initDropdownField({ wrapper, labelEl }) {
    if (!wrapper || !labelEl) return null;
    const placeholder = (labelEl.textContent || "").trim();
    labelEl.dataset.placeholder = placeholder;
    labelEl.dataset.filled = "false";
    labelEl.style.opacity = "0.5";
    wrapper.style.cursor = "pointer";

    wrapper.addEventListener("click", () => {
      if (labelEl.dataset.filled === "false") {
        labelEl.textContent = "";
        labelEl.style.opacity = "1";
      }
    });

    return {
      getValue() {
        if (labelEl.dataset.filled === "false") return "";
        return (labelEl.textContent || "").trim();
      },
      setValue(v) {
        labelEl.textContent = v;
        labelEl.dataset.filled = "true";
        labelEl.style.opacity = "1";
      },
      reset() {
        labelEl.textContent = labelEl.dataset.placeholder || "";
        labelEl.dataset.filled = "false";
        labelEl.style.opacity = "0.5";
      },
      el: labelEl,
    };
  }

  
  let unitChoices = [];
  let dayChoices = []; 
  let timeChoices = []; 
  let facultyChoices = []; 
  let classroomChoicesByFaculty = {}; 

  
  const unitsField = initDropdownField({ wrapper: unitsWrapper, labelEl: unitsTextEl });
  const dayField1 = initDropdownField({ wrapper: dayWrapper1, labelEl: dayTextEl1 });
  const timeField1 = initDropdownField({ wrapper: timeWrapper1, labelEl: timeTextEl1 });
  const dayField2 = initDropdownField({ wrapper: gp1Wrapper, labelEl: gp1TextEl });
  const timeField2 = initDropdownField({ wrapper: gp2Wrapper, labelEl: gp2TextEl });
  const roomField1 = initDropdownField({ wrapper: roomWrapper1, labelEl: roomTextEl1 });
  const facultyField1 = initDropdownField({ wrapper: facultyWrapper1, labelEl: facultyTextEl1 });
  const roomField2 = initDropdownField({ wrapper: gp3Wrapper, labelEl: gp3TextEl });
  const facultyField2 = initDropdownField({ wrapper: gp4Wrapper, labelEl: gp4TextEl });

  function facultyLabelToCode(label) {
    const f = facultyChoices.find((x) => x.label === label);
    return f ? f.value : null;
  }

  function timeLabelToRange(label) {
    return timeChoices.find((t) => t.label === label) || null;
  }

  function dayLabelToValue(label) {
    const d = dayChoices.find((x) => x.label === label);
    return d ? d.value : null;
  }

  function makeClassroomOptions(facultyCode) {
    const list = classroomChoicesByFaculty[facultyCode] || [];
    return list.map((r) => ({ value: String(r), label: String(r) }));
  }

  function updateExtraGroups(units) {
    if (!gp1Wrapper || !gp2Wrapper) return;
    if (units <= 2) {
      gp1Wrapper.style.display = "none";
      gp2Wrapper.style.display = "none";
      if (gp3Wrapper) gp3Wrapper.style.display = "none";
      if (gp4Wrapper) gp4Wrapper.style.display = "none";
      if (dayField2) dayField2.reset();
      if (timeField2) timeField2.reset();
      if (roomField2) roomField2.reset();
      if (facultyField2) facultyField2.reset();
    } else {
      gp1Wrapper.style.display = gp1InitialDisplay || "flex";
      gp2Wrapper.style.display = gp2InitialDisplay || "flex";
      if (gp3Wrapper) gp3Wrapper.style.display = gp3InitialDisplay || "flex";
      if (gp4Wrapper) gp4Wrapper.style.display = gp4InitialDisplay || "flex";
    }
  }


  async function loadChoicesFromServer() {
    try {
      const res = await fetch(`${API_BASE}/courses/admin/choices/`);
      if (!res.ok) throw new Error("choices request failed");
      const data = await res.json();

      unitChoices = (data.unit_choices || []).map((u) => ({
        value: u.value,
        label: String(u.label),
      }));
      dayChoices = data.day_choices || [];
      timeChoices = data.time_choices || [];
      facultyChoices = data.faculty_choices || [];
      classroomChoicesByFaculty = data.classroom_choices || {};

      
      if (unitsWrapper && unitsField) {
        createDropdown(unitsWrapper, unitChoices, (opt) => {
          unitsField.setValue(opt.label);
          const val = parseInt(opt.value, 10);
          updateExtraGroups(val);
        });
      }

      
      if (dayWrapper1 && dayField1) {
        createDropdown(
          dayWrapper1,
          dayChoices.map((d) => ({ value: d.value, label: d.label })),
          (opt) => dayField1.setValue(opt.label)
        );
      }
      if (gp1Wrapper && dayField2) {
        createDropdown(
          gp1Wrapper,
          dayChoices.map((d) => ({ value: d.value, label: d.label })),
          (opt) => dayField2.setValue(opt.label)
        );
      }

     
      const timeOpts = timeChoices.map((t) => ({ value: t.label, label: t.label }));
      if (timeWrapper1 && timeField1) {
        createDropdown(timeWrapper1, timeOpts, (opt) => timeField1.setValue(opt.label));
      }
      if (gp2Wrapper && timeField2) {
        createDropdown(gp2Wrapper, timeOpts, (opt) => timeField2.setValue(opt.label));
      }

   
      const facultyOpts = facultyChoices.map((f) => ({
        value: f.value,
        label: f.label,
      }));
      if (facultyWrapper1 && facultyField1) {
        createDropdown(facultyWrapper1, facultyOpts, (opt) => {
          facultyField1.setValue(opt.label);
          
          const code = opt.value;
          const roomOpts = makeClassroomOptions(code);
          if (roomWrapper1 && roomField1) {
            createDropdown(roomWrapper1, roomOpts, (o) => roomField1.setValue(o.label));
          }
        });
      }
      if (gp4Wrapper && facultyField2) {
        createDropdown(gp4Wrapper, facultyOpts, (opt) => {
          facultyField2.setValue(opt.label);
          const code = opt.value;
          const roomOpts = makeClassroomOptions(code);
          if (gp3Wrapper && roomField2) {
            createDropdown(gp3Wrapper, roomOpts, (o) => roomField2.setValue(o.label));
          }
        });
      }

      if (unitsTextEl) {
        const initUnits = parseInt(unitsTextEl.textContent.trim(), 10);
        if (!isNaN(initUnits)) updateExtraGroups(initUnits);
      }
    } catch (err) {
      console.error("Error loading choices:", err);
      
      updateExtraGroups(2);
    }
  }

  loadChoicesFromServer();
  loadPrereqCourses();
  initPrereqDropdown();
  bindPrereqClearAll();

  const MSG_MAP = {
    "Course code must be unique": "کد درسی نباید تکراری باشد.",
    "No professor found with this name.": "استادی با این نام یافت نشد.",
    "This field is required.": "این فیلد الزامی است.",
    "This field may not be null.": "این فیلد نمی‌تواند خالی باشد.",
    "Ensure this value is greater than or equal to 0.": "مقدار باید بزرگ‌تر یا مساوی صفر باشد.",
    "end_time must be later than start_time.": "ساعت پایان باید بعد از ساعت شروع باشد.",
    "A session with the same time, day, faculty and room already exists.":
      "جلسه‌ای با همین روز، ساعت، دانشکده و کلاس قبلاً ثبت شده است.",
  };

  function translateMessage(msg) {
    if (MSG_MAP[msg]) return MSG_MAP[msg];
  
    return msg;
  }

  function buildErrorsFromBackend(data) {
    const errors = [];

    if (!data || typeof data !== "object") {
      return errors;
    }

    if (Array.isArray(data.non_field_errors)) {
      data.non_field_errors.forEach((m) => {
        errors.push({ field: "", message: translateMessage(m) });
      });
    }

    if (Array.isArray(data.code)) {
      data.code.forEach((m) =>
        errors.push({ field: "کد درس", message: translateMessage(m) })
      );
    }

    if (Array.isArray(data.name)) {
      data.name.forEach((m) =>
        errors.push({ field: "نام درس", message: translateMessage(m) })
      );
    }

    if (Array.isArray(data.professor)) {
      data.professor.forEach((m) =>
        errors.push({ field: "نام استاد", message: translateMessage(m) })
      );
    }

    if (Array.isArray(data.units)) {
      data.units.forEach((m) =>
        errors.push({ field: "تعداد واحد", message: translateMessage(m) })
      );
    }

    if (Array.isArray(data.capacity)) {
      data.capacity.forEach((m) =>
        errors.push({ field: "ظرفیت", message: translateMessage(m) })
      );
    }

    if (Array.isArray(data.sessions)) {
      data.sessions.forEach((sErr, idx) => {
        const label = idx === 0 ? "جلسه اول" : "جلسه دوم";
        if (!sErr || typeof sErr !== "object") return;

        if (Array.isArray(sErr.day)) {
          sErr.day.forEach((m) =>
            errors.push({
              field: `روز ${label}`,
              message: translateMessage(m),
            })
          );
        }
        if (Array.isArray(sErr.start_time)) {
          sErr.start_time.forEach((m) =>
            errors.push({
              field: `ساعت شروع ${label}`,
              message: translateMessage(m),
            })
          );
        }
        if (Array.isArray(sErr.end_time)) {
          sErr.end_time.forEach((m) =>
            errors.push({
              field: `ساعت پایان ${label}`,
              message: translateMessage(m),
            })
          );
        }
        if (Array.isArray(sErr.room)) {
          sErr.room.forEach((m) =>
            errors.push({
              field: `کلاس ${label}`,
              message: translateMessage(m),
            })
          );
        }
        if (Array.isArray(sErr.faculty)) {
          sErr.faculty.forEach((m) =>
            errors.push({
              field: `دانشکده ${label}`,
              message: translateMessage(m),
            })
          );
        }
        if (Array.isArray(sErr.time_range)) {
          sErr.time_range.forEach((m) =>
            errors.push({
              field: `زمان ${label}`,
              message: translateMessage(m),
            })
          );
        }
      });
    }

    return errors;
  }

 
  function validateFront(data) {
    const errors = [];

    if (!data.name) {
      errors.push({ field: "نام درس", message: "نام درس را وارد کنید." });
    }
    if (!data.code) {
      errors.push({ field: "کد درس", message: "کد درس را وارد کنید." });
    }
    if (!data.teacher) {
      errors.push({ field: "نام استاد", message: "نام استاد را وارد کنید." });
    }
    if (!data.units || isNaN(data.units) || data.units <= 0) {
      errors.push({ field: "تعداد واحد", message: "تعداد واحد را به درستی وارد کنید." });
    }
    if (!data.capacity || isNaN(data.capacity) || data.capacity < 0) {
      errors.push({
        field: "ظرفیت",
        message: "ظرفیت باید یک عدد بزرگ‌تر یا مساوی صفر باشد.",
      });
    }

    const s1 = data.sessions[0] || {};
    if (!s1.day || !s1.start_time || !s1.end_time) {
      errors.push({
        field: "زمان جلسه اول",
        message: "روز و ساعت جلسه اول را کامل وارد کنید.",
      });
    }
    if (!s1.faculty || !s1.classroom) {
      errors.push({
        field: "کلاس جلسه اول",
        message: "دانشکده و کلاس جلسه اول را وارد کنید.",
      });
    }

    if (data.units > 2) {
      const s2 = data.sessions[1] || {};
      if (!s2.day || !s2.start_time || !s2.end_time) {
        errors.push({
          field: "زمان جلسه دوم",
          message: "برای دروس بیشتر از ۲ واحد، زمان جلسه دوم الزامی است.",
        });
      }
      if (!s2.faculty || !s2.classroom) {
        errors.push({
          field: "کلاس جلسه دوم",
          message: "برای دروس بیشتر از ۲ واحد، کلاس جلسه دوم الزامی است.",
        });
      }
    }

    return errors;
  }

  
  async function handleSave() {
    const token = localStorage.getItem("sabau-token");
    if (!token) {
      showGlobalErrorList([
        {
          field: "",
          message: "برای ثبت درس، ابتدا باید وارد حساب کاربری خود شوید.",
        },
      ]);
      return;
    }

    const name = (nameEl?.textContent || "").trim();
    const code = (codeEl?.textContent || "").trim();
    const capStr = (capacityEl?.textContent || "").trim();
    const teacher = (teacherEl?.textContent || "").trim();

    const unitsStr =
      (unitsField && unitsField.getValue()) ||
      (unitsTextEl?.textContent || "").trim();
    const units = unitsStr ? parseInt(unitsStr, 10) : 0;
    const capacity = capStr ? parseInt(capStr, 10) : 0;

    // جلسه اول
    const dayLabel1 = dayField1?.getValue() || "";
    const timeLabel1 = timeField1?.getValue() || "";
    const facultyLabel1 = facultyField1?.getValue() || "";
    const room1 = roomField1?.getValue() || "";

    const dayCode1 = dayLabelToValue(dayLabel1);
    const timeRange1 = timeLabelToRange(timeLabel1);
    const facultyCode1 = facultyLabelToCode(facultyLabel1);

    const startTime1 = timeRange1 ? timeRange1.start : "";
    const endTime1 = timeRange1 ? timeRange1.end : "";

    // جلسه دوم
    const dayLabel2 = dayField2?.getValue() || "";
    const timeLabel2 = timeField2?.getValue() || "";
    const facultyLabel2 = facultyField2?.getValue() || "";
    const room2 = roomField2?.getValue() || "";

    const dayCode2 = dayLabelToValue(dayLabel2);
    const timeRange2 = timeLabelToRange(timeLabel2);
    const facultyCode2 = facultyLabelToCode(facultyLabel2);

    const startTime2 = timeRange2 ? timeRange2.start : "";
    const endTime2 = timeRange2 ? timeRange2.end : "";

    const sessions = [];

  
    sessions.push({
      day: dayCode1 || null,
      start_time: startTime1 || null,
      end_time: endTime1 || null,
      faculty: facultyCode1 || null,
      room: room1 || null,
    });

    
    const anySecondFilled =
      dayCode2 || startTime2 || endTime2 || facultyCode2 || room2;
    if (anySecondFilled || units > 2) {
      sessions.push({
        day: dayCode2 || null,
        start_time: startTime2 || null,
        end_time: endTime2 || null,
        faculty: facultyCode2 || null,
        room: room2 || null,
      });
    }

    const payload = {
      name,
      code,
      units,
      capacity,
      professor: teacher,
      sessions,
    };

    console.log("payload being sent:", JSON.stringify(payload, null, 2));

    let res;
    let data = null;

    try {
      res = await fetch(`${API_BASE}/courses/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      try {
        data = await res.json();
      } catch {
        data = null;
      }
    } catch (err) {
      console.error("Network error:", err);
      showGlobalErrorList([
        {
          field: "",
          message: "ارتباط با سرور برقرار نشد. لطفاً دوباره تلاش کنید.",
        },
      ]);
      return;
    }

    if (res.ok) {
      showGlobalSuccess("درس با موفقیت ثبت شد.\nدر حال بازگشت به لیست دروس...", () => {
        window.location.href = "admin-dashboard-list.html";
      });
      return;
    }

    
    let backendErrors = buildErrorsFromBackend(data);

    
    if (!backendErrors || backendErrors.length === 0) {
      backendErrors = validateFront({ name, code, teacher, units, capacity, sessions });
    }

    if (!backendErrors || backendErrors.length === 0) {
      backendErrors = [
        {
          field: "",
          message: "خطای نامشخصی رخ داد. لطفاً ورودی‌ها را دوباره بررسی کنید.",
        },
      ];
    }

    showGlobalErrorList(backendErrors);
    if (backendErrors[0].field) {
     
      const first = backendErrors[0].field;
      if (first.includes("کد درس")) highlightField(codeEl);
      else if (first.includes("نام درس")) highlightField(nameEl);
      else if (first.includes("ظرفیت")) highlightField(capacityEl);
      else if (first.includes("استاد")) highlightField(teacherEl);
      else if (first.includes("جلسه اول")) highlightField(dayTextEl1 || roomTextEl1);
      else if (first.includes("جلسه دوم")) highlightField(gp1TextEl || gp3TextEl);
    }
  }


  if (saveBtn) {
    saveBtn.style.cursor = "pointer";
    saveBtn.addEventListener("click", handleSave);
  }

  if (cancelBtn) {
    cancelBtn.style.cursor = "pointer";
    cancelBtn.addEventListener("click", () => {
      showConfirmDialog({
        title: "انصراف از ثبت درس",
        message: "آیا مطمئن هستید می‌خواهید تغییرات را رها کرده و به لیست دروس بازگردید؟",
        confirmText: "بله، بازگشت",
        cancelText: "ادامه ثبت",
        onConfirm: () => {
          window.location.href = "admin-dashboard-list.html";
        },
      });
    });
  }

  if (bellWrapper) {
    bellWrapper.style.cursor = "pointer";
    bellWrapper.addEventListener("click", () => {
      if (bellBadge && bellBadge.parentElement) {
        bellBadge.textContent = "";
        bellBadge.parentElement.style.display = "none";
      }
      const overlay = createGlobalOverlay();
      const titleEl = overlay.querySelector(".global-message-title span:last-child");
      const msgEl = overlay.querySelector(".global-message-text");
      if (titleEl) titleEl.textContent = "اعلان‌ها";
      if (msgEl) msgEl.textContent = "اعلان جدیدی برای نمایش وجود ندارد.";
      overlay.style.display = "flex";
    });
  }

  if (lessonManagementBtn) {
    lessonManagementBtn.style.cursor = "pointer";
    lessonManagementBtn.addEventListener("click", () => {
      window.location.href = "admin-dashboard-list.html";
    });
  }
    if (unitManagementBtn) {
    unitManagementBtn.style.cursor = "pointer";

    unitManagementBtn.addEventListener("click", () => {
      window.location.href = "unit-management.html";
    });
  }
  if (logoutIcon) {
    logoutIcon.style.cursor = "pointer";
    logoutIcon.addEventListener("click", () => {
      showConfirmDialog({
        title: "خروج از حساب",
        message: "آیا مطمئن هستید که می‌خواهید از حساب کاربری خود خارج شوید؟",
        confirmText: "خروج",
        cancelText: "انصراف",
        onConfirm: () => {
          window.location.href = "login.html";
        },
      });
    });
  }

  
  (function () {
    function updateDateTime() {
      const now = new Date();
      const dateFormatter = new Intl.DateTimeFormat("fa-IR-u-ca-persian", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
      });
      const timeFormatter = new Intl.DateTimeFormat("fa-IR", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      });
      const parts = dateFormatter.formatToParts(now);
      const weekday = parts.find((p) => p.type === "weekday")?.value ?? "";
      const day = parts.find((p) => p.type === "day")?.value ?? "";
      const month = parts.find((p) => p.type === "month")?.value ?? "";
      const year = parts.find((p) => p.type === "year")?.value ?? "";
      const persianTime = timeFormatter.format(now);
      const persianDate = `${weekday} ${day} ${month} ${year}`;
      const dateTarget = document.querySelector("._1-1404");
      if (dateTarget) {
        dateTarget.textContent = `${persianTime} | ${persianDate}`;
      }
    }
    updateDateTime();
    setInterval(updateDateTime, 60000);
  })();


});
