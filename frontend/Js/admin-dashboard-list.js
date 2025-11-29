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