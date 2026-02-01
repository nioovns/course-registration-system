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

  fetchEnrollments(courseId);

  // ===============================
  // گرفتن لیست ثبت‌نام‌ها
  // ===============================
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

 function renderTable(list) {
  // پاک‌کردن جدول
  tbody.innerHTML = "";

  // اگر لیست خالی است
  if (!Array.isArray(list) || list.length === 0) {
    const emptyRow = document.createElement("div");
    emptyRow.style.padding = "14px";
    emptyRow.style.textAlign = "center";
    emptyRow.style.color = "#777";
    emptyRow.textContent = "دانشجویی برای این درس ثبت‌نام نکرده است";
    tbody.appendChild(emptyRow);
    return;
  }

  // ساخت ردیف‌ها
  list.forEach((item, index) => {
    const row = document.createElement("div");
    row.className = "tr2";

    row.innerHTML = `
      <!-- عملیات -->
      <div class="td operation">—</div>

      <!-- شماره دانشجویی -->
      <div class="td2">
        ${item.student_number || "—"}
      </div>

      <!-- نام و نام خانوادگی -->
      <div class="td2">
        ${item.full_name || "—"}
      </div>

      <!-- ردیف -->
      <div class="td2">
        ${index + 1}
      </div>
    `;

    tbody.appendChild(row);
  });
}


  // ===============================
  // پیام ساده
  // ===============================
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
