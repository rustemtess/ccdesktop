class Draggable {
    constructor(element, index, progress = {
      done: 0,
      win: 0,
      max: 10
    }, effectFunction = Function(), isProgress = false) {
      this.element = element;
      this.index = index;
      this.dragging = false;
      this.dropped = false;
      this.startX = 0;
      this.startY = 0;
      this.translateX = 0;
      this.translateY = 0;
      this.originalRect = null;
      this.progress = progress;
      this.effectFunction = effectFunction
      this.isProgress = isProgress
      this.onPointerMove = this.onPointerMove.bind(this);
      this.onPointerUp = this.onPointerUp.bind(this);
      this.element.classList.add('cursor-pointer')
      this.element.addEventListener('pointerdown', this.onPointerDown.bind(this));
      document.addEventListener('DOMContentLoaded', () => {
        const progress = document.getElementById('doing');
        const progressPercentage = (this.progress.win / (this.progress.done * this.progress.max)) * 100;  // Прогресс из 3 блоков
        progress.style.width = `${progressPercentage}%`;
      })
    }

    onPointerDown(event) {
      if (this.dropped) return;

      this.element.setPointerCapture(event.pointerId);
      this.dragging = true;
      this.startX = event.clientX;
      this.startY = event.clientY;
      this.originalRect = this.element.getBoundingClientRect();

      this.element.classList.add('dragging');
      document.addEventListener('pointermove', this.onPointerMove);
      document.addEventListener('pointerup', this.onPointerUp);
    }

    onPointerMove(event) {
      if (!this.dragging) return;

      this.translateX = event.clientX - this.startX;
      this.translateY = event.clientY - this.startY;

      this.element.style.transition = 'none';
      this.element.style.transform = `translate(${this.translateX}px, ${this.translateY}px)`;

      // Очистим все подсветки
      document.querySelectorAll('.drop-zone').forEach(zone => {
        zone.classList.remove('ring', 'ring-green-400');
      });

      // Найдём зону с наибольшей площадью пересечения
      const blockRect = this.element.getBoundingClientRect();
      let maxIntersection = 0;
      let bestZone = null;

      document.querySelectorAll('.drop-zone').forEach(zone => {
        const zoneRect = zone.getBoundingClientRect();
        const x_overlap = Math.max(0, Math.min(blockRect.right, zoneRect.right) - Math.max(blockRect.left, zoneRect.left));
        const y_overlap = Math.max(0, Math.min(blockRect.bottom, zoneRect.bottom) - Math.max(blockRect.top, zoneRect.top));
        const intersectionArea = x_overlap * y_overlap;

        if (intersectionArea > maxIntersection) {
          maxIntersection = intersectionArea;
          bestZone = zone;
        }
      });

      if (bestZone && maxIntersection > 0) {
        bestZone.classList.add('ring', 'ring-green-400');
      }
    }

    onPointerUp(event) {
      if (!this.dragging) return;

      const blockRect = this.element.getBoundingClientRect();
      let bestZone = null;
      let maxIntersection = 0;

      document.querySelectorAll('.drop-zone').forEach(zone => {
        zone.classList.remove('ring', 'ring-green-400');
        const zoneRect = zone.getBoundingClientRect();
        const x_overlap = Math.max(0, Math.min(blockRect.right, zoneRect.right) - Math.max(blockRect.left, zoneRect.left));
        const y_overlap = Math.max(0, Math.min(blockRect.bottom, zoneRect.bottom) - Math.max(blockRect.top, zoneRect.top));
        const intersectionArea = x_overlap * y_overlap;

        if (intersectionArea > maxIntersection) {
          maxIntersection = intersectionArea;
          bestZone = zone;
        }
      });

      if (bestZone && parseInt(bestZone.dataset.index) === parseInt(this.element.dataset.index)) {
        const zoneRect = bestZone.getBoundingClientRect();
        const offsetX = zoneRect.left + (zoneRect.width - blockRect.width) / 2 - this.originalRect.left;
        const offsetY = zoneRect.top + (zoneRect.height - blockRect.height) / 2 - this.originalRect.top;

        this.element.style.transition = 'transform 0.3s ease';
        this.element.style.transform = `translate(${offsetX}px, ${offsetY}px)`;

        //this.element.classList.add('bg-green-400');
        this.element.classList.remove('cursor-pointer');
        this.dropped = true;
      } else {
        this.element.style.transition = 'transform 0.3s ease';
        this.element.style.transform = `translate(0px, 0px)`;
      }

      this.dragging = false;
      this.element.classList.remove('dragging');
      document.removeEventListener('pointermove', this.onPointerMove);
      document.removeEventListener('pointerup', this.onPointerUp);

      // Проверка на победу
      const allPlaced = Array.from(document.querySelectorAll('.draggable')).filter(el => {
          return el.__draggableInstance?.dropped;
      });

      if(this.isProgress && allPlaced.length > 0) {
        const progress = document.getElementById('doing');
        const progressPercentage = (allPlaced.length / ((this.progress.done + this.progress.win) * (this.progress.max / allPlaced.length))) * 100;  // Прогресс из 3 блоков
        progress.style.width = `${progressPercentage}%`;
      }
      
      if (allPlaced.length === this.progress.win) {
          document.getElementById("next").classList.remove('hidden')
          const successSound = document.getElementById('success-sound');
          if (successSound) successSound.play();
          this.effectFunction('effect')
      }

    }
  }