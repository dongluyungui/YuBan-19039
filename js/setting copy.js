// 配置数据
const config = {
    // 语言翻译数据 data-i18n="xxx" :"", data-no-meow
    languages: {
        en: {
            //设置面板
            settings_title: "Settings",
            language_setting: "Language Settings",
            style_setting: "Style Settings",
            default_style: "Default Style",
            custom_style1: "Custom Style 1",
            close_btn: "Close" ,
            china:"China",
            meow:"meow",
            //页眉
            home: "Home",
            about: "About",
            gallery: "Gallery",
            timeline: "Timeline",
            comment_board: "Comment Board",
            voice_button: "Voice Button",
            previous_replays: "Previous Replays",
            Webpage_settings: "Webpage settings",
            //about
            About_the_site:"📄About the site📄",
            Station_Introduction:"✨ Station Introduction✨",
            Technical_Support_and_Acknowledgments:"✨ Technical Support and Acknowledgments✨",
            Update_Log:"Update Log",
        }
    },
    // 风格配置
    styles: {
        default: {
            name: "默认风格",
            enName: "Default Style",
            apply: () => {
                document.body.style.color = ""; // 恢复默认文本色
                document.body.style.background = ""; // 恢复默认背景色
            }
        },
        custom1: {
            name: "个性化1",
            enName: "Custom Style 1",
            apply: () => {
                document.body.style.color = "#9845"; // 个性化文本色
                document.body.style.background = "#9845"; // 个性化背景色
            }
        }
    }
};

// 存储中文默认文本（专门用于喵星语转换）
const chineseTexts = {};

// 存储默认文本（防止原始文本丢失）
const defaultTexts = {
    settings_title: "设置",
    language_setting: "语言设置",
    style_setting: "风格化设置",
    default_style: "默认风格",
    custom_style1: "个性化1",
    close_btn: "关闭"
};

// 存储所有中文文本节点（用于喵星语转换的源文本）
let chineseTextNodes = [];

// 初始化设置面板
function initSettings() {
    // 获取用户自定义的设置按钮
    const settingBtn = document.getElementById('settingBtn');
    if (!settingBtn) {
        console.warn('未找到设置按钮，请在HTML中添加id为"settingBtn"的按钮');
        return;
    }

    // 获取设置面板元素
    const panel = document.getElementById('settingPanel');
    const overlay = document.getElementById('settingOverlay');
    if (!panel || !overlay) {
        console.warn('未找到设置面板，请确保HTML中存在id为"settingPanel"和"settingOverlay"的元素');
        return;
    }

     // 先渲染面板内容
    renderPanelContent(panel);
    
    // 收集所有中文文本节点（用于后续喵星语转换的源）
    collectChineseTextNodes();
    
    // 保存中文默认文本（用于语言切换和喵星语转换）
    saveChineseTexts();

    // 加载保存的设置
    loadSavedSettings(panel);

    // 绑定按钮事件（打开设置面板）
    settingBtn.addEventListener('click', () => {
        panel.classList.add('open');
        overlay.style.display = 'block';
        setTimeout(() => overlay.style.opacity = 1, 10);
        
        // 禁用背景点击，保留滚动条
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
            // 恢复背景点击
            document.body.style.pointerEvents = '';
        }, 300);
    }

    // 绑定关闭按钮和遮罩层事件
    panel.querySelector('.setting-close').addEventListener('click', closePanel);
    overlay.addEventListener('click', closePanel);

    // 监听其他页面的设置变化
    window.addEventListener('storage', (e) => {
        if (e.key === 'userLanguage' || e.key === 'userStyle') {
            loadSavedSettings(panel);
        }
    });
}

// 收集所有中文文本节点（仅在初始化时执行，保存原始中文内容）
function collectChineseTextNodes() {
    const nodes = [];
    const walker = document.createTreeWalker(
        document.body,
        NodeFilter.SHOW_TEXT,
        {
            acceptNode: (node) => {
                if (!node.parentNode) return NodeFilter.FILTER_REJECT;
                
                const parentTag = node.parentNode.tagName.toLowerCase();
                if (parentTag === 'script' || parentTag === 'style') 
                    return NodeFilter.FILTER_REJECT;
                if (!node.textContent.trim()) 
                    return NodeFilter.FILTER_REJECT;
                return NodeFilter.FILTER_ACCEPT;
            }
        },
        false
    );

    let currentNode;
    while (currentNode = walker.nextNode()) {
        nodes.push({
            node: currentNode,
            chineseValue: currentNode.textContent // 保存初始中文内容
        });
    }
    
    chineseTextNodes = nodes;
}


// 保存所有带data-i18n属性的中文文本
function saveChineseTexts() {
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (!key) return;
        // 保存中文原始文本（优先用元素自身内容，否则用默认文本）
        chineseTexts[key] = el.innerHTML.trim() || defaultTexts[key] || key;
    });
}

// 渲染设置面板内容
function renderPanelContent(panel) {
    panel.innerHTML = `
        <div class="setting-header" >
            <h3 class="setting-title" data-i18n="settings_title" >设置</h3>
        </div>
        <div class="setting-content" >
            <h4 class="setting-label" data-i18n="language_setting" >语言设置</h4>
            <div class="setting-group">
                <div class="setting-option" data-setting="language" data-value="zh">
                    <span data-i18n="china" data-no-meow>中文</span>
                    <span class="check-mark">✓</span>
                </div>
                <div class="setting-option" data-setting="language" data-value="en">
                    <span data-no-meow>English</span>
                    <span class="check-mark">✓</span>
                </div>
                <div class="setting-option" data-setting="language" data-value="meow">
                    <span data-i18n="meow" data-no-meow >喵星语</span>
                    <span class="check-mark">✓</span>
                </div>
            </div>

            <!-- 风格设置组 -->
            <div class="setting-group">
                <h4 class="setting-label" data-i18n="style_setting">风格化设置</h4>
                <div class="setting-option" data-setting="style" data-value="default">
                    <span data-i18n="default_style">默认风格</span>
                    <span class="check-mark">✓</span>
                </div>
                <div class="setting-option" data-setting="style" data-value="custom1">
                    <span data-i18n="custom_style1">个性化1</span>
                    <span class="check-mark">✓</span>
                </div>
            </div>
        </div>
        <div class="setting-footer" >
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
            }
        });
    });
}

// 切换语言（中文/英文/喵星语）
function switchLanguage(lang) {
    // 先恢复所有文本到基础状态（用于非喵星语切换）
    if (lang !== 'meow') {
        // 恢复带data-i18n的元素
        document.querySelectorAll('[data-i18n]').forEach(el => {
            const key = el.getAttribute('data-i18n');
            if (!key) return;
            
            if (lang === 'zh') {
                el.innerHTML = chineseTexts[key] || defaultTexts[key] || key;
            } else if (lang === 'en') {
                el.innerHTML = config.languages.en[key] || chineseTexts[key] || defaultTexts[key] || key;
            }
        });

        // 恢复普通文本节点（非data-i18n的文本）
        chineseTextNodes.forEach(item => {
            item.node.textContent = item.chineseValue;
        });
    } 
    // 处理喵星语（基于中文转换）
    else {
        // 处理带data-i18n的元素（基于中文文本转换）
        document.querySelectorAll('[data-i18n]').forEach(el => {
            if (el.closest('[data-no-meow]') !== null) return;
            
            const key = el.getAttribute('data-i18n');
            const chineseSource = chineseTexts[key] || defaultTexts[key] || key; // 强制使用中文作为源
            
            let newText = '';
            for (let char of chineseSource) {
                if (/[\p{L}]/u.test(char)) { // 任何语言的字母/文字（主要针对中文）
                    newText += '喵';
                } else if (/[\s\p{P}]/u.test(char)) { // 空格或标点符号
                    newText += char;
                } else { // 数字和其他字符
                    newText += char;
                }
            }
            el.innerHTML = newText;
        });

        // 处理普通文本节点（基于中文原始文本转换）
        chineseTextNodes.forEach(item => {
            const node = item.node;
            if (!node.parentNode) return;
            if (node.parentNode.closest('[data-no-meow]') !== null) return;

            // 使用中文原始文本作为转换源
            let newText = '';
            for (let char of item.chineseValue) {
                if (/[\p{L}]/u.test(char)) { // 匹配中文及其他文字
                    newText += '喵';
                } else if (/[\s\p{P}]/u.test(char)) { // 空格或标点
                    newText += char;
                } else { // 其他字符保留
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
}

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', () => {
    // 延迟初始化，确保DOM完全加载
    setTimeout(() => {
        collectChineseTextNodes(); // 收集中文文本节点（仅一次）
        initSettings();
    }, 100);
});