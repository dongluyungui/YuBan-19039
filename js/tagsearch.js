// 检索功能
function filterByTag(tag) {
    const searchBox = document.getElementById('search-box');
    searchBox.value = tag;
    // 手动触发 input 事件来执行筛选
    const event = new Event('input', { bubbles: true });
    searchBox.dispatchEvent(event);
}

function triggerSearch() {
    const searchValue = document.getElementById('search-box').value.toLowerCase();
    const records = getSearchableElements();
    records.forEach(record => {
        const tags = record.dataset.tags.split(/,\s*/);
        const hasMatch = tags.some(t => t.toLowerCase().includes(searchValue));
        record.style.display = hasMatch? '' : 'none';
    });

    // 筛选后重新初始化分页
    initPagination();
}

// 获取可搜索的元素，根据不同页面可能有不同的类名
function getSearchableElements() {
    let soundRecords = document.querySelectorAll('.category-box');
    if (soundRecords.length > 0) {
        return soundRecords;
    }
    // 对于直播回放页面
    let liveRecords = document.querySelectorAll('.live-record');
    if (liveRecords.length > 0) {
        return liveRecords;
    }
    // 对于画廊页面
    return document.querySelectorAll('.art-card');
}

// 标签列表处理
function initTagList() {
    const tagsList = document.getElementById('tags-list');
    const allTags = new Set();

    const tagElements = getTagElements();
    tagElements.forEach(tag => {
        allTags.add(tag.textContent.trim());
    });

    tagsList.innerHTML = '';
    allTags.forEach(tag => {
        const tagItem = document.createElement('span');
        tagItem.textContent = tag;
        tagItem.onclick = () => {
            filterByTag(tag);
            tagsList.classList.remove('visible');
        };
        tagsList.appendChild(tagItem);
    });
}

// 获取标签元素，根据不同页面可能有不同的类名
function getTagElements() {
    // 新增 Sounds 页面处理
    let soundTags = document.querySelectorAll('.category-title');
    if (soundTags.length > 0) {
        return soundTags;
    }
    // 对于直播回放页面
    let liveTags = document.querySelectorAll('.tag');
    if (liveTags.length > 0) {
        return liveTags;
    }
    // 对于画廊页面
    return document.querySelectorAll('.art-tag');
}

// 初始化
document.addEventListener('DOMContentLoaded', () => {
    // 标签列表功能
    document.querySelector('.toggle-tags-btn').addEventListener('click', () => {
        document.getElementById('tags-list').classList.toggle('visible');
    });

    document.addEventListener('click', (e) => {
        if (!e.target.closest('.search-container')) {
            document.getElementById('tags-list').classList.remove('visible');
        }
    });

    // 清除筛选
    document.querySelector('.clear-search-btn').addEventListener('click', () => {
        //document.getElementById('search-box').value = '';
        //triggerSearch();
        location.reload();//本地刷新location.reload();
    });

    // 实时搜索
    document.getElementById('search-box').addEventListener('input', triggerSearch);

    // 初始化标签列表
    initTagList();
});