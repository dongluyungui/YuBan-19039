// 获取当前日期
const currentDate = new Date();

// 获取年、月、日
const year = currentDate.getFullYear();
// 月份从 0 开始，所以要加 1，并且保证是两位数
const month = String(currentDate.getMonth() + 1).padStart(2, '0');
const day = String(currentDate.getDate()).padStart(2, '0');

// 生成 “YYYY.MM.DD” 格式的日期
const formattedDateDot = `${year}.${month}.${day}`;

// 生成 “YYYY-MM-DD” 格式的日期
const formattedDateDash = `${year}-${month}-${day}`;

// 将格式化后的日期输出到 HTML 页面
function displayDates() {
    const dateDotElement = document.getElementById('date-dot');
    const dateDashElement = document.getElementById('date-dash');

    if (dateDotElement) {
        dateDotElement.textContent = formattedDateDot;
    }

    if (dateDashElement) {
        dateDashElement.textContent = formattedDateDash;
    }
}

// 当页面加载完成后调用 displayDates 函数
window.onload = displayDates;