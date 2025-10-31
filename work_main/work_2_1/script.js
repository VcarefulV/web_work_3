// 获取DOM元素
const passwordInput = document.getElementById("password");
const lengthSlider = document.getElementById("length");
const lengthDisplay = document.getElementById("length-value");
const uppercaseCheckbox = document.getElementById("uppercase");
const lowercaseCheckbox = document.getElementById("lowercase");
const numbersCheckbox = document.getElementById("numbers");
const symbolsCheckbox = document.getElementById("symbols");
const generateButton = document.getElementById("generate-btn");
const copyButton = document.getElementById("copy-btn");
const strengthText = document.getElementById("strength-text");

// 定义字符集
const uppercaseLetters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const lowercaseLetters = "abcdefghijklmnopqrstuvwxyz";
const numberCharacters = "0123456789";
const symbolCharacters = "!@#$%^&*()-_=+[]{}|;:,.<>?/";

// 监听滑块变化
lengthSlider.addEventListener("input", () => {
    lengthDisplay.textContent = lengthSlider.value;
});

// 生成密码按钮事件
generateButton.addEventListener("click", makePassword);

// 复制按钮事件
copyButton.addEventListener("click", () => {
    if (!passwordInput.value) {
        alert("Please generate a password first!");
        return;
    }

    navigator.clipboard
        .writeText(passwordInput.value)
        .then(() => showCopySuccess())
        .catch((error) => {
            console.log("Could not copy:", error);
            // 降级方案：使用传统复制方法
            fallbackCopyToClipboard(passwordInput.value);
        });
});

// 传统复制方法作为降级方案
function fallbackCopyToClipboard(text) {
    const textArea = document.createElement("textarea");
    textArea.value = text;
    textArea.style.position = "fixed";
    textArea.style.opacity = "0";
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    
    try {
        const successful = document.execCommand('copy');
        if (successful) {
            showCopySuccess();
        } else {
            alert("Failed to copy password. Please select and copy manually.");
        }
    } catch (err) {
        alert("Failed to copy password. Please select and copy manually.");
    }
    
    document.body.removeChild(textArea);
}

// 页面加载时生成初始密码
window.addEventListener("DOMContentLoaded", makePassword);

// 生成密码函数
function makePassword() {
    const length = Number(lengthSlider.value);
    const includeUppercase = uppercaseCheckbox.checked;
    const includeLowercase = lowercaseCheckbox.checked;
    const includeNumbers = numbersCheckbox.checked;
    const includeSymbols = symbolsCheckbox.checked;

    // 验证至少选择一种字符类型
    if (!includeUppercase && !includeLowercase && !includeNumbers && !includeSymbols) {
        alert("Please select at least one character type.");
        return;
    }

    // 生成密码
    const newPassword = createRandomPassword(
        length,
        includeUppercase,
        includeLowercase,
        includeNumbers,
        includeSymbols
    );
    
    passwordInput.value = newPassword;
    
    // 更新密码强度指示器
    updateStrengthMeter(newPassword);
}

// 创建随机密码
function createRandomPassword(
    length,
    includeUppercase,
    includeLowercase,
    includeNumbers,
    includeSymbols
) {
    let allCharacters = "";

    if (includeUppercase) allCharacters += uppercaseLetters;
    if (includeLowercase) allCharacters += lowercaseLetters;
    if (includeNumbers) allCharacters += numberCharacters;
    if (includeSymbols) allCharacters += symbolCharacters;

    let password = "";

    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * allCharacters.length);
        password += allCharacters[randomIndex];
    }
    
    return password;
}

// 更新密码强度指示器
function updateStrengthMeter(password) {
    const passwordLength = password.length;
    
    const hasUppercase = /[A-Z]/.test(password);
    const hasLowercase = /[a-z]/.test(password);
    const hasNumbers = /[0-9]/.test(password);
    const hasSymbols = /[!@#$%^&*()-_=+[\]{}|;:,.<>?]/.test(password);

    let strengthScore = 0;
    
    // 长度评分
    strengthScore += Math.min(passwordLength * 2, 40);

    // 字符类型评分
    if (hasUppercase) strengthScore += 15;
    if (hasLowercase) strengthScore += 15;
    if (hasNumbers) strengthScore += 15;
    if (hasSymbols) strengthScore += 15;

    // 对过短密码强制限制最高分
    if (passwordLength < 8) {
        strengthScore = Math.min(strengthScore, 40);
    }

    let strengthLabelText = "";
    let textColor = "";

    if (strengthScore < 40) {
        // 弱密码
        textColor = "#ef4444";
        strengthLabelText = "Weak";
    } else if (strengthScore < 70) {
        // 中等密码
        textColor = "#f59e0b";
        strengthLabelText = "Medium";
    } else {
        // 强密码
        textColor = "#10b981";
        strengthLabelText = "Strong";
    }

    strengthText.textContent = strengthLabelText;
    strengthText.style.color = textColor;
}

// 显示复制成功反馈 - 修复图标切换问题
function showCopySuccess() {
    const icon = copyButton.querySelector('i');
    
    // 保存原始类名
    const originalClasses = icon.className;
    
    // 切换到对勾图标
    icon.className = 'fas fa-check';
    copyButton.style.background = 'linear-gradient(135deg, #10b981, #34d399)';
    copyButton.style.boxShadow = '0 4px 12px rgba(16, 185, 129, 0.3)';
    
    // 2秒后恢复原始状态
    setTimeout(() => {
        icon.className = originalClasses;
        copyButton.style.background = 'linear-gradient(135deg, var(--primary), var(--primary-light))';
        copyButton.style.boxShadow = '0 4px 12px rgba(58, 134, 255, 0.3)';
    }, 2000);
}

// 添加键盘快捷键支持
document.addEventListener('keydown', (e) => {
    // Ctrl+C 或 Cmd+C 复制密码
    if ((e.ctrlKey || e.metaKey) && e.key === 'c' && document.activeElement === passwordInput) {
        e.preventDefault();
        copyButton.click();
    }
    
    // Enter 键生成新密码
    if (e.key === 'Enter' && document.activeElement !== passwordInput) {
        generateButton.click();
    }
});

// 添加输入验证
passwordInput.addEventListener('input', (e) => {
    // 防止用户手动修改密码
    e.target.value = passwordInput.value;
});

// 添加触摸设备支持
copyButton.addEventListener('touchstart', (e) => {
    e.preventDefault();
    copyButton.style.transform = 'scale(0.95)';
});

copyButton.addEventListener('touchend', (e) => {
    e.preventDefault();
    copyButton.style.transform = '';
    copyButton.click();
});