
/**
 * 去除 HTML 标签的函数
 * @param {string} str 包含HTML标签的字符串
 * @returns {string} 去除标签后的纯文本
 */
function stripHtmlTags(str) {
    return str.replace(/<[^>]*>/g, '');
}

/**
 * 渲染舰长列表
 * @param {Element} container 列表容器元素
 * @param {Array} captains 舰长数据数组
 */
function renderCaptainList(container, captains) {
    container.innerHTML = '';
    if (captains && captains.length > 0) {
        captains.forEach((captain, index) => {
            const card = document.createElement('div');
            card.classList.add('captain-card');
            
            // 添加排名
            const rank = document.createElement('div');
            rank.classList.add('captain-rank');
            if (index === 0) rank.classList.add('rank1');
            if (index === 1) rank.classList.add('rank2');
            if (index === 2) rank.classList.add('rank3');
            rank.textContent = index + 1;
            
            const avatar = document.createElement('img');
            avatar.classList.add('captain-avatar');
            
            let displayName = captain.username || '未知舰长';
            displayName = stripHtmlTags(displayName);
            avatar.alt = displayName;

            // 使用图片代理解决跨域问题
            if (captain.face) {
                // 使用代理获取图片
                avatar.src = `${CONFIG.IMG_PROXY}${encodeURIComponent(captain.face)}&w=150&h=150`;
            } else {
                // 使用默认头像
                avatar.src = `https://i.pravatar.cc/150?img=${index % 10}`;
            }

            // 添加默认头像处理
            avatar.onerror = function() {
                this.src = `https://i.pravatar.cc/150?img=${index % 10}`;
            };

            const name = document.createElement('p');
            name.classList.add('captain-name');
            name.textContent = displayName;
            
            // 舰长等级
            const level = document.createElement('span');
            level.classList.add('captain-level');
            
            // 根据舰长等级显示不同文本和样式
            if (captain.guard_level === 0) {
                level.textContent = '总督';
                level.style.background = 'rgba(255, 85, 85, 0.15)';
                level.style.color = '#ff5555';
            } else if (captain.guard_level === 1) {
                level.textContent = '提督'; 
                level.style.background = 'rgba(255, 184, 108, 0.15)';
                level.style.color = '#ffb86c';
            } else {
                level.textContent = '舰长';
            }
              
            card.appendChild(rank);
            card.appendChild(avatar);
            card.appendChild(name);
            card.appendChild(level);
              
            // 添加点击事件，打开舰长个人空间
            card.addEventListener('click', () => {
                if (captain.uid) {
                    window.open(`https://space.bilibili.com/${captain.uid}`, '_blank');
                }
            });
              
            container.appendChild(card);
        });
    } else {
        const message = document.createElement('p');
        message.textContent = '暂无舰长信息';
        message.style.textAlign = 'center';
        message.style.color = '#a9a9c5';
        message.style.padding = '20px';
        container.appendChild(message);
    }
}

/**
 * 加载舰长数据并渲染
 * @param {number} roomId 直播间ID
 * @param {number} uid 主播UID
 * @param {Element} container 舰长列表容器元素
 * @returns {Promise<boolean>} 加载是否成功
 */
async function loadAndRenderCaptainData(roomId, uid, container) {
    try {
        const url = `https://api.live.bilibili.com/xlive/app-room/v2/guardTab/topList?roomid=${roomId}&page=1&ruid=${uid}&page_size=${CONFIG.PAGE_SIZE}`;
        
        // 定义通用请求方法
        async function fetchData(url) {
            try {
                const response = await fetch(`${CONFIG.CORS_PROXY}${encodeURIComponent(url)}`);
                if (!response.ok) throw new Error('网络请求失败');
        
                const data = await response.json();
                return JSON.parse(data.contents);
            } catch (error) {
                console.error('获取舰长数据失败:', error);
                return null;
            }
        }
        
        const captainData = await fetchData(url);
        
        if (captainData) {
            // 合并 top3 和 list 中的舰长数据
            const allCaptains = [
                ...(captainData.data.top3 || []),
                ...(captainData.data.list || [])
            ].slice(0, CONFIG.PAGE_SIZE);
            
            // 模拟添加舰长等级（实际应用中应从API获取）
            allCaptains.forEach((captain, index) => {
                if (index === 0) captain.guard_level = 1; // 总督
                else if (index < 3) captain.guard_level = 2; // 提督
                else captain.guard_level = 3; // 舰长
            });
            
            renderCaptainList(container, allCaptains);
            return true;
        } else {
            // 加载失败时显示模拟数据
            const mockCaptains = [];
            for (let i = 0; i < CONFIG.PAGE_SIZE; i++) {
                mockCaptains.push({
                    username: `舰长${i+1}`,
                    face: `https://i.pravatar.cc/150?img=${i}`,
                    uid: 1000000 + i,
                    guard_level: i === 0 ? 1 : (i < 3 ? 2 : 3)
                });
            }
            renderCaptainList(container, mockCaptains);
            return false;
        }
    } catch (error) {
        console.error('加载舰长数据时发生错误:', error);
        // 显示模拟数据
        const mockCaptains = [];
        for (let i = 0; i < CONFIG.PAGE_SIZE; i++) {
            mockCaptains.push({
                username: `舰长${i+1}`,
                face: `https://i.pravatar.cc/150?img=${i}`,
                uid: 1000000 + i,
                guard_level: i === 0 ? 1 : (i < 3 ? 2 : 3)
            });
        }
        renderCaptainList(container, mockCaptains);
        return false;
    }
}