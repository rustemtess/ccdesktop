class GameScore {
  constructor({ levelName = "LEVEL1", onWin = () => {}, onLose = () => {} } = {}) {
    this.levelName = levelName;
    this.onWin = onWin;
    this.onLose = onLose;

    // Состояние
    this.point = Number(localStorage.getItem("point")) || 1;
    this.result = Number(localStorage.getItem("result")) || 0;
    this.answers = JSON.parse(localStorage.getItem("answers") || "{}");

    // Элементы
    this.elChance = document.getElementById("chance");
    this.elLevel = document.getElementById("level");
    this.elProgress = document.getElementById("doing");

    this.updateUI();
  }

  correctAnswer() {
    if (this.point === 0) return;

    this.playSound("sound-correct");

    this.result += this.point;
    this.answers[this.levelName] = String(this.point);

    localStorage.setItem("result", String(this.result));
    localStorage.setItem("answers", JSON.stringify(this.answers));
    localStorage.setItem("point", "1");

    this.point = 1;
    this.updateUI();

    if (typeof this.onWin === "function") this.onWin();
  }

wrongAnswer() {
  if (this.point === 0) return;

  this.playSound("sound-wrong");

  // Если был последний шанс (1 жизнь)
  if (this.point === 0.25) {
    this.point = 0;
    this.answers[this.levelName] = "0";
    localStorage.setItem("point", "0");
    localStorage.setItem("answers", JSON.stringify(this.answers));
    this.updateUI(); // 👈 обновляем интерфейс, чтобы текст стал "0"
    return;
  }

  // Обычное уменьшение
  this.point = this.point / 2;

  // Если вдруг стало меньше 0.25 — тоже в 0
  if (this.point < 0.25) {
    this.point = 0;
    this.answers[this.levelName] = "0";
    localStorage.setItem("point", "0");
    localStorage.setItem("answers", JSON.stringify(this.answers));
    this.updateUI(); // 👈 и тут обновляем UI
    return;
  }

  // Иначе сохраняем текущее значение
  localStorage.setItem("point", String(this.point));
  this.updateUI();
}



  updateUI() {
    // ❤️ Шансы
    if (this.elChance) {
      if (this.point === 1) this.elChance.textContent = "3";
      else if (this.point === 0.5) this.elChance.textContent = "2";
      else if (this.point === 0.25) this.elChance.textContent = "1";
      else this.elChance.textContent = "0";
    }

    // ⭐ Прогресс
    if (this.elProgress) {
      const progress = Math.min((this.result / 14) * 100, 100);
      this.elProgress.style.width = `${progress}%`;
    }
  }

  playSound(id) {
    const sound = document.getElementById(id);
    if (sound) {
      sound.currentTime = 0;
      sound.play().catch(() => {});
    }
  }
}
