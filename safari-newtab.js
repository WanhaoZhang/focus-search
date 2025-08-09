// Safari 存储 API 兼容层
const SafariStorage = {
    get: function(keys, callback) {
        if (typeof safari !== 'undefined' && safari.extension) {
            // Safari 扩展 API
            const result = {};
            if (Array.isArray(keys)) {
                keys.forEach(key => {
                    result[key] = JSON.parse(localStorage.getItem(key) || 'null');
                });
            } else if (typeof keys === 'object') {
                Object.keys(keys).forEach(key => {
                    result[key] = JSON.parse(localStorage.getItem(key) || 'null');
                });
            } else {
                result[keys] = JSON.parse(localStorage.getItem(keys) || 'null');
            }
            callback(result);
        } else {
            // 降级到 localStorage
            const result = {};
            if (Array.isArray(keys)) {
                keys.forEach(key => {
                    result[key] = JSON.parse(localStorage.getItem(key) || 'null');
                });
            } else if (typeof keys === 'object') {
                Object.keys(keys).forEach(key => {
                    result[key] = JSON.parse(localStorage.getItem(key) || 'null');
                });
            } else {
                result[keys] = JSON.parse(localStorage.getItem(keys) || 'null');
            }
            callback(result);
        }
    },
    
    set: function(items, callback) {
        if (typeof safari !== 'undefined' && safari.extension) {
            // Safari 扩展 API
            Object.keys(items).forEach(key => {
                localStorage.setItem(key, JSON.stringify(items[key]));
            });
        } else {
            // 降级到 localStorage
            Object.keys(items).forEach(key => {
                localStorage.setItem(key, JSON.stringify(items[key]));
            });
        }
        if (callback) callback();
    },
    
    remove: function(keys, callback) {
        if (Array.isArray(keys)) {
            keys.forEach(key => localStorage.removeItem(key));
        } else {
            localStorage.removeItem(keys);
        }
        if (callback) callback();
    }
};

// 搜索网站配置
const DEFAULT_SITES = {
    zhihu: {
        name: '知乎',
        url: 'https://www.zhihu.com/search?type=content&q='
    },
    xiaohongshu: {
        name: '小红书',
        url: 'https://www.xiaohongshu.com/search_result/?keyword='
    },
    douyin: {
        name: '抖音',
        url: 'https://www.douyin.com/search/'
    },
    bilibili: {
        name: 'B站',
        url: 'https://search.bilibili.com/all?keyword='
    }
};

// 动态网站配置（包含默认网站和自定义网站）
let SEARCH_SITES = { ...DEFAULT_SITES };

// DOM 元素
let searchInput, searchBtn, clearAllBtn, historyList, historyPanel, historyContent, historyToggle, collapseBtn, historyCount, todayCount, totalCount, loadMoreBtn;
let addSiteBtn, addSiteModal, modalClose, modalCancel, modalConfirm, siteNameInput, siteUrlInput, siteIconInput;
let guideTips, hideTipsBtn, restoreDefaultBtn;
let currentSite = null; // 默认不选择任何搜索平台，使用默认搜索引擎
let selectedColor = '#ff6b35';

// 初始化
document.addEventListener('DOMContentLoaded', function() {
    initializeElements();
    loadCustomSites();
    setupEventListeners();
    loadHistory();
    checkGuideTipsVisibility();
    
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
    historyPanel = document.getElementById('historyPanel');
    historyContent = document.getElementById('historyContent');
    historyToggle = document.getElementById('historyToggle');
    collapseBtn = document.getElementById('collapseBtn');
    historyCount = document.getElementById('historyCount');
    todayCount = document.getElementById('todayCount');
    totalCount = document.getElementById('totalCount');
    loadMoreBtn = document.getElementById('loadMoreBtn');
    
    // 添加网站相关元素
    addSiteBtn = document.getElementById('addSiteBtn');
    addSiteModal = document.getElementById('addSiteModal');
    modalClose = document.getElementById('modalClose');
    modalCancel = document.getElementById('modalCancel');
    modalConfirm = document.getElementById('modalConfirm');
    siteNameInput = document.getElementById('siteName');
    siteUrlInput = document.getElementById('siteUrl');
    siteIconInput = document.getElementById('siteIcon');
    
    // 指导提示相关元素
    guideTips = document.getElementById('guideTips');
    hideTipsBtn = document.getElementById('hideTipsBtn');
    restoreDefaultBtn = document.getElementById('restoreDefaultBtn');
}

// 加载自定义网站和处理隐藏的默认网站
function loadCustomSites() {
    SafariStorage.get(['customSites', 'hiddenSites'], function(result) {
        const customSites = result.customSites || {};
        const hiddenSites = result.hiddenSites || [];
        
        // 从默认网站中排除隐藏的网站
        const visibleDefaultSites = {};
        Object.keys(DEFAULT_SITES).forEach(siteKey => {
            if (!hiddenSites.includes(siteKey)) {
                visibleDefaultSites[siteKey] = DEFAULT_SITES[siteKey];
            }
        });
        
        // 合并可见的默认网站和自定义网站
        SEARCH_SITES = { ...visibleDefaultSites, ...customSites };
        
        // 保持默认状态：不选择任何网站
        currentSite = null;
        
        renderSiteGrid();
    });
}

// 渲染网站网格
function renderSiteGrid() {
    const siteGrid = document.querySelector('.site-grid');
    
    // 清空现有的自定义网站
    const customSites = siteGrid.querySelectorAll('.custom-site-card');
    customSites.forEach(site => site.remove());
    
    // 添加自定义网站
    Object.keys(SEARCH_SITES).forEach(siteKey => {
        if (!DEFAULT_SITES[siteKey]) {
            const siteConfig = SEARCH_SITES[siteKey];
            const siteCard = createCustomSiteCard(siteKey, siteConfig);
            siteGrid.appendChild(siteCard);
        }
    });
    
    // 重新绑定事件监听器
    setupSiteCardListeners();
    
    // 确保正确的激活状态
    updateActiveState();
}

// 更新激活状态的颜色
function updateActiveState() {
    document.querySelectorAll('.site-card').forEach(btn => {
        const icon = btn.querySelector('.site-icon');
        if (btn.dataset.site === currentSite && currentSite !== null) {
            btn.classList.add('active');
            if (icon.classList.contains('custom-site-icon')) {
                const originalColor = icon.dataset.originalColor;
                if (originalColor) {
                    icon.style.background = originalColor;
                }
            }
        } else {
            btn.classList.remove('active');
            if (icon.classList.contains('custom-site-icon')) {
                icon.style.background = 'linear-gradient(135deg, #9ca3af, #6b7280)';
            }
        }
    });
}

// 创建自定义网站卡片
function createCustomSiteCard(siteKey, siteConfig) {
    const card = document.createElement('button');
    card.className = 'site-card custom-site-card';
    card.dataset.site = siteKey;
    
    // 存储原始颜色信息
    card.dataset.originalColor = siteConfig.color || '#ff6b35';
    
    card.innerHTML = `
        <div class="site-icon custom-site-icon" data-original-color="${siteConfig.color || '#ff6b35'}">
            ${siteConfig.icon || siteConfig.name.charAt(0)}
        </div>
        <span class="site-name">${siteConfig.name}</span>
        <button class="delete-site-btn" data-site="${siteKey}">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
        </button>
    `;
    
    return card;
}

// 设置网站卡片事件监听器
function setupSiteCardListeners() {
    const siteButtons = document.querySelectorAll('.site-card');
    siteButtons.forEach(btn => {
        // 移除旧的监听器，添加新的
        btn.replaceWith(btn.cloneNode(true));
    });
    
    // 重新获取并添加监听器
    document.querySelectorAll('.site-card').forEach(btn => {
        btn.addEventListener('click', function(e) {
            if (e.target.closest('.delete-site-btn')) {
                e.stopPropagation();
                deleteSite(e.target.closest('.delete-site-btn').dataset.site);
                return;
            }
            
            // 移除所有active类，将所有图标变为灰色
            document.querySelectorAll('.site-card').forEach(b => {
                b.classList.remove('active');
                const icon = b.querySelector('.site-icon');
                if (icon.classList.contains('custom-site-icon')) {
                    // 自定义网站图标变为灰色
                    icon.style.background = 'linear-gradient(135deg, #9ca3af, #6b7280)';
                }
            });
            
            // 添加active类到当前按钮
            this.classList.add('active');
            
            // 如果是自定义网站，恢复原始颜色
            const icon = this.querySelector('.site-icon');
            if (icon.classList.contains('custom-site-icon')) {
                const originalColor = icon.dataset.originalColor;
                if (originalColor) {
                    icon.style.background = originalColor;
                }
            }
            
            // 更新当前选择的网站
            currentSite = this.dataset.site;
        });
    });
}

// 删除网站（包括默认网站和自定义网站）
function deleteSite(siteKey) {
    const siteName = SEARCH_SITES[siteKey].name;
    
    if (confirm(`确定要删除 ${siteName} 吗？删除后可以通过"添加网站"重新添加。`)) {
        if (DEFAULT_SITES[siteKey]) {
            // 删除默认网站 - 添加到隐藏列表
            SafariStorage.get(['hiddenSites'], function(result) {
                const hiddenSites = result.hiddenSites || [];
                if (!hiddenSites.includes(siteKey)) {
                    hiddenSites.push(siteKey);
                    SafariStorage.set({ hiddenSites }, function() {
                        // 从当前显示中移除
                        delete SEARCH_SITES[siteKey];
                        
                        // 如果删除的是当前选中的网站，切换到剩余的第一个网站
                        if (currentSite === siteKey) {
                            const remainingSites = Object.keys(SEARCH_SITES);
                            if (remainingSites.length > 0) {
                                currentSite = remainingSites[0];
                            }
                        }
                        
                        renderSiteGrid();
                        updateActiveState();
                    });
                }
            });
        } else {
            // 删除自定义网站
            SafariStorage.get(['customSites'], function(result) {
                const customSites = result.customSites || {};
                delete customSites[siteKey];
                delete SEARCH_SITES[siteKey];
                
                SafariStorage.set({ customSites }, function() {
                    // 如果删除的是当前选中的网站，切换到剩余的第一个网站
                    if (currentSite === siteKey) {
                        const remainingSites = Object.keys(SEARCH_SITES);
                        if (remainingSites.length > 0) {
                            currentSite = remainingSites[0];
                        }
                    }
                    
                    renderSiteGrid();
                    updateActiveState();
                });
            });
        }
    }
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
    
    // 历史记录切换按钮
    historyToggle.addEventListener('click', toggleHistoryPanel);
    
    // 折叠/展开历史记录
    collapseBtn.addEventListener('click', toggleCollapse);
    document.querySelector('.history-header').addEventListener('click', toggleCollapse);
    
    // 点击页面其他地方隐藏历史记录
    document.addEventListener('click', function(e) {
        if (!historyPanel.contains(e.target) && 
            !historyToggle.contains(e.target)) {
            hideHistoryPanel();
        }
    });
    
    // 网站选择按钮 - 使用新的函数
    setupSiteCardListeners();
    
    // 添加网站按钮
    addSiteBtn.addEventListener('click', showAddSiteModal);
    
    // 弹窗事件
    modalClose.addEventListener('click', hideAddSiteModal);
    modalCancel.addEventListener('click', hideAddSiteModal);
    modalConfirm.addEventListener('click', confirmAddSite);
    restoreDefaultBtn.addEventListener('click', restoreDefaultSites);
    
    // 点击弹窗外部关闭
    addSiteModal.addEventListener('click', function(e) {
        if (e.target === addSiteModal) {
            hideAddSiteModal();
        }
    });
    
    // 颜色选择
    document.querySelectorAll('.color-option').forEach(option => {
        option.addEventListener('click', function() {
            document.querySelectorAll('.color-option').forEach(opt => opt.classList.remove('selected'));
            this.classList.add('selected');
            selectedColor = this.dataset.color;
        });
    });
    
    // 输入框回车提交
    [siteNameInput, siteUrlInput, siteIconInput].forEach(input => {
        input.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                confirmAddSite();
            }
        });
    });
    
    // 实时验证
    [siteNameInput, siteUrlInput, siteIconInput].forEach(input => {
        input.addEventListener('input', validateForm);
    });
    
    // 隐藏指导提示
    hideTipsBtn.addEventListener('click', hideGuideTips);
    
    // 10秒后自动隐藏提示（如果用户没有交互）
    setTimeout(() => {
        if (guideTips && !guideTips.classList.contains('hidden')) {
            hideGuideTips();
        }
    }, 10000);
    
    // 清空所有历史记录
    clearAllBtn.addEventListener('click', clearAllHistory);
    
    // 加载更多
    loadMoreBtn.addEventListener('click', loadMoreHistory);
    
    // ESC键隐藏历史记录
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            hideHistoryPanel();
            hideAddSiteModal();
            searchInput.blur();
        }
    });
}

// 显示添加网站弹窗
function showAddSiteModal() {
    addSiteModal.classList.add('active');
    siteNameInput.value = '';
    siteUrlInput.value = '';
    siteIconInput.value = '';
    selectedColor = '#ff6b35';
    
    // 重置颜色选择
    document.querySelectorAll('.color-option').forEach(opt => opt.classList.remove('selected'));
    document.querySelector('.color-option').classList.add('selected');
    
    // 聚焦到第一个输入框
    setTimeout(() => siteNameInput.focus(), 100);
    validateForm();
}

// 隐藏添加网站弹窗
function hideAddSiteModal() {
    addSiteModal.classList.remove('active');
}

// 验证表单
function validateForm() {
    const name = siteNameInput.value.trim();
    const url = siteUrlInput.value.trim();
    const icon = siteIconInput.value.trim();
    
    const isValid = name.length > 0 && url.length > 0 && icon.length > 0;
    modalConfirm.disabled = !isValid;
    
    return isValid;
}

// 确认添加网站
function confirmAddSite() {
    if (!validateForm()) {
        return;
    }
    
    const name = siteNameInput.value.trim();
    const url = siteUrlInput.value.trim();
    const icon = siteIconInput.value.trim();
    
    // 处理URL格式
    let searchUrl = url;
    if (!url.includes('{keyword}') && !url.includes('=')) {
        // 如果URL既没有{keyword}占位符，也没有等号，添加占位符
        searchUrl = url.endsWith('/') ? url + '{keyword}' : url + '/{keyword}';
    }
    
    // 生成唯一的siteKey
    const siteKey = generateSiteKey(name);
    
    const newSite = {
        name: name,
        url: searchUrl,
        icon: icon,
        color: selectedColor
    };
    
    // 保存到存储
    SafariStorage.get(['customSites'], function(result) {
        const customSites = result.customSites || {};
        customSites[siteKey] = newSite;
        
        SafariStorage.set({ customSites }, function() {
            SEARCH_SITES[siteKey] = newSite;
            renderSiteGrid();
            hideAddSiteModal();
            
            // 自动选择新添加的网站
            setTimeout(() => {
                const newSiteBtn = document.querySelector(`[data-site="${siteKey}"]`);
                if (newSiteBtn) {
                    // 更新当前选中的网站
                    currentSite = siteKey;
                    updateActiveState();
                }
            }, 100);
        });
    });
}

// 生成网站Key
function generateSiteKey(name) {
    const base = name.toLowerCase().replace(/[^a-z0-9]/g, '');
    let key = base;
    let counter = 1;
    
    // 确保key唯一
    while (SEARCH_SITES[key] || DEFAULT_SITES[key]) {
        key = base + counter;
        counter++;
    }
    
    return key;
}

// 恢复默认网站
function restoreDefaultSites() {
    if (confirm('确定要恢复所有默认网站吗？这将显示知乎、小红书、抖音、B站等默认网站。')) {
        SafariStorage.remove('hiddenSites', function() {
            // 重新加载网站配置
            loadCustomSites();
            hideAddSiteModal();
            
            // 显示成功提示
            setTimeout(() => {
                alert('默认网站已恢复！');
            }, 100);
        });
    }
}

// 检查是否显示指导提示
function checkGuideTipsVisibility() {
    SafariStorage.get(['hideTips', 'customSites'], function(result) {
        const hideTips = result.hideTips || false;
        const customSites = result.customSites || {};
        const hasCustomSites = Object.keys(customSites).length > 0;
        
        // 如果用户已隐藏提示，或者已经有自定义网站，则不显示
        if (hideTips || hasCustomSites) {
            hideGuideTips(false); // 不保存到存储
        }
    });
}

// 隐藏指导提示
function hideGuideTips(saveToStorage = true) {
    if (guideTips) {
        guideTips.classList.add('hidden');
        
        if (saveToStorage) {
            SafariStorage.set({ hideTips: true });
        }
        
        // 动画结束后移除元素
        setTimeout(() => {
            if (guideTips) {
                guideTips.style.display = 'none';
            }
        }, 300);
    }
}

// 执行搜索
function performSearch() {
    const keyword = searchInput.value.trim();
    
    if (!keyword) {
        searchInput.focus();
        return;
    }
    
    let searchUrl;
    let siteName;
    let siteKey;
    
    // 检查是否有选中的搜索平台
    const activeButton = document.querySelector('.site-card.active');
    
    if (activeButton && currentSite && SEARCH_SITES[currentSite]) {
        // 使用选定的搜索平台
        const siteConfig = SEARCH_SITES[currentSite];
        const encodedKeyword = encodeURIComponent(keyword);
        
        // 处理不同的URL格式
        if (siteConfig.url.includes('{keyword}')) {
            searchUrl = siteConfig.url.replace('{keyword}', encodedKeyword);
        } else {
            searchUrl = siteConfig.url + encodedKeyword;
        }
        siteName = siteConfig.name;
        siteKey = currentSite;
    } else {
        // 使用默认搜索引擎（Google）
        const encodedKeyword = encodeURIComponent(keyword);
        searchUrl = `https://www.google.com/search?q=${encodedKeyword}`;
        siteName = 'Google';
        siteKey = 'google';
    }
    
    // 保存搜索记录
    saveSearchRecord(keyword, siteKey, siteName);
    
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
    
    SafariStorage.get(['searchHistory'], function(result) {
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
        
        SafariStorage.set({ searchHistory: history }, function() {
            loadHistory();
        });
    });
}

// 加载历史记录
function loadHistory() {
    SafariStorage.get(['searchHistory'], function(result) {
        const history = result.searchHistory || [];
        displayHistory(history);
    });
}

// 显示历史记录
function displayHistory(history) {
    if (!historyList) return;
    
    historyList.innerHTML = '';
    
    // 更新计数器
    updateHistoryCounts(history);
    
    if (history.length === 0) {
        historyList.innerHTML = `
            <div class="empty-history">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                    <circle cx="12" cy="12" r="10"></circle>
                    <polyline points="12 6 12 12 16 14"></polyline>
                </svg>
                <div>暂无搜索记录</div>
            </div>
        `;
        return;
    }
    
    // 显示历史记录
    history.forEach(record => {
        const historyItem = createHistoryItem(record);
        historyList.appendChild(historyItem);
    });
}

// 更新历史记录计数
function updateHistoryCounts(history) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayCount = history.filter(item => item.timestamp >= today.getTime()).length;
    
    if (historyCount) historyCount.textContent = history.length;
    if (todayCount) todayCount.textContent = `今日: ${todayCount}`;
    if (totalCount) totalCount.textContent = `总计: ${history.length}`;
}

// 创建历史记录项
function createHistoryItem(record) {
    const item = document.createElement('div');
    item.className = 'history-item';
    
    const siteInitials = {
        'zhihu': '知',
        'xiaohongshu': '红',
        'douyin': '抖',
        'bilibili': 'B'
    };
    
    // 获取网站图标，优先使用自定义配置
    const getSiteIcon = (siteKey) => {
        if (SEARCH_SITES[siteKey] && SEARCH_SITES[siteKey].icon) {
            return SEARCH_SITES[siteKey].icon;
        }
        return siteInitials[siteKey] || siteKey.charAt(0).toUpperCase();
    };
    
    const timeAgo = getRelativeTime(record.timestamp);
    
    item.innerHTML = `
        <div class="history-item-content">
            <div class="history-site-badge site-${record.site}">
                ${getSiteIcon(record.site)}
            </div>
            <div class="history-text">
                <div class="history-keyword">${escapeHtml(record.keyword)}</div>
                <div class="history-meta">
                    <span class="history-site-name">${record.siteName}</span>
                    <span class="history-time">${timeAgo}</span>
                </div>
            </div>
        </div>
        <button class="delete-button" data-id="${record.id}">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
        </button>
    `;
    
    // 点击历史记录项重新搜索
    item.addEventListener('click', function(e) {
        if (!e.target.classList.contains('delete-button') && !e.target.closest('.delete-button')) {
            searchInput.value = record.keyword;
            
            // 设置对应的网站选择
            document.querySelectorAll('.site-card').forEach(btn => {
                btn.classList.remove('active');
                const icon = btn.querySelector('.site-icon');
                if (icon.classList.contains('custom-site-icon')) {
                    // 自定义网站图标变为灰色
                    icon.style.background = 'linear-gradient(135deg, #9ca3af, #6b7280)';
                }
                
                if (btn.dataset.site === record.site) {
                    btn.classList.add('active');
                    currentSite = record.site;
                    
                    // 如果是自定义网站，恢复原始颜色
                    if (icon.classList.contains('custom-site-icon')) {
                        const originalColor = icon.dataset.originalColor;
                        if (originalColor) {
                            icon.style.background = originalColor;
                        }
                    }
                }
            });
            
            performSearch();
        }
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
    SafariStorage.get(['searchHistory'], function(result) {
        let history = result.searchHistory || [];
        history = history.filter(record => record.id !== recordId);
        
        SafariStorage.set({ searchHistory: history }, function() {
            loadHistory();
        });
    });
}

// 清空所有历史记录
function clearAllHistory() {
    if (confirm('确定要清空所有搜索记录吗？')) {
        SafariStorage.set({ searchHistory: [] }, function() {
            loadHistory();
            hideHistory();
        });
    }
}

// 切换历史记录面板
function toggleHistoryPanel() {
    const isActive = historyPanel.classList.contains('active');
    if (isActive) {
        hideHistoryPanel();
    } else {
        showHistoryPanel();
    }
}

// 显示历史记录面板
function showHistoryPanel() {
    historyPanel.classList.add('active');
    historyPanel.classList.remove('collapsed');
    historyToggle.classList.add('active');
    loadHistory();
}

// 隐藏历史记录面板
function hideHistoryPanel() {
    historyPanel.classList.remove('active');
    historyToggle.classList.remove('active');
}

// 切换折叠状态
function toggleCollapse(e) {
    e.stopPropagation();
    const isCollapsed = historyPanel.classList.contains('collapsed');
    if (isCollapsed) {
        historyPanel.classList.remove('collapsed');
        collapseBtn.innerHTML = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="18 15 12 9 6 15"></polyline></svg>';
    } else {
        historyPanel.classList.add('collapsed');
        collapseBtn.innerHTML = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 12 15 18 9"></polyline></svg>';
    }
}

// 生成唯一 ID
function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

// 获取相对时间描述
function getRelativeTime(timestamp) {
    const now = new Date();
    const date = new Date(timestamp);
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);
    
    if (diffMins < 1) return '刚刚';
    if (diffMins < 60) return `${diffMins}分钟前`;
    if (diffHours < 24) return `${diffHours}小时前`;
    if (diffDays === 1) return '昨天';
    if (diffDays < 7) return `${diffDays}天前`;
    
    return date.toLocaleDateString('zh-CN', {
        month: 'short',
        day: 'numeric'
    });
}

// HTML 转义
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// 快捷键支持
document.addEventListener('keydown', function(e) {
    // Cmd + K 聚焦搜索框 (Safari主要使用Cmd键)
    if (e.metaKey && e.key === 'k') {
        e.preventDefault();
        searchInput.focus();
        searchInput.select();
    }
    
    // Option + 数字键快速切换搜索网站 (Safari使用Option键)
    if (e.altKey && !isNaN(e.key) && e.key >= '1' && e.key <= '4') {
        e.preventDefault();
        const sites = ['zhihu', 'xiaohongshu', 'douyin', 'bilibili'];
        const siteIndex = parseInt(e.key) - 1;
        
        if (sites[siteIndex]) {
            document.querySelectorAll('.site-card').forEach(btn => {
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

// Safari 特定的初始化
if (typeof safari !== 'undefined' && safari.extension) {
    console.log('Safari Extension Loaded: Focus Search');
}