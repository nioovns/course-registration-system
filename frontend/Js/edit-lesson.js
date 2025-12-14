document.addEventListener("DOMContentLoaded", () => {
  const API_BASE = "http://127.0.0.1:8000/api";
  const TOKEN_KEY = "sabau-token";
  const CURRENT_COURSE_ID_KEY = "sabau-current-lesson-id";

  const $ = (s) => document.querySelector(s);

  
  function createOverlayBase() {
    const overlay = document.createElement("div");
    overlay.style.position = "fixed";
    overlay.style.inset = "0";
    overlay.style.background = "rgba(15,23,42,.55)";
    overlay.style.display = "none";
    overlay.style.alignItems = "center";
    overlay.style.justifyContent = "center";
    overlay.style.zIndex = "9999";
    return overlay;
  }

 
  let validationOverlay = null;
  function showValidationOverlay(errors) {
    if (!validationOverlay) {
      validationOverlay = createOverlayBase();
      const box = document.createElement("div");
      Object.assign(box.style, {
        background: "#fff",
        borderRadius: "24px",
        padding: "24px 28px 20px",
        maxWidth: "420px",
        width: "90%",
        direction: "rtl",
        fontFamily: "inherit",
        boxShadow: "0 16px 45px rgba(15,23,42,.35)",
        position: "relative",
      });

      const iconWrap = document.createElement("div");
      Object.assign(iconWrap.style, {
        width: "42px",
        height: "42px",
        borderRadius: "999px",
        background: "rgba(239,68,68,.08)",
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
        color: "#fff",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontWeight: "700",
        fontSize: "16px",
      });
      iconWrap.appendChild(iconInner);

      const title = document.createElement("div");
      title.textContent = "خطا در ثبت / ویرایش درس";
      Object.assign(title.style, {
        fontSize: "15px",
        fontWeight: "600",
        color: "#b91c1c",
        marginBottom: "4px",
      });

      const desc = document.createElement("div");
      desc.textContent = "لطفاً موارد زیر را بررسی و اصلاح کنید.";
      Object.assign(desc.style, {
        fontSize: "13px",
        color: "#4b5563",
        marginBottom: "10px",
      });

      const list = document.createElement("ul");
      list.className = "validation-error-list";
      Object.assign(list.style, {
        margin: "0",
        padding: "0 18px 0 0",
        fontSize: "12px",
        color: "#b91c1c",
        lineHeight: "1.8",
        textAlign: "right",
      });

      const btnRow = document.createElement("div");
      Object.assign(btnRow.style, {
        display: "flex",
        flexDirection: "row-reverse",
        marginTop: "18px",
      });

      const okBtn = document.createElement("button");
      okBtn.textContent = "متوجه شدم";
      Object.assign(okBtn.style, {
        border: "none",
        borderRadius: "999px",
        padding: "8px 20px",
        background: "linear-gradient(135deg,#3b175c,#5b21b6)",
        color: "#fff",
        cursor: "pointer",
        fontSize: "13px",
        fontWeight: "500",
      });
      okBtn.addEventListener("click", () => {
        validationOverlay.style.display = "none";
      });

      btnRow.appendChild(okBtn);
      box.appendChild(iconWrap);
      box.appendChild(title);
      box.appendChild(desc);
      box.appendChild(list);
      box.appendChild(btnRow);

      validationOverlay.appendChild(box);
      validationOverlay.addEventListener("click", (e) => {
        if (e.target === validationOverlay) {
          validationOverlay.style.display = "none";
        }
      });
      document.body.appendChild(validationOverlay);
    }

    const list = validationOverlay.querySelector(".validation-error-list");
    list.innerHTML = "";
    errors.forEach((msg) => {
      const li = document.createElement("li");
      li.textContent = msg;
      list.appendChild(li);
    });
    validationOverlay.style.display = "flex";
  }

 
  let successOverlay = null;
  function showSuccessOverlay(message, onClose) {
    if (!successOverlay) {
      successOverlay = createOverlayBase();
      const box = document.createElement("div");
      Object.assign(box.style, {
        background: "#fff",
        borderRadius: "24px",
        padding: "24px 28px 20px",
        maxWidth: "360px",
        width: "90%",
        direction: "rtl",
        fontFamily: "inherit",
        boxShadow: "0 16px 45px rgba(15,23,42,.35)",
      });

      const iconWrap = document.createElement("div");
      Object.assign(iconWrap.style, {
        width: "42px",
        height: "42px",
        borderRadius: "999px",
        background: "rgba(22,163,74,.1)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        marginBottom: "12px",
      });

      const iconInner = document.createElement("div");
      iconInner.textContent = "✓";
      Object.assign(iconInner.style, {
        width: "24px",
        height: "24px",
        borderRadius: "999px",
        background: "#16a34a",
        color: "#fff",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontWeight: "700",
        fontSize: "16px",
      });
      iconWrap.appendChild(iconInner);

      const msgEl = document.createElement("div");
      msgEl.className = "success-message";
      Object.assign(msgEl.style, {
        fontSize: "13px",
        color: "#065f46",
        lineHeight: "1.8",
        marginBottom: "16px",
      });

      const btnRow = document.createElement("div");
      Object.assign(btnRow.style, {
        display: "flex",
        flexDirection: "row-reverse",
      });

      const okBtn = document.createElement("button");
      okBtn.textContent = "باشه";
      Object.assign(okBtn.style, {
        border: "none",
        borderRadius: "999px",
        padding: "8px 20px",
        background: "#3b175c",
        color: "#fff",
        cursor: "pointer",
        fontSize: "13px",
        fontWeight: "500",
      });
      okBtn.addEventListener("click", () => {
        successOverlay.style.display = "none";
        if (typeof successOverlay._onClose === "function") {
          successOverlay._onClose();
        }
      });

      btnRow.appendChild(okBtn);
      box.appendChild(iconWrap);
      box.appendChild(msgEl);
      box.appendChild(btnRow);
      successOverlay.appendChild(box);
      document.body.appendChild(successOverlay);
    }

    const msgEl = successOverlay.querySelector(".success-message");
    msgEl.textContent = message || "عملیات با موفقیت انجام شد.";
    successOverlay._onClose = onClose || null;
    successOverlay.style.display = "flex";
  }

  
  let confirmOverlay = null;
  let confirmYesBtn, confirmNoBtn, confirmTitleEl, confirmMsgEl;
  function createConfirmOverlay() {
    if (confirmOverlay) return confirmOverlay;
    confirmOverlay = createOverlayBase();
    const box = document.createElement("div");
    Object.assign(box.style, {
      background: "#fff",
      borderRadius: "20px",
      padding: "22px 24px 18px",
      maxWidth: "380px",
      width: "90%",
      direction: "rtl",
      fontFamily: "inherit",
      boxShadow: "0 18px 45px rgba(15,23,42,.35)",
    });

    const iconWrap = document.createElement("div");
    Object.assign(iconWrap.style, {
      width: "42px",
      height: "42px",
      borderRadius: "999px",
      background: "rgba(239,68,68,.08)",
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
      color: "#fff",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontWeight: "700",
      fontSize: "16px",
    });
    iconWrap.appendChild(iconInner);

    confirmTitleEl = document.createElement("div");
    confirmTitleEl.textContent = "خروج از حساب";
    Object.assign(confirmTitleEl.style, {
      fontSize: "15px",
      fontWeight: "600",
      color: "#0f172a",
      marginBottom: "4px",
    });

    confirmMsgEl = document.createElement("div");
    confirmMsgEl.textContent = "آیا مطمئن هستید که می‌خواهید خارج شوید؟";
    Object.assign(confirmMsgEl.style, {
      fontSize: "13px",
      color: "#4b5563",
      lineHeight: "1.7",
      marginBottom: "16px",
    });

    const btnRow = document.createElement("div");
    Object.assign(btnRow.style, {
      display: "flex",
      flexDirection: "row-reverse",
      gap: "8px",
    });

    confirmYesBtn = document.createElement("button");
    confirmYesBtn.textContent = "خروج";
    Object.assign(confirmYesBtn.style, {
      border: "none",
      borderRadius: "999px",
      padding: "8px 18px",
      background: "linear-gradient(135deg,#ef4444,#b91c1c)",
      color: "#fff",
      cursor: "pointer",
      fontSize: "13px",
    });

    confirmNoBtn = document.createElement("button");
    confirmNoBtn.textContent = "انصراف";
    Object.assign(confirmNoBtn.style, {
      border: "1px solid #e5e7eb",
      borderRadius: "999px",
      padding: "8px 16px",
      background: "#fff",
      color: "#374151",
      cursor: "pointer",
      fontSize: "13px",
    });

    btnRow.appendChild(confirmYesBtn);
    btnRow.appendChild(confirmNoBtn);

    box.appendChild(iconWrap);
    box.appendChild(confirmTitleEl);
    box.appendChild(confirmMsgEl);
    box.appendChild(btnRow);
    confirmOverlay.appendChild(box);

    confirmOverlay.addEventListener("click", (e) => {
      if (e.target === confirmOverlay) confirmOverlay.style.display = "none";
    });
    confirmNoBtn.addEventListener("click", () => {
      confirmOverlay.style.display = "none";
    });

    document.body.appendChild(confirmOverlay);
    return confirmOverlay;
  }

  function showConfirmDialog({ title, message, confirmText, cancelText, onConfirm }) {
    const overlay = createConfirmOverlay();
    if (title) confirmTitleEl.textContent = title;
    if (message) confirmMsgEl.textContent = message;
    if (confirmText) confirmYesBtn.textContent = confirmText;
    if (cancelText) confirmNoBtn.textContent = cancelText;

    const newYes = confirmYesBtn.cloneNode(true);
    confirmYesBtn.parentNode.replaceChild(newYes, confirmYesBtn);
    confirmYesBtn = newYes;
    confirmYesBtn.addEventListener("click", () => {
      overlay.style.display = "none";
      if (typeof onConfirm === "function") onConfirm();
    });

    overlay.style.display = "flex";
  }

 
  let openDropdownEl = null;
  function createDropdown(triggerEl, options, onSelect) {
    if (openDropdownEl) {
      openDropdownEl.remove();
      openDropdownEl = null;
    }
    const rect = triggerEl.getBoundingClientRect();
    const dd = document.createElement("div");
    dd.className = "fake-dropdown";
    Object.assign(dd.style, {
      position: "fixed",
      top: rect.bottom + 4 + "px",
      left: rect.left + "px",
      minWidth: rect.width + "px",
      background: "#fff",
      borderRadius: "8px",
      boxShadow: "0 8px 25px rgba(15,23,42,.25)",
      padding: "4px 0",
      direction: "rtl",
      fontFamily: "inherit",
      fontSize: "13px",
      zIndex: "9999",
      maxHeight: "220px",
      overflowY: "auto",
    });

    options.forEach((opt) => {
      const item = document.createElement("div");
      item.textContent = opt.label;
      Object.assign(item.style, {
        padding: "6px 10px",
        cursor: "pointer",
        whiteSpace: "nowrap",
      });
      item.addEventListener("mouseenter", () => {
        item.style.background = "#f3f4ff";
      });
      item.addEventListener("mouseleave", () => {
        item.style.background = "transparent";
      });
      item.addEventListener("click", () => {
        onSelect(opt);
        dd.remove();
        openDropdownEl = null;
      });
      dd.appendChild(item);
    });

    document.body.appendChild(dd);
    openDropdownEl = dd;
  }

  document.addEventListener("click", (e) => {
    if (openDropdownEl && !openDropdownEl.contains(e.target)) {
      openDropdownEl.remove();
      openDropdownEl = null;
    }
  });

  function attachDropdownToBox(boxSelector, valueEl, getOptions, onChange) {
    const box = document.querySelector(boxSelector);
    if (!box || !valueEl) return;
    box.style.cursor = "pointer";
    box.addEventListener("click", (e) => {
      e.stopPropagation();
      const options = getOptions();
      if (!options || !options.length) return;
      createDropdown(box, options, (opt) => {
        valueEl.textContent = opt.label;
        if (valueEl.dataset) valueEl.dataset.cleared = "true";
        if (typeof onChange === "function") onChange(opt);
      });
    });
  }


  const nameEl = document.querySelector(".frame-3 ._1");
  const codeEl = document.querySelector(".frame-32 ._493284");
  const capacityEl = document.querySelector(".frame-33 ._30");
  const unitsEl = document.querySelector(".frame-34 ._3");
  const teacherEl = document.querySelector(".frame-35 .p-name");

  const day1El = document.querySelector(".select .one");
  const time1El = document.querySelector(".select2 .one");
  const day2El = document.querySelector(".gp1 .one");
  const time2El = document.querySelector(".gp2 .one");

  const room1El = document.querySelector(".select3 .one2");
  const building1El = document.querySelector(".select4 .one");
  const room2El = document.querySelector(".gp3 .one2");
  const building2El = document.querySelector(".gp4 .my-gp");

  const submitBtn = document.querySelector(".login-submit");
  const cancelBtn = document.querySelector(".login-submit2");
  const logoutIcon = document.querySelector(".solar-logout-outline");
  const bellWrapper = document.querySelector(".badge-with-notification");
  const bellBadge = document.querySelector(".badge-with-notification ._12");
  const searchEl = document.querySelector(".search");

  const prereqCountEl = document.querySelector(".frame-pre ._3-pre");
  const prereqCourseValueEl = document.querySelector(".frame-3-pr ._1-pr");

  const prereqCountBoxSel = ".frame-pre";
  const prereqCourseBoxSel = ".frame-3-pr";


  if (searchEl) {
    searchEl.dataset.placeholder = "جستجو";
    searchEl.textContent = "جستجو";
    searchEl.contentEditable = "false";
    searchEl.style.opacity = "0.55";
    searchEl.style.pointerEvents = "none";
    searchEl.style.userSelect = "none";
  }

  [nameEl, codeEl, capacityEl, teacherEl].forEach((el) => {
    if (!el) return;
    el.setAttribute("contenteditable", "true");
    el.style.outline = "none";
  });

 
  function normalizeDigits(str) {
    if (str == null) return "";
    const map = {
      "۰": "0", "۱": "1", "۲": "2", "۳": "3", "۴": "4",
      "۵": "5", "۶": "6", "۷": "7", "۸": "8", "۹": "9",
      "٠": "0", "١": "1", "٢": "2", "٣": "3", "٤": "4",
      "٥": "5", "٦": "6", "٧": "7", "٨": "8", "٩": "9",
    };
    return String(str).replace(/[۰-۹٠-٩]/g, (d) => map[d] || d);
  }

  function setSecondTimePlaceVisibility(unitsValue) {
    const normalized = normalizeDigits(unitsValue);
    const num = parseInt(normalized, 10);
    const showSecond = !isNaN(num) && num > 2;
    const secondPair = document.querySelectorAll(".gp3, .gp4, .gp1, .gp2");
    secondPair.forEach((el) => {
      if (!el) return;
      el.style.display = showSecond ? "flex" : "none";
      el.style.visibility = showSecond ? "visible" : "hidden";
    });
  }

  function getText(el) {
    return el ? el.textContent.trim() : "";
  }

 
  function dayCodeToFa(code) {
    const map = {
      sat: "شنبه",
      sun: "یکشنبه",
      mon: "دوشنبه",
      tue: "سه‌شنبه",
      wed: "چهارشنبه",
      thu: "پنجشنبه",
      fri: "جمعه",
    };
    return map[code] || code || "";
  }

  function dayFaToCode(label) {
    const map = {
      "شنبه": "sat",
      "یکشنبه": "sun",
      "دوشنبه": "mon",
      "سه‌شنبه": "tue",
      "چهارشنبه": "wed",
      "پنجشنبه": "thu",
      "جمعه": "fri",
    };
    return map[label] || null;
  }

  const facultyShortMap = {
    eng: "مهندسی",
    sci: "علوم",
    lit: "ادبیات",
    psy: "روان شناسی",
    art: "هنر",
  };

  function facultyCodeToFa(code) {
    return facultyShortMap[code] || code || "";
  }

  function facultyFaToCode(label) {
    const map = {
      "مهندسی": "eng",
      "علوم": "sci",
      "ادبیات": "lit",
      "روان شناسی": "psy",
      "هنر": "art",
      "دانشکده فنی و مهندسی": "eng",
      "دانشکده علوم": "sci",
      "دانشکده ادبیات": "lit",
      "دانشکده روان شناسی": "psy",
      "دانشکده هنر": "art",
    };
    return map[label] || null;
  }

  function labelToTimeRange(label) {
    if (!label) return { start: null, end: null };
    const parts = label.split("-");
    if (parts.length !== 2) return { start: null, end: null };
    return {
      start: parts[0].trim(),
      end: parts[1].trim(),
    };
  }

  function combineTimeRange(s) {
    if (!s || !s.start_time || !s.end_time) return "";
    return `${s.start_time.slice(0, 5)}-${s.end_time.slice(0, 5)}`;
  }


  let unitOptions = [];
  let dayOptions = [];
  let timeOptions = [];
  let facultyOptions = [];
  let classroomChoicesByFaculty = {};

  let prereqCourseOptions = [];

  async function loadPrereqCourses() {
  const token = localStorage.getItem(TOKEN_KEY);

  try {
    const res = await fetch(`${API_BASE}/courses/`, {
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        "Content-Type": "application/json",
      },
    });

    if (!res.ok) {
      console.warn("Failed to load courses list", res.status);
      return;
    }

    const data = await res.json();

    // اگر DRF pagination داشته باشی، معمولاً data.results هست
    const items = Array.isArray(data) ? data : (data.results || []);

    prereqCourseOptions = items.map((c) => ({
      value: c.id,
      label: c.name ? c.name : `Course #${c.id}`,
      raw: c,
    }));
  } catch (err) {
    console.error("loadPrereqCourses error:", err);
  }
}

  async function loadChoicesFromBackend() {
    const token = localStorage.getItem(TOKEN_KEY);
    if (!token) return;

    try {
      const res = await fetch(`${API_BASE}/courses/admin/choices/`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      if (!res.ok) {
        console.warn("Failed to load choices from backend", res.status);
        return;
      }
      const data = await res.json();
      // units
      unitOptions = (data.unit_choices || []).map((u) => ({
        value: u.value,
        label: String(u.label),
      }));
     
      dayOptions = (data.day_choices || []).map((d) => ({
        value: d.value,
        label: dayCodeToFa(d.value),
      }));
    
      timeOptions = (data.time_choices || []).map((t) => ({
        value: `${t.start}-${t.end}`,
        label: t.label || `${t.start}-${t.end}`,
      }));
      
      facultyOptions = Object.entries(facultyShortMap).map(([value, label]) => ({
        value,
        label,
      }));
    
      classroomChoicesByFaculty = data.classroom_choices || {};
    } catch (err) {
      console.error("Error loading dropdown choices:", err);
    }
  }

  
  let currentCourse = null;

  async function loadCourseFromServer() {
    const token = localStorage.getItem(TOKEN_KEY);
    const courseIdStr = localStorage.getItem(CURRENT_COURSE_ID_KEY);
    const courseId = courseIdStr ? parseInt(courseIdStr, 10) : null;

    if (!token || !courseId) {
      showValidationOverlay([
        "برای ویرایش درس ابتدا باید وارد حساب کاربری شوید و از لیست دروس وارد این صفحه شوید.",
      ]);
      return;
    }

    try {
      const res = await fetch(`${API_BASE}/courses/${courseId}/`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!res.ok) {
        showValidationOverlay([
          "خطا در دریافت اطلاعات درس از سرور. لطفاً دوباره تلاش کنید.",
        ]);
        return;
      }

      const course = await res.json();
      currentCourse = course;
      fillFormWithCourse(course);
    } catch (err) {
      console.error("loadCourseFromServer error:", err);
      showValidationOverlay([
        "عدم ارتباط با سرور هنگام دریافت اطلاعات درس.",
      ]);
    }
  }

  function stripProfessorLabel(full) {
    if (!full) return "";
    const idx = full.indexOf("(");
    if (idx > 0) return full.slice(0, idx).trim();
    return full;
  }

  function fillFormWithCourse(course) {
    if (!course) return;
    if (nameEl) {
      nameEl.textContent = course.name || "";
      nameEl.dataset.cleared = "true";
    }
    if (codeEl) {
      codeEl.textContent = course.code || "";
      codeEl.dataset.cleared = "true";
    }
    if (capacityEl) {
      capacityEl.textContent =
        course.capacity != null ? String(course.capacity) : "";
      capacityEl.dataset.cleared = "true";
    }
    if (unitsEl) {
      unitsEl.textContent =
        course.units != null ? String(course.units) : "";
      unitsEl.dataset.cleared = "true";
      setSecondTimePlaceVisibility(course.units);
    }
    if (teacherEl) {
      teacherEl.textContent = stripProfessorLabel(course.professor);
      teacherEl.dataset.cleared = "true";
    }

    const sessions = course.sessions || [];
    const s1 = sessions[0];
    const s2 = sessions[1];

    if (s1) {
      if (day1El) {
        day1El.textContent = dayCodeToFa(s1.day);
        day1El.dataset.cleared = "true";
      }
      if (time1El) {
        time1El.textContent = combineTimeRange(s1);
        time1El.dataset.cleared = "true";
      }
      if (building1El) {
        building1El.textContent = facultyCodeToFa(s1.faculty);
        building1El.dataset.cleared = "true";
      }
      if (room1El) {
        room1El.textContent = s1.room != null ? String(s1.room) : "";
        room1El.dataset.cleared = "true";
      }
    }

    if (s2 && course.units > 2) {
      if (day2El) {
        day2El.textContent = dayCodeToFa(s2.day);
        day2El.dataset.cleared = "true";
      }
      if (time2El) {
        time2El.textContent = combineTimeRange(s2);
        time2El.dataset.cleared = "true";
      }
      if (building2El) {
        building2El.textContent = facultyCodeToFa(s2.faculty);
        building2El.dataset.cleared = "true";
      }
      if (room2El) {
        room2El.textContent = s2.room != null ? String(s2.room) : "";
        room2El.dataset.cleared = "true";
      }
    } else {
      setSecondTimePlaceVisibility(course.units);
    }
  }

 
  function collectLessonData() {
    const unitsNum = parseInt(getText(unitsEl), 10) || 0;

    const day1Label = getText(day1El);
    const time1Label = getText(time1El);
    const room1Label = getText(room1El);
    const fac1Label = getText(building1El);

    const t1 = labelToTimeRange(time1Label);
    const dayCode1 = dayFaToCode(day1Label);
    const facCode1 = facultyFaToCode(fac1Label);

    const sessions = [];

    if (dayCode1 && t1.start && t1.end && facCode1 && room1Label) {
      sessions.push({
        day: dayCode1,
        start_time: t1.start,
        end_time: t1.end,
        faculty: facCode1,
        room: room1Label,
      });
    }

    if (unitsNum > 2) {
      const day2Label = getText(day2El);
      const time2Label = getText(time2El);
      const room2Label = getText(room2El);
      const fac2Label = getText(building2El);

      const t2 = labelToTimeRange(time2Label);
      const dayCode2 = dayFaToCode(day2Label);
      const facCode2 = facultyFaToCode(fac2Label);

      if (dayCode2 && t2.start && t2.end && facCode2 && room2Label) {
        sessions.push({
          day: dayCode2,
          start_time: t2.start,
          end_time: t2.end,
          faculty: facCode2,
          room: room2Label,
        });
      }
    }

    return {
      id: currentCourse ? currentCourse.id : null,
      name: getText(nameEl),
      code: getText(codeEl),
      capacity: parseInt(getText(capacityEl), 10) || 0,
      units: unitsNum,
      professor: getText(teacherEl),
      sessions,
      prerequisites: selectedPrereqIds,
    };
  }


  

  let selectedPrereqIds = [];

function renderSelectedPrereqs() {
  const selected = prereqCourseOptions.filter(o => selectedPrereqIds.includes(o.value));

  
  const chipsHtml = selected.map(o => `
    <span class="pr-chip" data-id="${o.value}">
      ${o.label}
      <button type="button" class="pr-chip-x" data-id="${o.value}">×</button>
    </span>
  `).join("");

  
  prereqCourseValueEl.innerHTML = chipsHtml || `<span class="pr-placeholder">انتخاب درس پیش‌نیاز…</span>`;


  if (prereqCountEl) prereqCountEl.textContent = String(selectedPrereqIds.length);

  
  prereqCourseValueEl.querySelectorAll(".pr-chip-x").forEach(btn => {
    btn.addEventListener("click", (e) => {
      e.stopPropagation(); 
      const id = parseInt(btn.dataset.id, 10);
      selectedPrereqIds = selectedPrereqIds.filter(x => x !== id);
      renderSelectedPrereqs();
    });
  });
}

function addPrereq(id) {
  if (!selectedPrereqIds.includes(id)) {
    selectedPrereqIds.push(id);
    renderSelectedPrereqs();
  }
}





function attachPrereqDropdown() {

  renderSelectedPrereqs();

  attachDropdownToBox(
    prereqCourseBoxSel,
    prereqCourseValueEl,
    () => {
      const currentIdStr = localStorage.getItem(CURRENT_COURSE_ID_KEY);
      const currentId = currentIdStr ? parseInt(currentIdStr, 10) : null;

      return prereqCourseOptions
        .filter(o => !currentId || o.value !== currentId)
        .filter(o => !selectedPrereqIds.includes(o.value));
    },
    (opt) => {
      addPrereq(opt.value);

      
      const box = document.querySelector(prereqCourseBoxSel);
      if (box) setTimeout(() => box.click(), 0);
    }
  );
}




  function validateLesson(data) {
    const errors = [];

    if (!data.name) errors.push("فیلد «نام درس» نباید خالی باشد.");
    if (!data.code) errors.push("فیلد «کد درس» نباید خالی باشد.");
    if (!data.professor) errors.push("فیلد «نام استاد» نباید خالی باشد.");

    if (!data.capacity || isNaN(data.capacity) || data.capacity <= 0) {
      errors.push("فیلد «ظرفیت» باید یک عدد مثبت باشد.");
    }

    if (!data.units || isNaN(data.units) || data.units <= 0) {
      errors.push("فیلد «واحد» باید صحیح وارد شود.");
    }

    if (!data.sessions || data.sessions.length === 0) {
      errors.push("اطلاعات برگزاری اول (روز، ساعت، مکان) کامل نیست.");
    }

    if (data.units > 2 && (!data.sessions || data.sessions.length < 2)) {
      errors.push(
        "برای دروس بیشتر از دو واحد، زمان و مکان دوم باید به‌طور کامل وارد شوند."
      );
    }

    return errors;
  }

  
  async function handleSubmit() {
    const token = localStorage.getItem(TOKEN_KEY);
    if (!token) {
      showValidationOverlay([
        "برای ویرایش درس ابتدا باید وارد حساب کاربری شوید.",
      ]);
      return;
    }

    const payload = collectLessonData();
    const errors = validateLesson(payload);
    if (errors.length > 0) {
      showValidationOverlay(errors);
      return;
    }

    if (!payload.id) {
      showValidationOverlay([
        "شناسه‌ی درس نامشخص است. لطفاً دوباره از لیست دروس وارد صفحه ویرایش شوید.",
      ]);
      return;
    }

    try {
      const res = await fetch(`${API_BASE}/courses/${payload.id}/`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: payload.name,
          code: payload.code,
          units: payload.units,
          capacity: payload.capacity,
          professor: payload.professor,
          sessions: payload.sessions,
        }),
      });

      if (res.status === 401 || res.status === 403) {
        showValidationOverlay([
          "برای ویرایش درس ابتدا باید وارد حساب کاربری شوید.",
        ]);
        return;
      }

      let data;
      try {
        data = await res.json();
      } catch {
        data = null;
      }

      if (!res.ok) {
        const msg =
          (data && (data.detail || data.message || data.error)) ||
          "خطا در ویرایش درس در سرور.";
        showValidationOverlay([msg]);
        return;
      }

      showSuccessOverlay("درس با موفقیت ویرایش شد.", () => {
        window.location.href = "admin-dashboard-list.html";
      });
    } catch (err) {
      console.error("handleSubmit error:", err);
      showValidationOverlay(["خطا در ارتباط با سرور هنگام ویرایش درس."]);
    }
  }


  let notifOverlay = null;
  function getNotifOverlay() {
    if (notifOverlay) return notifOverlay;
    const overlay = document.createElement("div");
    Object.assign(overlay.style, {
      position: "fixed",
      inset: "0",
      display: "none",
      alignItems: "center",
      justifyContent: "center",
      background: "rgba(15,23,42,0.45)",
      zIndex: "9999",
    });

    const box = document.createElement("div");
    Object.assign(box.style, {
      background: "#fff",
      borderRadius: "20px",
      padding: "20px 24px 16px",
      width: "90%",
      maxWidth: "360px",
      direction: "rtl",
      fontFamily: "inherit",
      boxShadow: "0 18px 45px rgba(15,23,42,0.35)",
      textAlign: "right",
    });

    const header = document.createElement("div");
    Object.assign(header.style, {
      display: "flex",
      alignItems: "center",
      gap: "10px",
      marginBottom: "8px",
    });

    const iconWrap = document.createElement("div");
    Object.assign(iconWrap.style, {
      width: "34px",
      height: "34px",
      borderRadius: "999px",
      background: "rgba(59,23,92,0.12)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    });

    const iconInner = document.createElement("div");
    iconInner.textContent = "i";
    Object.assign(iconInner.style, {
      width: "20px",
      height: "20px",
      borderRadius: "999px",
      background: "#3b175c",
      color: "#fff",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontWeight: "700",
      fontSize: "13px",
    });
    iconWrap.appendChild(iconInner);

    const title = document.createElement("div");
    title.textContent = "اعلان‌ها";
    Object.assign(title.style, {
      fontSize: "14px",
      fontWeight: "600",
      color: "#111827",
    });

    header.appendChild(iconWrap);
    header.appendChild(title);

    const msg = document.createElement("div");
    msg.textContent = "اعلان جدیدی برای نمایش وجود ندارد.";
    Object.assign(msg.style, {
      fontSize: "13px",
      color: "#4b5563",
      lineHeight: "1.7",
      marginBottom: "14px",
    });

    const btnRow = document.createElement("div");
    Object.assign(btnRow.style, {
      display: "flex",
      justifyContent: "flex-start",
    });

    const okBtn = document.createElement("button");
    okBtn.textContent = "متوجه شدم";
    Object.assign(okBtn.style, {
      border: "none",
      borderRadius: "999px",
      padding: "7px 16px",
      cursor: "pointer",
      fontSize: "13px",
      background: "linear-gradient(135deg,#3b175c,#6b21a8)",
      color: "#fff",
      boxShadow: "0 8px 20px rgba(107,33,168,0.35)",
    });
    okBtn.addEventListener("click", () => {
      overlay.style.display = "none";
    });

    btnRow.appendChild(okBtn);
    box.appendChild(header);
    box.appendChild(msg);
    box.appendChild(btnRow);
    overlay.appendChild(box);

    overlay.addEventListener("click", (e) => {
      if (e.target === overlay) overlay.style.display = "none";
    });

    document.body.appendChild(overlay);
    notifOverlay = overlay;
    return overlay;
  }

  function showNotificationMessage() {
    const overlay = getNotifOverlay();
    overlay.style.display = "flex";
  }

  if (submitBtn) {
    submitBtn.style.cursor = "pointer";
    submitBtn.addEventListener("click", (e) => {
      e.preventDefault();
      handleSubmit();
    });
  }

  if (cancelBtn) {
    cancelBtn.style.cursor = "pointer";
    cancelBtn.addEventListener("click", () => {
      window.location.href = "admin-dashboard-list.html";
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
          localStorage.removeItem(TOKEN_KEY);
          window.location.href = "login.html";
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
      showNotificationMessage();
    });
  }

  (async function init() {
    await loadChoicesFromBackend();

    // units
    attachDropdownToBox(".frame-34", unitsEl, () => unitOptions, (opt) => {
      setSecondTimePlaceVisibility(opt.value);
    });

    // روز و زمان جلسه اول
    attachDropdownToBox(".select", day1El, () => dayOptions);
    attachDropdownToBox(".select2", time1El, () => timeOptions);

    // روز و زمان جلسه دوم
    attachDropdownToBox(".gp1", day2El, () => dayOptions);
    attachDropdownToBox(".gp2", time2El, () => timeOptions);

    // مکان جلسه اول
    attachDropdownToBox(".select4", building1El, () => facultyOptions, (opt) => {
      const facultyCode = opt.value;
      const rooms = classroomChoicesByFaculty[facultyCode] || [];
      room1El.textContent = rooms.length ? String(rooms[0]) : "";
    });
    attachDropdownToBox(".select3", room1El, () => {
      const facultyCode = facultyFaToCode(getText(building1El)) || "eng";
      const rooms = classroomChoicesByFaculty[facultyCode] || [];
      return rooms.map((r) => ({ value: r, label: String(r) }));
    });

    // مکان جلسه دوم
    attachDropdownToBox(".gp4", building2El, () => facultyOptions, (opt) => {
      const facultyCode = opt.value;
      const rooms = classroomChoicesByFaculty[facultyCode] || [];
      room2El.textContent = rooms.length ? String(rooms[0]) : "";
    });
    attachDropdownToBox(".gp3", room2El, () => {
      const facultyCode = facultyFaToCode(getText(building2El)) || "eng";
      const rooms = classroomChoicesByFaculty[facultyCode] || [];
      return rooms.map((r) => ({ value: r, label: String(r) }));
    });

    
    await loadCourseFromServer();
  })();

   loadChoicesFromBackend();
   loadPrereqCourses();
  attachPrereqDropdown();
   loadCourseFromServer();
});


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
  setInterval(updateDateTime, 1000);
})();
