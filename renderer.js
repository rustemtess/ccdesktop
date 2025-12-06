function updateTexts() {
  const backToMenu = document.getElementById("backToMenu");
  const nextLevel = document.getElementById("next");
  const instructions = document.getElementById("instructions");
  const menu = document.getElementById("menu");
  const first_game = document.querySelectorAll(".first_game");
  const second_game = document.querySelectorAll(".second_game");
  const third_game = document.querySelectorAll(".third_game");
  const neverbal = document.querySelectorAll(".neverbal");
  const test_schulte = document.querySelectorAll(".test_schulte");
  const korrektura = document.querySelectorAll(".korrektura");
  const simple_analog = document.querySelectorAll(".simple_analog");
  const parnye_analog = document.querySelectorAll(".parnye_analog");
  const level = document.getElementById("level");
  const reset = document.getElementById("reset-button");
  if (backToMenu && nextLevel) {
    level.innerText = window.electronAPI.t("level");
    backToMenu.innerText = window.electronAPI.t("backToMenu");
    nextLevel.innerText = window.electronAPI.t("nextLevel");
  } 
  else if(backToMenu && reset) {
    backToMenu.innerText = window.electronAPI.t("backToMenu");
    reset.innerText = window.electronAPI.t("reset")
  }
  else if(backToMenu) {
    level.innerText = window.electronAPI.t("level");
  backToMenu.innerText = window.electronAPI.t("backToMenu");
  }
  else if (instructions) {
    first_game.forEach(e => {
      e.innerText = window.electronAPI.t("first_game");
    })
    second_game.forEach(e => {
      e.innerText = window.electronAPI.t("second_game");
    })
    third_game.forEach(e => {
      e.innerText = window.electronAPI.t("third_game");
    })
    neverbal.forEach(e => {
      e.innerText = window.electronAPI.t("neverbal");
    })
    test_schulte.forEach(e => {
      e.innerText = window.electronAPI.t("test_schulte");
    })
    korrektura.forEach(e => {
      e.innerText = window.electronAPI.t("korrektura");
    })
    simple_analog.forEach(e => {
      e.innerText = window.electronAPI.t("simple_analog");
    })
    parnye_analog.forEach(e => {
      e.innerText = window.electronAPI.t("parnye_analog");
    })
    instructions.innerText = window.electronAPI.t("instructions");
  } else if (menu) {
    menu.innerText = window.electronAPI.t("menu");
  }
}

document.addEventListener("DOMContentLoaded", () => {

  const localeKz = document.getElementById("localeKz");
  const localeRu = document.getElementById("localeRu");
  const localeEn = document.getElementById("localeEn");
  if (localeKz && localeRu && localeEn) {
    localeKz.addEventListener("click", () => {
      localStorage.setItem("locale", "kz");
      window.electronAPI.setLocale("kz");
      updateTexts();
    });
    localeRu.addEventListener("click", () => {
      localStorage.setItem("locale", "ru");
      window.electronAPI.setLocale("ru");
      updateTexts();
    });
    localeEn.addEventListener("click", () => {
      localStorage.setItem("locale", "en");
      window.electronAPI.setLocale("en");
      updateTexts();
    });
  }

  const locale = localStorage.getItem("locale") || "ru"; // По умолчанию 'ru'
  window.electronAPI.setLocale(locale);
  updateTexts();
});
