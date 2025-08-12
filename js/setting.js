// 配置数据
const config = {
    // 语言翻译数据
    languages: {
        en: {
            // 设置面板
            settings_title: "Settings",
            language_setting: "Language Settings",
            style_setting: "Style Settings",
            cursor_setting: "Cursor Settings",
            context_menu_setting: "Context Menu Settings",
            enable_context_menu: "Enable Custom Menu",
            disable_context_menu: "Disable Custom Menu",
            default_style: "Default Style",
            custom_style1: "Custom Style 1",
            close_btn: "Close",
            china: "China",
            meow: "meow",
            default_cursor: "Default Cursor",
            zaixi_cursor: "烖晞 Cursor",
            // 页眉
            home: "Home",
            about: "About",
            gallery: "Gallery",
            timeline: "Timeline",
            comment_board: "Comment Board",
            voice_button: "Voice Button",
            previous_replays: "Previous Replays",
            Webpage_settings: "Webpage settings",
            // about
            About_the_site: "📄About the site📄",
            Station_Introduction: "✨ Station Introduction✨",
            Technical_Support_and_Acknowledgments: "✨ Technical Support and Acknowledgments✨",
            Update_Log: "Update Log",
        }
    },
    // 风格配置
    styles: {
        default: {
            name: "默认风格",
            enName: "Default Style",
            apply: () => {
                document.body.classList.remove('custom-style1');
                document.documentElement.style.setProperty('--primary-color', '#e91e63');
                document.documentElement.style.setProperty('--secondary-color', '#ff9eb5');
                document.documentElement.style.setProperty('--hover-color', '#ff6f91');
                document.documentElement.style.setProperty('--bg-color', '#fff5f8');
                document.documentElement.style.setProperty('--text-color', '#333');
                document.documentElement.style.setProperty('--border-color', '#ffc1d6');
            }
        },
        custom1: {
            name: "蓝色妖姬",
            enName: "Starry Purple",
            apply: () => {
                document.body.classList.add('custom-style1');
                document.documentElement.style.setProperty('--primary-color', '#2196f3');
                document.documentElement.style.setProperty('--secondary-color', '#90caf9');
                document.documentElement.style.setProperty('--hover-color', '#64b5f6');
                document.documentElement.style.setProperty('--bg-color', '#f0f7ff');
                document.documentElement.style.setProperty('--text-color', '#263238');
            }
        }
    },
    // 光标配置
    cursors: {
        default: {
            name: "默认光标",
            enName: "Default Cursor",
            apply: () => {
                document.body.classList.remove('cursor-zaixi');
            }
        },
        zaixi: {
            name: "烖晞",
            enName: "烖晞 Cursor",
            apply: () => {
                document.body.classList.add('cursor-zaixi');
            }
        }
    }
};

// 存储中文默认文本
const defaultTexts = {
    settings_title: "设置",
    language_setting: "语言设置",
    style_setting: "风格化设置",
    cursor_setting: "光标设置",
    context_menu_setting: "右键菜单设置",
    enable_context_menu: "启用自定义菜单",
    disable_context_menu: "禁用自定义菜单",
    default_style: "默认风格",
    custom_style1: "蓝色妖姬",
    default_cursor: "默认光标",
    zaixi_cursor: "烖晞",
    close_btn: "关闭"
};

// 存储所有中文文本节点
let chineseTextNodes = [];
const chineseTexts = {};

// 初始化设置面板
function initSettings() {
    const settingBtn = document.getElementById('settingBtn');
    if (!settingBtn) {
        console.warn('未找到设置按钮，请在HTML中添加id为"settingBtn"的按钮');
        return;
    }

    const panel = document.getElementById('settingPanel');
    const overlay = document.getElementById('settingOverlay');
    if (!panel || !overlay) {
        console.warn('未找到设置面板，请确保HTML中存在id为"settingPanel"和"settingOverlay"的元素');
        return;
    }

    renderPanelContent(panel);
    collectChineseTextNodes();
    saveChineseTexts();
    loadSavedSettings(panel);

    // 打开设置面板
    settingBtn.addEventListener('click', () => {
        panel.classList.add('open');
        overlay.style.display = 'block';
        setTimeout(() => overlay.style.opacity = 1, 10);
        document.body.style.pointerEvents = 'none';
        panel.style.pointerEvents = 'auto';
        overlay.style.pointerEvents = 'auto';
    });

    // 关闭面板函数
    function closePanel() {
        panel.classList.remove('open');
        overlay.style.opacity = 0;
        setTimeout(() => {
            overlay.style.display = 'none';
            document.body.style.pointerEvents = '';
        }, 300);
    }

    panel.querySelector('.setting-close').addEventListener('click', closePanel);
    overlay.addEventListener('click', closePanel);

    // 监听存储变化
    window.addEventListener('storage', (e) => {
        if (['userLanguage', 'userStyle', 'userCursor', 'contextMenuState'].includes(e.key)) {
            loadSavedSettings(panel);
        }
    });
}

// 收集中文文本节点
function collectChineseTextNodes() {
    const nodes = [];
    const walker = document.createTreeWalker(
        document.body,
        NodeFilter.SHOW_TEXT,
        {
            acceptNode: (node) => {
                if (!node.parentNode) return NodeFilter.FILTER_REJECT;
                const parentTag = node.parentNode.tagName.toLowerCase();
                if (parentTag === 'script' || parentTag === 'style') return NodeFilter.FILTER_REJECT;
                if (!node.textContent.trim()) return NodeFilter.FILTER_REJECT;
                return NodeFilter.FILTER_ACCEPT;
            }
        },
        false
    );

    let currentNode;
    while (currentNode = walker.nextNode()) {
        nodes.push({
            node: currentNode,
            chineseValue: currentNode.textContent
        });
    }
    
    chineseTextNodes = nodes;
}

// 保存中文文本
function saveChineseTexts() {
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (!key) return;
        chineseTexts[key] = el.innerHTML.trim() || defaultTexts[key] || key;
    });
}

// 渲染面板内容
function renderPanelContent(panel) {
    panel.innerHTML = `
        <div class="setting-header">
            <h3 class="setting-title" data-i18n="settings_title">设置</h3>
        </div>
        <div class="setting-content">
            <!-- 语言设置组 -->
            <div class="setting-section">
                <h4 class="setting-label" data-i18n="language_setting">语言设置</h4>
                <div class="setting-options">
                    <div class="setting-option" data-setting="language" data-value="zh">
                        <span data-i18n="china" data-no-meow>中文</span>
                        <span class="check-mark">✓</span>
                    </div>
                    <div class="setting-option" data-setting="language" data-value="en">
                        <span data-no-meow>English</span>
                        <span class="check-mark">✓</span>
                    </div>
                    <div class="setting-option" data-setting="language" data-value="meow">
                        <span data-i18n="meow" data-no-meow>喵星语</span>
                        <span class="check-mark">✓</span>
                    </div>
                </div>
            </div>

            <!-- 风格设置组 -->
            <div class="setting-section">
                <h4 class="setting-label" data-i18n="style_setting">风格化设置</h4>
                <div class="setting-options">
                    <div class="setting-option" data-setting="style" data-value="default">
                        <span data-i18n="default_style">默认风格</span>
                        <span class="check-mark">✓</span>
                    </div>
                    <div class="setting-option" data-setting="style" data-value="custom1">
                        <span data-i18n="custom_style1">蓝色妖姬</span>
                        <span class="check-mark">✓</span>
                    </div>
                </div>
            </div>
            
            <!-- 光标设置组 -->
            <div class="setting-section hide-on-mobile">
                <h4 class="setting-label" data-i18n="cursor_setting">光标设置</h4>
                <div class="setting-options">
                    <div class="setting-option" data-setting="cursor" data-value="default">
                        <span data-i18n="default_cursor">默认光标</span>
                        <span class="check-mark">✓</span>
                    </div>
                    <div class="setting-option" data-setting="cursor" data-value="zaixi">
                        <span data-i18n="zaixi_cursor">烖晞</span>
                        <span class="check-mark">✓</span>
                    </div>
                </div>
            </div>

            <!-- 右键菜单设置组 -->
            <div class="setting-section hide-on-mobile">
                <h4 class="setting-label" data-i18n="context_menu_setting">右键菜单设置</h4>
                <div class="setting-options">
                    <div class="setting-option" data-setting="contextMenu" data-value="enabled">
                        <span data-i18n="enable_context_menu">启用自定义菜单</span>
                        <span class="check-mark">✓</span>
                    </div>
                    <div class="setting-option" data-setting="contextMenu" data-value="disabled">
                        <span data-i18n="disable_context_menu">禁用自定义菜单</span>
                        <span class="check-mark">✓</span>
                    </div>
                </div>
            </div>
        </div>
        <div class="setting-footer">
            <button class="setting-close" data-i18n="close_btn">关闭</button>
        </div>
    `;

    // 绑定设置选项点击事件
    panel.querySelectorAll('.setting-option').forEach(option => {
        option.addEventListener('click', () => {
            const type = option.getAttribute('data-setting');
            const value = option.getAttribute('data-value');
            
            if (type === 'language') {
                switchLanguage(value);
                localStorage.setItem('userLanguage', value);
                updateActiveOption(panel, 'language', value);
            } else if (type === 'style') {
                applyStyle(value);
                localStorage.setItem('userStyle', value);
                updateActiveOption(panel, 'style', value);
            } else if (type === 'cursor') {
                applyCursor(value);
                localStorage.setItem('userCursor', value);
                updateActiveOption(panel, 'cursor', value);
            } else if (type === 'contextMenu') {
                setContextMenuState(value);
                localStorage.setItem('contextMenuState', value);
                updateActiveOption(panel, 'contextMenu', value);
            }
        });
    });
}

// 应用光标设置
function applyCursor(cursorKey) {
    const cursor = config.cursors[cursorKey];
    if (cursor && typeof cursor.apply === 'function') {
        cursor.apply();
    }
}

// 切换语言
function switchLanguage(lang) {
    if (lang !== 'meow') {
        document.querySelectorAll('[data-i18n]').forEach(el => {
            const key = el.getAttribute('data-i18n');
            if (!key) return;
            
            if (lang === 'zh') {
                el.innerHTML = chineseTexts[key] || defaultTexts[key] || key;
            } else if (lang === 'en') {
                el.innerHTML = config.languages.en[key] || chineseTexts[key] || defaultTexts[key] || key;
            }
        });

        chineseTextNodes.forEach(item => {
            item.node.textContent = item.chineseValue;
        });
    } else {
        document.querySelectorAll('[data-i18n]').forEach(el => {
            if (el.closest('[data-no-meow]') !== null) return;
            
            const key = el.getAttribute('data-i18n');
            const chineseSource = chineseTexts[key] || defaultTexts[key] || key;
            
            let newText = '';
            for (let char of chineseSource) {
                if (/[\p{L}]/u.test(char)) {
                    newText += '喵';
                } else if (/[\s\p{P}]/u.test(char)) {
                    newText += char;
                } else {
                    newText += char;
                }
            }
            el.innerHTML = newText;
        });

        chineseTextNodes.forEach(item => {
            const node = item.node;
            if (!node.parentNode || node.parentNode.closest('[data-no-meow]') !== null) return;

            let newText = '';
            for (let char of item.chineseValue) {
                if (/[\p{L}]/u.test(char)) {
                    newText += '喵';
                } else if (/[\s\p{P}]/u.test(char)) {
                    newText += char;
                } else {
                    newText += char;
                }
            }
            node.textContent = newText;
        });
    }
}

// 应用风格设置
function applyStyle(styleKey) {
    const style = config.styles[styleKey];
    if (style && typeof style.apply === 'function') {
        style.apply();
    }
}

// 控制右键菜单状态
function setContextMenuState(state) {
    const isEnabled = state === 'enabled';
    localStorage.setItem('isContextMenuEnabled', isEnabled);
    
    if (isEnabled) {
        enableContextMenu();
    } else {
        disableContextMenu();
    }
}

// 启用右键菜单
function enableContextMenu() {
    if (window.contextMenu) {
        window.contextMenu.style.display = '';
    }
}

// 禁用右键菜单（只隐藏自定义菜单，保留系统默认）
function disableContextMenu() {
    if (window.contextMenu) {
        window.contextMenu.style.display = 'none';
    }
}

// 更新选项选中状态
function updateActiveOption(panel, type, value) {
    panel.querySelectorAll(`.setting-option[data-setting="${type}"]`).forEach(option => {
        if (option.getAttribute('data-value') === value) {
            option.classList.add('active');
        } else {
            option.classList.remove('active');
        }
    });
}

// 加载本地保存的设置
function loadSavedSettings(panel) {
    // 加载语言设置
    const savedLang = localStorage.getItem('userLanguage') || 'zh';
    switchLanguage(savedLang);
    updateActiveOption(panel, 'language', savedLang);

    // 加载风格设置
    const savedStyle = localStorage.getItem('userStyle') || 'default';
    applyStyle(savedStyle);
    updateActiveOption(panel, 'style', savedStyle);

    // 加载光标设置
    const savedCursor = localStorage.getItem('userCursor') || 'default';
    applyCursor(savedCursor);
    updateActiveOption(panel, 'cursor', savedCursor);

    // 加载右键菜单设置
    const savedContextMenu = localStorage.getItem('contextMenuState') || 'enabled';
    setContextMenuState(savedContextMenu);
    updateActiveOption(panel, 'contextMenu', savedContextMenu);
}

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        collectChineseTextNodes();
        initSettings();
    }, 100);
});
