// background.js - Анимированный космический фон
class Starfield {
    constructor() {
        this.canvas = document.getElementById('bg-canvas');
        this.ctx = this.canvas.getContext('2d');
        this.stars = [];
        this.nebulas = [];
        
        this.init();
        this.animate();
        window.addEventListener('resize', () => this.init());
    }

    init() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        
        this.stars = [];
        this.nebulas = [];
        
        // Создаём звёзды
        for (let i = 0; i < 200; i++) {
            this.stars.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                radius: Math.random() * 1.5,
                speed: Math.random() * 0.3,
                opacity: Math.random() * 0.8 + 0.2
            });
        }
        
        // Создаём туманности
        for (let i = 0; i < 3; i++) {
            this.nebulas.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                radius: Math.random() * 300 + 100,
                color: this.getRandomNebulaColor(),
                opacity: Math.random() * 0.1 + 0.05
            });
        }
    }

    getRandomNebulaColor() {
        const colors = [
            '#003366', '#0066cc', '#6600cc', '#cc0066', '#00cc99',
            '#3366ff', '#6633cc', '#cc3366', '#33cc99', '#ff3366'
        ];
        return colors[Math.floor(Math.random() * colors.length)];
    }

    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Рисуем туманности
        this.nebulas.forEach(nebula => {
            const gradient = this.ctx.createRadialGradient(
                nebula.x, nebula.y, 0,
                nebula.x, nebula.y, nebula.radius
            );
            gradient.addColorStop(0, `${nebula.color}${Math.floor(nebula.opacity * 255).toString(16).padStart(2, '0')}`);
            gradient.addColorStop(1, `${nebula.color}00`);
            
            this.ctx.beginPath();
            this.ctx.arc(nebula.x, nebula.y, nebula.radius, 0, Math.PI * 2);
            this.ctx.fillStyle = gradient;
            this.ctx.fill();
        });
        
        // Рисуем звёзды
        this.stars.forEach(star => {
            this.ctx.beginPath();
            this.ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
            
            // Создаём свечение
            const gradient = this.ctx.createRadialGradient(
                star.x, star.y, 0,
                star.x, star.y, star.radius * 3
            );
            gradient.addColorStop(0, `rgba(0, 255, 0, ${star.opacity})`);
            gradient.addColorStop(1, 'rgba(0, 255, 0, 0)');
            
            this.ctx.fillStyle = gradient;
            this.ctx.fill();
            
            // Двигаем звёзды
            star.y += star.speed;
            if (star.y > this.canvas.height) {
                star.y = 0;
                star.x = Math.random() * this.canvas.width;
            }
        });
        
        // Добавляем лёгкий градиент поверх
        const overlay = this.ctx.createLinearGradient(0, 0, 0, this.canvas.height);
        overlay.addColorStop(0, 'rgba(0, 10, 0, 0.8)');
        overlay.addColorStop(1, 'rgba(0, 20, 10, 0.4)');
        this.ctx.fillStyle = overlay;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    }

    animate() {
        this.draw();
        requestAnimationFrame(() => this.animate());
    }
}

// Запускаем фон когда страница загрузится
window.addEventListener('load', () => {
    new Starfield();
    
    // Добавляем случайные глитч-эффекты
    setInterval(() => {
        if (Math.random() < 0.1) { // 10% шанс на глитч
            document.body.style.filter = 'hue-rotate(180deg)';
            setTimeout(() => {
                document.body.style.filter = 'none';
            }, 100);
        }
    }, 5000);
});
