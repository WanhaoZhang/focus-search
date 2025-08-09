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
let searchInput, searchBtn, clearAllBtn, historyList, historyContainer;
let currentSite = 'zhihu';

// 初始化
document.addEventListener('DOMContentLoaded', function() {
    initializeElements();
    setupEventListeners();
    loadHistory();
    
    // 自动聚焦搜索框
    setTimeout(() => {
        searchInput.focus();
    }, 100);
});

// 初始化DOM元素
function initializeElements() {
    searchInput = document.getElementById('searchInput');
    searchBtn = document.getElementById('searchBtn');
    clearAllBtn = document.getElementById('clearAllBtn');
    historyList = document.getElementById('historyList');
    historyContainer = document.getElementById('historyContainer');
}

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
    
    // 搜索输入框焦点事件
    searchInput.addEventListener('focus', showHistory);
    
    // 点击页面其他地方隐藏历史记录
    document.addEventListener('click', function(e) {
        if (!historyContainer.contains(e.target) && 
            !searchInput.contains(e.target)) {
            hideHistory();
        }
    });
    
    // 网站选择按钮
    const siteButtons = document.querySelectorAll('.site-btn');
    siteButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            // 移除所有active类
            siteButtons.forEach(b => b.classList.remove('active'));
            // 添加active类到当前按钮
            this.classList.add('active');
            // 更新当前选择的网站
            currentSite = this.dataset.site;
        });
    });
    
    // 清空所有历史记录
    clearAllBtn.addEventListener('click', clearAllHistory);
    
    // ESC键隐藏历史记录
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            hideHistory();
            searchInput.blur();
        }
    });
}

// 执行搜索
function performSearch() {
    const keyword = searchInput.value.trim();
    
    if (!keyword) {
        searchInput.focus();
        return;
    }
    
    const siteConfig = SEARCH_SITES[currentSite];
    
    // URL 编码关键词
    const encodedKeyword = encodeURIComponent(keyword);
    const searchUrl = siteConfig.url + encodedKeyword;
    
    // 保存搜索记录
    saveSearchRecord(keyword, currentSite, siteConfig.name);
    
    // 在当前标签页打开搜索结果
    window.location.href = searchUrl;
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
        
        chrome.storage.local.set({ searchHistory: history }, function() {
            loadHistory();
        });
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
    if (!historyList) return;
    
    historyList.innerHTML = '';
    
    if (history.length === 0) {
        historyList.innerHTML = '<div class="empty-history">暂无搜索记录</div>';
        return;
    }
    
    // 显示历史记录容器
    if (history.length > 0) {
        historyContainer.classList.add('has-content');
    }
    
    history.slice(0, 10).forEach(record => { // 只显示最近10条
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
        
        // 设置对应的网站选择
        document.querySelectorAll('.site-btn').forEach(btn => {
            btn.classList.remove('active');
            if (btn.dataset.site === record.site) {
                btn.classList.add('active');
                currentSite = record.site;
            }
        });
        
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
            hideHistory();
        });
    }
}

// 显示历史记录
function showHistory() {
    chrome.storage.local.get(['searchHistory'], function(result) {
        const history = result.searchHistory || [];
        if (history.length > 0) {
            historyContainer.classList.add('visible');
        }
    });
}

// 隐藏历史记录
function hideHistory() {
    historyContainer.classList.remove('visible');
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

// 快捷键支持
document.addEventListener('keydown', function(e) {
    // Ctrl/Cmd + K 聚焦搜索框
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        searchInput.focus();
        searchInput.select();
    }
    
    // Alt + 数字键快速切换搜索网站
    if (e.altKey && !isNaN(e.key) && e.key >= '1' && e.key <= '3') {
        e.preventDefault();
        const sites = ['zhihu', 'xiaohongshu', 'baidu'];
        const siteIndex = parseInt(e.key) - 1;
        
        if (sites[siteIndex]) {
            document.querySelectorAll('.site-btn').forEach(btn => {
                btn.classList.remove('active');
                if (btn.dataset.site === sites[siteIndex]) {
                    btn.classList.add('active');
                    currentSite = sites[siteIndex];
                }
            });
        }
    }
});

// 错误处理
window.addEventListener('error', function(e) {
    console.error('Focus Search Error:', e.error);
});

// 处理Chrome扩展API错误
if (typeof chrome !== 'undefined' && chrome.runtime) {
    chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
        if (request.action === 'searchError') {
            console.error('Search error:', request.error);
        }
    });
}