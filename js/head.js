// DOM元素引用
const avatarContainers = document.querySelectorAll('.avatar-container');
const characterDetails = document.getElementById('character-details');
const mainAvatars = document.querySelectorAll('.main-avatar');

// 显示角色信息 - 完全硬编码HTML内容
function displayCharacterInfo(index) {
  // 更新头像
  const avatars = [
    "img/face/face.jpg",
    "img/face/sina.jpg",
    "img/face/zaixi.jpg"
  ];
  mainAvatars.forEach((avatar, i) => {
    avatar.src = avatars[i];
  });
  
  // 直接写死三个角色的HTML内容
  let detailsHTML = '';
  if (index === 0) {
    detailsHTML = `
      <p> <strong>角色名称：</strong>御坂19039</p>
      <p> <strong>生日：</strong>5月01日</p>
      <p> <strong>直播类型：</strong>音乐练习 | 游戏实况 | 绘画直播</p>
      <p><strong>直播时间：</strong>不定期直播哦~时间变动会发动态嘟</p>
      <p> <strong>角色标签：</strong>你已经上贼船了，你逃不脱了桀桀桀！</p>
      <div class="character-description">
        <p> <strong>角色介绍：</strong>
            账号主角色，负责日常直播。<br>
            是一只超大🐖，会把睡觉称为兽性大发。<br>
        </p>
      </div>
      <div style="margin-top: 20px; display: flex; gap: 15px; flex-wrap: wrap;">
        <a href="https://space.bilibili.com/12136555/" target="_blank" class="bilibili-btn">个人主页</a>
        <a href="https://live.bilibili.com/8414339/" target="_blank" class="bilibili-btn">直播间</a>
      </div>
    `;
  } else if (index === 1) {
    detailsHTML = `
      <p><strong>角色名称：</strong>SINA</p>
      <p><strong>生日：</strong>5月31日</p>
      <p><strong>出道日期：</strong>2024年5月31日</p>
      <p><strong>直播类型：</strong>杂谈、（伪）助眠、读书内容为主</p>
      <p><strong>直播时间：</strong>晚间至凌晨直播</p>
      <p><strong>角色标签：</strong>常驻角色，负责晚间至凌晨直播</p>
      <div class="character-description">
        <p><strong>角色介绍：</strong>
            机娘设定，外套可脱卸，主打 '睡前陪伴' 风格。<br>
            未来不再播游戏，专注聊天、画画等轻松内容，与烖晞形成时段互补。<br>
        </p>
      </div>
      <div style="margin-top: 20px; display: flex; gap: 15px; flex-wrap: wrap;">
        <a href="https://space.bilibili.com/12136555/" target="_blank" class="bilibili-btn">个人主页</a>
        <a href="https://live.bilibili.com/8414339/" target="_blank" class="bilibili-btn">直播间</a>
      </div>
    `;
  } else if (index === 2) {
    detailsHTML = `
      <p><strong>角色名称：</strong>烖晞（Zai Xi）</p>
      <p><strong>生日：</strong>5月31日</p>
      <p><strong>出道日期：</strong>2025年5月31日</p>
      <p><strong>直播类型：</strong>游戏内容为主</p>
      <p><strong>直播时间：</strong>白天直播</p>
      <p><strong>角色标签：</strong>账号第二位新角色，主打白天游戏直播</p>
      <div class="character-description">
        <p><strong>角色介绍：</strong>
            未来计划以消防员形象参与火灾公益宣传。<br>
            性格开朗，擅长互动，整体风格偏向 '清凉干练'。<br>
            现实中头发为黑色，开启直播后变棕色，带点绿色挑染。<br>
            头上的“牛角”其实是头发的一种，面部有伤疤元素（美化后）。<br>
            '烖' 取自 '灾难'，'晞' 意为 '希望'，象征 '灾难熄灭的希望'。<br>
            初期模型存在眼睛崩坏、头发物理效果异常等 bug，仍在修复中。<br>
            原型为蜥蜴，外观偏朴素，穿着黑色外套、红围巾，佩戴可脱卸护目镜。<br> 
        </p>
      </div>
      <div style="margin-top: 20px; display: flex; gap: 15px; flex-wrap: wrap;">
        <a href="https://space.bilibili.com/12136555/" target="_blank" class="bilibili-btn">个人主页</a>
        <a href="https://live.bilibili.com/8414339/" target="_blank" class="bilibili-btn">直播间</a>
      </div>
    `;
  }
  
  characterDetails.innerHTML = detailsHTML;
  
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
