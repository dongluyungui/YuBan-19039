// 存储多选模式下选中的标签（全局）
let selectedTags = [];
// 跟踪筛选状态
let isFiltering = false;

// 检索功能：支持单标签搜索和多标签筛选
function triggerSearch() {
  const searchValue = document.getElementById('search-box').value.toLowerCase();
  const records = getSearchableElements();
  
  // 将搜索框的值分割为关键词
  const keywords = searchValue.trim() ? searchValue.trim().split(/\s+/) : [];
  
  records.forEach(record => {
    const tags = record.dataset.tags.split(/[,，]\s*/).map(t => t.toLowerCase());
    let hasMatch = false;

    // 如果没有关键词，则显示所有
    if (keywords.length === 0) {
      hasMatch = true;
    } else {
      // 要求每一个关键词都匹配
      hasMatch = keywords.every(keyword => 
          tags.some(t => t.includes(keyword))
      );
    }

    record.style.display = hasMatch ? '' : 'none';
  });

  // 更新筛选状态和按钮样式
  updateFilterButtonState();

  // 筛选后重新初始化分页
  if (typeof initPagination === 'function') {
    setTimeout(initPagination, 10); 
  }
  // 更新音乐播放器的筛选结果
  if (window.musicPlayer && window.musicPlayer.updateFilteredMusic) {
    window.musicPlayer.updateFilteredMusic();
  }
}

// 更新筛选按钮状态
function updateFilterButtonState() {
  const filterButton = document.querySelector('.toggle-tags-btn');
  const searchValue = document.getElementById('search-box').value.trim();
  
  // 判定是否处于筛选状态
  isFiltering = selectedTags.length > 0 || searchValue !== '';
  
  if (isFiltering) {
    filterButton.classList.add('filtering');
    filterButton.textContent = '筛选中';
  } else {
    filterButton.classList.remove('filtering');
    filterButton.textContent = '标签筛选';
  }
}

// 获取可搜索的元素（适配不同页面）
function getSearchableElements() {
  let musicCards = document.querySelectorAll('.music-card');
  if (musicCards.length > 0) return musicCards;
  
  let soundRecords = document.querySelectorAll('.category-box');
  if (soundRecords.length > 0) return soundRecords;
  
  let liveRecords = document.querySelectorAll('.live-record');
  if (liveRecords.length > 0) return liveRecords;
  
  return document.querySelectorAll('.art-card'); // 包含.art-card
}

// 获取标签元素（适配不同页面）
function getTagElements() {
  let musicTags = document.querySelectorAll('.music-tag');
  if (musicTags.length > 0) return musicTags;
  
  let soundTags = document.querySelectorAll('.category-title');
  if (soundTags.length > 0) return soundTags;
  
  let liveTags = document.querySelectorAll('.live-tag');
  if (liveTags.length > 0) return liveTags;
  
  return document.querySelectorAll('.art-tag');
}

// 初始化标签列表（搜索框弹出的tag列表）
function initTagList() {
  const tagsList = document.getElementById('tags-list');
  const allTags = new Set();

  // 收集所有标签
  const tagElements = getTagElements();
  tagElements.forEach(tag => {
    allTags.add(tag.textContent.trim());
  });

  // 生成标签列表项
  tagsList.innerHTML = '';
  allTags.forEach(tag => {
    const tagItem = document.createElement('span');
    tagItem.textContent = tag;
    tagItem.dataset.tag = tag;

    // 搜索框tag的点击事件：调用统一筛选逻辑+关闭列表
    tagItem.onclick = (e) => {
      e.stopPropagation();
      const isMulti = tagsList.classList.contains('multi-select');
      
      if (isMulti) {
        // 多选模式逻辑（保持不变）
        tagItem.classList.toggle('selected');
        updateSelectedTags();
        triggerSearch();
      } else {
        // 单选模式：调用统一筛选函数，传入true表示需要关闭列表
        filterByTag(tag, true); 
      }
    };

    tagsList.appendChild(tagItem);
  });
}

// 更新多选模式下的选中标签数组
function updateSelectedTags() {
  const tagsList = document.getElementById('tags-list');
  const selectedItems = tagsList.querySelectorAll('span.selected');
  selectedTags = Array.from(selectedItems).map(item => item.dataset.tag);
  
  // 将多选标签显示在搜索框
  document.getElementById('search-box').value = selectedTags.join(' ');
}

// 单标签筛选（统一处理逻辑，增加是否关闭列表的参数）
function filterByTag(tag, shouldCloseList = false) {
  const searchBox = document.getElementById('search-box');
  const tagsList = document.getElementById('tags-list');
  
  // 1. 更新选中标签和搜索框
  selectedTags = [tag]; // 单选模式下仅保留当前标签
  searchBox.value = tag; // 同步到搜索框
  
  // 2. 清除所有标签的选中样式（统一视觉状态）
  document.querySelectorAll('.tags-list span.selected, .music-tag.selected, .art-tag.selected, .live-tag.selected').forEach(span => {
    span.classList.remove('selected');
  });
  
  // 3. 触发筛选流程（核心逻辑统一）
  triggerSearch();
  
  // 4. 若需要关闭列表（仅搜索框的tag需要）
  if (shouldCloseList && tagsList) {
    tagsList.classList.remove('visible');
  }
}

// 自动生成标签列表（分情况适配不同容器，排除.category-box）
function autoGenerateTags() {
  // 处理所有需要生成标签的容器（按类型区分）
  const containers = [
    ...document.querySelectorAll('.music-card'),
    ...document.querySelectorAll('.live-record'),
    ...document.querySelectorAll('.art-card'),
    ...document.querySelectorAll('.category-box') // 仍保留该类型容器，但后续会跳过处理
  ];
  
  containers.forEach(container => {
    // 新增：如果是.category-box，直接跳过不生成标签
    if (container.classList.contains('category-box')) {
      return; // 终止当前容器的处理，继续下一个
    }

    // 1. 判断容器类型
    const isMusicCard = container.classList.contains('music-card');
    const isLiveRecord = container.classList.contains('live-record');
    const isArtCard = container.classList.contains('art-card');

    // 2. 根据容器类型确定标签容器的位置和样式
    let tagsContainer;
    if (isMusicCard) {
      // 对于.music-card：在.music-info内生成标签容器
      tagsContainer = container.querySelector('.music-info .music-tags');
      if (!tagsContainer) {
        tagsContainer = document.createElement('div');
        tagsContainer.className = 'music-tags';
        // 插入到音乐信息的末尾
        const musicInfo = container.querySelector('.music-left');
        if (musicInfo) {
          musicInfo.appendChild(tagsContainer);
        } else {
          container.appendChild(tagsContainer); // 降级方案
        }
      }
    } else if (isLiveRecord) {
      // 对于.live-record：优先在.live-info内生成标签容器
      tagsContainer = container.querySelector('.live-info .live-tags');
      if (!tagsContainer) {
        tagsContainer = document.createElement('div');
        tagsContainer.className = 'live-tags';
        const liveInfo = container.querySelector('.live-info');
        if (liveInfo) {
          liveInfo.appendChild(tagsContainer);
        } else {
          container.appendChild(tagsContainer);
        }
      }
    } else if (isArtCard) {
      // 对于.art-card：使用已有的.tags容器
      tagsContainer = container.querySelector('.art-info .art-tags');
      if (!tagsContainer) {
        tagsContainer = document.createElement('div');
        tagsContainer.className = 'art-tags';
        const artDetails = container.querySelector('.art-details');
        if (artDetails) {
          artDetails.after(tagsContainer);
        } else {
          container.querySelector('.art-info').appendChild(tagsContainer);
        }
      }
    }

    // 3. 清空现有标签（避免重复生成）
    if (tagsContainer) {
      tagsContainer.innerHTML = '';
      
      // 生成卡片上的tag按钮
      const tags = container.dataset.tags?.split(/[,，]\s*/) || [];
      tags.forEach(tag => {
        const tagElement = document.createElement('span');
        tagElement.className = `tag ${isMusicCard ? 'music-tag' : isLiveRecord ? 'live-tag' : 'art-tag'}`;
        tagElement.textContent = tag;
        
        // 卡片tag的点击事件：调用统一筛选逻辑，无需关闭列表（无弹窗）
        tagElement.addEventListener('click', () => filterByTag(tag));
        
        tagsContainer.appendChild(tagElement);
      });
    }
  });
}

// 初始化筛选面板
function initFilterPanel() {
  const filterPanel = document.getElementById('filterPanel');
  const toggleFilterBtn = document.querySelector('.toggle-tags-btn');
  const closeFilterBtn = filterPanel.querySelector('.close-filter');
  const applyFilterBtn = filterPanel.querySelector('.apply-filter');
  const resetFilterBtn = filterPanel.querySelector('.reset-filter');
  
  // 生成其他标签选项
  populateOtherTagOptions();
  
  // 切换筛选面板显示
  toggleFilterBtn.addEventListener('click', () => {
    const tagsList = document.getElementById('tags-list');
    tagsList.classList.remove('visible');
    filterPanel.style.display = filterPanel.style.display === 'block' ? 'none' : 'block';
  });
  
  // 关闭筛选面板
  closeFilterBtn.addEventListener('click', () => {
    filterPanel.style.display = 'none';
  });
  
  // 应用筛选
  applyFilterBtn.addEventListener('click', applyFilters);
  
  // 重置筛选
  resetFilterBtn.addEventListener('click', () => {
    // 重置所有复选框
    filterPanel.querySelectorAll('input[type="checkbox"]').forEach(checkbox => {
      checkbox.checked = false;
    });
    
    // 重置筛选模式
    filterPanel.querySelector('input[type="radio"][value="any"]').checked = true;
    
    // 重置时清空全局标签和搜索框
    selectedTags = [];
    document.getElementById('search-box').value = '';
    
    // 应用重置后的筛选
    applyFilters();
  });
  
  // 点击页面其他地方关闭面板
  document.addEventListener('click', (e) => {
    if (!e.target.closest('.filter-panel') && !e.target.closest('.toggle-tags-btn')) {
      filterPanel.style.display = 'none';
    }
  });
  
  // 防止面板内部点击事件关闭面板
  filterPanel.addEventListener('click', (e) => {
    e.stopPropagation();
  });
}

// 收集所有标签并填充到"其他标签"组
function populateOtherTagOptions() {
  const allTags = new Set();
  const existingTags = new Set();
  
  // 同时收集所有类型的标签
  const records = [
    ...document.querySelectorAll('.music-card'),
    ...document.querySelectorAll('.live-record'), 
    ...document.querySelectorAll('.art-card')
  ];
  
  records.forEach(record => {
    // 支持中文逗号和英文逗号分割
    const tags = record.dataset.tags.split(/[,，]\s*/);
    tags.forEach(tag => allTags.add(tag));
  });
  
  // 收集已存在的标签（在预定义分类中，需要跳过的部分，自定义）
  const predefinedGroups = ['timeOptions', 'hostOptions', 'themeOptions', 'gameTitleOptions', 'gameOptions', 'bookOptions', 'festival', 'character', 'originalSingerOptions', 'songOptions'];
  predefinedGroups.forEach(groupId => {
    const group = document.getElementById(groupId);
    if (group) {
      group.querySelectorAll('input[type="checkbox"]').forEach(input => {
        existingTags.add(input.value);
      });
    }
  });
  
  // 找出未在预定义分类中的标签
  const otherTags = Array.from(allTags).filter(tag => !existingTags.has(tag));
  
  // 按字母顺序排序
  otherTags.sort();
  
  // 添加到"其他标签"组
  const otherTagOptions = document.getElementById('otherTagOptions');
  otherTagOptions.innerHTML = ''; // 清空容器
  
  otherTags.forEach(tag => {
    const label = document.createElement('label');
    const input = document.createElement('input');
    input.type = 'checkbox';
    input.name = 'other';
    input.value = tag;
    
    label.appendChild(input);
    label.appendChild(document.createTextNode(tag));
    otherTagOptions.appendChild(label);
  });
  
  // 如果没有其他标签，显示提示信息
  if (otherTags.length === 0) {
    otherTagOptions.innerHTML = '<p>暂无其他标签</p>';
  }
}

// 应用筛选逻辑
function applyFilters() {
  const filterPanel = document.getElementById('filterPanel');
  // 同时处理所有类型的卡片
  const records = [
    ...document.querySelectorAll('.music-card'),
    ...document.querySelectorAll('.live-record'),
    ...document.querySelectorAll('.art-card')
  ];
  
  // 获取所有选中的筛选条件
  const panelSelectedTags = Array.from(filterPanel.querySelectorAll('input[type="checkbox"]:checked'))
    .map(checkbox => checkbox.value);
  
  // 将面板选中的标签同步到全局selectedTags
  selectedTags = panelSelectedTags;
  
  // 将多选标签用空格分隔显示在搜索框（象征意义）
  const searchBox = document.getElementById('search-box');
  searchBox.value = selectedTags.join(' ');
  
  // 获取筛选模式
  const filterMode = filterPanel.querySelector('input[name="filterMode"]:checked').value;
  
  records.forEach(record => {
    // 支持中文逗号和英文逗号分割
    const tags = record.dataset.tags.split(/[,，]\s*/);
    
    // 应用筛选模式
    let shouldDisplay = false;
    if (selectedTags.length === 0) {
      shouldDisplay = true; // 没有选择任何标签时显示所有记录
    } else if (filterMode === 'any') {
      // 宽松模式：包含任意一个选中的标签
      shouldDisplay = selectedTags.some(tag => tags.includes(tag));
    } else {
      // 严格模式：包含所有选中的标签
      shouldDisplay = selectedTags.every(tag => tags.includes(tag));
    }
    
    // 最终是否显示记录
    record.style.display = shouldDisplay ? '' : 'none';
  });
  
  // 清除标签列表的选中样式
  document.querySelectorAll('.tags-list span.selected').forEach(span => {
    span.classList.remove('selected');
  });
  
  // 关闭筛选面板
  filterPanel.style.display = 'none';
  
  // 更新筛选状态
  updateFilterButtonState();
  
  // 更新分页
  if (typeof initPagination === 'function') {
    initPagination();
  }
  // 更新音乐播放器的筛选结果
  if (window.musicPlayer && window.musicPlayer.updateFilteredMusic) {
    window.musicPlayer.updateFilteredMusic();
  }
}

// 初始化功能
document.addEventListener('DOMContentLoaded', () => {
  const tagsList = document.getElementById('tags-list');
  const searchBox = document.getElementById('search-box');
  const toggleBtn = document.querySelector('.toggle-tags-btn');
  const clearBtn = document.querySelector('.clear-search-btn');

  // 自动生成标签列表
  autoGenerateTags();

  // 初始化标签列表
  initTagList();

  // 点击标签筛选按钮：显示多选面板
  toggleBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    tagsList.classList.add('multi-select'); // 启用多选样式
    tagsList.classList.toggle('visible');
  });

  // 点击搜索框：显示单选标签列表
  searchBox.addEventListener('click', (e) => {
    e.stopPropagation();
    tagsList.classList.remove('multi-select'); // 禁用多选样式
    tagsList.classList.add('visible');
  });

  // 搜索框输入时触发筛选
  searchBox.addEventListener('input', () => {
    // 将输入的内容按空格分割为标签数组
    selectedTags = searchBox.value.trim() ? searchBox.value.trim().split(/\s+/) : [];
    // 清除所有选中样式
    document.querySelectorAll('.tags-list span.selected').forEach(span => {
      span.classList.remove('selected');
    });
    triggerSearch();
  });

  // 点击页面其他区域关闭标签列表
  document.addEventListener('click', (e) => {
    if (!e.target.closest('.search-container')) {
      tagsList.classList.remove('visible');
    }
  });

  // 清除筛选按钮
  clearBtn.addEventListener('click', () => {
    searchBox.value = '';
    selectedTags = [];
    // 清除所有选中样式
    document.querySelectorAll('.tags-list span.selected').forEach(span => {
      span.classList.remove('selected');
    });
    tagsList.classList.remove('visible');
    triggerSearch();
  });

  // 防止标签列表内部点击事件冒泡
  tagsList.addEventListener('click', (e) => {
    e.stopPropagation();
  });

  // 初始化筛选面板
  initFilterPanel();
  
  // 初始化按钮状态
  updateFilterButtonState();
});