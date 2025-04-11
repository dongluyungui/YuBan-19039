// ��ʼ����ҳ����
function initPagination() {
    // ��ǰҳ�룬��ʼֵΪ 1
    let currentPage = 1;
    // ÿҳ��ʾ����Ŀ��
    const itemsPerPage = 6;
    // �޸�����ط�
    /*��js
    ���õ�css
        <link rel="stylesheet" href="css/pages.css">
        <script src="js/pages.js"></script>
    */
    /*
    �ŵ���Ҫ��ʾҳ���ĵط�
        <div class="pagination-container">
            <div class="page-info">��<span id="total-count">0</span>��������ǰ��<span id="current-page">1</span>ҳ/��<span id="total-pages">1</span>ҳ</div>
            <div class="page-buttons" id="page-buttons"></div>
            <div class="jump-to">
                ��ת����<input type="number" id="jump-page" min="1">ҳ
                <button onclick="jumpToPage()">��ת</button>
            </div>
        </div>
    */
    // ��ȡ������Ҫ��ҳ��Ԫ�أ�ֻѡ����ʾ��Ԫ��
    const artCards = Array.from(document.querySelectorAll('.art-card, .live-record, .date-log,.dynamic-item,.message-card,.yet-another-class')).filter(card => getComputedStyle(card).display!== 'none');
    // ����Ŀ��
    const totalItems = artCards.length;
    // ��ҳ��ͨ������Ŀ������ÿҳ��ʾ����Ŀ��������ȡ���õ�
    const totalPages = Math.ceil(totalItems / itemsPerPage);

    // ��־��������������ҳ���ʼ�����û�����
    let isInitialLoad = true;

    // ���·�ҳ��Ϣ
    function updatePagination() {
        // ��������Ŀ����ʾ
        document.getElementById('total-count').textContent = totalItems;
        // ���µ�ǰҳ����ʾ
        document.getElementById('current-page').textContent = currentPage;
        // ������ҳ����ʾ
        document.getElementById('total-pages').textContent = totalPages;
    }

    // ����ҳ�밴ť
    function generatePageButtons() {
        // ��ȡҳ�밴ť����
        const buttonsContainer = document.getElementById('page-buttons');
        // ��������ڵ������ӽڵ�
        buttonsContainer.innerHTML = '';

        // ѭ������ÿ��ҳ�밴ť
        for (let i = 1; i <= totalPages; i++) {
            // ����һ����ťԪ��
            const button = document.createElement('button');
            // ���ð�ť���ı�����Ϊ��ǰҳ��
            button.textContent = i;
            // Ϊ��ť��ӵ���¼������������ʱ���� changePage �����л�ҳ��
            button.onclick = () => {
                isInitialLoad = false;
                changePage(i);
            };
            // �����ǰ��ť��Ӧ��ҳ���ǵ�ǰҳ�룬��� 'active' ��
            if (i === currentPage) button.classList.add('active');
            // ����ť��ӵ�������
            buttonsContainer.appendChild(button);
        }
    }

    // �л�ҳ��
    function changePage(pageNumber) {
        // ȷ��ҳ������Ч��Χ�ڣ�1 ����ҳ��֮�䣩
        currentPage = Math.max(1, Math.min(pageNumber, totalPages));
        // ���·�ҳ��Ϣ
        updatePagination();
        // ��������ҳ�밴ť
        generatePageButtons();

        // �����ҳ��Ŀ�����ݵ�ǰҳ������Ƿ���ʾ
        artCards.forEach((card, index) => {
            // ���㵱ǰҳ�����ʼ����
            const start = (currentPage - 1) * itemsPerPage;
            // ���㵱ǰҳ��Ľ�������
            const end = start + itemsPerPage;
            // �����ǰ��Ŀ�������ڵ�ǰҳ��ķ�Χ�ڣ�����ʾ����Ŀ����������
            card.style.display = index >= start && index < end? 'block' : 'none';
        });

        // ֻ���ڲ���ҳ���ʼ��ʱ�Ź�������һ������
        if (!isInitialLoad) {
            // ��ȡ��ǰҳ��ĵ�һ������
            const startIndex = (currentPage - 1) * itemsPerPage;
            if (artCards[startIndex]) {
                // ��ȡҳü�ĸ߶�
                const header = document.querySelector('.header');
                const headerHeight = header? header.offsetHeight : 0;
                // ����������ת����
                const extraOffset = 40;
                // ���������ƫ����
                const offset = -(headerHeight + extraOffset);

                // ��������Ԫ�ز�����ƫ����
                const rect = artCards[startIndex].getBoundingClientRect();
                const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
                window.scrollTo({
                    top: rect.top + scrollTop + offset,
                    behavior: 'smooth'
                });
            }
        }
    }

    // ��ת��ָ��ҳ��
    function jumpToPage() {
        // ��ȡ�������תҳ��
        const input = document.getElementById('jump-page');
        // �������ҳ��ת��Ϊ����
        const page = parseInt(input.value);
        // ��������ҳ���Ƿ�Ϊ��Ч���֣����� 1 ����ҳ��֮��
        if (!isNaN(page) && page >= 1 && page <= totalPages) {
            isInitialLoad = false;
            // ���� changePage ������ת��ָ��ҳ��
            changePage(page);
            // ������������
            input.value = '';
        } else {
            // ���������Ч����ʾ��ʾ��Ϣ
            alert('��������Чҳ�룡');
        }
    }

    // ��ʼ����ҳ
    // ���·�ҳ��Ϣ������ҳ�밴ť���л�����ǰҳ��
    updatePagination();
    generatePageButtons();
    changePage(currentPage);

    // �� jumpToPage ������¶��ȫ���������Ա��� HTML �п��Ե���
    window.jumpToPage = jumpToPage;
}

// ҳ�������ɺ��ʼ����ҳ
window.addEventListener('load', initPagination);