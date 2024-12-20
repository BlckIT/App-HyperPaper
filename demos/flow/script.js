const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const particles = [];
const colors = ['#ff4500', '#ff8c00', '#ffd700'];

function createParticle(x, y) {
  const size = Math.random() * 5 + 2;
  const color = colors[Math.floor(Math.random() * colors.length)];
  const speedX = (Math.random() - 0.5) * 2;
  const speedY = (Math.random() - 0.5) * 2;
  particles.push({ x, y, size, color, speedX, speedY });
}

function updateParticles() {
  for (let i = 0; i < particles.length; i++) {
    const p = particles[i];
    p.x += p.speedX;
    p.y += p.speedY;
    p.size *= 0.95;
    if (p.size < 0.5) {
      particles.splice(i, 1);
      i--;
    }
  }
}

function drawParticles() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  for (const p of particles) {
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
    ctx.fillStyle = p.color;
    ctx.fill();
  }
}

function animate() {
  updateParticles();
  drawParticles();
  requestAnimationFrame(animate);
}

canvas.addEventListener('mousemove', (e) => {
  for (let i = 0; i < 5; i++) {
    createParticle(e.clientX, e.clientY);
  }
});

animate();
