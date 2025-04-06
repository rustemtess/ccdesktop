function shuffleBlocks(id) {
    const container = document.getElementById(id);
    const blocks = Array.from(container.children);  // Получаем все дочерние элементы (блоки)
    
    // Перемешиваем массив блоков
    for (let i = blocks.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [blocks[i], blocks[j]] = [blocks[j], blocks[i]];  // Меняем местами элементы
    }

    // Перемещаем элементы обратно в контейнер в новом порядке
    blocks.forEach(block => container.appendChild(block));
}