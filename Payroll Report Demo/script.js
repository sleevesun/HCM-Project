// 报表数据结构定义
const reportData = {
    // 模拟部门数据
    departments: [
        '技术部', '产品部', '市场部', '销售部', '人事部', '财务部', '运营部', '客服部',
        '法务部', '行政部', '研发一部', '研发二部', '测试部', '设计部', '商务部'
    ],
    
    // 表头结构定义
    headerStructure: {
        '部门': { level: 1, children: null, key: 'dept' },
        '发薪人数': {
            level: 1,
            key: 'payroll_count',
            children: {
                '加班人数': { level: 2, key: 'overtime_count' },
                '劳动补偿金支付人数': { level: 2, key: 'compensation_count' }
            }
        },
        '工薪成本': {
            level: 1,
            key: 'salary_cost',
            children: {
                '应发工资': {
                    level: 2,
                    key: 'gross_salary',
                    children: {
                        '本月调薪额度': { level: 3, key: 'salary_adjustment' }
                    }
                },
                '五险一金司付': {
                    level: 2,
                    key: 'insurance_fund',
                    children: {
                        '社会保险': { level: 3, key: 'social_insurance' },
                        '住房公积金': { level: 3, key: 'housing_fund' }
                    }
                },
                '其他工薪科目': {
                    level: 2,
                    key: 'other_salary',
                    children: {
                        '离职补偿金': { level: 3, key: 'severance_pay' },
                        '加班费': { level: 3, key: 'overtime_pay' },
                        '签约金': { level: 3, key: 'signing_bonus' }
                    }
                }
            }
        },
        '奖金': { level: 1, children: null, key: 'bonus' }
    }
};

// 全局状态管理
const state = {
    expandedGroups: new Set(),
    comparisonMode: false,
    currentData: null,
    lastMonthData: null
};

// 生成模拟数据
function generateMockData() {
    const data = {};
    const lastMonthData = {};
    
    reportData.departments.forEach(dept => {
        data[dept] = {
            payroll_count: Math.floor(Math.random() * 100) + 50,
            overtime_count: Math.floor(Math.random() * 30) + 10,
            compensation_count: Math.floor(Math.random() * 5),
            salary_cost: Math.floor(Math.random() * 500000) + 200000,
            gross_salary: Math.floor(Math.random() * 300000) + 150000,
            salary_adjustment: Math.floor(Math.random() * 20000),
            insurance_fund: Math.floor(Math.random() * 100000) + 50000,
            social_insurance: Math.floor(Math.random() * 60000) + 30000,
            housing_fund: Math.floor(Math.random() * 40000) + 20000,
            other_salary: Math.floor(Math.random() * 100000) + 30000,
            severance_pay: Math.floor(Math.random() * 50000),
            overtime_pay: Math.floor(Math.random() * 30000) + 10000,
            signing_bonus: Math.floor(Math.random() * 20000),
            bonus: Math.floor(Math.random() * 80000) + 20000
        };
        
        // 生成上月数据（略有差异）
        lastMonthData[dept] = {};
        Object.keys(data[dept]).forEach(key => {
            const variance = (Math.random() - 0.5) * 0.2; // ±10%的变化
            lastMonthData[dept][key] = Math.floor(data[dept][key] * (1 + variance));
        });
    });
    
    state.currentData = data;
    state.lastMonthData = lastMonthData;
}

// 计算合计值
function calculateTotals(data, key) {
    return Object.values(data).reduce((sum, dept) => sum + (dept[key] || 0), 0);
}

// 计算分组合计
function calculateGroupTotal(data, groupKey, structure) {
    if (!structure.children) {
        return calculateTotals(data, groupKey);
    }
    
    let total = 0;
    Object.values(structure.children).forEach(child => {
        total += calculateGroupTotal(data, child.key, child);
    });
    return total;
}

// 生成表头HTML
function generateTableHeader() {
    const header = document.getElementById('tableHeader');
    header.innerHTML = '';
    
    // 创建多级表头
    const level1Row = document.createElement('tr');
    const level2Row = document.createElement('tr');
    const level3Row = document.createElement('tr');
    
    // 部门列（跨3行）
    const deptHeader = document.createElement('th');
    deptHeader.textContent = '部门';
    deptHeader.rowSpan = 3;
    deptHeader.className = 'dept-col level-1-header';
    level1Row.appendChild(deptHeader);
    
    // 遍历表头结构生成列
    Object.entries(reportData.headerStructure).forEach(([name, config]) => {
        if (name === '部门') return;
        
        generateHeaderColumn(level1Row, level2Row, level3Row, name, config);
    });
    
    header.appendChild(level1Row);
    header.appendChild(level2Row);
    header.appendChild(level3Row);
}

// 生成单个表头列
function generateHeaderColumn(level1Row, level2Row, level3Row, name, config) {
    const isExpanded = state.expandedGroups.has(config.key);
    
    if (config.level === 1) {
        const th = document.createElement('th');
        th.className = 'level-1-header';
        
        if (config.children) {
            // 有子列的情况
            const expandBtn = document.createElement('button');
            expandBtn.className = 'expand-btn';
            expandBtn.textContent = isExpanded ? '−' : '+';
            expandBtn.onclick = () => toggleGroup(config.key);
            th.appendChild(expandBtn);
            
            const span = document.createElement('span');
            span.textContent = name;
            th.appendChild(span);
            
            if (isExpanded) {
                // 展开状态：计算子列数量 + 1（包含一级汇总列）
                const childCount = countVisibleChildren(config) + 1;
                th.colSpan = childCount;
                th.rowSpan = 1;
            } else {
                // 折叠状态：只占1列
                th.colSpan = 1;
                th.rowSpan = 3;
            }
        } else {
            // 无子列的情况
            th.textContent = name;
            th.rowSpan = 3;
        }
        
        level1Row.appendChild(th);
        
        // 如果展开且有子列，生成二级表头
        if (isExpanded && config.children) {
            // 添加一级汇总列表头
            const summaryTh = document.createElement('th');
            summaryTh.className = 'level-2-header';
            summaryTh.textContent = name;
            summaryTh.rowSpan = 2;
            level2Row.appendChild(summaryTh);
            
            Object.entries(config.children).forEach(([childName, childConfig]) => {
                generateLevel2Header(level2Row, level3Row, childName, childConfig, config.key);
            });
        }
        
        // 添加同期对比列
        if (state.comparisonMode && (config.key === 'payroll_count' || config.key === 'salary_cost')) {
            addComparisonHeaders(level1Row, level2Row, level3Row, name, config, isExpanded);
        }
    }
}

// 生成二级表头
function generateLevel2Header(level2Row, level3Row, name, config, parentKey) {
    const isExpanded = state.expandedGroups.has(config.key);
    
    const th = document.createElement('th');
    th.className = 'level-2-header';
    
    if (config.children) {
        const expandBtn = document.createElement('button');
        expandBtn.className = 'expand-btn';
        expandBtn.textContent = isExpanded ? '−' : '+';
        expandBtn.onclick = () => toggleGroup(config.key);
        th.appendChild(expandBtn);
        
        const span = document.createElement('span');
        span.textContent = name;
        th.appendChild(span);
        
        if (isExpanded) {
            th.colSpan = Object.keys(config.children).length + 1; // +1 for summary column
        } else {
            th.colSpan = 1;
            th.rowSpan = 2;
        }
    } else {
        th.textContent = name;
        th.rowSpan = 2;
    }
    
    level2Row.appendChild(th);
    
    // 如果展开且有子列，生成三级表头
    if (isExpanded && config.children) {
        Object.entries(config.children).forEach(([childName, childConfig]) => {
            const childTh = document.createElement('th');
            childTh.className = 'level-3-header';
            childTh.textContent = childName;
            level3Row.appendChild(childTh);
        });
    }
}

// 添加同期对比表头
function addComparisonHeaders(level1Row, level2Row, level3Row, name, config, isExpanded) {
    // 上月数据列
    const lastMonthTh = document.createElement('th');
    lastMonthTh.className = 'level-1-header comparison-col';
    lastMonthTh.textContent = `${name}(上月)`;
    lastMonthTh.rowSpan = 3;
    level1Row.appendChild(lastMonthTh);
    
    // 环比变化列
    const changeTh = document.createElement('th');
    changeTh.className = 'level-1-header comparison-col';
    changeTh.textContent = `${name}(环比)`;
    changeTh.rowSpan = 3;
    level1Row.appendChild(changeTh);
}

// 计算可见子列数量
function countVisibleChildren(config) {
    if (!config.children) return 1;
    
    let count = 0;
    Object.values(config.children).forEach(child => {
        if (state.expandedGroups.has(child.key)) {
            count += countVisibleChildren(child);
        } else {
            count += 1;
        }
    });
    return count;
}

// 生成表格数据
function generateTableBody() {
    const tbody = document.getElementById('tableBody');
    tbody.innerHTML = '';
    
    // 生成部门数据行
    reportData.departments.forEach(dept => {
        const row = document.createElement('tr');
        
        // 部门名称列
        const deptCell = document.createElement('td');
        deptCell.className = 'dept-col';
        deptCell.textContent = dept;
        row.appendChild(deptCell);
        
        // 数据列
        Object.entries(reportData.headerStructure).forEach(([name, config]) => {
            if (name === '部门') return;
            generateDataCells(row, dept, config);
        });
        
        tbody.appendChild(row);
    });
    
    // 生成总计行
    generateTotalRow(tbody);
}

// 生成数据单元格
function generateDataCells(row, dept, config) {
    const isExpanded = state.expandedGroups.has(config.key);
    
    if (!isExpanded) {
        // 折叠状态：显示合计值
        const cell = document.createElement('td');
        const value = config.children ? 
            calculateGroupTotal(state.currentData, config.key, config) :
            state.currentData[dept][config.key];
        cell.textContent = formatNumber(value);
        row.appendChild(cell);
    } else if (config.children) {
        // 展开状态：先添加一级汇总数据，再显示子列
        const summaryCell = document.createElement('td');
        const summaryValue = calculateGroupTotal(state.currentData, config.key, config);
        summaryCell.textContent = formatNumber(summaryValue);
        summaryCell.style.backgroundColor = '#e8f4ff';
        summaryCell.style.fontWeight = '600';
        row.appendChild(summaryCell);
        
        Object.values(config.children).forEach(childConfig => {
            generateDataCells(row, dept, childConfig);
        });
    } else {
        // 叶子节点：显示实际数据
        const cell = document.createElement('td');
        cell.textContent = formatNumber(state.currentData[dept][config.key]);
        row.appendChild(cell);
    }
    
    // 添加同期对比数据
    if (state.comparisonMode && (config.key === 'payroll_count' || config.key === 'salary_cost')) {
        addComparisonCells(row, dept, config);
    }
}

// 添加同期对比单元格
function addComparisonCells(row, dept, config) {
    const currentValue = config.children ? 
        calculateGroupTotal(state.currentData, config.key, config) :
        state.currentData[dept][config.key];
    
    const lastMonthValue = config.children ? 
        calculateGroupTotal(state.lastMonthData, config.key, config) :
        state.lastMonthData[dept][config.key];
    
    // 上月数据
    const lastMonthCell = document.createElement('td');
    lastMonthCell.className = 'comparison-col';
    lastMonthCell.textContent = formatNumber(lastMonthValue);
    row.appendChild(lastMonthCell);
    
    // 环比变化
    const changeCell = document.createElement('td');
    changeCell.className = 'comparison-col';
    const change = currentValue - lastMonthValue;
    const changePercent = lastMonthValue !== 0 ? (change / lastMonthValue * 100).toFixed(1) : 0;
    
    if (change > 0) {
        changeCell.className += ' increase arrow-up';
        changeCell.textContent = `+${formatNumber(change)} (+${changePercent}%)`;
    } else if (change < 0) {
        changeCell.className += ' decrease arrow-down';
        changeCell.textContent = `${formatNumber(change)} (${changePercent}%)`;
    } else {
        changeCell.textContent = '0 (0%)';
    }
    
    row.appendChild(changeCell);
}

// 生成总计行
function generateTotalRow(tbody) {
    const totalRow = document.createElement('tr');
    totalRow.className = 'total-row';
    
    // 部门列
    const deptCell = document.createElement('td');
    deptCell.className = 'dept-col';
    deptCell.textContent = '总计';
    totalRow.appendChild(deptCell);
    
    // 数据列
    Object.entries(reportData.headerStructure).forEach(([name, config]) => {
        if (name === '部门') return;
        generateTotalCells(totalRow, config);
    });
    
    tbody.appendChild(totalRow);
}

// 生成总计单元格
function generateTotalCells(row, config) {
    const isExpanded = state.expandedGroups.has(config.key);
    
    if (!isExpanded) {
        const cell = document.createElement('td');
        const total = config.children ? 
            calculateGroupTotal(state.currentData, config.key, config) :
            calculateTotals(state.currentData, config.key);
        cell.textContent = formatNumber(total);
        row.appendChild(cell);
    } else if (config.children) {
        // 展开状态：先添加一级汇总总计，再显示子列总计
        const summaryCell = document.createElement('td');
        const summaryTotal = calculateGroupTotal(state.currentData, config.key, config);
        summaryCell.textContent = formatNumber(summaryTotal);
        summaryCell.style.backgroundColor = '#e8f4ff';
        summaryCell.style.fontWeight = '600';
        row.appendChild(summaryCell);
        
        Object.values(config.children).forEach(childConfig => {
            generateTotalCells(row, childConfig);
        });
    } else {
        const cell = document.createElement('td');
        cell.textContent = formatNumber(calculateTotals(state.currentData, config.key));
        row.appendChild(cell);
    }
    
    // 添加同期对比总计
    if (state.comparisonMode && (config.key === 'payroll_count' || config.key === 'salary_cost')) {
        addComparisonTotalCells(row, config);
    }
}

// 添加同期对比总计单元格
function addComparisonTotalCells(row, config) {
    const currentTotal = config.children ? 
        calculateGroupTotal(state.currentData, config.key, config) :
        calculateTotals(state.currentData, config.key);
    
    const lastMonthTotal = config.children ? 
        calculateGroupTotal(state.lastMonthData, config.key, config) :
        calculateTotals(state.lastMonthData, config.key);
    
    // 上月总计
    const lastMonthCell = document.createElement('td');
    lastMonthCell.className = 'comparison-col';
    lastMonthCell.textContent = formatNumber(lastMonthTotal);
    row.appendChild(lastMonthCell);
    
    // 环比变化总计
    const changeCell = document.createElement('td');
    changeCell.className = 'comparison-col';
    const change = currentTotal - lastMonthTotal;
    const changePercent = lastMonthTotal !== 0 ? (change / lastMonthTotal * 100).toFixed(1) : 0;
    
    if (change > 0) {
        changeCell.className += ' increase arrow-up';
        changeCell.textContent = `+${formatNumber(change)} (+${changePercent}%)`;
    } else if (change < 0) {
        changeCell.className += ' decrease arrow-down';
        changeCell.textContent = `${formatNumber(change)} (${changePercent}%)`;
    } else {
        changeCell.textContent = '0 (0%)';
    }
    
    row.appendChild(changeCell);
}

// 数字格式化
function formatNumber(num) {
    if (num === undefined || num === null) return '0';
    return num.toLocaleString('zh-CN');
}

// 切换分组展开/收起
function toggleGroup(groupKey) {
    if (state.expandedGroups.has(groupKey)) {
        state.expandedGroups.delete(groupKey);
    } else {
        state.expandedGroups.add(groupKey);
    }
    renderTable();
}

// 全部展开
function expandAll() {
    function addAllKeys(structure) {
        Object.values(structure).forEach(config => {
            if (config.children) {
                state.expandedGroups.add(config.key);
                addAllKeys(config.children);
            }
        });
    }
    addAllKeys(reportData.headerStructure);
    renderTable();
}

// 全部收起
function collapseAll() {
    state.expandedGroups.clear();
    renderTable();
}

// 切换同期对比模式
function toggleComparison() {
    state.comparisonMode = !state.comparisonMode;
    const btn = document.getElementById('comparisonBtn');
    btn.textContent = state.comparisonMode ? '隐藏同期对比' : '显示同期对比';
    renderTable();
}

// 渲染表格
function renderTable() {
    generateTableHeader();
    generateTableBody();
}

// 初始化
function init() {
    generateMockData();
    renderTable();
    
    // 绑定事件
    document.getElementById('expandAllBtn').onclick = expandAll;
    document.getElementById('collapseAllBtn').onclick = collapseAll;
    document.getElementById('comparisonBtn').onclick = toggleComparison;
}

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', init);