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
