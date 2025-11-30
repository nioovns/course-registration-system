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