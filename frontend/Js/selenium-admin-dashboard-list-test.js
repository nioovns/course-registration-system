const { Builder, By, until } = require("selenium-webdriver");
const chrome = require("selenium-webdriver/chrome");

const DASHBOARD_URL = "http://127.0.0.1:5500/Pages/admin-dashboard-list.html";
const LOGIN_URL_FRAGMENT = "login.html";
const ADD_LESSON_URL_FRAGMENT = "add-lesson.html";

