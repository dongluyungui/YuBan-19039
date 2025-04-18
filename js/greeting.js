/* 问候语开始
<div id="greetingBox"></div>
问候语显示容器

js来源
https://ciyuani.com/index.php/2024/02/16/
*/
  
  (() => {
    const greetings = [{
        "greeting": "晚安😴",
        "start_time": 0,
        "end_time": 5
      },
      {
        "greeting": "早上好鸭👋, 祝你一天好心情！",
        "start_time": 6,
        "end_time": 9
      },
      {
        "greeting": "上午好👋, 状态很好，鼓励一下～",
        "start_time": 10,
        "end_time": 10
      },
      {
        "greeting": "11点多啦, 在坚持一下就吃饭啦～",
        "start_time": 11,
        "end_time": 11
      },
      {
        "greeting": "午安👋, 宝贝",
        "start_time": 12,
        "end_time": 14
      },
      {
        "greeting": "🌈充实的一天辛苦啦！",
        "start_time": 14,
        "end_time": 18
      },
      {
        "greeting": "19点喽, 奖励一顿丰盛的大餐吧🍔。",
        "start_time": 19,
        "end_time": 19
      },
      {
        "greeting": "晚上好👋, 在属于自己的时间好好放松😌~",
        "start_time": 20,
        "end_time": 24
      }
    ];
 
    // 获取当前时间
    const currentHour = (new Date).getHours();
 
    // 根据当前时间获取相应的问候语
    let chosenGreeting = "晚上好👋";
    for (let i = 0; i < greetings.length; i++) {
      if (currentHour >= greetings[i].start_time && currentHour <= greetings[i].end_time) {
        chosenGreeting = greetings[i].greeting;
        break;
      }
    }
 
    // 创建问候语元素
    const greetingElement = document.createElement("div");
    greetingElement.id = "greeting";
 
    // 设置问候语文本内容
    greetingElement.innerHTML = chosenGreeting;
 
    // 将问候语元素添加到容器中
    const greetingBox = document.querySelector("#greetingBox");
    greetingBox.appendChild(greetingElement);
 
    // 显示问候语
    setTimeout(() => {
      greetingElement.classList.add("shown");
    }, 1000);
 
    // 隐藏问候语
    setTimeout(() => {
      greetingElement.classList.remove("shown");
      setTimeout(() => {
        greetingBox.remove();
      }, 500);
    }, 3000);
  })();