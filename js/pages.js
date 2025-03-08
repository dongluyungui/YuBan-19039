// ����һ����������ʼ����ҳ����
function initPagination() {
    // ��ǰҳ�룬��ʼֵΪ 1
    let currentPage = 1;
    // ÿҳ��ʾ������
    const itemsPerPage = 6;
    //�޸�����ط�
    /*
        <link rel="stylesheet" href="css/pages.css">
        <script src="js/pages.js"></script>
    */
    /*
        <div class="pagination-container">
            <div class="page-info">��<span id="total-count">0</span>��������ǰ��<span id="current-page">1</span>ҳ/��<span id="total-pages">1</span>ҳ</div>
            <div class="page-buttons" id="page-buttons"></div>
            <div class="jump-to">
                ��ת����<input type="number" id="jump-page" min="1">ҳ
                <button onclick="jumpToPage()">��ת</button>
            </div>
        </div>
    */
    // ��ȡ������Ҫ��ҳ��Ԫ�أ�֧����Ӷ���������ö��ŷָ�
    const artCards = document.querySelectorAll('.art-card, .live-record, .date-log,.yet-another-class,.yet-another-class,.yet-another-class');
    // ������
    const totalItems = artCards.length;
    // ��ҳ����ͨ������������ÿҳ��ʾ������������ȡ���õ�
    const totalPages = Math.ceil(totalItems / itemsPerPage);

    // ���·�ҳ��Ϣ
    function updatePagination() {
        // ��������������ʾ
        document.getElementById('total-count').textContent = totalItems;
        // ���µ�ǰҳ�����ʾ
        document.getElementById('current-page').textContent = currentPage;
        // ������ҳ������ʾ
        document.getElementById('total-pages').textContent = totalPages;
    }

    // ����ҳ�밴ť
    function generatePageButtons() {
        // ��ȡ���ҳ�밴ť������
        const buttonsContainer = document.getElementById('page-buttons');
        // ��������ڵ���������
        buttonsContainer.innerHTML = '';

        // ѭ������ÿ��ҳ�밴ť
        for (let i = 1; i <= totalPages; i++) {
            // ����һ����ťԪ��
            const button = document.createElement('button');
            // ���ð�ť���ı�����Ϊ��ǰҳ��
            button.textContent = i;
            // Ϊ��ť��ӵ���¼������ʱ���� changePage �����л�ҳ��
            button.onclick = () => changePage(i);
            // �����ǰ��ť��Ӧ��ҳ���ǵ�ǰҳ�룬����� 'active' ��
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

        // �������з�ҳ����ݵ�ǰҳ������Ƿ���ʾ
        artCards.forEach((card, index) => {
            // ���㵱ǰҳ����ʼ����
            const start = (currentPage - 1) * itemsPerPage;
            // ���㵱ǰҳ�Ľ�������
            const end = start + itemsPerPage;
            // �����ǰ��������ڵ�ǰҳ�ķ�Χ�ڣ�����ʾ�����������
            card.style.display = index >= start && index < end ? 'block' : 'none';
        });
    }

    // ��ת��ָ��ҳ��
    function jumpToPage() {
        // ��ȡ������תҳ��������
        const input = document.getElementById('jump-page');
        // �����������ת��Ϊ����
        const page = parseInt(input.value);
        // ��������ҳ���Ƿ�Ϊ��Ч���֣������� 1 ����ҳ��֮��
        if (!isNaN(page) && page >= 1 && page <= totalPages) {
            // ���� changePage ������ת��ָ��ҳ��
            changePage(page);
            // �������������
            input.value = '';
        } else {
            // ���������Ч��������ʾ��
           // alert('��������Ч��ҳ�룡');
            alert('?');
        }
    }

    // ��ʼ����ҳ
    // ���ø��·�ҳ��Ϣ������ҳ�밴ť���л�����ǰҳ�ĺ���
    updatePagination();
    generatePageButtons();
    changePage(currentPage);

    // ��¶ jumpToPage ������ȫ���������Ա� HTML �п��Ե���
    window.jumpToPage = jumpToPage;
}

// ҳ�������ɺ��ʼ����ҳ
window.addEventListener('load', initPagination);