// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', function() {
    initTabSwitching();
    initCharts();
    initFilterActions();
    initTableActions();
});

// 标签页切换功能
function initTabSwitching() {
    const navTabs = document.querySelectorAll('.nav-tab');
    const tabContents = document.querySelectorAll('.tab-content');
    
    navTabs.forEach(tab => {
        tab.addEventListener('click', function(e) {
            e.preventDefault();
            
            // 移除所有活动状态
            navTabs.forEach(t => t.classList.remove('active'));
            tabContents.forEach(content => content.classList.remove('active'));
            
            // 添加当前标签的活动状态
            this.classList.add('active');
            
            // 显示对应的内容
            const targetTab = this.getAttribute('data-tab');
            const targetContent = document.getElementById(targetTab);
            if (targetContent) {
                targetContent.classList.add('active');
            }
        });
    });
}

// 初始化图表
function initCharts() {
    // 预算趋势图表
    const budgetTrendCtx = document.getElementById('budgetTrendChart');
    if (budgetTrendCtx) {
        new Chart(budgetTrendCtx, {
            type: 'line',
            data: {
                labels: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
                datasets: [{
                    label: '预算总额',
                    data: [200000, 210000, 195000, 220000, 235000, 245000, 240000, 250000, 245000, 260000, 255000, 270000],
                    borderColor: '#3498db',
                    backgroundColor: 'rgba(52, 152, 219, 0.1)',
                    borderWidth: 3,
                    fill: true,
                    tension: 0.4
                }, {
                    label: '实际使用',
                    data: [180000, 195000, 185000, 205000, 220000, 230000, 235000, 240000, 238000, 245000, 250000, 255000],
                    borderColor: '#e74c3c',
                    backgroundColor: 'rgba(231, 76, 60, 0.1)',
                    borderWidth: 3,
                    fill: true,
                    tension: 0.4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'top',
                        labels: {
                            usePointStyle: true,
                            padding: 20
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        grid: {
                            color: 'rgba(0, 0, 0, 0.05)'
                        },
                        ticks: {
                            callback: function(value) {
                                return '¥' + (value / 1000) + 'K';
                            }
                        }
                    },
                    x: {
                        grid: {
                            color: 'rgba(0, 0, 0, 0.05)'
                        }
                    }
                },
                elements: {
                    point: {
                        radius: 6,
                        hoverRadius: 8
                    }
                }
            }
        });
    }
    
    // 部门预算分布饼图
    const departmentCtx = document.getElementById('departmentChart');
    if (departmentCtx) {
        new Chart(departmentCtx, {
            type: 'doughnut',
            data: {
                labels: ['技术部', '销售部', '市场部', '人事部', '财务部'],
                datasets: [{
                    data: [800000, 600000, 450000, 300000, 200000],
                    backgroundColor: [
                        '#3498db',
                        '#2ecc71',
                        '#f39c12',
                        '#e74c3c',
                        '#9b59b6'
                    ],
                    borderWidth: 0,
                    hoverBorderWidth: 3,
                    hoverBorderColor: '#fff'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: {
                            usePointStyle: true,
                            padding: 20,
                            generateLabels: function(chart) {
                                const data = chart.data;
                                if (data.labels.length && data.datasets.length) {
                                    return data.labels.map((label, i) => {
                                        const value = data.datasets[0].data[i];
                                        return {
                                            text: `${label}: ¥${(value / 10000).toFixed(1)}万`,
                                            fillStyle: data.datasets[0].backgroundColor[i],
                                            strokeStyle: data.datasets[0].backgroundColor[i],
                                            pointStyle: 'circle'
                                        };
                                    });
                                }
                                return [];
                            }
                        }
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                const label = context.label || '';
                                const value = context.parsed;
                                const total = context.dataset.data.reduce((a, b) => a + b, 0);
                                const percentage = ((value / total) * 100).toFixed(1);
                                return `${label}: ¥${(value / 10000).toFixed(1)}万 (${percentage}%)`;
                            }
                        }
                    }
                },
                cutout: '60%'
            }
        });
    }
}

// 筛选功能
function initFilterActions() {
    const applyFilterBtn = document.querySelector('.apply-filter-btn');
    if (applyFilterBtn) {
        applyFilterBtn.addEventListener('click', function() {
            // 添加加载状态
            const originalText = this.innerHTML;
            this.innerHTML = '<i class="fas fa-spinner fa-spin"></i> 应用中...';
            this.disabled = true;
            
            // 模拟筛选过程
            setTimeout(() => {
                this.innerHTML = originalText;
                this.disabled = false;
                
                // 显示成功提示
                showNotification('筛选条件已应用', 'success');
                
                // 这里可以添加实际的筛选逻辑
                updateTableData();
            }, 1500);
        });
    }
}

// 表格操作功能
function initTableActions() {
    // 导出按钮
    const exportBtn = document.querySelector('.table-actions .btn-secondary');
    if (exportBtn) {
        exportBtn.addEventListener('click', function() {
            showNotification('数据导出功能开发中...', 'info');
        });
    }
    
    // 新增按钮
    const addBtn = document.querySelector('.table-actions .btn-primary');
    if (addBtn) {
        addBtn.addEventListener('click', function() {
            showNotification('新增功能开发中...', 'info');
        });
    }
    
    // 表格行操作按钮
    document.addEventListener('click', function(e) {
        if (e.target.closest('.btn-icon')) {
            const btn = e.target.closest('.btn-icon');
            const icon = btn.querySelector('i');
            
            if (icon.classList.contains('fa-edit')) {
                showNotification('编辑功能开发中...', 'info');
            } else if (icon.classList.contains('fa-eye')) {
                showNotification('查看详情功能开发中...', 'info');
            }
        }
    });
}

// 更新表格数据（模拟）
function updateTableData() {
    const tableRows = document.querySelectorAll('.data-table tbody tr');
    
    tableRows.forEach(row => {
        // 添加更新动画
        row.style.opacity = '0.5';
        setTimeout(() => {
            row.style.opacity = '1';
        }, 300);
    });
}

// 显示通知
function showNotification(message, type = 'info') {
    // 创建通知元素
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas ${getNotificationIcon(type)}"></i>
            <span>${message}</span>
        </div>
        <button class="notification-close">
            <i class="fas fa-times"></i>
        </button>
    `;
    
    // 添加样式
    notification.style.cssText = `
        position: fixed;
        top: 80px;
        right: 20px;
        background: white;
        border-radius: 8px;
        box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
        border-left: 4px solid ${getNotificationColor(type)};
        padding: 16px;
        z-index: 10000;
        min-width: 300px;
        transform: translateX(100%);
        transition: transform 0.3s ease;
    `;
    
    // 添加到页面
    document.body.appendChild(notification);
    
    // 显示动画
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // 关闭按钮事件
    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.addEventListener('click', () => {
        closeNotification(notification);
    });
    
    // 自动关闭
    setTimeout(() => {
        closeNotification(notification);
    }, 4000);
}

// 关闭通知
function closeNotification(notification) {
    notification.style.transform = 'translateX(100%)';
    setTimeout(() => {
        if (notification.parentNode) {
            notification.parentNode.removeChild(notification);
        }
    }, 300);
}

// 获取通知图标
function getNotificationIcon(type) {
    const icons = {
        success: 'fa-check-circle',
        error: 'fa-exclamation-circle',
        warning: 'fa-exclamation-triangle',
        info: 'fa-info-circle'
    };
    return icons[type] || icons.info;
}

// 获取通知颜色
function getNotificationColor(type) {
    const colors = {
        success: '#2ecc71',
        error: '#e74c3c',
        warning: '#f39c12',
        info: '#3498db'
    };
    return colors[type] || colors.info;
}

// 图表控制按钮
document.addEventListener('click', function(e) {
    if (e.target.classList.contains('chart-btn')) {
        const buttons = e.target.parentNode.querySelectorAll('.chart-btn');
        buttons.forEach(btn => btn.classList.remove('active'));
        e.target.classList.add('active');
        
        // 这里可以添加切换图表数据的逻辑
        showNotification(`已切换到${e.target.textContent}视图`, 'success');
    }
});

// 添加通知样式到页面
const notificationStyles = document.createElement('style');
notificationStyles.textContent = `
    .notification {
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    }
    
    .notification-content {
        display: flex;
        align-items: center;
        gap: 12px;
        color: #2c3e50;
        font-weight: 500;
    }
    
    .notification-close {
        position: absolute;
        top: 8px;
        right: 8px;
        background: none;
        border: none;
        color: #7f8c8d;
        cursor: pointer;
        padding: 4px;
        border-radius: 4px;
        transition: all 0.3s ease;
    }
    
    .notification-close:hover {
        background: #ecf0f1;
        color: #2c3e50;
    }
    
    .notification-success {
        border-left-color: #2ecc71;
    }
    
    .notification-error {
        border-left-color: #e74c3c;
    }
    
    .notification-warning {
        border-left-color: #f39c12;
    }
    
    .notification-info {
        border-left-color: #3498db;
    }
`;
document.head.appendChild(notificationStyles);