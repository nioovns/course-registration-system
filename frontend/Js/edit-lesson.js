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