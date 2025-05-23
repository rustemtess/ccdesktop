function updateTexts() {
  const backToMenu = document.getElementById("backToMenu");
  const nextLevel = document.getElementById("next");
  const instructions = document.getElementById("instructions");
  const menu = document.getElementById("menu");
  const first_game = document.getElementById("first_game");
  const level = document.getElementById("level");
  if (backToMenu && nextLevel) {
    level.innerText = window.electronAPI.t("level");
    backToMenu.innerText = window.electronAPI.t("backToMenu");
    nextLevel.innerText = window.electronAPI.t("nextLevel");
  } else if (instructions) {
    first_game.innerText = window.electronAPI.t("first_game");
    instructions.innerText = window.electronAPI.t("instructions");
  } else if (menu) {
    menu.innerText = window.electronAPI.t("menu");
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const minimize = document.getElementById("minimize");
  //const maximize = document.getElementById('maximize');
  const close = document.getElementById("close");

  minimize.addEventListener("click", () => {
    window.electronAPI.sendMessage("window-minimize");
  });

  /**maximize.addEventListener('click', () => {
        window.electronAPI.sendMessage('window-maximize');
    });*/

  close.addEventListener("click", () => {
    window.electronAPI.sendMessage("window-close");
  });

  window.electronAPI.on("maximize-changed", (isMaximized) => {
    if (!isMaximized) {
      document.getElementById("maximize").innerHTML =
        '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 20 20"><path fill="currentColor" fill-rule="evenodd" d="M11.75 3.75A.75.75 0 0 1 12.5 3h3.7501a.75.75 0 0 1 .75.75V7.5a.75.75 0 0 1-1.5 0V5.5605l-3.2236 3.2232a.75.75 0 0 1-1.0606-1.0607L14.4392 4.5H12.5a.75.75 0 0 1-.75-.75Zm-2.9666 7.4663a.75.75 0 0 1 0 1.0606L5.5606 15.5H7.5a.75.75 0 0 1 0 1.5H3.75a.75.75 0 0 1-.75-.75V12.5a.75.75 0 0 1 1.5 0v1.9393l3.2227-3.223a.75.75 0 0 1 1.0607 0Z" clip-rule="evenodd"/></svg>';
    } else {
      document.getElementById("maximize").innerHTML =
        '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 20 20"><path fill="currentColor" fill-rule="evenodd" d="M15.7197 3.2197a.75.75 0 0 1 1.0606 1.0607L13.5607 7.5H15.5a.75.75 0 0 1 0 1.5h-3.7501a.75.75 0 0 1-.75-.75V4.5a.75.75 0 0 1 1.5 0v1.9394l3.2198-3.2197ZM3.75 11.75A.75.75 0 0 1 4.5 11h3.75a.75.75 0 0 1 .75.75v3.75a.75.75 0 0 1-1.5 0v-1.9427l-3.2227 3.223a.75.75 0 0 1-1.0607-1.0606L6.436 12.5H4.5a.75.75 0 0 1-.75-.75Z" clip-rule="evenodd"/></svg>';
    }
  });

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
