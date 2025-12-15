document.addEventListener("DOMContentLoaded", () => {
  const API_URL = "http://127.0.0.1:8000/api/enrollment-settings/";
  const TOKEN_KEY = "sabau-token";

 
  const minEl = document.querySelector(".group-65 ._1");        
  const maxEl = document.querySelector(".group-66 ._493284"); 
  const bellBadge = document.querySelector(".badge-with-notification ._12");
  const bellWrapper = document.querySelector(".badge-with-notification");  
  const logoutIcon = document.querySelector(".solar-logout-outline");

  
  const saveBtn = document.querySelector(".login-submit");      
  const cancelBtn = document.querySelector(".login-submit2");   

  
  const lessonsLink = document.querySelector(".sidenav-link");
  const unitsLink = document.querySelector(".sidenav-link3");

  
  const token = localStorage.getItem(TOKEN_KEY);
  if (!token) {
    window.location.href = "login.html";
    return;
  }

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

  // دکمه‌ها
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

  function makeNumberEditable(el) {
    if (!el) return;
    el.setAttribute("contenteditable", "true");
    el.style.cursor = "text";
    el.style.userSelect = "text";
    el.style.pointerEvents = "auto";
    el.tabIndex = 0;

    el.addEventListener("input", () => {
      const cleaned = (el.textContent || "").replace(/[^\d]/g, "");
      if (el.textContent !== cleaned) el.textContent = cleaned;

      const r = document.createRange();
      r.selectNodeContents(el);
      r.collapse(false);
      const s = window.getSelection();
      if (s) {
        s.removeAllRanges();
        s.addRange(r);
      }
    });
  }

  makeNumberEditable(minEl);
  makeNumberEditable(maxEl);

  function toInt(el) {
    const v = (el?.textContent || "").trim();
    if (!v) return null;
    const n = parseInt(v, 10);
    return Number.isFinite(n) ? n : null;
  }

  async function saveSettings() {
    const minUnits = toInt(minEl);
    const maxUnits = toInt(maxEl);

    if (minUnits === null || maxUnits === null) {
      alert("حداقل و حداکثر واحد باید عدد باشند.");
      return;
    }
    if (minUnits < 0 || maxUnits < 0) {
      alert("مقادیر نمی‌توانند منفی باشند.");
      return;
    }
    if (minUnits > maxUnits) {
      alert("حداقل واحد نباید از حداکثر واحد بیشتر باشد.");
      return;
    }

    const payload = {
      is_active: true,
      min_units: minUnits,
      max_units: maxUnits,
    };

    try {
      const res = await fetch(API_URL, {
        method: "POST", 
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (res.status === 401 || res.status === 403) {
        const t = await res.text();
        console.log("Auth error:", res.status, t);
        alert("دسترسی ندارید. (این endpoint ممکن است Basic Auth بخواهد)");
        return;
      }

      if (!res.ok) {
        const t = await res.text();
        console.log("POST error:", res.status, t);
        alert("خطا در ثبت تنظیمات.");
        return;
      }

      alert("تنظیمات با موفقیت ثبت شد ✅");
    } catch (e) {
      console.log("Network error:", e);
      alert("عدم ارتباط با سرور.");
    }
  }

  if (saveBtn) {
    saveBtn.style.cursor = "pointer";
    saveBtn.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      saveSettings();
    });
  }

  if (cancelBtn) {
    cancelBtn.style.cursor = "pointer";
    cancelBtn.addEventListener("click", () => {
      window.location.href = "admin-dashboard-list.html";
    });
  }
  if (bellWrapper) {
    bellWrapper.style.cursor = "pointer";
    bellWrapper.addEventListener("click", () => {
      if (bellBadge) {
        bellBadge.textContent = "";
        bellBadge.parentElement.style.display = "none";
      }
      showGlobalError("اعلان جدیدی برای نمایش وجود ندارد.");
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

      onConfirm: async () => {

        const token = localStorage.getItem("sabau-token");

        try {
          const res = await fetch("http://127.0.0.1:8000/api/auth/logout/", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({})
          });

          console.log("Logout response:", res.status);

        } catch (err) {
          console.error("Logout error:", err);
        }

      
        localStorage.removeItem("sabau-token");

        window.location.href = "login.html";
      }
    });
  });
}
  if (lessonsLink) {
    lessonsLink.style.cursor = "pointer";
    lessonsLink.addEventListener("click", () => {
      window.location.href = "admin-dashboard-list.html";
    });
  }
  if (unitsLink) {
    unitsLink.style.cursor = "pointer";
    unitsLink.addEventListener("click", () => {
      window.location.href = "unit-management.html";
    });
  }
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
  const weekday = parts.find(p => p.type === "weekday")?.value ?? "";
  const day = parts.find(p => p.type === "day")?.value ?? "";
  const month = parts.find(p => p.type === "month")?.value ?? "";
  const year = parts.find(p => p.type === "year")?.value ?? "";

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
