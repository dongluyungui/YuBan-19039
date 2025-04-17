/*本站已运行
<p id="running-time">加载中...</p>
引用不同当前日期就用id
    <p>日期格式（YYYY.MM.DD）: <span id="date-dot"></span></p>
    <p>日期格式（YYYY-MM-DD）: <span id="date-dash"></span></p>
*/
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


// 建站时间
const created_at = new Date("2025-02-02T06:59:41Z");

function updateRunningTime() {
  const now = new Date();
  const diff = now - created_at;

  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const years = Math.floor(days / 365);

  const remainingDays = days % 365;
  const remainingHours = hours % 24;
  const remainingMinutes = minutes % 60;
  const remainingSeconds = seconds % 60;

  let timeString;
  if (years >= 1) {
    timeString = `${years}年${remainingDays}天${remainingHours}时${remainingMinutes}分${remainingSeconds}秒`;
  } else {
    timeString = `${remainingDays}天${remainingHours}时${remainingMinutes}分${remainingSeconds}秒`;
  }

  document.getElementById('running-time').textContent = `本站已运行：${timeString}`;
}

// 初始更新
updateRunningTime();
// 每秒更新一次
setInterval(updateRunningTime, 1000);