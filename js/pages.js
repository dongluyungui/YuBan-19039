// 初始化分页功能
function initPagination() {
    // 当前页码，初始值为 1
    let currentPage = 1;
    const paginationContainer = document.querySelector('.pagination-container');
    // 显示的页码按钮数量
    const visiblePages = 5;
    // 每页显示的项目数
    const itemsPerPage = 6;
    // 修改这个地方
    /*和js
    引用的css
        <link rel="stylesheet" href="css/pages.css">
        <script src="js/pages.js"></script>
    */
    /*
    放到需要显示页数的地方
        <div class="pagination-container">
            <div class="page-info">共<span id="total-count">0</span>幅画，当前第<span id="current-page">1</span>页/共<span id="total-pages">1</span>页</div>
            <div class="page-buttons" id="page-buttons"></div>
            <div class="jump-to">
                跳转到第<input type="number" id="jump-page" min="1">页
                <button onclick="jumpToPage()">跳转</button>
            </div>
        </div>
    */
    // 获取所有需要分页的元素，只选择显示的元素
    // 修改后：添加.category-box，与搜索功能匹配
const artCards = Array.from(document.querySelectorAll(
  '.art-card, .live-record, .category-box, .date-log,.music-card, .dynamic-item, .message-card, .yet-another-class'
)).filter(card => getComputedStyle(card).display!== 'none');
    const totalItems = artCards.length;
    // 总页数通过总项目数除以每页显示的项目数并向上取整得到
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    // 若总页数少于 2 页，隐藏分页容器
    if (totalPages < 2) {
        paginationContainer.style.display = 'none';
    } 
    // 新增：总页数≥2时显示
    else {
        paginationContainer.style.display = 'block'; 
    }
    // 标志变量，用于区分页面初始化和用户操作
    let isInitialLoad = true;

 
    // 更新分页信息
    function updatePagination() {
        // 更新总项目数显示
        document.getElementById('total-count').textContent = totalItems;
        // 更新当前页码显示
        document.getElementById('current-page').textContent = currentPage;
        // 更新总页数显示
        document.getElementById('total-pages').textContent = totalPages;
    }

    
    // 生成页码按钮
    function generatePageButtons() {
        // 获取页码按钮容器
        const buttonsContainer = document.getElementById('page-buttons');
        // 清空容器内的所有子节点
        buttonsContainer.innerHTML = '';

        // 添加第一页按钮
        const firstButton = document.createElement('button');
        firstButton.textContent = '首页';
        firstButton.onclick = () => {
            isInitialLoad = false;
            changePage(1);
        };
        buttonsContainer.appendChild(firstButton);

        // 添加上一页按钮
        const prevButton = document.createElement('button');
        prevButton.textContent = '上一页';
        prevButton.onclick = () => {
            isInitialLoad = false;
            changePage(currentPage - 1);
        };
        buttonsContainer.appendChild(prevButton);

        // 计算起始页码和结束页码
        let startPage = Math.max(1, currentPage - Math.floor(visiblePages / 2));
        let endPage = startPage + visiblePages - 1;
        if (endPage > totalPages) {
            endPage = totalPages;
            startPage = Math.max(1, endPage - visiblePages + 1);
        }

        // 显示省略号
        if (startPage > 1) {
            const ellipsis = document.createElement('span');
            ellipsis.textContent = '...';
            buttonsContainer.appendChild(ellipsis);
        }

        // 循环生成每个页码按钮
        for (let i = startPage; i <= endPage; i++) {
            // 创建一个按钮元素
            const button = document.createElement('button');
            // 设置按钮的文本内容为当前页码
            button.textContent = i;
            // 为按钮添加点击事件监听器，点击时调用 changePage 函数切换页面
            button.onclick = () => {
                isInitialLoad = false;
                changePage(i);
            };
            // 如果当前按钮对应的页码是当前页码，添加 'active' 类
            if (i === currentPage) button.classList.add('active');
            // 将按钮添加到容器中
            buttonsContainer.appendChild(button);
        }

        // 显示省略号
        if (endPage < totalPages) {
            const ellipsis = document.createElement('span');
            ellipsis.textContent = '...';
            buttonsContainer.appendChild(ellipsis);
        }

        // 添加下一页按钮
        const nextButton = document.createElement('button');
        nextButton.textContent = '下一页';
        nextButton.onclick = () => {
            isInitialLoad = false;
            changePage(currentPage + 1);
        };
        buttonsContainer.appendChild(nextButton);

        // 添加最后一页按钮
        const lastButton = document.createElement('button');
        lastButton.textContent = '尾页';
        lastButton.onclick = () => {
            isInitialLoad = false;
            changePage(totalPages);
        };
        buttonsContainer.appendChild(lastButton);
    }

    // 切换页面
    function changePage(pageNumber) {
        // 确保页码在有效范围内（1 到总页数之间）
        currentPage = Math.max(1, Math.min(pageNumber, totalPages));
        // 更新分页信息
        updatePagination();
        // 重新生成页码按钮
        generatePageButtons();

        // 处理分页项目，根据当前页码决定是否显示
        artCards.forEach((card, index) => {
            // 计算当前页面的起始索引
            const start = (currentPage - 1) * itemsPerPage;
            // 计算当前页面的结束索引
            const end = start + itemsPerPage;
            // 如果当前项目的索引在当前页面的范围内，则显示该项目，否则隐藏
            card.style.display = index >= start && index < end? 'block' : 'none';
        });

        // 只有在不是页面初始化时才滚动到第一条内容
        if (!isInitialLoad) {
            // 获取当前页码的第一条内容
            const startIndex = (currentPage - 1) * itemsPerPage;
            if (artCards[startIndex]) {
                // 获取页眉的高度
                const header = document.querySelector('.header');
                const headerHeight = header? header.offsetHeight : 0;
                // 定义额外的跳转距离
                const extraOffset = 40;
                // 计算滚动的偏移量
                const offset = -(headerHeight + extraOffset);

                // 滚动到该元素并考虑偏移量
                const rect = artCards[startIndex].getBoundingClientRect();
                const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
                window.scrollTo({
                    top: rect.top + scrollTop + offset,
                    behavior: 'smooth'
                });
            }
        }
    }

    // 跳转到指定页面
    function jumpToPage() {
        const input = document.getElementById('jump-page');
        const page = parseInt(input.value);
        
        // 清除旧提示
        const errorMessage = document.getElementById('jump-error');
        if (errorMessage) errorMessage.remove();

        if (!isNaN(page) && page >= 1 && page <= totalPages) {
            isInitialLoad = false;
            changePage(page);
            input.value = '';
        } else {
            // 创建自定义提示元素
            const errorDiv = document.createElement('div');
            errorDiv.id = 'jump-error';
            errorDiv.className = 'error-message';
            errorDiv.textContent = '请输入 1 到 ' + totalPages + ' 之间的有效页码！';
            
            // 将提示添加到跳转按钮右侧
            const jumpButton = document.querySelector('.jump-to button');
            jumpButton.parentNode.insertBefore(errorDiv, jumpButton.nextSibling);

            // 3秒后自动隐藏提示
            setTimeout(() => errorDiv.remove(), 3000);
        }
    }

    // 初始化分页
    // 更新分页信息，生成页码按钮，切换到当前页面
    updatePagination();
    generatePageButtons();
    changePage(currentPage);

    // 将 jumpToPage 函数暴露到全局作用域，以便在 HTML 中可以调用
    window.jumpToPage = jumpToPage;
}

// 页面加载完成后初始化分页
window.addEventListener('load', initPagination);