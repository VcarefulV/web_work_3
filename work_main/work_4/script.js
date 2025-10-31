// DOM Elements
const startScreen = document.getElementById("start-screen");
const quizScreen = document.getElementById("quiz-screen");
const resultScreen = document.getElementById("result-screen");
const startButton = document.getElementById("start-btn");
const questionText = document.getElementById("question-text");
const answersContainer = document.getElementById("answers-container");
const currentQuestionSpan = document.getElementById("current-question");
const totalQuestionsSpan = document.getElementById("total-questions");
const scoreSpan = document.getElementById("score");
const finalScoreSpan = document.getElementById("final-score");
const maxScoreSpan = document.getElementById("max-score");
const resultMessage = document.getElementById("result-message");
const restartButton = document.getElementById("restart-btn");
const progressBar = document.getElementById("progress");

// 测验题目
const quizQuestions = [
    {
        question: "法国的首都是哪里？",
        answers: [
            { text: "伦敦", correct: false },
            { text: "柏林", correct: false },
            { text: "巴黎", correct: true },
            { text: "马德里", correct: false },
        ],
    },
    {
        question: "哪个行星被称为红色星球？",
        answers: [
            { text: "金星", correct: false },
            { text: "火星", correct: true },
            { text: "木星", correct: false },
            { text: "土星", correct: false },
        ],
    },
    {
        question: "地球上最大的海洋是哪个？",
        answers: [
            { text: "大西洋", correct: false },
            { text: "印度洋", correct: false },
            { text: "北冰洋", correct: false },
            { text: "太平洋", correct: true },
        ],
    },
    {
        question: "以下哪项不是编程语言？",
        answers: [
            { text: "Java", correct: false },
            { text: "Python", correct: false },
            { text: "香蕉", correct: true },
            { text: "JavaScript", correct: false },
        ],
    },
    {
        question: "金的化学符号是什么？",
        answers: [
            { text: "Go", correct: false },
            { text: "Gd", correct: false },
            { text: "Au", correct: true },
            { text: "Ag", correct: false },
        ],
    },
];

// 测验状态变量
let currentQuestionIndex = 0;
let score = 0;
let answersDisabled = false;

// 初始化
totalQuestionsSpan.textContent = quizQuestions.length;
maxScoreSpan.textContent = quizQuestions.length;

// 事件监听器
startButton.addEventListener("click", startQuiz);
restartButton.addEventListener("click", restartQuiz);

// 开始测验
function startQuiz() {
    // 重置变量
    currentQuestionIndex = 0;
    score = 0;
    scoreSpan.textContent = 0;
    
    // 切换屏幕
    startScreen.classList.remove("active");
    quizScreen.classList.add("active");
    
    // 显示第一个问题
    showQuestion();
}

// 显示问题
function showQuestion() {
    // 重置状态
    answersDisabled = false;
    
    // 获取当前问题
    const currentQuestion = quizQuestions[currentQuestionIndex];
    
    // 更新界面
    currentQuestionSpan.textContent = currentQuestionIndex + 1;
    
    // 更新进度条
    const progressPercent = ((currentQuestionIndex) / quizQuestions.length) * 100;
    progressBar.style.width = progressPercent + "%";
    
    // 显示问题
    questionText.textContent = currentQuestion.question;
    
    // 清空并创建答案按钮
    answersContainer.innerHTML = "";
    
    currentQuestion.answers.forEach((answer) => {
        const button = document.createElement("button");
        button.textContent = answer.text;
        button.classList.add("answer-btn");
        
        // 存储正确答案信息
        button.dataset.correct = answer.correct;
        
        // 添加点击事件
        button.addEventListener("click", selectAnswer);
        
        // 添加到容器
        answersContainer.appendChild(button);
    });
}

// 选择答案
function selectAnswer(event) {
    // 防止重复点击
    if (answersDisabled) return;
    answersDisabled = true;
    
    const selectedButton = event.target;
    const isCorrect = selectedButton.dataset.correct === "true";
    
    // 显示正确答案和错误答案
    Array.from(answersContainer.children).forEach((button) => {
        if (button.dataset.correct === "true") {
            button.classList.add("correct");
        } else if (button === selectedButton && !isCorrect) {
            button.classList.add("incorrect");
        }
    });
    
    // 更新分数
    if (isCorrect) {
        score++;
        scoreSpan.textContent = score;
    }
    
    // 延迟后进入下一题或显示结果
    setTimeout(() => {
        currentQuestionIndex++;
        
        if (currentQuestionIndex < quizQuestions.length) {
            showQuestion();
        } else {
            showResults();
        }
    }, 1000);
}

// 显示结果
function showResults() {
    // 切换屏幕
    quizScreen.classList.remove("active");
    resultScreen.classList.add("active");
    
    // 显示分数
    finalScoreSpan.textContent = score;
    
    // 计算百分比并显示评价
    const percentage = (score / quizQuestions.length) * 100;
    
    if (percentage === 100) {
        resultMessage.textContent = "完美！你是个天才！";
    } else if (percentage >= 80) {
        resultMessage.textContent = "太棒了！你知识渊博！";
    } else if (percentage >= 60) {
        resultMessage.textContent = "不错！继续努力！";
    } else if (percentage >= 40) {
        resultMessage.textContent = "还可以！再试一次提高成绩！";
    } else {
        resultMessage.textContent = "继续学习！你会进步的！";
    }
}

// 重新开始测验
function restartQuiz() {
    resultScreen.classList.remove("active");
    startQuiz();
}