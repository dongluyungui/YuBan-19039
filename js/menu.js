

/*
首先
需要引用css
<link rel="stylesheet" href="css/menu.css">
最后需要引用js
<script src="js/fireworks.js"></script>
<script src="js/menu.js"></script>
在body下面引用，彩蛋
  <div id="fireworks-container"></div>
    <!-- 右键菜单 -->
    <ul id="context-menu">
        <li>打开网页</li>
        <li>粘贴</li>
        <li>彩蛋</li>
    </ul>


*/

const contextMenu = document.getElementById('context-menu');
// 声明 fireworks 变量并初始化为空数组
const fireworks = [];
document.addEventListener('contextmenu', function (e) {
    e.preventDefault();
    contextMenu.style.display = 'block';
    contextMenu.style.left = e.pageX + 'px';
    contextMenu.style.top = e.pageY + 'px';
});

document.addEventListener('click', function (e) {
    if (!contextMenu.contains(e.target)) {
        contextMenu.style.display = 'none';
    }
});

// 监听菜单项点击事件
const menuItems = contextMenu.getElementsByTagName('li');
for (let i = 0; i < menuItems.length; i++) {
    menuItems[i].addEventListener('click', function () {
        switch (this.textContent) {
            case '打开网页':
                // 打开指定网页
                window.open('https://www.example.com', '_blank');
                break;
            case '复制文本':
                // 复制文本到剪贴板
                const textToCopy = '这是要复制的文本';
                navigator.clipboard.writeText(textToCopy).then(() => {
                    console.log('文本已复制到剪贴板');
                }).catch((err) => {
                    console.error('复制失败: ', err);
                });
                break;
            case '删除元素':
                // 删除示例元素
                if (exampleElement) {
                    exampleElement.remove();
                }
                break;
            case '彩蛋':
    // 随机生成烟花数量，范围 20 - 50
    const numFireworks = Math.floor(Math.random() * 31) + 20;
    for (let i = 0; i < numFireworks; i++) {
        window.fireworks.push(new window.Firework());
    }
    break;
        }
        contextMenu.style.display = 'none';
    });
}    