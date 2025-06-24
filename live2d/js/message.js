//对话框显示信息列表
const messageList = [
  '你好呀'
]
//对话框当前显示信息的index
let messageIndex = 0
let timer
function init(){
    var resourcesPaths = `${resourcesPath}`;
    var backImageNames = `${backImageName}`;
    var modelDirString = `${modelDir}`;
    var modelDirs = modelDirString.split(',');

    initDefine(resourcesPaths, backImageNames, modelDirs);
}

// 监听复制
(function() {
    document.addEventListener('copy',(e)=>{
      e.preventDefault();
      e.stopPropagation();
      showMessage('你都复制了些什么呀,能让我看看吗？', 5000, true)
    })
  }());


function showMessage(text, timeout, flag){
  console.log('timer:'+timer)
  if (!timer) {
    timer = setInterval(() => {
      showMessage(messageList[messageIndex], 5000, true)
      //如果messageIndex不超过数组长度-1就递增messageIndex，否则重置为0
      if (messageIndex < messageList.length - 1) {
        messageIndex++
      } else {
        messageIndex = 0
      }
    }, 30000);
  }
    if(flag || sessionStorage.getItem('waifu-text') === '' || sessionStorage.getItem('waifu-text') === null){
        if(Array.isArray(text)) text = text[Math.floor(Math.random() * text.length + 1)-1];
        //console.log(text);
        if(flag) sessionStorage.setItem('waifu-text', text);
        $('.live2d-tips').stop();
        $('.live2d-tips').html(text).fadeTo(200, 1);
        if (timeout === undefined) timeout = 5000;
        hideMessage(timeout);
    }
}

function hideMessage(timeout){
    $('.live2d-tips').stop().css('opacity',1);
    if (timeout === undefined) timeout = 5000;
    window.setTimeout(function() {sessionStorage.removeItem('waifu-text')}, timeout);
    $('.live2d-tips').delay(timeout).fadeTo(200, 0);
}

// 全局变量
let currentModelIndex = 0;
let currentBackgroundIndex = 0;
let modelDirs = []; // 模型目录数组
let backImageNames = []; // 背景图片名称数组

function init() {
    var resourcesPaths = `${resourcesPath}`;
    var backImageNamesStr = `${backImageName}`;
    var modelDirString = `${modelDir}`;
    
    // 保存到全局变量
    modelDirs = modelDirString.split(',');
    backImageNames = backImageNamesStr.split(',');
    
    initDefine(resourcesPaths, backImageNamesStr, modelDirs);
}

// 工具栏功能实现
$('.tool .fui-home').click(function (){
    clearInterval(timer);
    timer = null;
    messageIndex = 0;
    showMessage('欢迎回来！需要我帮忙吗？', 5000, true);
});

$('.tool .fui-eye').click(function (){
    clearInterval(timer);
    timer = null;
    showMessage('切换表情成功！', 3000, true);
    // 这里可以添加实际切换表情的代码
});

$('.tool .fui-chat').click(function (){
    clearInterval(timer);
    timer = null;
    const randomMessages = [
        '今天天气真不错呢~',
        '有什么想和我聊聊的吗？',
        '听说点击"用户"图标可以切换角色哦',
        '试试点击"照片"图标换背景吧！'
    ];
    const randomIndex = Math.floor(Math.random() * randomMessages.length);
    showMessage(randomMessages[randomIndex], 5000, true);
});

$('.tool .fui-user').click(function (){
    clearInterval(timer);
    timer = null;
    
    currentModelIndex = (currentModelIndex + 1) % modelDirs.length;
    showMessage(`角色已切换为: ${modelDirs[currentModelIndex]}`, 4000, true);
    
    // 获取Live2D管理器实例并切换模型
    const live2DManager = LAppLive2DManager.getInstance();
    live2DManager.changeScene(currentModelIndex);
    
});

$('.tool .fui-info-circle').click(function (){
    clearInterval(timer);
    timer = null;
    showMessage('Live2D看板娘 v1.0<br>按F12打开控制台查看更多信息', 6000, true);
});

$('.tool .fui-cross').click(function (){
    $('.live2d-tips').stop().fadeTo(200, 0);
    sessionStorage.removeItem('waifu-text');
});

$('.tool .fui-photo').click(function (){
    clearInterval(timer);
    timer = null;
    
    currentBackgroundIndex = (currentBackgroundIndex + 1) % backImageNames.length;
    showMessage(`背景已切换为: ${backImageNames[currentBackgroundIndex]}`, 4000, true);
    
    // 这里添加实际切换背景的代码
    // changeBackground(backImageNames[currentBackgroundIndex]);
    
});
