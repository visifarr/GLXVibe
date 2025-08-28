class ClickerGame {
    constructor() {
        this.score = 0;
        this.clickValue = 1;
        this.autoClickerLevel = 0;
        this.doubleClickLevel = 0;
        this.autoClickerInterval = null;
        
        this.initializeElements();
        this.setupEventListeners();
        this.loadGame();
        this.startAutoClicker();
    }

    initializeElements() {
        this.scoreElement = document.getElementById('score');
        this.clickerButton = document.getElementById('clicker');
        this.scoreAnimation = document.getElementById('scoreAnimation');
        this.particlesContainer = document.getElementById('particles');
        this.autoClickerUpgrade = document.getElementById('autoClicker');
        this.doubleClickUpgrade = document.getElementById('doubleClick');
    }

    setupEventListeners() {
        this.clickerButton.addEventListener('click', () => this.handleClick());
        
        this.autoClickerUpgrade.addEventListener('click', () => 
            this.buyUpgrade('autoClicker', 50)
        );
        
        this.doubleClickUpgrade.addEventListener('click', () => 
            this.buyUpgrade('doubleClick', 100)
        );
    }

    handleClick() {
        this.addScore(this.clickValue);
        this.createClickEffect();
        this.showScoreAnimation(this.clickValue);
    }

    addScore(amount) {
        this.score += amount;
        this.updateScoreDisplay();
        this.saveGame();
    }

    updateScoreDisplay() {
        this.scoreElement.textContent = this.score.toLocaleString();
        this.updateUpgradesAvailability();
    }

    createClickEffect() {
        const effect = document.createElement('div');
        effect.className = 'click-effect';
        this.clickerButton.appendChild(effect);
        
        setTimeout(() => {
            effect.remove();
        }, 500);
    }

    showScoreAnimation(amount) {
        const anim = this.scoreAnimation.cloneNode(true);
        anim.textContent = `+${amount}`;
        anim.style.animation = 'none';
        this.scoreContainer = document.querySelector('.score-container');
        this.scoreContainer.appendChild(anim);
        
        setTimeout(() => {
            anim.style.animation = 'scorePop 1s ease-out forwards';
        }, 10);

        setTimeout(() => {
            anim.remove();
        }, 1000);
    }

    createParticles(x, y) {
        for (let i = 0; i < 10; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            
            const size = Math.random() * 10 + 5;
            const angle = Math.random() * Math.PI * 2;
            const distance = Math.random() * 100 + 50;
            
            particle.style.width = `${size}px`;
            particle.style.height = `${size}px`;
            particle.style.left = `${x}px`;
            particle.style.top = `${y}px`;
            particle.style.setProperty('--tx', `${Math.cos(angle) * distance}px`);
            particle.style.setProperty('--ty', `${Math.sin(angle) * distance}px`);
            
            this.particlesContainer.appendChild(particle);
            
            setTimeout(() => {
                particle.remove();
            }, 1000);
        }
    }

    buyUpgrade(type, cost) {
        if (this.score >= cost) {
            this.score -= cost;
            
            if (type === 'autoClicker') {
                this.autoClickerLevel++;
                this.autoClickerUpgrade.querySelector('.count').textContent = this.autoClickerLevel;
                this.startAutoClicker();
            } else if (type === 'doubleClick') {
                this.doubleClickLevel++;
                this.doubleClickUpgrade.querySelector('.count').textContent = this.doubleClickLevel;
                this.clickValue = 1 + this.doubleClickLevel;
            }
            
            this.updateScoreDisplay();
            this.saveGame();
        }
    }

    startAutoClicker() {
        if (this.autoClickerInterval) {
            clearInterval(this.autoClickerInterval);
        }
        
        if (this.autoClickerLevel > 0) {
            this.autoClickerInterval = setInterval(() => {
                this.addScore(this.autoClickerLevel);
            }, 1000);
        }
    }

    updateUpgradesAvailability() {
        const upgrades = [
            { element: this.autoClickerUpgrade, cost: 50 },
            { element: this.doubleClickUpgrade, cost: 100 }
        ];

        upgrades.forEach(upgrade => {
            if (this.score >= upgrade.cost) {
                upgrade.element.style.opacity = '1';
                upgrade.element.style.cursor = 'pointer';
            } else {
                upgrade.element.style.opacity = '0.5';
                upgrade.element.style.cursor = 'not-allowed';
            }
        });
    }

    saveGame() {
        const gameData = {
            score: this.score,
            clickValue: this.clickValue,
            autoClickerLevel: this.autoClickerLevel,
            doubleClickLevel: this.doubleClickLevel
        };
        
        localStorage.setItem('clickerGame', JSON.stringify(gameData));
    }

    loadGame() {
        const savedData = localStorage.getItem('clickerGame');
        
        if (savedData) {
            const gameData = JSON.parse(savedData);
            
            this.score = gameData.score || 0;
            this.clickValue = gameData.clickValue || 1;
            this.autoClickerLevel = gameData.autoClickerLevel || 0;
            this.doubleClickLevel = gameData.doubleClickLevel || 0;
            
            this.updateScoreDisplay();
            
            if (this.autoClickerLevel > 0) {
                this.autoClickerUpgrade.querySelector('.count').textContent = this.autoClickerLevel;
            }
            
            if (this.doubleClickLevel > 0) {
                this.doubleClickUpgrade.querySelector('.count').textContent = this.doubleClickLevel;
            }
        }
    }
}

// Инициализация игры когда DOM загружен
document.addEventListener('DOMContentLoaded', () => {
    new ClickerGame();
    
    // Добавляем обработчик для частиц при клике
    document.addEventListener('click', (e) => {
        const game = new ClickerGame();
        game.createParticles(e.clientX, e.clientY);
    });
});
