document.addEventListener("DOMContentLoaded", () => {
  
  const $ = (sel) => document.querySelector(sel);

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
      box.style.background = "#fff";
      box.style.borderRadius = "24px";
      box.style.padding = "24px 28px 20px";
      box.style.maxWidth = "420px";
      box.style.width = "90%";
      box.style.direction = "rtl";
      box.style.fontFamily = "inherit";
      box.style.boxShadow = "0 16px 45px rgba(15,23,42,.35)";
      box.style.position = "relative";

      const iconWrap = document.createElement("div");
      iconWrap.style.width = "42px";
      iconWrap.style.height = "42px";
      iconWrap.style.borderRadius = "999px";
      iconWrap.style.background = "rgba(239,68,68,.08)";
      iconWrap.style.display = "flex";
      iconWrap.style.alignItems = "center";
      iconWrap.style.justifyContent = "center";
      iconWrap.style.marginBottom = "12px";

      const iconInner = document.createElement("div");
      iconInner.textContent = "!";
      iconInner.style.width = "24px";
      iconInner.style.height = "24px";
      iconInner.style.borderRadius = "999px";
      iconInner.style.background = "#ef4444";
      iconInner.style.color = "#fff";
      iconInner.style.display = "flex";
      iconInner.style.alignItems = "center";
      iconInner.style.justifyContent = "center";
      iconInner.style.fontWeight = "700";
      iconInner.style.fontSize = "16px";
      iconWrap.appendChild(iconInner);

      const title = document.createElement("div");
      title.textContent = "خطا در ثبت / ویرایش درس";
      title.style.fontSize = "15px";
      title.style.fontWeight = "600";
      title.style.color = "#b91c1c";
      title.style.marginBottom = "4px";

      const desc = document.createElement("div");
      desc.textContent = "لطفاً موارد زیر را بررسی و اصلاح کنید.";
      desc.style.fontSize = "13px";
      desc.style.color = "#4b5563";
      desc.style.marginBottom = "10px";

      const list = document.createElement("ul");
      list.className = "validation-error-list";
      list.style.margin = "0";
      list.style.padding = "0 18px 0 0";
      list.style.fontSize = "12px";
      list.style.color = "#b91c1c";
      list.style.lineHeight = "1.8";
      list.style.textAlign = "right";

      const btnRow = document.createElement("div");
      btnRow.style.display = "flex";
      btnRow.style.flexDirection = "row-reverse";
      btnRow.style.marginTop = "18px";

      const okBtn = document.createElement("button");
      okBtn.textContent = "متوجه شدم";
      okBtn.style.border = "none";
      okBtn.style.borderRadius = "999px";
      okBtn.style.padding = "8px 20px";
      okBtn.style.background = "linear-gradient(135deg,#3b175c,#5b21b6)";
      okBtn.style.color = "#fff";
      okBtn.style.cursor = "pointer";
      okBtn.style.fontSize = "13px";
      okBtn.style.fontWeight = "500";
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
      box.style.background = "#fff";
      box.style.borderRadius = "24px";
      box.style.padding = "24px 28px 20px";
      box.style.maxWidth = "360px";
      box.style.width = "90%";
      box.style.direction = "rtl";
      box.style.fontFamily = "inherit";
      box.style.boxShadow = "0 16px 45px rgba(15,23,42,.35)";

      const iconWrap = document.createElement("div");
      iconWrap.style.width = "42px";
      iconWrap.style.height = "42px";
      iconWrap.style.borderRadius = "999px";
      iconWrap.style.background = "rgba(22,163,74,.1)";
      iconWrap.style.display = "flex";
      iconWrap.style.alignItems = "center";
      iconWrap.style.justifyContent = "center";
      iconWrap.style.marginBottom = "12px";

      const iconInner = document.createElement("div");
      iconInner.textContent = "✓";
      iconInner.style.width = "24px";
      iconInner.style.height = "24px";
      iconInner.style.borderRadius = "999px";
      iconInner.style.background = "#16a34a";
      iconInner.style.color = "#fff";
      iconInner.style.display = "flex";
      iconInner.style.alignItems = "center";
      iconInner.style.justifyContent = "center";
      iconInner.style.fontWeight = "700";
      iconInner.style.fontSize = "16px";
      iconWrap.appendChild(iconInner);

      const msgEl = document.createElement("div");
      msgEl.className = "success-message";
      msgEl.style.fontSize = "13px";
      msgEl.style.color = "#065f46";
      msgEl.style.lineHeight = "1.8";
      msgEl.style.marginBottom = "16px";

      const btnRow = document.createElement("div");
      btnRow.style.display = "flex";
      btnRow.style.flexDirection = "row-reverse";

      const okBtn = document.createElement("button");
      okBtn.textContent = "باشه";
      okBtn.style.border = "none";
      okBtn.style.borderRadius = "999px";
      okBtn.style.padding = "8px 20px";
      okBtn.style.background = "#3b175c";
      okBtn.style.color = "#fff";
      okBtn.style.cursor = "pointer";
      okBtn.style.fontSize = "13px";
      okBtn.style.fontWeight = "500";

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
    box.style.background = "#fff";
    box.style.borderRadius = "20px";
    box.style.padding = "22px 24px 18px";
    box.style.maxWidth = "380px";
    box.style.width = "90%";
    box.style.direction = "rtl";
    box.style.fontFamily = "inherit";
    box.style.boxShadow = "0 18px 45px rgba(15,23,42,.35)";

    const iconWrap = document.createElement("div");
    iconWrap.style.width = "42px";
    iconWrap.style.height = "42px";
    iconWrap.style.borderRadius = "999px";
    iconWrap.style.background = "rgba(239,68,68,.08)";
    iconWrap.style.display = "flex";
    iconWrap.style.alignItems = "center";
    iconWrap.style.justifyContent = "center";
    iconWrap.style.marginBottom = "12px";

    const iconInner = document.createElement("div");
    iconInner.textContent = "!";
    iconInner.style.width = "24px";
    iconInner.style.height = "24px";
    iconInner.style.borderRadius = "999px";
    iconInner.style.background = "#ef4444";
    iconInner.style.color = "#fff";
    iconInner.style.display = "flex";
    iconInner.style.alignItems = "center";
    iconInner.style.justifyContent = "center";
    iconInner.style.fontWeight = "700";
    iconInner.style.fontSize = "16px";
    iconWrap.appendChild(iconInner);

    confirmTitleEl = document.createElement("div");
    confirmTitleEl.textContent = "خروج از حساب";
    confirmTitleEl.style.fontSize = "15px";
    confirmTitleEl.style.fontWeight = "600";
    confirmTitleEl.style.color = "#0f172a";
    confirmTitleEl.style.marginBottom = "4px";

    confirmMsgEl = document.createElement("div");
    confirmMsgEl.textContent = "آیا مطمئن هستید که می‌خواهید خارج شوید؟";
    confirmMsgEl.style.fontSize = "13px";
    confirmMsgEl.style.color = "#4b5563";
    confirmMsgEl.style.lineHeight = "1.7";
    confirmMsgEl.style.marginBottom = "16px";

    const btnRow = document.createElement("div");
    btnRow.style.display = "flex";
    btnRow.style.flexDirection = "row-reverse";
    btnRow.style.gap = "8px";

    confirmYesBtn = document.createElement("button");
    confirmYesBtn.textContent = "خروج";
    confirmYesBtn.style.border = "none";
    confirmYesBtn.style.borderRadius = "999px";
    confirmYesBtn.style.padding = "8px 18px";
    confirmYesBtn.style.background =
      "linear-gradient(135deg,#ef4444,#b91c1c)";
    confirmYesBtn.style.color = "#fff";
    confirmYesBtn.style.cursor = "pointer";
    confirmYesBtn.style.fontSize = "13px";

    confirmNoBtn = document.createElement("button");
    confirmNoBtn.textContent = "انصراف";
    confirmNoBtn.style.border = "1px solid #e5e7eb";
    confirmNoBtn.style.borderRadius = "999px";
    confirmNoBtn.style.padding = "8px 16px";
    confirmNoBtn.style.background = "#fff";
    confirmNoBtn.style.color = "#374151";
    confirmNoBtn.style.cursor = "pointer";
    confirmNoBtn.style.fontSize = "13px";

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

  const gp1 = document.querySelector(".gp1");
  const gp2 = document.querySelector(".gp2");
  const gp3 = document.querySelector(".gp3");
  const gp4 = document.querySelector(".gp4");

  const submitBtn = document.querySelector(".login-submit");
  const cancelBtn = document.querySelector(".login-submit2");

  const logoutIcon = document.querySelector(".solar-logout-outline");
  const bellWrapper = document.querySelector(".badge-with-notification");
  const bellBadge = document.querySelector(".badge-with-notification ._12");

  const searchEl = document.querySelector(".search");

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
  return String(str).replace(/[۰-۹٠-٩]/g, d => map[d] || d);
}


function setSecondTimePlaceVisibility(unitsValue) {
  const normalized = normalizeDigits(unitsValue);
  const num = parseInt(normalized, 10);
  const showSecond = !isNaN(num) && num > 2;

  const secondPair = document.querySelectorAll(".gp3, .gp4 , .gp1 , .gp2");

  secondPair.forEach((el) => {
    if (!el) return;
    el.style.display = showSecond ? "flex" : "none";
    el.style.visibility = showSecond ? "visible" : "hidden";
  });

}

const unitOptions = [1, 2, 3, 4].map((n) => ({ value: n, label: String(n) }));
  const dayOptions = [
    "شنبه",
    "یکشنبه",
    "دوشنبه",
    "سه‌شنبه",
    "چهارشنبه",
  ].map((d) => ({ value: d, label: d }));
  const timeOptions = ["8-10", "10-12", "14-16", "16-18"].map(
    (t) => ({ value: t, label: t })
  );
  const roomOptions = ["200", "203", "305", "120", "150"].map((r) => ({
    value: r,
    label: r,
  }));
  const buildingOptions = ["مهندسی", "علوم", "الهیات", "ادبیات"].map((b) => ({
    value: b,
    label: b,
  }));

  function attachDropdownToBox(boxSelector, valueEl, options, onChange) {
    const box = document.querySelector(boxSelector);
    if (!box || !valueEl) return;
    box.style.cursor = "pointer";

    box.addEventListener("click", (e) => {
      e.stopPropagation();
      createDropdown(box, options, (opt) => {
        valueEl.textContent = opt.label;
        if (valueEl.dataset) valueEl.dataset.cleared = "true";
        if (typeof onChange === "function") onChange(opt.value);
      });
    });
  }

  
  attachDropdownToBox(".frame-34", unitsEl, unitOptions, (val) => {
    setSecondTimePlaceVisibility(val);
  });

  
  attachDropdownToBox(".select", day1El, dayOptions);
  attachDropdownToBox(".select2", time1El, timeOptions);


  attachDropdownToBox(".gp1", day2El, dayOptions);
  attachDropdownToBox(".gp2", time2El, timeOptions);

 
  attachDropdownToBox(".select3", room1El, roomOptions);
  attachDropdownToBox(".select4", building1El, buildingOptions);

  
  attachDropdownToBox(".gp3", room2El, roomOptions);
  attachDropdownToBox(".gp4", building2El, buildingOptions);

   function loadLessons() {
    try {
      const raw = localStorage.getItem("sabau-lessons");
      if (!raw) return [];
      const parsed = JSON.parse(raw);
      if (!Array.isArray(parsed)) return [];
      return parsed;
    } catch (e) {
      console.error("Error reading lessons:", e);
      return [];
    }
  }

  function saveLessons(list) {
    localStorage.setItem("sabau-lessons", JSON.stringify(list));
  }

  const lessons = loadLessons();
  const currentIdStr = localStorage.getItem("sabau-current-lesson-id");
  const currentId = currentIdStr ? parseInt(currentIdStr, 10) : null;
  const currentLesson = lessons.find((l) => l.id === currentId);

  if (!currentLesson) {
    showValidationOverlay([
      "درس مورد نظر برای ویرایش پیدا نشد. لطفاً دوباره از لیست دروس وارد صفحه ویرایش شوید.",
    ]);
  } else {
    
    if (nameEl) {
      nameEl.textContent = currentLesson.name || "";
      nameEl.dataset.cleared = "true";
    }
    if (codeEl) {
      codeEl.textContent = currentLesson.code || "";
      codeEl.dataset.cleared = "true";
    }
    if (capacityEl) {
      capacityEl.textContent =
        currentLesson.capacity != null ? String(currentLesson.capacity) : "";
      capacityEl.dataset.cleared = "true";
    }
    if (unitsEl) {
      unitsEl.textContent =
        currentLesson.units != null ? String(currentLesson.units) : "";
      unitsEl.dataset.cleared = "true";
      setSecondTimePlaceVisibility(currentLesson.units);
    }
    if (teacherEl) {
      teacherEl.textContent = currentLesson.teacher || "";
      teacherEl.dataset.cleared = "true";
    }

    if (day1El) {
      day1El.textContent = currentLesson.day1 || "شنبه";
      day1El.dataset.cleared = "true";
    }
    if (time1El) {
      time1El.textContent = currentLesson.time1 || "14-16";
      time1El.dataset.cleared = "true";
    }
    if (room1El) {
      room1El.textContent =
        currentLesson.room1 != null ? String(currentLesson.room1) : "200";
      room1El.dataset.cleared = "true";
    }
    if (building1El) {
      building1El.textContent = currentLesson.building1 || "مهندسی";
      building1El.dataset.cleared = "true";
    }

    
    if (currentLesson.units > 2) {
      if (day2El) {
        day2El.textContent = currentLesson.day2 || "دوشنبه";
        day2El.dataset.cleared = "true";
      }
      if (time2El) {
        time2El.textContent = currentLesson.time2 || "10-12";
        time2El.dataset.cleared = "true";
      }
      if (room2El) {
        room2El.textContent =
          currentLesson.room2 != null ? String(currentLesson.room2) : "203";
        room2El.dataset.cleared = "true";
      }
      if (building2El) {
        building2El.textContent = currentLesson.building2 || "الهیات";
        building2El.dataset.cleared = "true";
      }
    }
  }

