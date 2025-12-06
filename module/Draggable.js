let gameCompleted = false;

class Draggable {
  constructor(element, index, progress = { name: "", win: 0, currentLevel: 0, max: 0 }, effectFunction = () => {}, isProgress = false) {
    this.element = element;
    this.index = index;
    this.progress = progress;
    this.effectFunction = effectFunction;
    this.isProgress = isProgress;

    this.dragging = false;
    this.dropped = false;
    this.startX = 0;
    this.startY = 0;
    this.translateX = 0;
    this.translateY = 0;
    this.originalRect = null;

    this.element.classList.add("cursor-pointer");
    this.element.addEventListener("pointerdown", this.onPointerDown.bind(this));
    document.addEventListener("DOMContentLoaded", () => this.updateProgressBar());
  }

  updateProgressBar(extraWin = 0) {
    const progressBar = document.getElementById("doing");
    const percentage = ((this.progress.currentLevel + extraWin) / this.progress.max) * 100;
    progressBar.style.width = `${percentage}%`;
  }

  onPointerDown(event) {
    if (this.dropped) return;

    this.element.setPointerCapture(event.pointerId);
    this.dragging = true;
    this.startX = event.clientX;
    this.startY = event.clientY;
    this.originalRect = this.element.getBoundingClientRect();
    this.element.classList.add("dragging");

    document.addEventListener("pointermove", this.onPointerMove.bind(this));
    document.addEventListener("pointerup", this.onPointerUp.bind(this));
  }

  onPointerMove(event) {
    if (!this.dragging) return;

    this.translateX = event.clientX - this.startX;
    this.translateY = event.clientY - this.startY;
    this.element.style.transition = "none";
    this.element.style.transform = `translate(${this.translateX}px, ${this.translateY}px)`;

    document.querySelectorAll(".drop-zone").forEach(zone => {
      zone.classList.remove("ring", "ring-green-400");
    });

    const bestZone = this.getBestZone();
    if (bestZone) bestZone.classList.add("ring", "ring-green-400");
  }

  onPointerUp(event) {
    if (!this.dragging) return;

    const bestZone = this.getBestZone();
    this.element.classList.remove("dragging");
    document.removeEventListener("pointermove", this.onPointerMove.bind(this));
    document.removeEventListener("pointerup", this.onPointerUp.bind(this));

    if (bestZone && parseInt(bestZone.dataset.index) === parseInt(this.element.dataset.index)) {
      this.handleDropSuccess(bestZone);
    } else {
      this.handleDropFail();
    }

    // Убираем подсветку после отпускания
    document.querySelectorAll(".drop-zone").forEach(zone => {
      zone.classList.remove("ring", "ring-green-400");
    });

    this.dragging = false;
    this.checkCompletion();
  }


  getBestZone() {
    const blockRect = this.element.getBoundingClientRect();
    let maxIntersection = 0;
    let bestZone = null;

    document.querySelectorAll(".drop-zone").forEach(zone => {
      const zoneRect = zone.getBoundingClientRect();
      const x_overlap = Math.max(0, Math.min(blockRect.right, zoneRect.right) - Math.max(blockRect.left, zoneRect.left));
      const y_overlap = Math.max(0, Math.min(blockRect.bottom, zoneRect.bottom) - Math.max(blockRect.top, zoneRect.top));
      const area = x_overlap * y_overlap;

      if (area > maxIntersection) {
        maxIntersection = area;
        bestZone = zone;
      }
    });

    return maxIntersection > 0 ? bestZone : null;
  }

  handleDropSuccess(zone) {
    const zoneRect = zone.getBoundingClientRect();
    const blockRect = this.originalRect;
    const offsetX = zoneRect.left + (zoneRect.width - blockRect.width) / 2 - blockRect.left;
    const offsetY = zoneRect.top + (zoneRect.height - blockRect.height) / 2 - blockRect.top;

    this.element.style.transition = "transform 0.3s ease";
    this.element.style.transform = `translate(${offsetX}px, ${offsetY}px)`;

    this.dropped = true;
    this.element.classList.remove("cursor-pointer");

    const allPlaced = [...document.querySelectorAll(".draggable")]
      .filter(el => el.__draggableInstance?.dropped);

    this.updateProgressBar(allPlaced.length);
    this.saveProgress();

    if ((this.progress.currentLevel + allPlaced.length) >= this.progress.max) {
      this.showNextLevelButton();
    }
  }

  handleDropFail() {
    this.element.style.transition = "transform 0.3s ease";
    this.element.style.transform = "translate(0px, 0px)";

    const sound = document.getElementById("bad-answer-sound");
    if (sound) sound.play();

    document.querySelectorAll(".drop-zone").forEach(zone => {
      zone.classList.remove("ring", "ring-green-400");
    });

    let point = parseFloat(localStorage.getItem("point")) || 1;
    const cost = point / 2;

    if (cost >= 0.25) {
      localStorage.setItem("point", String(cost));
      document.getElementById("chance").innerText = cost === 0.5 ? "2" : "1";
    } else {
      localStorage.setItem("point", "0");
      document.getElementById("chance").innerText = "0";
      console.log("Недостаточно баллов для использования шанса");
    }
  }

  saveProgress() {
    const allPlaced = [...document.querySelectorAll(".draggable")]
      .filter(el => el.__draggableInstance?.dropped);

    localStorage.setItem("progress", String(this.progress.currentLevel + this.progress.win));
  }

  showNextLevelButton() {
    const next = document.getElementById("next");
    const goTo = (url) => {
      localStorage.setItem("progress", "0");
      document.location.href = url;
    };

    if (this.progress.name.startsWith('AB')) {
      // для AB переходим на B1
      next.innerText = window.electronAPI.t('nextLevel');
      next.onclick = () => goTo('../B1/index.html');
    } else if (this.progress.name === 'A12') {
      // для точного A переходим на AB1
      next.innerText = window.electronAPI.t('nextLevel');
      next.onclick = () => goTo('../AB1/index.html');
    } else {
      next.innerText = window.electronAPI.t('result');
      next.onclick = () => goTo('../../../result.html');
    }

  }

  checkCompletion() {
    const allPlaced = [...document.querySelectorAll(".draggable")]
      .filter(el => el.__draggableInstance?.dropped);

    if (allPlaced.length === this.progress.win && !gameCompleted) {
      gameCompleted = true;
      document.getElementById("next").classList.remove("hidden");

      const successSound = document.getElementById("success-sound");
      if (successSound) successSound.play();

      this.effectFunction("effect");

      const result = Number(localStorage.getItem("result") || 0);
      const point = Number(localStorage.getItem("point") || 1);
      localStorage.setItem("result", String(result + point));

      const answers = JSON.parse(localStorage.getItem("answers") || "{}");
      answers[this.progress.name] = String(point);
      localStorage.setItem("answers", JSON.stringify(answers));
      localStorage.setItem("point", "1");
    }
  }
}
