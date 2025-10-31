// 待办事项应用
document.addEventListener('DOMContentLoaded', function() {
    // 获取DOM元素
    const taskInput = document.getElementById('taskInput');
    const addBtn = document.getElementById('addBtn');
    const taskList = document.getElementById('taskList');
    const taskCount = document.getElementById('taskCount');
    const clearCompletedBtn = document.getElementById('clearCompleted');
    const filterBtns = document.querySelectorAll('.filter-btn');
    const currentDateElement = document.getElementById('currentDate');
    
    // 设置当前日期
    function setCurrentDate() {
        const now = new Date();
        const options = { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric',
            weekday: 'long'
        };
        currentDateElement.textContent = now.toLocaleDateString('zh-CN', options);
    }
    
    // 当前过滤器
    let currentFilter = 'all';
    
    // 从本地存储加载任务
    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    
    // 初始化应用
    function initApp() {
        setCurrentDate();
        renderTasks();
        updateTaskCount();
        
        // 添加事件监听器
        addBtn.addEventListener('click', addTask);
        taskInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                addTask();
            }
        });
        
        clearCompletedBtn.addEventListener('click', clearCompletedTasks);
        
        filterBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                // 更新活动按钮
                filterBtns.forEach(b => b.classList.remove('active'));
                this.classList.add('active');
                
                // 更新过滤器并重新渲染
                currentFilter = this.dataset.filter;
                renderTasks();
            });
        });
    }
    
    // 添加新任务
    function addTask() {
        const text = taskInput.value.trim();
        
        if (text === '') {
            alert('请输入任务内容');
            return;
        }
        
        // 创建新任务对象
        const newTask = {
            id: Date.now(),
            text: text,
            completed: false,
            createdAt: new Date().toISOString()
        };
        
        // 添加到任务数组
        tasks.push(newTask);
        
        // 保存到本地存储
        saveTasks();
        
        // 清空输入框
        taskInput.value = '';
        
        // 重新渲染任务列表
        renderTasks();
        updateTaskCount();
    }
    
    // 删除任务
    function deleteTask(id) {
        tasks = tasks.filter(task => task.id !== id);
        saveTasks();
        renderTasks();
        updateTaskCount();
    }
    
    // 切换任务完成状态
    function toggleTask(id) {
        tasks = tasks.map(task => {
            if (task.id === id) {
                return { ...task, completed: !task.completed };
            }
            return task;
        });
        
        saveTasks();
        renderTasks();
        updateTaskCount();
    }
    
    // 清除已完成的任务
    function clearCompletedTasks() {
        tasks = tasks.filter(task => !task.completed);
        saveTasks();
        renderTasks();
        updateTaskCount();
    }
    
    // 保存任务到本地存储
    function saveTasks() {
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }
    
    // 渲染任务列表
    function renderTasks() {
        // 根据当前过滤器筛选任务
        let filteredTasks = tasks;
        
        if (currentFilter === 'active') {
            filteredTasks = tasks.filter(task => !task.completed);
        } else if (currentFilter === 'completed') {
            filteredTasks = tasks.filter(task => task.completed);
        }
        
        // 清空任务列表
        taskList.innerHTML = '';
        
        // 如果没有任务，显示空状态
        if (filteredTasks.length === 0) {
            const emptyState = document.createElement('div');
            emptyState.className = 'empty-state';
            emptyState.textContent = currentFilter === 'all' ? '暂无任务，添加一个吧！' : 
                                   currentFilter === 'active' ? '没有待完成的任务' : '没有已完成的任务';
            taskList.appendChild(emptyState);
            return;
        }
        
        // 渲染每个任务
        filteredTasks.forEach(task => {
            const taskItem = document.createElement('li');
            taskItem.className = `task-item ${task.completed ? 'completed' : ''}`;
            taskItem.dataset.id = task.id;
            
            taskItem.innerHTML = `
                <input type="checkbox" class="task-checkbox" ${task.completed ? 'checked' : ''}>
                <span class="task-text">${task.text}</span>
                <button class="delete-btn">×</button>
            `;
            
            // 添加事件监听器
            const checkbox = taskItem.querySelector('.task-checkbox');
            const deleteBtn = taskItem.querySelector('.delete-btn');
            
            checkbox.addEventListener('change', () => toggleTask(task.id));
            deleteBtn.addEventListener('click', () => deleteTask(task.id));
            
            taskList.appendChild(taskItem);
        });
    }
    
    // 更新任务计数
    function updateTaskCount() {
        const totalTasks = tasks.length;
        const completedTasks = tasks.filter(task => task.completed).length;
        const remainingTasks = totalTasks - completedTasks;
        
        taskCount.textContent = `${remainingTasks} 个待完成，${completedTasks} 个已完成`;
    }
    
    // 初始化应用
    initApp();
});