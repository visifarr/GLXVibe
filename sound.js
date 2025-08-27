class SoundManager {
    constructor() {
        this.sounds = {};
        this.masterVolume = 0.6;
        this.muted = false;
    }

    loadSound(key, src) {
        this.sounds[key] = new Audio(src);
        this.sounds[key].volume = this.masterVolume;
        this.sounds[key].load();
    }

    play(key, loop = false) {
        if (this.muted || !this.sounds[key]) return;
        const sound = this.sounds[key].cloneNode(); // Чтобы перезапускать звук
        sound.loop = loop;
        sound.volume = this.masterVolume;
        sound.play();
        return sound;
    }

    stop(soundInstance) {
        if (soundInstance) {
            soundInstance.pause();
            soundInstance.currentTime = 0;
        }
    }

    setVolume(volume) {
        this.masterVolume = volume;
        for (const key in this.sounds) {
            this.sounds[key].volume = volume;
        }
    }

    toggleMute() {
        this.muted = !this.muted;
        for (const key in this.sounds) {
            this.sounds[key].muted = this.muted;
        }
        return this.muted;
    }
}

// Создаем глобальный менеджер звуков
const soundManager = new SoundManager();

// Загружаем звуки после загрузки страницы
window.addEventListener('load', () => {
    soundManager.loadSound('ambient', 'audio/ambient.ogg');
    soundManager.loadSound('click', 'audio/click.ogg');
    soundManager.loadSound('glitch', 'audio/glitch.ogg');
    soundManager.loadSound('music', 'audio/music.ogg');
});
