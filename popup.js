// 搜索网站配置
const SEARCH_SITES = {
    zhihu: {
        name: '知乎',
        url: 'https://www.zhihu.com/search?type=content&q='
    },
    xiaohongshu: {
        name: '小红书',
        url: 'https://www.xiaohongshu.com/search_result/?keyword='
    },
    baidu: {
        name: '百度',
        url: 'https://www.baidu.com/s?wd='
    }
};

// DOM 元素
const searchInput = document.getElementById('searchInput');
const searchBtn = document.getElementById('searchBtn');
const clearAllBtn = document.getElementById('clearAllBtn');
const historyList = document.getElementById('historyList');

// 初始化
document.addEventListener('DOMContentLoaded', function() {
    loadHistory();
    setupEventListeners();
});

// 设置事件监听器
function setupEventListeners() {
    // 搜索按钮点击事件
    searchBtn.addEventListener('click', performSearch);
    
    // 回车键搜索
    searchInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            performSearch();
        }
    });
    
    // 清空所有历史记录
    clearAllBtn.addEventListener('click', clearAllHistory);
}

// 执行搜索
function performSearch() {
    const keyword = searchInput.value.trim();
    
    if (!keyword) {
        alert('请输入搜索关键词！');
        return;
    }
    
    const selectedSite = document.querySelector('input[name="site"]:checked').value;
    const siteConfig = SEARCH_SITES[selectedSite];
    
    // URL 编码关键词
    const encodedKeyword = encodeURIComponent(keyword);
    const searchUrl = siteConfig.url + encodedKeyword;
    
    // 保存搜索记录
    saveSearchRecord(keyword, selectedSite, siteConfig.name);
    
    // 在新标签页打开搜索结果
    chrome.tabs.create({ url: searchUrl });
    
    // 清空输入框
    searchInput.value = '';
    
    // 重新加载历史记录
    loadHistory();
}

// 保存搜索记录
function saveSearchRecord(keyword, siteKey, siteName) {
    const record = {
        keyword: keyword,
        site: siteKey,
        siteName: siteName,
        timestamp: Date.now(),
        id: generateId()
    };
    
    chrome.storage.local.get(['searchHistory'], function(result) {
        let history = result.searchHistory || [];
        
        // 避免重复记录（相同关键词和网站）
        history = history.filter(item => 
            !(item.keyword === keyword && item.site === siteKey)
        );
        
        // 添加新记录到开头
        history.unshift(record);
        
        // 限制历史记录数量（最多50条）
        if (history.length > 50) {
            history = history.slice(0, 50);
        }
        
        chrome.storage.local.set({ searchHistory: history });
    });
}

// 加载历史记录
function loadHistory() {
    chrome.storage.local.get(['searchHistory'], function(result) {
        const history = result.searchHistory || [];
        displayHistory(history);
    });
}

// 显示历史记录
function displayHistory(history) {
    historyList.innerHTML = '';
    
    if (history.length === 0) {
        historyList.innerHTML = '<div class="empty-history">暂无搜索记录</div>';
        return;
    }
    
    history.forEach(record => {
        const historyItem = createHistoryItem(record);
        historyList.appendChild(historyItem);
    });
}

// 创建历史记录项
function createHistoryItem(record) {
    const item = document.createElement('div');
    item.className = 'history-item';
    item.innerHTML = `
        <div class="history-content">
            <div class="history-keyword">${escapeHtml(record.keyword)}</div>
            <div class="history-site">${record.siteName}</div>
        </div>
        <button class="delete-button" data-id="${record.id}">删除</button>
    `;
    
    // 点击历史记录项重新搜索
    item.querySelector('.history-content').addEventListener('click', function() {
        searchInput.value = record.keyword;
        document.querySelector(`input[name="site"][value="${record.site}"]`).checked = true;
        performSearch();
    });
    
    // 删除单条记录
    item.querySelector('.delete-button').addEventListener('click', function(e) {
        e.stopPropagation();
        deleteRecord(record.id);
    });
    
    return item;
}

// 删除单条记录
function deleteRecord(recordId) {
    chrome.storage.local.get(['searchHistory'], function(result) {
        let history = result.searchHistory || [];
        history = history.filter(record => record.id !== recordId);
        
        chrome.storage.local.set({ searchHistory: history }, function() {
            loadHistory();
        });
    });
}

// 清空所有历史记录
function clearAllHistory() {
    if (confirm('确定要清空所有搜索记录吗？')) {
        chrome.storage.local.set({ searchHistory: [] }, function() {
            loadHistory();
        });
    }
}

// 生成唯一 ID
function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

// HTML 转义
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// 错误处理
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.action === 'searchError') {
        alert('搜索时出现错误，请重试！');
    }
});