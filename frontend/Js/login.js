const $ = (s) => document.querySelector(s);

document.addEventListener("DOMContentLoaded", () => {
  const userField = document.querySelector(".user-name");
  const passField = document.querySelector(".pass-word");
  const captchaField = document.querySelector(".capcha");

  const usernameContainer = document.querySelector(".user-name .frame-24");
  const passwordContainer = document.querySelector(".pass-word .frame-24");
  const captchaInputContainer = document.querySelector(".capcha .frame-4");
  const captchaVisualContainer = document.querySelector(".capcha .frame-5");

  const loginBtn = document.querySelector(".login-submit");
  const refreshBtn = document.querySelector(".mdi-light-refresh");
  const rememberBox = document.querySelector(".remember-me .frame-6");

  let currentCaptcha = "";
  let rememberMeState = false;

 
  function createTextInput(id, type, placeholder) {
    const input = document.createElement("input");
    input.id = id;
    input.type = type;
    input.placeholder = placeholder;
    input.className = "text-input";
    input.dir = "rtl";
    return input;
  }
  const usernameInput = createTextInput("username", "text", "نام کاربری");
  const passwordInput = createTextInput("password", "password", "کلمه عبور");
  const captchaInput = createTextInput("captcha-input", "text", "کد امنیتی");

  usernameContainer.appendChild(usernameInput);
  passwordContainer.appendChild(passwordInput);
  captchaInputContainer.appendChild(captchaInput);

  const captchaCodeEl = document.createElement("span");
  captchaCodeEl.id = "captcha-code";
  captchaCodeEl.className = "captcha-code";
  captchaVisualContainer.appendChild(captchaCodeEl);

  function generateCaptcha() {
    const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
    let code = "";
    for (let i = 0; i < 5; i++) code += chars[Math.floor(Math.random() * chars.length)];
    currentCaptcha = code;
    captchaCodeEl.textContent = code;
  }

  generateCaptcha();

  if (refreshBtn) {
    refreshBtn.style.cursor = "pointer";
    refreshBtn.addEventListener("click", () => {
      generateCaptcha();
      captchaInput.value = "";
    });
  }
   function createErrorElement(parent) {
    const el = document.createElement("span");
    el.className = "error-inline";
    el.style.color = "#d00000";
    el.style.fontSize = "12px";
    el.style.display = "none";
    parent.appendChild(el);
    return el;
  }

  const userError = createErrorElement(userField);
  const passError = createErrorElement(passField);
  const captchaError = createErrorElement(captchaField);

  function showInlineError(el, msg) {
    el.style.display = "block";
    el.textContent = msg;
  }

  function hideErrors() {
    [userError, passError, captchaError].forEach((e) => {
      e.style.display = "none";
      e.textContent = "";
    });
  }

   if (rememberBox) {
    rememberBox.style.cursor = "pointer";

    rememberBox.addEventListener("click", () => {
      rememberMeState = !rememberMeState;
      rememberBox.classList.toggle("checked", rememberMeState);

      if (rememberMeState) {
        localStorage.setItem("sabau-login-username", usernameInput.value.trim());
      } else {
        localStorage.removeItem("sabau-login-username");
      }
    });
  }
const savedUser = localStorage.getItem("sabau-login-username");
  if (savedUser) {
    usernameInput.value = savedUser;
    rememberMeState = true;
    rememberBox.classList.add("checked");
  }

  usernameInput.addEventListener("input", () => {
    if (rememberMeState) {
      localStorage.setItem("sabau-login-username", usernameInput.value.trim());
    }
  });
