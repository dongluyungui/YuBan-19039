// 定义一个函数来初始化分页功能
function initPagination() {
    // 当前页码，初始值为 1
    let currentPage = 1;
    // 每页显示的项数
    const itemsPerPage = 6;
    //修改这个地方
    /*
        <link rel="stylesheet" href="css/pages.css">
        <script src="js/pages.js"></script>
    */
    /*
        <div class="pagination-container">
            <div class="page-info">共<span id="total-count">0</span>幅画，当前第<span id="current-page">1</span>页/共<span id="total-pages">1</span>页</div>
            <div class="page-buttons" id="page-buttons"></div>
            <div class="jump-to">
                跳转到第<input type="number" id="jump-page" min="1">页
                <button onclick="jumpToPage()">跳转</button>
            </div>
        </div>
    */
    // 获取所有需要分页的元素，支持添加多个类名，用逗号分隔
    const artCards = document.querySelectorAll('.art-card, .live-record, .date-log,.yet-another-class,.yet-another-class,.yet-another-class');
    // 总项数
    const totalItems = artCards.length;
    // 总页数，通过总项数除以每页显示的项数并向上取整得到
    const totalPages = Math.ceil(totalItems / itemsPerPage);

    // 更新分页信息
    function updatePagination() {
        // 更新总项数的显示
        document.getElementById('total-count').textContent = totalItems;
        // 更新当前页码的显示
        document.getElementById('current-page').textContent = currentPage;
        // 更新总页数的显示
        document.getElementById('total-pages').textContent = totalPages;
    }

    // 生成页码按钮
    function generatePageButtons() {
        // 获取存放页码按钮的容器
        const buttonsContainer = document.getElementById('page-buttons');
        // 清空容器内的所有内容
        buttonsContainer.innerHTML = '';

        // 循环生成每个页码按钮
        for (let i = 1; i <= totalPages; i++) {
            // 创建一个按钮元素
            const button = document.createElement('button');
            // 设置按钮的文本内容为当前页码
            button.textContent = i;
            // 为按钮添加点击事件，点击时调用 changePage 函数切换页面
            button.onclick = () => changePage(i);
            // 如果当前按钮对应的页码是当前页码，则添加 'active' 类
            if (i === currentPage) button.classList.add('active');
            // 将按钮添加到容器中
            buttonsContainer.appendChild(button);
        }
    }

    // 切换页面
    function changePage(pageNumber) {
        // 确保页码在有效范围内（1 到总页数之间）
        currentPage = Math.max(1, Math.min(pageNumber, totalPages));
        // 更新分页信息
        updatePagination();
        // 重新生成页码按钮
        generatePageButtons();

        // 遍历所有分页项，根据当前页码决定是否显示
        artCards.forEach((card, index) => {
            // 计算当前页的起始索引
            const start = (currentPage - 1) * itemsPerPage;
            // 计算当前页的结束索引
            const end = start + itemsPerPage;
            // 如果当前项的索引在当前页的范围内，则显示该项，否则隐藏
            card.style.display = index >= start && index < end ? 'block' : 'none';
        });
    }

    // 跳转到指定页面
    function jumpToPage() {
        // 获取输入跳转页码的输入框
        const input = document.getElementById('jump-page');
        // 将输入的内容转换为整数
        const page = parseInt(input.value);
        // 检查输入的页码是否为有效数字，并且在 1 到总页数之间
        if (!isNaN(page) && page >= 1 && page <= totalPages) {
            // 调用 changePage 函数跳转到指定页码
            changePage(page);
            // 清空输入框的内容
            input.value = '';
        } else {
            // 如果输入无效，弹出提示框
           // alert('请输入有效的页码！');
            alert('?');
        }
    }

    // 初始化分页
    // 调用更新分页信息、生成页码按钮和切换到当前页的函数
    updatePagination();
    generatePageButtons();
    changePage(currentPage);

    // 暴露 jumpToPage 函数到全局作用域，以便 HTML 中可以调用
    window.jumpToPage = jumpToPage;
}

// 页面加载完成后初始化分页
window.addEventListener('load', initPagination);