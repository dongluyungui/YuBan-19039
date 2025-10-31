// music.js - 修改后的音乐播放器实现

class MusicPlayer {
    constructor() {
        this.audio = new Audio();
        this.currentMusic = null;
        this.musicList = []; // 所有音乐数据
        this.filteredMusic = []; // 当前筛选结果的音乐数据
        this.isPlaying = false;
        this.currentPage = 1;
        this.itemsPerPage = 10;
        this.playMode = 'random'; // 默认随机播放
        this.loopMode = false; // 默认不循环
        this.volume = 50; // 默认音量
        
        this.init();
    }
    
    init() {
        this.createBottomPlayer(); // 创建底部播放器
        this.setupEventListeners();
        this.setupAudioEvents();
        this.collectMusicFromCards(); // 从页面收集音乐数据
        this.hidePlayer(); // 初始隐藏播放器
    }
    
    // 创建底部播放器
    createBottomPlayer() {
        // 检查是否已存在播放器，避免重复创建
        if (document.querySelector('.music-player')) return;
        
        const playerHTML = `
            <div class="music-player" style="display: none;">
                <div class="player-controls">
                    <button id="playPauseBtn" class="control-btn">▶</button>
                    <button id="prevBtn" class="control-btn">⏮</button>
                    <button id="nextBtn" class="control-btn">⏭</button>
                    <button id="playModeBtn" class="control-btn">🔀</button>
                    <button id="loopBtn" class="control-btn">➡️</button>
                    <div class="progress-container">
                        <div class="progress-bar" id="progressBar"></div>
                    </div>
                    <span id="currentTime">0:00</span>
                    <span>/</span>
                    <span id="totalTime">0:00</span>
                    <div class="volume-control">
                        <span>🔊</span>
                        <input type="range" id="volumeSlider" min="0" max="100" value="${this.volume}">
                    </div>
                </div>
                <div class="now-playing" id="nowPlaying">
                    <span>未播放</span>
                </div>
            </div>
        `;
        
        document.body.insertAdjacentHTML('beforeend', playerHTML);
        
        // 添加播放器样式
        this.addPlayerStyles();
        
        // 重新绑定事件
        this.setupPlayerEventListeners();
    }
    
    // 添加播放器样式
    addPlayerStyles() {
        const style = document.createElement('style');
        style.textContent = `
            .music-player {
                position: fixed;
                bottom: 0;
                left: 0;
                right: 0;
                background: rgba(255, 255, 255, 0.95);
                border-top: 2px solid #e0e0e0;
                padding: 10px 200px;
                display: flex;
                justify-content: space-between;
                align-items: center;
                z-index: 1000;
                backdrop-filter: blur(10px);
                box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.1);
            }
            
            .player-controls {
                display: flex;
                align-items: center;
                gap: 15px;
                flex: 1;
            }
            
            .control-btn {
                background: var(--secondary-color);
                color: white;
                border: none;
                border-radius: 50%;
                width: 40px;
                height: 40px;
                cursor: pointer;
                font-size: 14px;
                transition: all 0.3s ease;
                display: flex;
                align-items: center;
                justify-content: center;
            }
            
            .control-btn:hover {
                background: var(--secondary-color);
                transform: scale(1.1);
            }
            
            .progress-container {
                flex: 1;
                height: 6px;
                background: #e0e0e0;
                border-radius: 3px;
                cursor: pointer;
                position: relative;
            }
            
            .progress-bar {
                height: 100%;
                background: var(--secondary-color);
                border-radius: 3px;
                width: 0%;
                transition: width 0.1s ease;
            }
            
            .volume-control {
                display: flex;
                align-items: center;
                gap: 8px;
            }
            
            #volumeSlider {
                width: 80px;
            }
            
            .now-playing {
                font-size: 14px;
                color: #666;
                min-width: 200px;
                text-align: right;
            }
            
            @media (max-width: 768px) {
                .music-player {
                    flex-direction: column;
                    gap: 10px;
                    padding: 10px;
                }
                
                .player-controls {
                    width: 100%;
                }
                
                .now-playing {
                    text-align: center;
                    min-width: auto;
                }
            }
        `;
        document.head.appendChild(style);
    }
    
    // 显示播放器
    showPlayer() {
        const player = document.querySelector('.music-player');
        if (player) {
            player.style.display = 'flex';
        }
    }
    
    // 隐藏播放器
    hidePlayer() {
        const player = document.querySelector('.music-player');
        if (player) {
            player.style.display = 'none';
        }
    }
    
    // 设置播放器事件监听
    setupPlayerEventListeners() {
        // 播放器控制
        document.getElementById('playPauseBtn').addEventListener('click', () => this.togglePlayPause());
        document.getElementById('prevBtn').addEventListener('click', () => this.previous());
        document.getElementById('nextBtn').addEventListener('click', () => this.next());
        document.getElementById('playModeBtn').addEventListener('click', () => this.togglePlayMode());
        document.getElementById('loopBtn').addEventListener('click', () => this.toggleLoopMode());
        document.getElementById('volumeSlider').addEventListener('input', (e) => this.setVolume(e.target.value));
        
        // 进度条点击
        document.querySelector('.progress-container').addEventListener('click', (e) => this.seek(e));
    }
    
    // 设置事件监听
    setupEventListeners() {
        // 音乐卡片播放按钮事件（委托）
        document.addEventListener('click', (e) => {
            if (e.target.closest('.music-card .play-btn')) {
                const card = e.target.closest('.music-card');
                // 修改：只在当前显示的卡片中查找
                const visibleCards = Array.from(document.querySelectorAll('.music-card')).filter(
                    card => getComputedStyle(card).display !== 'none'
                );
                const musicIndex = visibleCards.indexOf(card);
                if (musicIndex !== -1 && this.filteredMusic[musicIndex]) {
                    this.playMusic(this.filteredMusic[musicIndex].id);
                }
            }
        });
    }
    
    // 设置音频事件
    setupAudioEvents() {
        this.audio.addEventListener('loadedmetadata', () => this.onAudioLoaded());
        this.audio.addEventListener('timeupdate', () => this.updateProgress());
        this.audio.addEventListener('ended', () => {
            if (this.loopMode) {
                // 循环播放当前歌曲
                this.audio.currentTime = 0;
                this.audio.play();
            } else {
                // 播放下一首
                this.next();
            }
        });
        this.audio.addEventListener('error', (e) => this.onAudioError(e));
    }
    
    // 从页面中的 music-card 收集音乐数据
    collectMusicFromCards() {
        const musicCards = document.querySelectorAll('.music-card');
        this.musicList = [];
        
        musicCards.forEach((card, index) => {
            const title = card.querySelector('.music-title-text').textContent;
            const artist = card.querySelector('.music-artist').textContent;
            const date = card.querySelector('.music-date').textContent;
            const tags = card.dataset.tags;
            
            // 从卡片获取音乐文件路径
            const url = this.getMusicUrlFromCard(card);
            
            this.musicList.push({
                id: index + 1,
                title: title,
                artist: artist,
                date: date,
                tags: tags,
                url: url,
                element: card
            });
        });
        
        // 初始时，filteredMusic 包含所有音乐
        this.filteredMusic = [...this.musicList];
    }
    
    // 更新筛选后的音乐列表
    updateFilteredMusic() {
        // 获取当前显示的音乐卡片
        const visibleCards = Array.from(document.querySelectorAll('.music-card')).filter(
            card => getComputedStyle(card).display !== 'none'
        );
        
        // 根据显示的音乐卡片更新 filteredMusic
        this.filteredMusic = [];
        visibleCards.forEach((card, index) => {
            const title = card.querySelector('.music-title-text').textContent;
            const artist = card.querySelector('.music-artist').textContent;
            const date = card.querySelector('.music-date').textContent;
            const tags = card.dataset.tags;
            const url = this.getMusicUrlFromCard(card);
            
            this.filteredMusic.push({
                id: index + 1,
                title: title,
                artist: artist,
                date: date,
                tags: tags,
                url: url,
                element: card
            });
        });
        
        // 如果当前播放的音乐不在筛选结果中，停止播放
        if (this.currentMusic && !this.filteredMusic.find(m => m.url === this.currentMusic.url)) {
            this.audio.pause();
            this.isPlaying = false;
            this.currentMusic = null;
            this.hidePlayer();
            this.updateCardPlayState();
        }
    }
    
    // 从卡片获取音乐文件路径
    getMusicUrlFromCard(card) {
        // 直接从 data-music-url 属性获取路径
        if (card.dataset.musicUrl) {
            return card.dataset.musicUrl;
        }
        
        // 如果卡片没有显式指定音乐路径，返回空字符串
        console.warn('音乐卡片缺少data-music-url属性:', card);
        return '';
    }
    
    // 播放音乐
    async playMusic(musicId) {
        const music = this.filteredMusic.find(m => m.id === musicId);
        if (!music) return;

        // 如果是同一首歌，切换播放状态
        if (this.currentMusic && this.currentMusic.id === musicId) {
            this.togglePlayPause();
            return;
        }

        // 新歌曲，先停止当前播放
        this.audio.pause();
        this.currentMusic = music;

        try {
            // 显示加载状态
            const playBtn = music.element.querySelector('.play-btn');
            if (playBtn) {
                playBtn.classList.add('loading');
                playBtn.textContent = '⏳';
            }
            
            // 设置音频源
            this.audio.src = music.url;
            await this.audio.load();
            
            // 更新底部播放器显示
            document.getElementById('nowPlaying').innerHTML = 
                `<strong>${music.title}</strong> - ${music.artist}`;
            
            // 显示播放器
            this.showPlayer();
            
            // 开始播放
            await this.audio.play();
            this.isPlaying = true;
            this.updatePlayButton();
            
            // 更新卡片播放状态
            this.updateCardPlayState();
            
        } catch (error) {
            console.error('播放失败:', error);
            alert('播放失败，请检查音乐文件是否存在');
            
            // 如果播放失败，隐藏播放器
            this.hidePlayer();
        } finally {
            const playBtn = music.element.querySelector('.play-btn');
            if (playBtn) {
                playBtn.classList.remove('loading');
            }
        }
    }
    
    // 更新卡片播放状态
    updateCardPlayState() {
        // 移除所有卡片的播放状态
        document.querySelectorAll('.music-card').forEach(card => {
            card.classList.remove('playing');
            const btn = card.querySelector('.play-btn');
            if (btn) btn.textContent = '▶';
        });
        
        // 为当前播放的卡片添加播放状态
        if (this.currentMusic && this.currentMusic.element) {
            this.currentMusic.element.classList.add('playing');
            const btn = this.currentMusic.element.querySelector('.play-btn');
            if (btn) btn.textContent = this.isPlaying ? '⏸' : '▶';
        }
    }
    
    // 切换播放/暂停
    togglePlayPause() {
        if (!this.currentMusic) return;
        
        if (this.isPlaying) {
            this.audio.pause();
        } else {
            this.audio.play();
        }
        this.isPlaying = !this.isPlaying;
        this.updatePlayButton();
        this.updateCardPlayState();
    }
    
    // 更新播放按钮
    updatePlayButton() {
        const playPauseBtn = document.getElementById('playPauseBtn');
        if (playPauseBtn) {
            playPauseBtn.textContent = this.isPlaying ? '⏸' : '▶';
        }
    }
    
    // 下一首
    next() {
        if (!this.currentMusic || this.filteredMusic.length === 0) return;
        
        let nextIndex;
        if (this.playMode === 'random') {
            // 随机播放：随机选择下一首
            do {
                nextIndex = Math.floor(Math.random() * this.filteredMusic.length);
            } while (this.filteredMusic[nextIndex].id === this.currentMusic.id && this.filteredMusic.length > 1);
        } else {
            // 顺序播放
            const currentIndex = this.filteredMusic.findIndex(m => m.id === this.currentMusic.id);
            nextIndex = (currentIndex + 1) % this.filteredMusic.length;
        }
        
        this.playMusic(this.filteredMusic[nextIndex].id);
    }
    
    // 上一首
    previous() {
        if (!this.currentMusic || this.filteredMusic.length === 0) return;
        
        const currentIndex = this.filteredMusic.findIndex(m => m.id === this.currentMusic.id);
        const prevIndex = (currentIndex - 1 + this.filteredMusic.length) % this.filteredMusic.length;
        this.playMusic(this.filteredMusic[prevIndex].id);
    }
    
    // 切换播放模式
    togglePlayMode() {
        const modes = ['random', 'sequential'];
        const currentIndex = modes.indexOf(this.playMode);
        this.playMode = modes[(currentIndex + 1) % modes.length];
        
        // 更新界面显示
        const modeBtn = document.getElementById('playModeBtn');
        if (modeBtn) {
            modeBtn.textContent = this.playMode === 'random' ? '🔀' : '🔁';
            modeBtn.title = this.playMode === 'random' ? '随机播放' : '顺序播放';
        }
    }
    
    // 切换循环模式
    toggleLoopMode() {
        this.loopMode = !this.loopMode;
        this.audio.loop = this.loopMode;
        
        // 更新界面显示
        const loopBtn = document.getElementById('loopBtn');
        if (loopBtn) {
            loopBtn.textContent = this.loopMode ? '🔂' : '➡️';
            loopBtn.title = this.loopMode ? '单曲循环' : '不循环';
        }
    }
    
    // 设置音量
    setVolume(volume) {
        this.volume = volume;
        this.audio.volume = volume / 100;
    }
    
    // 跳转进度
    seek(e) {
        if (!this.currentMusic) return;
        
        const progressContainer = e.currentTarget;
        const clickPosition = (e.pageX - progressContainer.getBoundingClientRect().left) / progressContainer.offsetWidth;
        this.audio.currentTime = clickPosition * this.audio.duration;
    }
    
    // 音频加载完成
    onAudioLoaded() {
        document.getElementById('totalTime').textContent = this.formatTime(this.audio.duration);
    }
    
    // 更新进度条
    updateProgress() {
        if (!this.currentMusic) return;
        
        const progress = (this.audio.currentTime / this.audio.duration) * 100;
        document.getElementById('progressBar').style.width = progress + '%';
        document.getElementById('currentTime').textContent = this.formatTime(this.audio.currentTime);
    }
    
    // 音频错误处理
    onAudioError(e) {
        console.error('音频加载错误:', e);
        alert('音频加载失败，请检查文件路径');
        this.hidePlayer();
    }
    
    // 格式化时间
    formatTime(seconds) {
        if (isNaN(seconds)) return '0:00';
        
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    }
}

// 初始化音乐播放器
document.addEventListener('DOMContentLoaded', () => {
    window.musicPlayer = new MusicPlayer();
});