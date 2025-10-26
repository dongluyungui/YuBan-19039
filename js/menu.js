// 右键菜单逻辑
const contextMenu = document.getElementById('context-menu');
const fireworks = [];

// 初始化时检查菜单状态
document.addEventListener('DOMContentLoaded', () => {
    const isEnabled = localStorage.getItem('isContextMenuEnabled') !== 'false';
    if (!isEnabled) {
        contextMenu.style.display = 'none';
    }
});

// 右键菜单显示
document.addEventListener('contextmenu', function (e) {
    const isEnabled = localStorage.getItem('isContextMenuEnabled') !== 'false';
    
    if (isEnabled) {
        e.preventDefault(); // 只有启用自定义菜单时才阻止默认菜单
        contextMenu.style.display = 'block';
        // 确保菜单不会超出视口
        const menuWidth = contextMenu.offsetWidth;
        const menuHeight = contextMenu.offsetHeight;
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;
        
        // 计算位置，防止溢出
        let left = e.clientX; // 改为 clientX
        let top = e.clientY;  // 改为 clientY
        
        if (left + menuWidth > viewportWidth) {
            left = viewportWidth - menuWidth;
        }
        
        if (top + menuHeight > viewportHeight) {
            top = viewportHeight - menuHeight;
        }
        
        contextMenu.style.left = left + 'px';
        contextMenu.style.top = top + 'px';
    }
    // 禁用时不做任何处理，使用系统默认右键菜单
});

// 点击其他区域关闭菜单
document.addEventListener('click', function (e) {
    if (!contextMenu.contains(e.target)) {
        contextMenu.style.display = 'none';
    }
});

// 菜单选项点击事件
const menuItems = contextMenu.getElementsByTagName('li');
for (let i = 0; i < menuItems.length; i++) {
    menuItems[i].addEventListener('click', function () {
        switch (this.textContent) {
            case '打开网页':
                window.open('https://www.example.com', '_blank');
                break;
            case 'ai总结':
                window.open('Tools/aisummary.html', '_blank');
                break;
            case '当前时间':
                window.open('Tools/NowTime.html', '_blank');
                break;    
            case '更新动态':
                window.open('Tools/dynamics.html', '_blank');
                break;
            case '生成记录':
                window.open('Tools/LiveRecords.html', '_blank');
                break;
            case '添加作品':
                window.open('Tools/galleryRecords.html', '_blank');
                break;    
            case '复制文本':
                const textToCopy = '这是要复制的文本';
                navigator.clipboard.writeText(textToCopy).then(() => {
                    console.log('文本已复制到剪贴板');
                }).catch((err) => {
                    console.error('复制失败: ', err);
                });
                break;
            case '删除元素':
                const exampleElement = document.querySelector('.example');
                if (exampleElement) {
                    exampleElement.remove();
                }
                break;
            case '彩蛋':
                const numFireworks = Math.floor(Math.random() * 31) + 20;
                for (let i = 0; i < numFireworks; i++) {
                    window.fireworks.push(new window.Firework());
                }
                break;
        }
        contextMenu.style.display = 'none';
    });
}
