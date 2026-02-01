document.addEventListener("DOMContentLoaded", () => {
  const tbody = document.querySelector(".datatable .tbody");

  const token = localStorage.getItem("sabau-token");
  if (!token) {
    window.location.href = "login.html";
    return;
  }

  const courseId = localStorage.getItem("selected-course-id");
  if (!courseId) {
    alert("شناسه درس یافت نشد");
    return;
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

 


  fetchEnrollments(courseId);

  async function fetchEnrollments(courseId) {
    try {
      const res = await fetch(
        `http://127.0.0.1:8000/api/enrollment/courses/${courseId}/enrollments`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        }
      );

      if (!res.ok) {
        console.error("STATUS:", res.status);
        showMessage("خطا در دریافت لیست دانشجویان");
        return;
      }

      const data = await res.json();
      renderTable(data);

    } catch (err) {
      console.error("FETCH ERROR:", err);
      showMessage("عدم ارتباط با سرور");
    }
  }

 const viewCoursesBtn = document.querySelector(".sidenav-link");

if (viewCoursesBtn) {
  viewCoursesBtn.style.cursor = "pointer";

  viewCoursesBtn.addEventListener("click", () => {
    window.location.href = "professor-dashboard.html";
  });
}



async function deleteEnrollment(courseId, studentDbId) {
  try {
    const res = await fetch(
      `http://127.0.0.1:8000/api/enrollment/courses/${courseId}/enrollments/${studentDbId}/`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (res.status === 204) {
      return { ok: true };
    }

    const errText = await res.text();
    console.error("DELETE ERROR:", errText);
    return { ok: false, error: "حذف دانشجو ناموفق بود" };

  } catch (e) {
    console.error("DELETE FETCH ERROR:", e);
    return { ok: false, error: "خطا در ارتباط با سرور" };
  }
}


const logoutIcon = document.querySelector(".solar-logout-outline");

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
          await fetch("http://127.0.0.1:8000/api/auth/logout/", {
            method: "POST",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({}),
          });
        } catch (err) {
          console.error("LOGOUT ERROR:", err);
        }

        
        localStorage.removeItem("sabau-token");
        localStorage.removeItem("selected-course-id");

       
        window.location.href = "login.html";
      },
    });
  });
}

function renderTable(list) {
  tbody.innerHTML = "";

  if (!Array.isArray(list) || list.length === 0) {
    tbody.innerHTML = `
      <div style="padding:14px; text-align:center; color:#777">
        دانشجویی برای این درس ثبت‌نام نکرده است
      </div>
    `;
    return;
  }

  const courseId = localStorage.getItem("selected-course-id");

  list.forEach((item, index) => {
    const row = document.createElement("div");
    row.className = "tr2";

    row.innerHTML = `
      <!-- عملیات -->
      <div class="td">
        <img
          class="group-10"
          src="../Image/trash.svg"
          alt="حذف دانشجو"
          title="حذف دانشجو"
          style="cursor:pointer"
        />
      </div>

      <!-- شماره دانشجویی -->
      <div class="td2">
        <div class="_45789">${item.student_id || "—"}</div>
      </div>

      <!-- نام و نام خانوادگی -->
      <div class="td2">
        <div class="_1">${item.full_name || "—"}</div>
      </div>

      <!-- ردیف -->
      <div class="td2">
        <div class="_30">${index + 1}</div>
      </div>
    `;

    console.log("ROW ITEM:", item);

    const trashIcon = row.querySelector(".group-10");

   trashIcon.addEventListener("click", () => {
  showConfirmDialog({
    title: "حذف دانشجو",
    message: `آیا از حذف «${item.full_name}» از این درس مطمئن هستید؟`,
    confirmText: "حذف",
    cancelText: "انصراف",

    onConfirm: async () => {
      const result = await deleteEnrollment(
        courseId,
        item.student_db_id
      );

      if (!result.ok) {
        showGlobalError(result.error);
        return;
      }

      showGlobalError("دانشجو با موفقیت حذف شد ✅");
      fetchEnrollments(courseId);
    },
  });
});



    tbody.appendChild(row);
  });
}

  function showMessage(text) {
    const div = document.createElement("div");
    div.textContent = text;
    Object.assign(div.style, {
      position: "fixed",
      bottom: "20px",
      left: "20px",
      background: "#3b175c",
      color: "#fff",
      padding: "10px 16px",
      borderRadius: "12px",
      fontSize: "13px",
      zIndex: 9999,
    });

    document.body.appendChild(div);
    setTimeout(() => div.remove(), 2500);
  }
});
