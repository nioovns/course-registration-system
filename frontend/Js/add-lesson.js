document.addEventListener("DOMContentLoaded", () => {
  const $ = (s) => document.querySelector(s);

  const saveBtn = document.querySelector(".group-98 .login-submit");
  const cancelBtn = document.querySelector(".group-98 .login-submit2");

  const nameEl = document.querySelector(".group-65 ._1"); 
  const codeEl = document.querySelector(".group-66 ._493284"); 
  const capacityEl = document.querySelector(".group-67 ._30"); 
  const teacherEl = document.querySelector(".group-652 .p-name"); 
  const searchEl = document.querySelector(".th4 .search"); 

  const unitsWrapper = document.querySelector(".group-68 .frame-34");
  const unitsTextEl = document.querySelector(".group-68 ._3");

  
  const logoutIcon = document.querySelector(".solar-logout-outline");
  const bellWrapper = document.querySelector(".badge-with-notification");
  const bellBadge = document.querySelector(".badge-with-notification ._12");

  const dayWrapper1 = document.querySelector(".group-102 .select");
  const timeWrapper1 = document.querySelector(".group-102 .select2");
  const dayTextEl1 = dayWrapper1 ? dayWrapper1.querySelector(".one") : null;
  const timeTextEl1 = timeWrapper1 ? timeWrapper1.querySelector(".one") : null;

  const gp1Wrapper = document.querySelector(".group-102 .gp1"); 
  const gp2Wrapper = document.querySelector(".group-102 .gp2"); 
  const gp1TextEl = gp1Wrapper ? gp1Wrapper.querySelector(".one") : null;
  const gp2TextEl = gp2Wrapper ? gp2Wrapper.querySelector(".one") : null;

  const roomWrapper1 = document.querySelector(".group-101 .select3");
  const facultyWrapper1 = document.querySelector(".group-101 .select4");
  const roomTextEl1 = roomWrapper1 ? roomWrapper1.querySelector(".one2") : null;
  const facultyTextEl1 = facultyWrapper1 ? facultyWrapper1.querySelector(".one") : null;

  const gp3Wrapper = document.querySelector(".group-101 .gp3");
  const gp4Wrapper = document.querySelector(".group-101 .gp4");
  const gp3TextEl = gp3Wrapper ? gp3Wrapper.querySelector(".one2") : null;
  const gp4TextEl = gp4Wrapper ? gp4Wrapper.querySelector(".my-gp") : null;

  const gp1InitialDisplay = gp1Wrapper ? getComputedStyle(gp1Wrapper).display : null;
  const gp2InitialDisplay = gp2Wrapper ? getComputedStyle(gp2Wrapper).display : null;
  const gp3InitialDisplay = gp3Wrapper ? getComputedStyle(gp3Wrapper).display : null;
  const gp4InitialDisplay = gp4Wrapper ? getComputedStyle(gp4Wrapper).display : null;

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

  function showGlobalErrorList(errorItems) {
    const overlay = createGlobalOverlay();
    const msgEl = overlay.querySelector(".global-message-text");

    
    let text = "لطفاً خطاهای زیر را بررسی کنید:\n\n";
    text += errorItems.map((e) => `• ${e.field}: ${e.message}`).join("\n");

    if (msgEl) msgEl.textContent = text;
    overlay.style.display = "flex";
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
      if (e.target === overlay) {
        overlay.style.display = "none";
      }
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

  const dayOptions = ["شنبه","یکشنبه","دوشنبه","سه‌شنبه","چهارشنبه"]
    .map(d => ({ value: d, label: d }));
  const timeOptions = ["8-10","10-12","14-16","16-18"]
    .map(t => ({ value: t, label: t }));
  const facultyOptions = ["مهندسی","علوم","فنی","ادبیات","الهیات"]
    .map(f => ({ value: f, label: f }));
  const roomOptions = ["100","120","150","200","203","210","220","305"]
    .map(r => ({ value: r, label: r }));
  const unitOptions = [1,2,3,4]
    .map(u => ({ value: u, label: String(u) }));