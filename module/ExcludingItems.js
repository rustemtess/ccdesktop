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

        let point = parseFloat(localStorage.getItem("point") || "1");
        
        // Логика уменьшения баллов: 1 -> 0.5 -> 0.25 -> 0
        if (point === 1) {
            point = 0.5;
        } else if (point === 0.5) {
            point = 0.25;
        } else if (point === 0.25) {
            point = 0;
        } else { // Если уже 0, остаётся 0
            point = 0;
        }
        localStorage.setItem("point", String(point)); // Обновляем в localStorage
        this.gameInstance.updateChanceDisplay(point); // Обновляем отображение шансов
    }
}


class Game {
    constructor(totalLevels = 12) {
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
            localStorage.setItem("point", "1");
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
        let initialPoint = parseFloat(localStorage.getItem("point") || "1");
        localStorage.setItem("point", String(initialPoint));

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

    updateChanceDisplay(pointValue) {
        if (pointValue === 1) {
            document.getElementById("chance").innerText = "3";
        } else if (pointValue === 0.5) {
            document.getElementById("chance").innerText = "2";
        } else if (pointValue === 0.25) {
            document.getElementById("chance").innerText = "1";
        } else {
            document.getElementById("chance").innerText = "0";
        }
    }

    generateShapesForLevel(level) {
        const shapes = [];
        let extraShape = null;

        const colors = ['red', 'blue', 'green', 'yellow', 'purple', 'orange', 'pink', 'indigo'];

        const getRandomColor = () => colors[Math.floor(Math.random() * colors.length)];
        const getDifferentColor = (excludeColor) => {
            let newColor = getRandomColor();
            while (newColor === excludeColor) {
                newColor = getRandomColor();
            }
            return newColor;
        };

        const shapeTypes = ['circle', 'square', 'triangle', 'diamond', 'star'];
        const getRandomShapeType = () => shapeTypes[Math.floor(Math.random() * shapeTypes.length)];
        const getDifferentShapeType = (excludeType) => {
            let newType = getRandomShapeType();
            while (newType === excludeType) {
                newType = getRandomShapeType();
            }
            return newType;
        };

        // Логика уровней
        switch (level) {
            case 0: // Уровень 1: 3 круга одного цвета, 1 треугольник другого цвета (лишний по форме)
                shapes.push({ type: 'circle', color: 'red' }, { type: 'circle', color: 'red' }, { type: 'circle', color: 'red' });
                extraShape = { type: 'triangle', color: 'blue' };
                break;
            case 1: // Уровень 2: 3 квадрата одного цвета, 1 квадрат другого цвета (лишний по цвету)
                shapes.push({ type: 'square', color: 'green' }, { type: 'square', color: 'green' }, { type: 'square', color: 'green' });
                extraShape = { type: 'square', color: 'purple' };
                break;
            case 2: // Уровень 3: 3 треугольника одного цвета, 1 ромб того же цвета (лишний по форме)
                shapes.push({ type: 'triangle', color: 'orange' }, { type: 'triangle', color: 'orange' }, { type: 'triangle', color: 'orange' });
                extraShape = { type: 'diamond', color: 'orange' };
                break;
            case 3: // Уровень 4: 3 звезды одного цвета, 1 круг того же цвета (лишний по форме)
                shapes.push({ type: 'star', color: 'yellow' }, { type: 'star', color: 'yellow' }, { type: 'star', color: 'yellow' });
                extraShape = { type: 'circle', color: 'yellow' };
                break;
            case 4: // Уровень 5: 2 синих круга, 1 синий квадрат; лишний - красный треугольник (лишний по форме и цвету)
                shapes.push({ type: 'circle', color: 'blue' }, { type: 'circle', color: 'blue' }, { type: 'square', color: 'blue' });
                extraShape = { type: 'triangle', color: 'red' };
                break;
            case 5: // Уровень 6: 2 зеленых ромба, 1 зеленая звезда; лишний - фиолетовый квадрат (лишний по форме и цвету)
                shapes.push({ type: 'diamond', color: 'green' }, { type: 'diamond', color: 'green' }, { type: 'star', color: 'green' });
                extraShape = { type: 'square', color: 'purple' };
                break;
            case 6: // Уровень 7: 3 фигуры одного цвета, но разных форм (круг, квадрат, треугольник); лишний - звезда того же цвета (лишний по форме)
                shapes.push({ type: 'circle', color: 'pink' }, { type: 'square', color: 'pink' }, { type: 'triangle', color: 'pink' });
                extraShape = { type: 'star', color: 'green' };
                break;
            case 7: // Уровень 8: 2 красных треугольника, 1 красный ромб; лишний - синяя звезда (лишний по форме и цвету)
                shapes.push({ type: 'triangle', color: 'red' }, { type: 'triangle', color: 'red' }, { type: 'diamond', color: 'red' });
                extraShape = { type: 'star', color: 'blue' };
                break;
            case 8: // Уровень 9: 2 пурпурных звезды, 1 пурпурный круг; лишний - зеленый квадрат (лишний по форме и цвету)
                shapes.push({ type: 'star', color: 'purple' }, { type: 'star', color: 'purple' }, { type: 'circle', color: 'purple' });
                extraShape = { type: 'square', color: 'green' };
                break;
            case 9: // Уровень 10: 2 оранжевых квадрата, 1 оранжевый треугольник; лишний - желтый ромб (лишний по форме и цвету)
                shapes.push({ type: 'square', color: 'orange' }, { type: 'square', color: 'orange' }, { type: 'triangle', color: 'orange' });
                extraShape = { type: 'diamond', color: 'yellow' };
                break;
            case 10: // Уровень 11: 3 фигуры разных форм одного цвета (красный круг, квадрат, треугольник); лишняя - та же форма, но другого цвета (синий круг)
                const commonColor11 = getDifferentColor('black');
                const extraColor11 = getDifferentColor(commonColor11);
                shapes.push({ type: 'circle', color: commonColor11 }, { type: 'square', color: commonColor11 }, { type: 'triangle', color: commonColor11 });
                extraShape = { type: 'circle', color: extraColor11 };
                break;
            case 11: // Уровень 12 (Финальный): 3 фигуры одного типа (например, звезды), но 2 одного цвета, 1 - другого; лишняя - фигура другого типа и другого цвета.
                const commonShape12 = getRandomShapeType();
                const commonColor12 = getRandomColor();
                const differentColor12 = getDifferentColor(commonColor12);
                const extraShapeType12 = getDifferentShapeType(commonShape12);
                const extraShapeColor12 = getDifferentColor(commonColor12);

                shapes.push({ type: commonShape12, color: commonColor12 }, { type: commonShape12, color: commonColor12 }, { type: commonShape12, color: differentColor12 });
                extraShape = { type: extraShapeType12, color: extraShapeColor12 };
                break;

            default:
                console.log("No specific configuration for this level, generating default.");
                shapes.push({ type: 'circle', color: 'red' }, { type: 'circle', color: 'red' }, { type: 'circle', color: 'red' });
                extraShape = { type: 'triangle', color: 'blue' };
                break;
        }

        return { mainShapes: shapes, extraShape: extraShape };
    }

    loadLevel(levelIndex) {
        this.gameContainer.innerHTML = '';
        this.nextLevelButton.classList.add("hidden");
        this.levelComplete = false;

        // Если это последний уровень и он только что был завершен (currentLevel === totalLevels - 1)
        // то при следующей попытке загрузки уровня (levelIndex === totalLevels)
        // мы показываем окончание игры
        if (levelIndex >= this.totalLevels) {
            this.showGameEnd();
            return;
        }

        const { mainShapes, extraShape } = this.generateShapesForLevel(levelIndex);

        if (!extraShape || mainShapes.length < 3) {
            console.error("Error: Not enough shapes generated for level", levelIndex);
            this.gameContainer.innerHTML = '<div class="col-span-4 text-center text-xl font-bold text-red-500">Ошибка генерации уровня.</div>';
            return;
        }

        const allShapes = [...mainShapes, extraShape];
        // Перемешиваем фигуры
        for (let i = allShapes.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [allShapes[i], allShapes[j]] = [allShapes[j], allShapes[i]];
        }

        const shapesWrapper = document.createElement('div');
        shapesWrapper.className = 'w-full h-full grid grid-cols-2 gap-10 justify-items-center items-center';
        this.gameContainer.appendChild(shapesWrapper);

        allShapes.forEach((shapeData) => {
            const el = document.createElement('div');
            const isCurrentExtra = (shapeData === extraShape);

            el.className = `selectable ${shapeData.type}`;
            if (shapeData.type === 'triangle') {
                el.classList.add(`border-b-${shapeData.color}-500`);
            } else if (shapeData.color.includes('-')) {
                 el.classList.add(`bg-${shapeData.color}`);
            } else {
                el.classList.add(`bg-${shapeData.color}-500`);
            }
            
            shapesWrapper.appendChild(el);

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

        localStorage.setItem("point", "1");
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
        localStorage.setItem("point", "1");
        document.getElementById("chance").innerText = "3";

        this.loadLevel(this.currentLevel);
    }

    showGameEnd() {
        // Убеждаемся, что кнопка видна и меняем её текст
        this.nextLevelButton.classList.remove("hidden");
        this.nextLevelButton.innerText = window.electronAPI.t('result');
        
        // Обновляем прогресс-бар до 100% и индикатор уровня
        this.progressBar.style.width = `100%`;
        this.levelIndicator.innerText = this.totalLevels;
    }
}

const game = new Game(12);