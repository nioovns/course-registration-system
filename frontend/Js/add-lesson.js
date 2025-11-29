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