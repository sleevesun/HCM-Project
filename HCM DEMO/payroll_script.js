// 工薪预算驾驶舱交互脚本

// DOM加载完成后初始化
document.addEventListener('DOMContentLoaded', function() {
    initializePayrollDashboard();
});

// 初始化仪表板
function initializePayrollDashboard() {
    initializeYearTabs();
    initializeExpandableRows();
    initializeRefreshButton();
    initializeActionButtons();
    loadDashboardData();
}

// 初始化年份标签切换
function initializeYearTabs() {
    const yearTabs = document.querySelectorAll('.year-tab');
    
    yearTabs.forEach(tab => {
        tab.addEventListener('click', function() {
            // 移除所有活跃状态
            yearTabs.forEach(t => t.classList.remove('active'));
            // 添加当前活跃状态
            this.classList.add('active');
            
            // 获取选中的年份
            const selectedYear = this.textContent;
            console.log('切换到年份:', selectedYear);
            
            // 更新数据显示
            updateDataByYear(selectedYear);
        });
    });
}

// 初始化可展开行
function initializeExpandableRows() {
    const expandableRows = document.querySelectorAll('.expandable');
    
    expandableRows.forEach(row => {
        row.addEventListener('click', function() {
            const departmentName = this.cells[0].textContent.trim();
            const isExpanded = departmentName.startsWith('▼');
            
            if (isExpanded) {
                // 收起
                this.cells[0].textContent = departmentName.replace('▼', '▶');
                hideSubRows(this);
            } else {
                // 展开
                this.cells[0].textContent = departmentName.replace('▶', '▼');
                showSubRows(this);
            }
        });
    });
}

// 显示子行
function showSubRows(parentRow) {
    let nextRow = parentRow.nextElementSibling;
    while (nextRow && nextRow.classList.contains('sub-row')) {
        nextRow.style.display = 'table-row';
        nextRow = nextRow.nextElementSibling;
    }
}

// 隐藏子行
function hideSubRows(parentRow) {
    let nextRow = parentRow.nextElementSibling;
    while (nextRow && nextRow.classList.contains('sub-row')) {
        nextRow.style.display = 'none';
        nextRow = nextRow.nextElementSibling;
    }
}

// 初始化刷新按钮
function initializeRefreshButton() {
    const refreshBtn = document.querySelector('.refresh-btn');
    if (refreshBtn) {
        refreshBtn.addEventListener('click', function() {
            console.log('刷新数据');
            showNotification('正在刷新数据...', 'info');
            
            // 模拟刷新延迟
            setTimeout(() => {
                loadDashboardData();
                showNotification('数据刷新完成', 'success');
            }, 1000);
        });
    }
}

// 初始化操作按钮
function initializeActionButtons() {
    const actionBtns = document.querySelectorAll('.action-btn');
    
    actionBtns.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.stopPropagation();
            const row = this.closest('tr');
            const applicationType = row.cells[0].textContent;
            console.log('查看申请:', applicationType);
            showNotification(`正在查看 ${applicationType} 详情`, 'info');
        });
    });
}

// 根据年份更新数据
function updateDataByYear(year) {
    const statsCards = document.querySelectorAll('.stats-card');
    
    // 模拟不同年份的数据
    const yearData = {
        '2023年': {
            hc: { actual: '200.0', budget: '184.7', diff: '15.3' },
            cost: { actual: '779.4', budget: '722.4', diff: '57.0' }
        },
        '2024年': {
            hc: { actual: '220.0', budget: '205.0', diff: '15.0' },
            cost: { actual: '850.0', budget: '800.0', diff: '50.0' }
        }
    };
    
    const data = yearData[year] || yearData['2023年'];
    
    // 更新HC卡片
    const hcCard = statsCards[0];
    if (hcCard) {
        const values = hcCard.querySelectorAll('.value');
        if (values.length >= 6) {
            values[0].textContent = data.hc.actual;
            values[1].textContent = (parseFloat(data.hc.actual) * 12).toFixed(1);
            values[2].textContent = data.hc.budget;
            values[3].textContent = (parseFloat(data.hc.budget) * 12).toFixed(1);
            values[4].textContent = data.hc.diff;
            values[5].textContent = (parseFloat(data.hc.diff) * 12).toFixed(1);
        }
    }
    
    // 更新工薪成本卡片
    const costCard = statsCards[1];
    if (costCard) {
        const values = costCard.querySelectorAll('.value');
        if (values.length >= 6) {
            values[0].textContent = data.cost.actual;
            values[1].textContent = (parseFloat(data.cost.actual) * 12).toFixed(1);
            values[2].textContent = data.cost.budget;
            values[3].textContent = (parseFloat(data.cost.budget) * 12).toFixed(1);
            values[4].textContent = data.cost.diff;
            values[5].textContent = (parseFloat(data.cost.diff) * 12).toFixed(1);
        }
    }
}

// 加载仪表板数据
function loadDashboardData() {
    console.log('加载仪表板数据');
    
    // 这里可以添加实际的数据加载逻辑
    // 例如从API获取数据
    
    // 模拟数据加载
    setTimeout(() => {
        console.log('数据加载完成');
        updateChartAnimations();
    }, 500);
}

// 更新图表动画
function updateChartAnimations() {
    const statsCards = document.querySelectorAll('.stats-card');
    
    statsCards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        
        setTimeout(() => {
            card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, index * 100);
    });
}

// 显示通知
function showNotification(message, type = 'info') {
    // 创建通知元素
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    // 添加样式
    Object.assign(notification.style, {
        position: 'fixed',
        top: '20px',
        right: '20px',
        padding: '12px 20px',
        borderRadius: '4px',
        color: 'white',
        fontSize: '14px',
        zIndex: '9999',
        opacity: '0',
        transform: 'translateX(100%)',
        transition: 'all 0.3s ease'
    });
    
    // 根据类型设置背景色
    const colors = {
        info: '#1677FF',
        success: '#52C41A',
        warning: '#FAAD14',
        error: '#FF4D4F'
    };
    notification.style.backgroundColor = colors[type] || colors.info;
    
    // 添加到页面
    document.body.appendChild(notification);
    
    // 显示动画
    setTimeout(() => {
        notification.style.opacity = '1';
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // 自动隐藏
    setTimeout(() => {
        notification.style.opacity = '0';
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 3000);
}

// 工具函数：格式化数字
function formatNumber(num, decimals = 1) {
    return parseFloat(num).toFixed(decimals);
}

// 工具函数：计算百分比
function calculatePercentage(actual, budget) {
    if (budget === 0) return 0;
    return ((actual - budget) / budget * 100).toFixed(1);
}

// 导出函数供外部使用
window.PayrollDashboard = {
    updateDataByYear,
    showNotification,
    formatNumber,
    calculatePercentage
};

// 页面卸载时清理
window.addEventListener('beforeunload', function() {
    console.log('清理资源');
});