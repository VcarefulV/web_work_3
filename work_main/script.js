// script.js
document.addEventListener('DOMContentLoaded', function() {
    const cards = document.querySelectorAll('.page-card');
    
    cards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });
    
    // 添加页面加载动画
    const grid = document.querySelector('.pages-grid');
    grid.style.opacity = '0';
    grid.style.transform = 'translateY(20px)';
    
    setTimeout(() => {
        grid.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        grid.style.opacity = '1';
        grid.style.transform = 'translateY(0)';
    }, 300);
    
    // 添加卡片点击效果
    cards.forEach(card => {
        card.addEventListener('click', function() {
            const button = this.querySelector('.card-button');
            if (button) {
                button.style.transform = 'scale(0.95)';
                setTimeout(() => {
                    button.style.transform = '';
                }, 150);
            }
        });
    });
});