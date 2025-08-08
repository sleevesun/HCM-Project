// DOM加载完成后初始化
document.addEventListener('DOMContentLoaded', function() {
    initYearTabs();
    initTableInteractions();
    initCardInteractions();
    
    // 加载设计系统配置（可选，用于动态配置）
    loadDesignSystemConfig();
});

// 加载设计系统配置
function loadDesignSystemConfig() {
    fetch('design_system.json')
        .then(response => response.json())
        .then(data => {
            console.log('设计系统配置已加载:', data);
            // 这里可以根据配置动态调整样式
        })
        .catch(error => console.log('设计系统配置加载失败:', error));
}

// 初始化年度标签切换
function initYearTabs() {
    const yearTabs = document.querySelectorAll('.year-tab');
    
    yearTabs.forEach(tab => {
        tab.addEventListener('click', function() {
            // 移除所有活跃状态
            yearTabs.forEach(t => t.classList.remove('active'));
            // 添加当前活跃状态
            this.classList.add('active');
            
            // 这里可以添加切换年度数据的逻辑
            const year = this.textContent;
            console.log('切换到年度:', year);
            
            // 模拟数据更新
            updateTableData(year);
        });
    });
}

// 初始化表格交互
function initTableInteractions() {
    const expandableRows = document.querySelectorAll('.expandable');
    
    expandableRows.forEach(row => {
        row.addEventListener('click', function(e) {
            // 如果点击的是状态图标，不触发展开/收起
            if (e.target.classList.contains('status-icon')) {
                return;
            }
            
            const expandIcon = this.querySelector('.expand-icon');
            const departmentName = this.querySelector('.department-name').textContent;
            
            // 切换展开图标
            if (expandIcon.textContent === '▼') {
                expandIcon.textContent = '▶';
                hideSubDepartments(departmentName);
            } else {
                expandIcon.textContent = '▼';
                showSubDepartments(departmentName);
            }
        });
    });
    
    // 初始化子部门展开图标点击
    const subExpandIcons = document.querySelectorAll('.sub-department .expand-icon');
    subExpandIcons.forEach(icon => {
        icon.addEventListener('click', function(e) {
            e.stopPropagation();
            
            if (this.textContent === '▶') {
                this.textContent = '▼';
                // 这里可以添加显示更深层级的逻辑
                console.log('展开子部门');
            } else {
                this.textContent = '▶';
                console.log('收起子部门');
            }
        });
    });
}

// 隐藏子部门
function hideSubDepartments(departmentName) {
    const allRows = document.querySelectorAll('tbody tr');
    let hideNext = false;
    
    allRows.forEach(row => {
        if (row.classList.contains('department-row')) {
            const name = row.querySelector('.department-name');
            if (name && name.textContent === departmentName) {
                hideNext = true;
                return;
            } else if (name) {
                hideNext = false;
            }
        }
        
        if (hideNext && row.classList.contains('sub-department')) {
            row.style.display = 'none';
        }
    });
}

// 显示子部门
function showSubDepartments(departmentName) {
    const allRows = document.querySelectorAll('tbody tr');
    let showNext = false;
    
    allRows.forEach(row => {
        if (row.classList.contains('department-row')) {
            const name = row.querySelector('.department-name');
            if (name && name.textContent === departmentName) {
                showNext = true;
                return;
            } else if (name) {
                showNext = false;
            }
        }
        
        if (showNext && row.classList.contains('sub-department')) {
            row.style.display = '';
        }
    });
}

// 初始化卡片交互
function initCardInteractions() {
    const actionElements = document.querySelectorAll('.value.action');
    
    actionElements.forEach(element => {
        element.addEventListener('click', function() {
            const action = this.textContent;
            console.log('点击操作:', action);
            
            // 模拟操作反馈
            showNotification(`执行操作: ${action}`);
        });
    });
}

// 更新表格数据（模拟）
function updateTableData(year) {
    // 这里可以根据年度更新表格数据
    // 现在只是简单的视觉反馈
    const table = document.querySelector('.data-table');
    table.style.opacity = '0.7';
    
    setTimeout(() => {
        table.style.opacity = '1';
        showNotification(`已切换到${year}数据`);
    }, 300);
}

// 显示通知
function showNotification(message) {
    // 创建通知元素
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    
    // 添加通知样式
    Object.assign(notification.style, {
        position: 'fixed',
        top: '80px',
        right: '24px',
        background: '#0066FF',
        color: 'white',
        padding: '12px 16px',
        borderRadius: '6px',
        boxShadow: '0 4px 12px rgba(0, 102, 255, 0.3)',
        zIndex: '1000',
        fontSize: '14px',
        fontWeight: '500',
        transform: 'translateX(100%)',
        transition: 'transform 0.3s ease'
    });
    
    document.body.appendChild(notification);
    
    // 显示动画
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // 自动隐藏
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 2000);
}

// 工具函数：格式化数字
function formatNumber(num) {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

// 工具函数：计算百分比
function calculatePercentage(used, total) {
    if (total === 0) return 0;
    return Math.round((used / total) * 100);
}

// 模拟数据更新
function simulateDataUpdate() {
    const values = document.querySelectorAll('.metric-item .value:not(.action)');
    
    values.forEach(value => {
        if (!isNaN(parseFloat(value.textContent))) {
            const currentValue = parseFloat(value.textContent);
            const newValue = currentValue + (Math.random() - 0.5) * 10;
            value.textContent = newValue.toFixed(1);
        }
    });
}

// 每30秒模拟数据更新（可选）
// setInterval(simulateDataUpdate, 30000);