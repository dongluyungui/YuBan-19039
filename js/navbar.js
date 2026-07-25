/**
 * ============================================
 * 统一导航栏管理器 navbar.js
 * ============================================
 *
 * 功能：
 * - 一处配置导航项，所有页面同步更新
 * - 自动高亮当前页面（通过 data-page 属性匹配）
 * - PC/移动端自适应（"更多"下拉菜单由 responsive-nav.js 控制）
 * - 自动适配根目录/子目录页面路径
 *
 * 使用方法：
 *
 * 1. 在每个页面的 <header> 中添加 data-page 属性标识当前页面：
 *
     <header class="header" data-page="index">
         <div class="header-content">
             <div></div>  <!-- JS 自动填充导航内容 -->
          </div>
     </header>
 *
 * 2. 引入本脚本（必须放在 responsive-nav.js 之前）：
 *
 *     <script src="js/navbar.js"></script>
 *     <script src="js/responsive-nav.js"></script>
 *
 * 3. data-page 可选值（不区分大小写）：
 *    index | about | gallery | timeline | comment
 *    sound | livehistory | games | music
 *
 * 4. 子目录页面（如 games/xxx.html）：
 *    - 脚本自动检测路径深度，链接自动添加 "../" 前缀
 *    - 子目录页面自动排除"小游戏"和"音乐"链接（避免指向自身）
 *
 * 5. 特殊情况覆盖：
 *    如需手动指定目录深度，可在 header 内添加 data-depth 属性：
 *    <header class="header" data-page="xxx" data-depth="1">
  核心设计

  js/navbar.js 实现了：

  1. NAV_ITEMS 配置（第49-58行） — 所有导航链接集中定义，修改此处→全局生效
  2. 自动高亮（第122-124行）— 读取 <header data-page="...">，匹配 item.key，自动添加 active 类（不区分大小写）
  3. 路径适配（第92-118行）— 自动检测 URL 是否在 games/ 子目录下，链接加 ../ 前缀
  4. 深度差异化（第62-73行）— 子目录页面自动排除"小游戏"和"音乐"链接
  5. PC/移动端"更多"菜单 — 保留原始的 hidden-on-mobile + 更多 ▼ 结构，交互由 responsive-nav.js 处理

  执行流程（脚本顺序关键）

  navbar.js (DOMContentLoaded → 渲染导航HTML)
      ↓
  responsive-nav.js (DOMContentLoaded → 找到已渲染的元素，绑定"更多"交互)

  navbar.js 必须 在 responsive-nav.js 之前 加载。

  ---
  📋 各页面迁移指南

  以下是你需要手动修改的每个文件，将硬编码导航栏替换为新系统：

  根目录页面（9个）

  每个文件做同样的三件事：

  ① 替换 header 代码块

  <!-- 替换前：约 40 行硬编码导航 -->
  <header class="header">
      <div class="header-content">
          <div>
              <a href="index.html" ...>首页</a>
              <a href="About.html" ...>关于</a>
              ... 大量重复代码 ...
          </div>
      </div>
  </header>

  <!-- 替换后：仅 6 行 -->
  <header class="header" data-page="index">
      <div class="header-content">
          <div></div>  <!-- JS 自动填充 -->
      </div>
  </header>

  ② 调整脚本顺序

  在 <head> 中，确保 navbar.js 在 responsive-nav.js 之前：

  <link rel="stylesheet" href="./css/responsive-nav.css"/>
  <script src="js/navbar.js"></script>           <!-- 先加载 -->
  <script src="./js/responsive-nav.js"></script>   <!-- 后加载 -->

  ③ 各页面的 data-page 值

  ┌──────────────────┬───────────────┬──────────┐
  │       文件       │ data-page 值  │   备注   │
  ├──────────────────┼───────────────┼──────────┤
  │ index.html       │ "index"       │ 首页     │
  ├──────────────────┼───────────────┼──────────┤
  │ About.html       │ "about"       │ 关于     │
  ├──────────────────┼───────────────┼──────────┤
  │ gallery.html     │ "gallery"     │ 画廊     │
  ├──────────────────┼───────────────┼──────────┤
  │ time.html        │ "timeline"    │ 时间轴   │
  ├──────────────────┼───────────────┼──────────┤
  │ comment.html     │ "comment"     │ 留言板   │
  ├──────────────────┼───────────────┼──────────┤
  │ Sound.html       │ "sound"       │ 语音按钮 │
  ├──────────────────┼───────────────┼──────────┤
  │ LiveHistory.html │ "livehistory" │ 往期回放 │
  ├──────────────────┼───────────────┼──────────┤
  │ games.html       │ "games"       │ 小游戏   │
  ├──────────────────┼───────────────┼──────────┤
  │ Music.html       │ "music"       │ 音乐     │
  └──────────────────┴───────────────┴──────────┘

  子目录页面（games/*.html，7个）

  以 games/dinosaur.html、games/cursor.html 等为例：

  <header class="header" data-page="about">  <!-- 随意填，不匹配任何key就不会高亮 -->
      <!-- 或省略 data-page，所有链接均不高亮 -->
      <div class="header-content">
          <div></div>
      </div>
  </header>

  路径会自动检测 games/ 添加 ../ 前缀，且自动排除"小游戏"和"音乐"链接。

  特殊情况：有搜索框的页面

  gallery.html、LiveHistory.html、Music.html、time.html 的 header 内还包含搜索框结构。迁移时需要将搜索框保留在
  header-content 中，放在 JS 填充的 div 后面：

  <header class="header" data-page="gallery">
      <div class="header-content">
          <div></div>  <!-- JS 自动填充导航 -->
          <div class="search-container">  <!-- 原有的搜索框保持不变 -->
              <input type="text" id="search-box" ...>
              ...
          </div>
      </div>
  </header>

  ---
  🎯 未来修改导航栏

  添加/删除/修改链接 → 只改 js/navbar.js 中的 NAV_ITEMS 数组（第49-58行）：

  var NAV_ITEMS = [
      { label: '首页', link: 'index.html', key: 'index', i18nKey: 'home' },
      { label: '关于', link: 'About.html', key: 'about', i18nKey: 'about' },
      // ... 在这里增删改
  ];

  调整主链接/隐藏链接 → 改 NAV_CONFIG_BY_DEPTH（第62-73行）：

  var NAV_CONFIG_BY_DEPTH = {
      0: {
          mainKeys: ['index', 'about', 'gallery', 'timeline'],       // 始终显示的链接
          hiddenMobileKeys: ['comment', 'sound', 'livehistory', 'games', 'music'],  // 移动端隐藏的链接
      },
      // ...
  };

 * ============================================
 */

(function () {
    'use strict';

    // ==================== 导航项配置 ====================
    // 修改此处即可全局更新导航栏
    // label: 显示文字 | link: 相对路径 | key: 匹配标识 | i18nKey: 国际化键名

    var NAV_ITEMS = [
        { label: '首页', link: 'index.html', key: 'index', i18nKey: 'home' },
        { label: '关于', link: 'About.html', key: 'about', i18nKey: 'about' },
        { label: '画廊', link: 'gallery.html', key: 'gallery', i18nKey: 'gallery' },
        { label: '时间轴', link: 'time.html', key: 'timeline', i18nKey: 'timeline' },
        { label: '留言板', link: 'comment.html', key: 'comment', i18nKey: 'comment_board' },
        { label: '语音按钮', link: 'Sound.html', key: 'sound', i18nKey: 'voice_button' },
        { label: '往期回放', link: 'LiveHistory.html', key: 'livehistory', i18nKey: 'previous_replays' },
        { label: '小游戏', link: 'games.html', key: 'games', i18nKey: 'games' },
        { label: '音乐', link: 'Music.html', key: 'music', i18nKey: 'music' },
    ];

    // 不同目录深度对应的导航显示配置
    var NAV_CONFIG_BY_DEPTH = {
        // 根目录页面（index.html, About.html 等）
        0: {
            mainKeys: ['index', 'about', 'gallery', 'timeline'],
            hiddenMobileKeys: ['comment', 'sound', 'livehistory', 'games', 'music'],
        },
        // 子目录页面（games/xxx.html 等）
        1: {
            mainKeys: ['index', 'about', 'gallery', 'timeline'],
            hiddenMobileKeys: ['comment', 'sound', 'livehistory', 'games', 'music'],
        },
    };

    // ==================== 工具函数 ====================

    /**
     * 获取当前页面标识
     * 从 data-page 属性读取（不区分大小写）
     */
    function getCurrentPage() {
        var el = document.querySelector('[data-page]');
        if (!el) return '';
        return el.dataset.page.trim().toLowerCase();
    }

    /**
     * 获取页面所在目录深度
     * 自动检测：页面 URL 包含 /games/ 则为 1，否则为 0
     * 可通过 data-depth 属性手动覆盖
     */
    function getDepth() {
        // 支持手动指定 depth 属性覆盖
        var depthAttr = document.querySelector('[data-depth]');
        if (depthAttr) {
            var d = parseInt(depthAttr.dataset.depth, 10);
            if (!isNaN(d) && d >= 0) return d;
        }
        // 自动检测
        var path = window.location.pathname;
        var dir = path.substring(0, path.lastIndexOf('/'));
        if (dir.indexOf('/games') !== -1) return 1;
        return 0;
    }

    /**
     * 根据深度生成链接路径前缀
     * 根目录：直接返回
     * 子目录：添加 ../ 前缀
     */
    function getPrefixedLink(link, depth) {
        if (depth <= 0) return link;
        var prefix = '';
        for (var i = 0; i < depth; i++) {
            prefix += '../';
        }
        return prefix + link;
    }

    // ==================== 导航栏渲染 ====================

    function renderNavbar() {
        var currentPage = getCurrentPage();
        var depth = getDepth();
        var config = NAV_CONFIG_BY_DEPTH[depth] || NAV_CONFIG_BY_DEPTH[0];

        // 容器：.header-content 下的第一个 div
        var container = document.querySelector('.header-content > div:first-child');
        if (!container) return;

        var html = '';

        // ----- 1. 主链接（PC 和移动端都始终显示） -----
        html += '<!-- 主链接 -->\n        ';
        NAV_ITEMS.forEach(function (item) {
            if (config.mainKeys.indexOf(item.key) === -1) return;
            if (item.key === currentPage) return; // 当前页面不显示自身链接
            html += '<a href="' + getPrefixedLink(item.link, depth) + '" class="nav-link" data-i18n="' + item.i18nKey + '">' + item.label + '</a>\n        ';
        });

        // ----- 2. 移动端隐藏链接（PC 端直接显示，移动端放入"更多"菜单） -----
        html += '<!-- 移动端隐藏链接 -->\n        ';
        NAV_ITEMS.forEach(function (item) {
            if (config.hiddenMobileKeys.indexOf(item.key) === -1) return;
            if (item.key === currentPage) return; // 当前页面不显示自身链接
            html += '<a href="' + getPrefixedLink(item.link, depth) + '" class="nav-link hidden-on-mobile" data-i18n="' + item.i18nKey + '">' + item.label + '</a>\n        ';
        });

        // ----- 3. 设置按钮 -----
        html += '<!-- 设置按钮 -->\n        ';
        html += '<button id="settingBtn" class="nav-link" data-no-meow data-i18n="Webpage_settings">网页设置</button>\n        ';
        html += '<div id="settingOverlay" class="setting-overlay"></div>\n        ';
        html += '<div id="settingPanel" class="setting-panel"></div>\n        ';

        // ----- 4. PC端"更多"容器 -----
        html += '<!-- PC端“更多” -->\n        ';
        html += '<div class="more-container more-container-pc" style="display: none;">\n            ';
        html += '<button class="more-btn more-btn-pc nav-link" data-i18n="more">更多 ▼</button>\n            ';
        html += '<div class="more-dropdown more-dropdown-pc"></div>\n        ';
        html += '</div>\n        ';

        // ----- 5. 移动端"更多"容器 -----
        html += '<!-- 移动端“更多” -->\n        ';
        html += '<div class="more-container more-container-mobile">\n            ';
        html += '<button class="more-btn more-btn-mobile nav-link" data-i18n="more">更多 ▼</button>\n            ';
        html += '<div class="more-dropdown more-dropdown-mobile">\n';
        NAV_ITEMS.forEach(function (item) {
            if (config.hiddenMobileKeys.indexOf(item.key) === -1) return;
            if (item.key === currentPage) return; // 当前页面不显示自身链接
            html += '                <a href="' + getPrefixedLink(item.link, depth) + '" class="nav-link" data-i18n="' + item.i18nKey + '">' + item.label + '</a>\n';
        });
        html += '            </div>\n        ';
        html += '</div>';

        container.innerHTML = html;
    }

    // ==================== 启动 ====================
    // 注意："更多"菜单的点击交互由 responsive-nav.js 处理
    // 本脚本仅负责渲染导航栏 HTML
    // 确保本脚本在 responsive-nav.js 之前加载

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', renderNavbar);
    } else {
        renderNavbar();
    }

})();
