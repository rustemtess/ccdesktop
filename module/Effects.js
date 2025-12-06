function launchConfetti(id) {
    const container = document.getElementById(id);
    container.classList.remove('hidden');

    for (let i = 0; i < 100; i++) {
      const confetti = document.createElement('div');
      const size = Math.random() * 10 + 5;  // Random size between 5 and 15
      confetti.style.width = `${size}px`;
      confetti.style.height = `${size}px`;
      confetti.style.backgroundColor = `hsl(${Math.random() * 360}, 100%, 60%)`;
      confetti.style.left = `${Math.random() * 100}vw`;
      confetti.style.top = `${Math.random() * 100}vh`;
      confetti.style.transform = `rotate(${Math.random() * 360}deg)`;

      // Assigning random values for animation
      confetti.style.setProperty('--x', `${Math.random() * 200 - 100}vw`);
      confetti.style.setProperty('--y', `${Math.random() * 200 - 100}vh`);

      confetti.classList.add('confetti');
      container.appendChild(confetti);

      // Remove confetti after animation
      setTimeout(() => {
          confetti.remove();
      }, 3000);
    }
  }