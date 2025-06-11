  // 角色数据
const characters = [
  {
    name: "御坂19039",
    id: "御坂19039",
    birthday: "5月01日",
    debutDate: "2024年5月31日",
    liveType: "聊天互动 | 游戏实况 | 才艺展示",
    liveTime: "不定期直播哦~时间变动会发动态嘟",
    tag: "你已经上贼船了，你逃不脱了桀桀桀！",
    avatar: "img/face/face.jpg",
    description: "账号主角色，负责日常直播，以活泼开朗的性格和多样化的直播内容为特点，深受粉丝喜爱。"
  },
  {
    name: "SINA",
    id: "SINA",
    birthday: "5月31日",
    debutDate: "2024年5月31日",
    liveType: "杂谈、助眠内容为主",
    liveTime: "晚间至凌晨直播",
    tag: "常驻角色，负责晚间至凌晨直播",
    avatar: "img/face/sina.jpg",
    description: "机娘设定，外套可脱卸，主打 '睡前陪伴' 风格。未来不再播游戏，专注聊天、画画等轻松内容，与烖晞形成时段互补。"
  },
  {
    name: "烖晞（Zai Xi）",
    id: "烖晞",
    birthday: "5月31日",
    debutDate: "2025年5月31日",
    liveType: "游戏内容为主",
    liveTime: "白天直播",
    tag: "账号第二位新角色，主打白天游戏直播",
    avatar: "img/face/zaixi.jpg",
    description: "原型为蜥蜴，外观偏朴素，穿着黑色外套、红围巾，佩戴可脱卸护目镜。现实中头发为黑色，开启直播后变棕色，带点绿色挑染，头上的“牛角”其实是头发的一种，面部有伤疤元素（美化后），整体风格偏向 '清凉干练'。名字含义：'烖' 取自 '灾难'，'晞' 意为 '希望'，象征 '灾难熄灭的希望'，未来计划以消防员形象参与火灾公益宣传。性格开朗，擅长互动，初期模型存在眼睛崩坏、头发物理效果异常等 bug，仍在修复中。"
  }
];

// DOM元素引用
const avatarContainers = document.querySelectorAll('.avatar-container');
const characterDetails = document.getElementById('character-details');
const mainAvatars = document.querySelectorAll('.main-avatar');

// 显示角色信息
function displayCharacterInfo(index) {
  const char = characters[index];
  
  // 更新所有头像源（确保悬停时显示正确头像）
  mainAvatars.forEach((avatar, i) => {
    avatar.src = characters[i].avatar;
  });
  
  // 更新角色信息
  characterDetails.innerHTML = `
    <p>角色名称：${char.name}</p>
    <p>生日：${char.birthday}</p>
    <p>出道日期：${char.debutDate}</p>
    <p>直播类型：${char.liveType}</p>
    <p>直播时间：${char.liveTime}</p>
    <p>角色标签：${char.tag}</p>
    ${char.description ? `<p>角色介绍：${char.description}</p>` : ''}
    <div style="margin-top: 20px;">
      <a href="https://space.bilibili.com/12136555/" target="_blank" class="bilibili-btn">个人主页</a>
      <a href="https://live.bilibili.com/8414339/" target="_blank" class="bilibili-btn">直播间</a>
    </div>
  `;
  
  // 移除所有active类和floating类
  avatarContainers.forEach(container => {
    container.classList.remove('active', 'floating');
  });
  
  // 添加active类和floating类到当前容器
  avatarContainers[index].classList.add('active', 'floating');
}

// 鼠标悬停切换头像
avatarContainers.forEach((container, index) => {
  container.addEventListener('mouseenter', () => {
    displayCharacterInfo(index);
  });
});

// 初始化显示第一个角色
displayCharacterInfo(0);