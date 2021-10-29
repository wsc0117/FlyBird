var startBtn = document.querySelector("#start");
var head = document.querySelector("#head");
var ductWrap = document.querySelector("#ductWrap");
var bird = document.querySelector("#bird");
var score = document.querySelector("#score");
var over = document.querySelector("#over");
//创建管道定时器
var createDuctTimer = null;
//是否删除管道移动定时器
var isDelTimer = false;
startBtn.onclick = () => {
  //页面初始的标签消失
  head.style.display = "none";
  //parentNode 获取当前元素的父元素
  startBtn.parentNode.style.display = "none";
  bird.style.display = "block";
  bird.speed = 0;
  bird.moveTimer = setInterval(() => {
    bird.speed += 0.5;
    if (bird.speed <= 0)
      bird.children[0].src = "./img/up_bird0.png";
    else
      bird.children[0].src = "./img/down_bird1.png";
    if (bird.offsetTop <= 0)
      bird.style.top = "0px";
    else if (bird.offsetTop >= 394) {
      bird.style.top = "394px";
      clearInterval(bird.moveTimer);
      clearInterval(createDuctTimer);
      isDelTimer = true;
      over.style.display = "block";
    }
    bird.style.top = bird.offsetTop + bird.speed + "px";
    //小鸟碰撞检测
    var ductRow = document.querySelectorAll(".duct_row");
    for (var i = 0; i < ductRow.length; i++) {
      var isCrash = CrashFn(bird, ductRow[i]);
      if (isCrash) {
        clearInterval(bird.moveTimer);
        clearInterval(createDuctTimer);
        isDelTimer = true;
        over.style.display = "block";
        bird.className = "die";
      }
    }
  }, 30);
  //小鸟向上移动
  document.onmousedown = (event) => {
    var ev = event || window.event;
    event.preventDefault();
    bird.speed = -5;
  }
  //随机函数 随机产生管道的高度
  function randFn(min, max) {
    return parseInt(Math.random() * (max - min + 1) + min);
  }
  //创建管道 通过计时器创建
  createDuctTimer = setInterval(() => {
    //createElement 创建li元素 
    var duct = document.createElement("li");
    //上管道
    var upHeight = randFn(60, 240);
    //下管道
    var downHeight = 432 - upHeight - 100;
    duct.innerHTML = '<div class="duct_up duct_row" style="height:' + upHeight + 'px"><img src="./img/up_pipe.png"></div><div class="duct_down duct_row" style="height:' + downHeight + 'px"><img src="./img/down_pipe.png"></div>';
    duct.l = 300;
    //管道添加bol元素，判断是否加分
    duct.scoreBol = true;
    duct.moveTimer = setInterval(() => {
      duct.l -= 3;
      duct.style.left = duct.l + "px";
      //判断当管道移出游戏画面时，清除管道 停止管道的移动
      //小鸟通过柱子 分数+1
      if (duct.l <= -62) {
        ductWrap.removeChild(duct);
        clearInterval(duct.moveTimer);
      }
      else if (duct.l <= -31) {
        if (duct.scoreBol)
          score.innerHTML = parseInt(score.innerHTML) + 1;
        duct.scoreBol = false;
      }
      //小鸟死亡 定时器移出
      if (isDelTimer)
        clearInterval(duct.moveTimer);
    }, 30)
    //添加到ul中
    ductWrap.appendChild(duct);
  }, 3000)
  //碰撞检测
  function CrashFn(objBird, objDuct) {
    var objBirdLeft = objBird.offsetLeft;
    var objBirdRight = objBirdLeft + objBird.offsetWidth;
    var objBirdTop = objBird.offsetTop;
    var objBirdBottom = objBirdTop + objBird.offsetHeight;
    //
    var objDuctLeft = objDuct.parentNode.offsetLeft;
    var objDuctRight = objDuctLeft + objDuct.offsetWidth;
    var objDuctTop = objDuct.offsetTop;
    var objDuctBottom = objDuctTop + objDuct.offsetHeight;
    if (objBirdRight >= objDuctLeft && objBirdBottom >= objDuctTop && objBirdLeft <= objDuctRight && objBirdTop <= objDuctBottom) {
      //碰撞发生 游戏结束
      return true;
    } else {
      return false;
    }
  }
}