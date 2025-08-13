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
            // 兼容原版数据结构，同时适配新数据的嵌套格式
            const uinfo = captain.uinfo || {};
            const baseInfo = uinfo.base || {};
            
            // 从嵌套结构提取数据，保持与原版访问方式一致
            const faceUrl = baseInfo.face || captain.face;
            const userName = baseInfo.name || captain.username;
            const userId = uinfo.uid || captain.uid;
            const guardLevel = uinfo.guard?.level || uinfo.medal?.guard_level || captain.guard_level || 3;
            
            const card = document.createElement('div');
            card.classList.add('captain-card');
            
            // 排名使用榜单排名
            const rank = document.createElement('div');
            rank.classList.add('captain-rank');
            const rankNum = captain.rank || (index + 1);
            if (rankNum === 1) rank.classList.add('rank1');
            if (rankNum === 2) rank.classList.add('rank2');
            if (rankNum === 3) rank.classList.add('rank3');
            rank.textContent = rankNum;
            
            const avatar = document.createElement('img');
            avatar.classList.add('captain-avatar');
            
            // 名称处理
            let displayName = userName || '未知舰长';
            displayName = stripHtmlTags(displayName);
            avatar.alt = displayName;

            // 头像处理（完全复刻原版逻辑，仅调整数据来源）
            if (faceUrl) {
                // 与原版完全一致的代理拼接方式
                avatar.src = `${CONFIG.IMG_PROXY}${encodeURIComponent(faceUrl)}&w=150&h=150`;
            } else {
                // 仅在无真实头像时使用默认头像
                avatar.src = `https://i.pravatar.cc/150?img=${index % 10}`;
            }

            // 错误处理保持原版逻辑
            avatar.onerror = function() {
                this.src = `https://i.pravatar.cc/150?img=${index % 10}`;
            };

            const name = document.createElement('p');
            name.classList.add('captain-name');
            name.textContent = displayName;
            
            // 陪伴天数（新增功能保留）
            const accompanyDays = document.createElement('p');
            accompanyDays.classList.add('captain-accompany');
            accompanyDays.textContent = `陪伴 ${captain.accompany || 0} 天`;
            
            // 舰长等级
            const level = document.createElement('span');
            level.classList.add('captain-level');
            
            // 修正等级对应关系（与数据定义一致）
            if (guardLevel === 1) {
                level.textContent = '总督';
                level.style.background = 'rgba(255, 85, 85, 0.15)';
                level.style.color = '#ff5555';
            } else if (guardLevel === 2) {
                level.textContent = '提督'; 
                level.style.background = 'rgba(255, 184, 108, 0.15)';
                level.style.color = '#ffb86c';
            } else {
                level.textContent = '舰长';
                level.style.background = 'rgba(100, 149, 237, 0.15)';
                level.style.color = '#6495ed';
            }
              
            card.appendChild(rank);
            card.appendChild(avatar);
            card.appendChild(name);
            card.appendChild(accompanyDays);
            card.appendChild(level);
              
            // 个人空间链接
            card.addEventListener('click', () => {
                if (userId) {
                    window.open(`https://space.bilibili.com/${userId}`, '_blank');
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
        
        // 复用全局定义的fetchData方法（与页面内JS保持一致）
        const captainData = await fetchData(url);
        
        if (captainData) {
            const allCaptains = [
                ...(captainData.data.top3 || []),
                ...(captainData.data.list || [])
            ].slice(0, CONFIG.PAGE_SIZE);
            
            renderCaptainList(container, allCaptains);
            return true;
        } else {
            // 模拟数据保持与原版结构一致
            const mockCaptains = [];
            for (let i = 0; i < CONFIG.PAGE_SIZE; i++) {
                const guardLevel = i === 0 ? 1 : (i < 3 ? 2 : 3);
                // 同时提供扁平结构和嵌套结构，确保兼容性
                mockCaptains.push({
                    rank: i + 1,
                    accompany: Math.floor(Math.random() * 365) + 10,
                    username: `舰长${i+1}`,
                    face: `https://i0.hdslb.com/bfs/face/5dc2df837803a3ece3e69e59df4130809d323949.jpg`,
                    uid: 1000000 + i,
                    guard_level: guardLevel,
                    uinfo: {
                        uid: 1000000 + i,
                        base: {
                            name: `舰长${i+1}`,
                            face: `https://i0.hdslb.com/bfs/face/5dc2df837803a3ece3e69e59df4130809d323949.jpg`
                        },
                        guard: {
                            level: guardLevel
                        }
                    }
                });
            }
            renderCaptainList(container, mockCaptains);
            return false;
        }
    } catch (error) {
        console.error('加载舰长数据时发生错误:', error);
        // 错误时显示模拟数据
        const mockCaptains = [];
        for (let i = 0; i < CONFIG.PAGE_SIZE; i++) {
            const guardLevel = i === 0 ? 1 : (i < 3 ? 2 : 3);
            mockCaptains.push({
                rank: i + 1,
                accompany: Math.floor(Math.random() * 365) + 10,
                username: `舰长${i+1}`,
                face: `https://i0.hdslb.com/bfs/face/5dc2df837803a3ece3e69e59df4130809d323949.jpg`,
                uid: 1000000 + i,
                guard_level: guardLevel,
                uinfo: {
                    uid: 1000000 + i,
                    base: {
                        name: `舰长${i+1}`,
                        face: `https://i0.hdslb.com/bfs/face/5dc2df837803a3ece3e69e59df4130809d323949.jpg`
                    }
                }
            });
        }
        renderCaptainList(container, mockCaptains);
        return false;
    }
}