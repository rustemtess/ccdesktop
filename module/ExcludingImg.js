// game.js
let gameCompleted = false;

class Selectable {
    constructor(element, isExtra = false, gameInstance) {
        this.element = element;
        this.isExtra = isExtra;
        this.gameInstance = gameInstance;

        this.element.classList.add("cursor-pointer");
        this.element.addEventListener("pointerup", this.onPointerUp.bind(this));
    }

    onPointerUp(event) {
        if (this.gameInstance.levelComplete) return;

        if (this.isExtra) {
            this.handleSelectionSuccess();
        } else {
            this.handleSelectionFail();
        }
    }

    handleSelectionSuccess() {
        const successSound = document.getElementById("success-sound");
        if (successSound) successSound.play();
        if (typeof window.launchConfetti === 'function') {
            window.launchConfetti("effect");
        }
        this.gameInstance.handleLevelCompletion(); // Сигнализируем Game классу о завершении уровня
    }

    handleSelectionFail() {
        const sound = document.getElementById("bad-answer-sound");
        if (sound) sound.play();

        // --- MODIFICATION START ---
        // If an incorrect selection is made, set points directly to 0
        localStorage.setItem("point", "0");
        this.gameInstance.updateChanceDisplay(0); // Update display to show 0 lives
        // --- MODIFICATION END ---
    }
}


class Game {
    constructor(totalLevels = 19) { // Updated totalLevels to 19 based on your level data
        this.currentLevel = 0;
        this.totalLevels = totalLevels;
        this.gameContainer = document.getElementById("game-elements-container");
        this.nextLevelButton = document.getElementById("next");
        this.progressBar = document.getElementById("doing");
        this.backToMenuButton = document.getElementById("backToMenu");
        this.levelIndicator = document.getElementById("level");
        this.levelComplete = false;
        this.backToMenuButton.addEventListener("click", () => {
            // Сбрасываем прогресс игры перед возвратом в меню
            localStorage.setItem("currentLevel", "0");
            localStorage.setItem("point", "1"); // Reset point to 1 when returning to menu
            localStorage.setItem("result", "0");
            localStorage.setItem("answers", "{}");
            document.location.href = '../../../menu.html'; // Переходим в меню
        });
        // Обработчик кнопки nextLevelButton
        this.nextLevelButton.addEventListener("click", () => {
            // Если текущий уровень равен общему количеству уровней (т.е. 12-й уровень пройден)
            if (this.currentLevel === this.totalLevels - 1) {
                // Тогда это кнопка "Посмотреть результаты"
                // Очищаем localStorage только при переходе на страницу результатов

                document.location.href = '../../../result.html';
            } else {
                // Иначе, это кнопка "Следующий уровень"
                this.loadNextLevel();
            }
        });

        document.addEventListener("DOMContentLoaded", () => this.initGame());
    }

    initGame() {
        this.currentLevel = parseInt(localStorage.getItem("currentLevel") || "0");
        // --- MODIFICATION START ---
        // Ensure initial point is 1, not some fractional value from previous system
        let initialPoint = parseFloat(localStorage.getItem("point") || "1");
        if (initialPoint !== 1 && initialPoint !== 0) { // If it's a fractional point, reset to 1
             initialPoint = 1;
        }
        localStorage.setItem("point", String(initialPoint));
        // --- MODIFICATION END ---

        this.updateProgressBar();
        this.updateLevelIndicator();
        this.loadLevel(this.currentLevel);
        this.updateChanceDisplay(initialPoint);
    }

    updateProgressBar() {
        const percentage = (this.currentLevel / this.totalLevels) * 100;
        this.progressBar.style.width = `${percentage}%`;
    }

    updateLevelIndicator() {
        this.levelIndicator.innerText = (this.currentLevel + 1) + " " + window.electronAPI.t("level");
    }

    // --- MODIFICATION START ---
    updateChanceDisplay(pointValue) {
        // Display 1 if points are 1 (or any positive value), otherwise 0
        document.getElementById("chance").innerText = pointValue >= 1 ? "1" : "0";
    }
    // --- MODIFICATION END ---

    getLevelImages(level) {
        const levelsData = [
            {
                mainImages: [
                    '../../../levels/ExcludingImg/A1/images/1-1.png',
                    '../../../levels/ExcludingImg/A1/images/1-2.png',
                    '../../../levels/ExcludingImg/A1/images/1-3.png'
                ],
                extraImage: '../../../levels/ExcludingImg/A1/images/1-4.png'
            },
            {
                mainImages: [
                    '../../../levels/ExcludingImg/A1/images/2-1.png',
                    '../../../levels/ExcludingImg/A1/images/2-3.png',
                    '../../../levels/ExcludingImg/A1/images/2-4.png'
                ],
                extraImage: '../../../levels/ExcludingImg/A1/images/2-2.png'
            },
            {
                mainImages: [
                    '../../../levels/ExcludingImg/A1/images/3-1.png',
                    '../../../levels/ExcludingImg/A1/images/3-2.png',
                    '../../../levels/ExcludingImg/A1/images/3-4.png'
                ],
                extraImage: '../../../levels/ExcludingImg/A1/images/3-3.png'
            },
            {
                mainImages: [
                    '../../../levels/ExcludingImg/A1/images/4-1.png',
                    '../../../levels/ExcludingImg/A1/images/4-2.png',
                    '../../../levels/ExcludingImg/A1/images/4-4.png'
                ],
                extraImage: '../../../levels/ExcludingImg/A1/images/4-3.png'
            },
            {
                mainImages: [
                    '../../../levels/ExcludingImg/A1/images/5-1.png',
                    '../../../levels/ExcludingImg/A1/images/5-2.png',
                    '../../../levels/ExcludingImg/A1/images/5-4.png'
                ],
                extraImage: '../../../levels/ExcludingImg/A1/images/5-3.png'
            },
            {
                mainImages: [
                    '../../../levels/ExcludingImg/A1/images/6-2.png',
                    '../../../levels/ExcludingImg/A1/images/6-3.png',
                    '../../../levels/ExcludingImg/A1/images/6-4.png'
                ],
                extraImage: '../../../levels/ExcludingImg/A1/images/6-1.png'
            },
            {
                mainImages: [
                    '../../../levels/ExcludingImg/A1/images/7-1.png',
                    '../../../levels/ExcludingImg/A1/images/7-3.png',
                    '../../../levels/ExcludingImg/A1/images/7-4.png'
                ],
                extraImage: '../../../levels/ExcludingImg/A1/images/7-2.png'
            },
            {
                mainImages: [
                    '../../../levels/ExcludingImg/A1/images/8-1.png',
                    '../../../levels/ExcludingImg/A1/images/8-3.png',
                    '../../../levels/ExcludingImg/A1/images/8-4.png'
                ],
                extraImage: '../../../levels/ExcludingImg/A1/images/8-2.png'
            },

            {
                mainImages: [
                    '../../../levels/ExcludingImg/A1/images/9-1.png',
                    '../../../levels/ExcludingImg/A1/images/9-3.png',
                    '../../../levels/ExcludingImg/A1/images/9-4.png'
                ],
                extraImage: '../../../levels/ExcludingImg/A1/images/9-2.png'
            },
            {
                mainImages: [
                    '../../../levels/ExcludingImg/A1/images/10-1.png',
                    '../../../levels/ExcludingImg/A1/images/10-3.png',
                    '../../../levels/ExcludingImg/A1/images/10-4.png'
                ],
                extraImage: '../../../levels/ExcludingImg/A1/images/10-2.png'
            },
            {
                mainImages: [
                    '../../../levels/ExcludingImg/A1/images/11-1.png',
                    '../../../levels/ExcludingImg/A1/images/11-2.png',
                    '../../../levels/ExcludingImg/A1/images/11-3.png'
                ],
                extraImage: '../../../levels/ExcludingImg/A1/images/11-4.png'
            },
            {
                mainImages: [
                    '../../../levels/ExcludingImg/A1/images/12-2.png',
                    '../../../levels/ExcludingImg/A1/images/12-3.png',
                    '../../../levels/ExcludingImg/A1/images/12-4.png'
                ],
                extraImage: '../../../levels/ExcludingImg/A1/images/12-1.png'
            },
            {
                mainImages: [
                    '../../../levels/ExcludingImg/A1/images/13-1.png',
                    '../../../levels/ExcludingImg/A1/images/13-3.png',
                    '../../../levels/ExcludingImg/A1/images/13-4.png'
                ],
                extraImage: '../../../levels/ExcludingImg/A1/images/13-2.png'
            },
            {
                mainImages: [
                    '../../../levels/ExcludingImg/A1/images/14-1.png',
                    '../../../levels/ExcludingImg/A1/images/14-2.png',
                    '../../../levels/ExcludingImg/A1/images/14-3.png'
                ],
                extraImage: '../../../levels/ExcludingImg/A1/images/14-4.png'
            },
            {
                mainImages: [
                    '../../../levels/ExcludingImg/A1/images/15-1.png',
                    '../../../levels/ExcludingImg/A1/images/15-3.png',
                    '../../../levels/ExcludingImg/A1/images/15-4.png'
                ],
                extraImage: '../../../levels/ExcludingImg/A1/images/15-2.png' // Corrected path, assuming 15-2.png is the extra
            },
            {
                mainImages: [
                    '../../../levels/ExcludingImg/A1/images/16-1.png',
                    '../../../levels/ExcludingImg/A1/images/16-3.png', // Assuming 16-2.png was the extra in previous
                    '../../../levels/ExcludingImg/A1/images/16-4.png'
                ],
                extraImage: '../../../levels/ExcludingImg/A1/images/16-2.png' // Corrected path, assuming 16-2.png is the extra
            },
            {
                mainImages: [
                    '../../../levels/ExcludingImg/A1/images/17-1.png',
                    '../../../levels/ExcludingImg/A1/images/17-2.png',
                    '../../../levels/ExcludingImg/A1/images/17-3.png'
                ],
                extraImage: '../../../levels/ExcludingImg/A1/images/17-4.png'
            },
            {
                mainImages: [
                    '../../../levels/ExcludingImg/A1/images/18-2.png',
                    '../../../levels/ExcludingImg/A1/images/18-3.png',
                    '../../../levels/ExcludingImg/A1/images/18-4.png'
                ],
                extraImage: '../../../levels/ExcludingImg/A1/images/18-1.png'
            },
            {
                mainImages: [
                    '../../../levels/ExcludingImg/A1/images/19-2.png',
                    '../../../levels/ExcludingImg/A1/images/19-3.png',
                    '../../../levels/ExcludingImg/A1/images/19-4.png'
                ],
                extraImage: '../../../levels/ExcludingImg/A1/images/19-1.png'
            }
        ];

        if (level < levelsData.length) {
            return levelsData[level];
        } else {
            console.warn(`No specific image configuration for level ${level}, using default.`);
            return {
                mainImages: [
                    '../../../assets/img/default_main.png',
                    '../../../assets/img/default_main.png',
                    '../../../assets/img/default_main.png'
                ],
                extraImage: '../../../assets/img/default_extra.png'
            };
        }
    }


    loadLevel(levelIndex) {
        this.gameContainer.innerHTML = '';
        this.nextLevelButton.classList.add("hidden");
        this.levelComplete = false;

        if (levelIndex >= this.totalLevels) {
            this.showGameEnd();
            return;
        }

        const { mainImages, extraImage } = this.getLevelImages(levelIndex);

        if (!extraImage || mainImages.length < 3) {
            console.error("Error: Not enough images specified for level", levelIndex);
            this.gameContainer.innerHTML = '<div class="col-span-4 text-center text-xl font-bold text-red-500">Ошибка загрузки изображений для уровня.</div>';
            return;
        }

        const allImages = [...mainImages, extraImage];
        // Shuffle the images
        for (let i = allImages.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [allImages[i], allImages[j]] = [allImages[j], allImages[i]];
        }

        const imagesWrapper = document.createElement('div');
        imagesWrapper.className = 'w-full h-full grid grid-cols-2 gap-10 justify-items-center items-center';
        this.gameContainer.appendChild(imagesWrapper);

        allImages.forEach((imagePath) => {
            const el = document.createElement('div');
            // Check if the current image path is the extra image
            const isCurrentExtra = (imagePath === extraImage);

            el.className = `selectable image-container`; // Add a general class for styling image containers
            const img = document.createElement('img');
            img.src = imagePath;
            img.alt = 'game image'; // Provide a meaningful alt text
            img.className = 'w-full h-full object-contain'; // Ensure image fits within its container
            el.appendChild(img);

            imagesWrapper.appendChild(el);

            new Selectable(el, isCurrentExtra, this);
        });

        document.querySelector('.drop-zone')?.remove();

        this.updateProgressBar();
        this.updateLevelIndicator();
    }

    handleLevelCompletion() {
        if (this.levelComplete) return;

        this.levelComplete = true;

        const result = Number(localStorage.getItem("result") || 0);
        const point = Number(localStorage.getItem("point") || 1);
        localStorage.setItem("result", String(result + point));

        const answers = JSON.parse(localStorage.getItem("answers") || "{}");
        answers[`A${this.currentLevel + 1}`] = String(point);
        localStorage.setItem("answers", JSON.stringify(answers));

        localStorage.setItem("point", "1"); // Always reset to 1 point for the next level
        this.updateChanceDisplay(1);

        document.querySelectorAll('.selectable').forEach(el => {
            el.classList.remove('correct-selected', 'incorrect-selected');
        });


        // Проверяем, если текущий уровень является последним
        if (this.currentLevel + 1 === this.totalLevels) {
            this.showGameEnd(); // Если последний, вызываем функцию окончания игры
        } else {
            this.nextLevelButton.classList.remove("hidden");
            this.nextLevelButton.innerText = window.electronAPI.t('nextLevel');
        }
    }

    loadNextLevel() {
        this.currentLevel++;
        localStorage.setItem("currentLevel", String(this.currentLevel));
        localStorage.setItem("point", "1"); // Always start next level with 1 point
        document.getElementById("chance").innerText = "1"; // Display 1 chance

        this.loadLevel(this.currentLevel);
    }

    showGameEnd() {
        this.nextLevelButton.classList.remove("hidden");
        this.nextLevelButton.innerText = window.electronAPI.t('result');

        this.progressBar.style.width = `100%`;
        this.levelIndicator.innerText = this.totalLevels;
    }
}

const game = new Game(19); // Set total levels to 19 as per your `levelsData`