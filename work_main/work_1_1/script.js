document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('registerForm');
    const usernameInput = document.getElementById('username');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const confirmPasswordInput = document.getElementById('confirmPassword');
    const termsCheckbox = document.getElementById('agreeTerms');
    
    const usernameError = document.getElementById('usernameError');
    const emailError = document.getElementById('emailError');
    const passwordError = document.getElementById('passwordError');
    const confirmPasswordError = document.getElementById('confirmPasswordError');
    const termsError = document.getElementById('termsError');
    const passwordStrength = document.getElementById('passwordStrength');
    
    // 用户名验证
    usernameInput.addEventListener('input', function() {
        const username = usernameInput.value.trim();
        const usernameRegex = /^[a-zA-Z0-9_]{3,16}$/;
        
        if (username === '') {
            hideError(usernameError);
        } else if (!usernameRegex.test(username)) {
            showError(usernameError, '用户名必须为3-16个字符，只能包含字母、数字和下划线');
        } else {
            showSuccess(usernameError, '用户名可用');
        }
    });
    
    // 邮箱验证
    emailInput.addEventListener('input', function() {
        const email = emailInput.value.trim();
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        
        if (email === '') {
            hideError(emailError);
        } else if (!emailRegex.test(email)) {
            showError(emailError, '请输入有效的电子邮箱地址');
        } else {
            showSuccess(emailError, '邮箱格式正确');
        }
    });
    
    // 密码验证和强度检测
    passwordInput.addEventListener('input', function() {
        const password = passwordInput.value;
        
        // 密码验证
        const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*#?&]{8,}$/;
        
        if (password === '') {
            hideError(passwordError);
            passwordStrength.className = 'password-strength';
        } else if (!passwordRegex.test(password)) {
            showError(passwordError, '密码必须至少8个字符，包含字母和数字');
            passwordStrength.className = 'password-strength strength-weak';
        } else {
            hideError(passwordError);
            
            // 密码强度检测
            let strength = 0;
            if (password.length >= 8) strength++;
            if (password.match(/[a-z]/) && password.match(/[A-Z]/)) strength++;
            if (password.match(/\d/)) strength++;
            if (password.match(/[^a-zA-Z\d]/)) strength++;
            
            if (strength < 2) {
                passwordStrength.className = 'password-strength strength-weak';
            } else if (strength < 4) {
                passwordStrength.className = 'password-strength strength-medium';
            } else {
                passwordStrength.className = 'password-strength strength-strong';
            }
        }
        
        // 确认密码验证
        validateConfirmPassword();
    });
    
    // 确认密码验证
    confirmPasswordInput.addEventListener('input', validateConfirmPassword);
    
    function validateConfirmPassword() {
        const password = passwordInput.value;
        const confirmPassword = confirmPasswordInput.value;
        
        if (confirmPassword === '') {
            hideError(confirmPasswordError);
        } else if (password !== confirmPassword) {
            showError(confirmPasswordError, '两次输入的密码不一致');
        } else {
            showSuccess(confirmPasswordError, '密码匹配');
        }
    }
    
    // 表单提交
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // 验证所有字段
        const isUsernameValid = validateUsername();
        const isEmailValid = validateEmail();
        const isPasswordValid = validatePassword();
        const isConfirmPasswordValid = validateConfirmPasswordFinal();
        const isTermsAccepted = validateTerms();
        
        if (isUsernameValid && isEmailValid && isPasswordValid && isConfirmPasswordValid && isTermsAccepted) {
            // 表单提交成功
            alert('注册成功！');
            form.reset();
            passwordStrength.className = 'password-strength';
            
            // 在实际应用中，这里会发送数据到服务器
            console.log('表单数据:', {
                username: usernameInput.value,
                email: emailInput.value,
                password: passwordInput.value
            });
        }
    });
    
    // 最终验证函数
    function validateUsername() {
        const username = usernameInput.value.trim();
        const usernameRegex = /^[a-zA-Z0-9_]{3,16}$/;
        
        if (username === '') {
            showError(usernameError, '用户名不能为空');
            return false;
        } else if (!usernameRegex.test(username)) {
            showError(usernameError, '用户名必须为3-16个字符，只能包含字母、数字和下划线');
            return false;
        } else {
            hideError(usernameError);
            return true;
        }
    }
    
    function validateEmail() {
        const email = emailInput.value.trim();
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        
        if (email === '') {
            showError(emailError, '邮箱不能为空');
            return false;
        } else if (!emailRegex.test(email)) {
            showError(emailError, '请输入有效的电子邮箱地址');
            return false;
        } else {
            hideError(emailError);
            return true;
        }
    }
    
    function validatePassword() {
        const password = passwordInput.value;
        const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*#?&]{8,}$/;
        
        if (password === '') {
            showError(passwordError, '密码不能为空');
            return false;
        } else if (!passwordRegex.test(password)) {
            showError(passwordError, '密码必须至少8个字符，包含字母和数字');
            return false;
        } else {
            hideError(passwordError);
            return true;
        }
    }
    
    function validateConfirmPasswordFinal() {
        const password = passwordInput.value;
        const confirmPassword = confirmPasswordInput.value;
        
        if (confirmPassword === '') {
            showError(confirmPasswordError, '请确认密码');
            return false;
        } else if (password !== confirmPassword) {
            showError(confirmPasswordError, '两次输入的密码不一致');
            return false;
        } else {
            hideError(confirmPasswordError);
            return true;
        }
    }
    
    function validateTerms() {
        if (!termsCheckbox.checked) {
            showError(termsError, '请同意服务条款和隐私政策');
            return false;
        } else {
            hideError(termsError);
            return true;
        }
    }
    
    // 显示错误消息
    function showError(element, message) {
        element.textContent = message;
        element.style.display = 'block';
        element.className = 'error';
    }
    
    // 显示成功消息
    function showSuccess(element, message) {
        element.textContent = message;
        element.style.display = 'block';
        element.className = 'success';
    }
    
    // 隐藏消息
    function hideError(element) {
        element.style.display = 'none';
    }
});