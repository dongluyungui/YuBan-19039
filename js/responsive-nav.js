/**
 * 响应式导航菜单脚本
 * 功能：实现移动端"更多"下拉菜单的交互逻辑
 * 
 * 使用方法（在其他网页复用）：
 * 1. 引入本JS文件和对应的responsive-nav.css样式文件
 * 
    <link rel="stylesheet" href="./css/responsive-nav.css"/>
    <script src = "./js/responsive-nav.js"></script>
 * 2. 在导航菜单的HTML结构中添加以下内容：
      <!-- 更多按钮和下拉菜单 -->
      <div class="more-container">
         <button class="more-btn nav-link" data-i18n="more">更多 ▼</button>
         <div class="more-dropdown">
             <!-- 在这里添加需要在移动端隐藏的导航项 -->
             <a href="页面1.html" class="nav-link" data-i18n="item1">菜单项1</a>
             <a href="页面2.html" class="nav-link" data-i18n="item2">菜单项2</a>
             <!-- 可以根据需要添加更多项 -->
          </div>
       </div>
   3. 为需要在移动端隐藏的导航项添加"hidden-on-mobile"类，例如：
      <a href="comment.html" class="nav-link hidden-on-mobile" data-i18n="comment_board">留言版</a>
   4. 根据需要调整CSS中的媒体查询断点（768px）

新的
   始终显示的链接：直接添加，不加任何隐藏类，例如：
<a href="index.html" class="nav-link" data-i18n="home">首页</a>

仅在 PC 端可能隐藏（放入 PC"更多"）的链接：添加hidden-on-pc-more类，例如：
<a href="comment.html" class="nav-link hidden-on-pc-more" data-i18n="comment_board">留言板</a>


（当 PC 端导航一行放不下时，会自动隐藏并显示在 PC"更多" 菜单中）
仅在移动端隐藏（放入移动 "更多"）的链接：添加hidden-on-mobile类，例如：
<a href="Sound.html" class="nav-link hidden-on-mobile" data-i18n="voice_button">语音按钮</a>


（在移动端始终隐藏，仅显示在移动 "更多" 菜单中；在 PC 端正常显示）
同时在 PC 和移动端隐藏的链接：同时添加两个类，例如：
<a href="xxx.html" class="nav-link hidden-on-pc-more hidden-on-mobile" data-i18n="xxx">XXX</a>


参考

<div> 
  <a href="index.html" class="nav-link" data-i18n="home">首页</a>
  <a href="About.html" class="nav-link" data-i18n="about">关于</a>
  <a href="gallery.html" class="nav-link active" data-i18n="gallery">画廊</a>
  <a href="time.html" class="nav-link active" data-i18n="timeline">时间轴</a>
  
  <!-- 需要在PC端"更多"中显示的链接（默认显示，超出时隐藏） -->
  <a href="comment.html" class="nav-link active hidden-on-pc-more" data-i18n="comment_board">留言板</a>
  
  <!-- 需要在移动端"更多"中显示的链接（PC端正常显示，移动端隐藏） -->
  <a href="Sound.html" class="nav-link active hidden-on-mobile" data-i18n="voice_button">语音按钮</a>
  
  <!-- 设置按钮 -->
  <button id="settingBtn" class="nav-link" data-no-meow data-i18n="Webpage_settings">网页设置</button>
  <div id="settingOverlay" class="setting-overlay"></div>
  <div id="settingPanel" class="setting-panel"></div>
  
  <!-- 1. PC端专用"更多"容器 -->
  <div class="more-container more-container-pc">
    <button class="more-btn more-btn-pc nav-link" data-i18n="more">更多 ▼</button>
    <div class="more-dropdown more-dropdown-pc">
      <!-- PC端"更多"菜单内容 -->
      <a href="comment.html" class="nav-link active" data-i18n="comment_board">留言板</a>
    </div>
  </div>
  
  <!-- 2. 移动端专用"更多"容器 -->
  <div class="more-container more-container-mobile">
    <button class="more-btn more-btn-mobile nav-link" data-i18n="more">更多 ▼</button>
    <div class="more-dropdown more-dropdown-mobile">
      <!-- 移动端"更多"菜单内容（比PC端多） -->
      <a href="comment.html" class="nav-link active" data-i18n="comment_board">留言板</a>
      <a href="Sound.html" class="nav-link active" data-i18n="voice_button">语音按钮</a>
    </div>
  </div>
</div>




 */

document.addEventListener('DOMContentLoaded', function() {
    // 获取元素
    const navContainer = document.querySelector('.nav-link').parentElement; // 导航容器
    const pcMoreBtn = document.querySelector('.more-btn-pc');
    const pcMoreDropdown = document.querySelector('.more-dropdown-pc');
    const mobileMoreBtn = document.querySelector('.more-btn-mobile');
    const mobileMoreDropdown = document.querySelector('.more-dropdown-mobile');
    const pcHiddenLinks = document.querySelectorAll('.hidden-on-pc-more'); // PC端可能隐藏的链接

    // 检查元素是否存在
    if (!navContainer || !pcMoreBtn || !mobileMoreBtn) {
        console.log('未找到导航菜单元素，响应式导航功能未启用');
        return;
    }

    // 核心功能：判断PC端导航是否超出一行，决定是否显示PC端"更多"按钮
    function checkPcNavOverflow() {
        // 仅在PC端执行（屏幕宽度 >= 985px）
        if (window.innerWidth < 985) return;

        // 临时显示所有可能隐藏的链接和PC端"更多"按钮，用于计算
        pcHiddenLinks.forEach(link => link.style.display = 'inline-block');
        pcMoreBtn.style.display = 'none';

        // 计算导航容器的宽度和内容总宽度
        const containerWidth = navContainer.clientWidth;
        const contentWidth = Array.from(navContainer.children).reduce((total, child) => {
            return total + child.offsetWidth;
        }, 0);

        // 如果内容总宽度 > 容器宽度（超出一行），显示PC端"更多"按钮并隐藏对应链接
        if (contentWidth > containerWidth) {
            pcMoreBtn.style.display = 'inline-block';
            pcHiddenLinks.forEach(link => link.style.display = 'none');
        } else {
            pcMoreBtn.style.display = 'none';
            pcHiddenLinks.forEach(link => link.style.display = 'inline-block');
        }
    }

    // PC端"更多"按钮点击事件
    pcMoreBtn.addEventListener('click', function(e) {
        e.stopPropagation();
        pcMoreDropdown.style.display = pcMoreDropdown.style.display === 'block' ? 'none' : 'block';
    });

    // 移动端"更多"按钮点击事件
    mobileMoreBtn.addEventListener('click', function(e) {
        e.stopPropagation();
        mobileMoreDropdown.style.display = mobileMoreDropdown.style.display === 'block' ? 'none' : 'block';
    });

    // 点击页面其他地方隐藏下拉菜单
    document.addEventListener('click', function() {
        pcMoreDropdown.style.display = 'none';
        mobileMoreDropdown.style.display = 'none';
    });

    // 点击下拉菜单内部不关闭
    pcMoreDropdown.addEventListener('click', function(e) {
        e.stopPropagation();
    });
    mobileMoreDropdown.addEventListener('click', function(e) {
        e.stopPropagation();
    });

    // 窗口大小变化时重新检查
    window.addEventListener('resize', function() {
        checkPcNavOverflow();
        
        // 移动端窗口变化时确保下拉菜单关闭
        if (window.innerWidth < 985) {
            pcMoreDropdown.style.display = 'none';
        } else {
            mobileMoreDropdown.style.display = 'none';
        }
    });

    // 初始加载时检查一次
    checkPcNavOverflow();
});
