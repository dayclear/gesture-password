
var minLength=5;//手势密码最少的点数量
var firstPwd="";//第一次输入的密码
var touchColor="blue",errorColor="red",rightColor="green";
//触摸时，错误时，正确时颜色
var cirBgColor="#fff";cirBdColor="#666";//圆的背景色和为触摸时的边框色
var cirBdWidth=2;//圆的边框宽度
var lineWidth=10;//线的宽度
var mes=document.getElementById("message");

var R = 25;//圆形半径
var WIDTH = document.body.clientWidth;//画布宽度
if(document.body.clientWidth>420){
      WIDTH =420;
}else if(document.body.clientWidth<320){
      WIDTH =320;
};
var HEIGHT = 350;//画布高度
var paddingX = 30;//两边距离
var paddingY = 30;//上下距离
var disX = (WIDTH - paddingX * 2 - R * 2 * 3) / 2;//两个圆水平的距离
var disY = (HEIGHT - paddingY * 2 - R * 2 * 3) / 2;//两个圆垂直的距离

var points = [];//存储9个点
var touchPoints=[];//存储被选过的点

// 初始9个点的位置
for (var row = 0; row < 3; row++) {
      for (var col = 0; col < 3; col++) {
            var p = {
                  x: (paddingX + col * disX + (col * 2 + 1) * R),
                  y: (paddingY + row * disY + (row * 2 + 1) * R)
            };
            points.push(p);
      }
}

window.onload = function() {
      
      var canvas = document.getElementById("gestureCanvas");
      canvas.width = WIDTH;
      canvas.height = HEIGHT;
      var cxt = canvas.getContext("2d");
      init(cxt,points);

      var radio1=document.getElementById("radio1"); 
      var radio2=document.getElementById("radio2");
      radio1.addEventListener("change",function(){
            firstPwd="";
            mes.innerHTML="请输入手势密码";
      },false);
      radio2.addEventListener("change",function(){
            mes.innerHTML="请验证密码";
      },false);

      // 触发touch事件
      canvas.addEventListener("touchstart", function (e){
            e.preventDefault();
            checkTouch(e.touches[0]);
            cxt.clearRect(0,0,WIDTH,HEIGHT);
            change(cxt,e.touches[0]);
            drawLineAndCir(cxt,"blue")
      },false);

      //移动
      canvas.addEventListener("touchmove", function (e){
            e.preventDefault();
            checkTouch(e.touches[0]);
            cxt.clearRect(0,0,WIDTH,HEIGHT);
            change(cxt,e.touches[0]);
            drawLineAndCir(cxt,"blue")
      },false);

      //touch事件结束
      canvas.addEventListener("touchend", function (e){
            
            if(radio1.checked){
                  setPwd(cxt);
            }else if(radio2.checked){
                  verifyPwd(cxt);
            }
            
            touchPoints=[];
      },false);
}

//将九个按钮恢复最初状态
function init(cxt,points) {

      cxt.clearRect(0,0,WIDTH,HEIGHT);
      for(var i=0;i<points.length;i++){
            var point=points[i];
            drawCir(cxt,point.x,point.y,R,"",cirBgColor,cirBdColor);
      }
}

//画圆
function drawCir(cxt,x,y,r,inColor,outColor,borderColor){
      
      // 画边框
      cxt.fillStyle = borderColor;
      cxt.beginPath();
      cxt.arc(x, y, r, 0, Math.PI * 2, true);
      cxt.closePath();
      cxt.fill();
      
      //画外面的圆
      cxt.fillStyle = outColor;
      cxt.beginPath();
      cxt.arc(x, y, r-cirBdWidth, 0, Math.PI * 2, true);
      cxt.closePath();
      cxt.fill();

      //如果数字被选中，则画该数字里面的小圆
      if(inColor!==""){
            cxt.fillStyle = inColor;
            cxt.beginPath();
            cxt.arc(x, y, r-15, 0, Math.PI * 2, true);
            cxt.closePath();
            cxt.fill();
      }
}

//画出触摸之后的线和点，以及错误之后的线和点
function drawLineAndCir(cxt,color){
      if (touchPoints.length > 0) {
            
            //画出之前触摸过的点之间的连线
            cxt.beginPath();
            for (var i = 0; i < touchPoints.length; i++) {
                  var index = touchPoints[i];
                  cxt.lineTo(points[index].x, points[index].y);
            }
            cxt.lineWidth = lineWidth;
            cxt.strokeStyle = color;
            cxt.stroke();
            cxt.closePath();
      }
      for (var i = 0; i < points.length; i++) {
            var point = points[i];
            drawCir(cxt,point.x,point.y,R,"",cirBgColor,cirBdColor);
      }

      for (var i = 0; i < touchPoints.length; i++) {
            var point = points[touchPoints[i]];
            drawCir(cxt,point.x,point.y,R,color,cirBgColor,color);
      }
}

//检查是否触摸到圆内
function checkTouch(touch) {
      for (var i = 0; i < points.length; i++) {
            var point = points[i];
            var x = Math.abs(point.x - touch.pageX);
            var y = Math.abs(point.y - touch.pageY);
            var d = Math.pow((x * x + y * y), 0.5);
            if (d < R) {
                  var mid=-1;
                  if(touchPoints.length>=1){
                        var mid=addMiddle(i);
                  }
                  if (touchPoints.indexOf(i) < 0) {
                        //如果两点之间有一个点并且这个点没有被存储，则连接该点
                        if(mid!=-1 && touchPoints.indexOf(mid) < 0){
                              touchPoints.push(mid);
                        }
                        touchPoints.push(i);
                  }
                  break;
            }
      }
}

//绘画触摸之后的线和图的变化
function change(cxt,touch) {
      if (touchPoints.length > 0) {
            //最后一个点和当前触摸位置的连线
            cxt.beginPath();
            lastIndex=touchPoints[touchPoints.length-1];
            lastPoint=points[lastIndex];
            cxt.moveTo(lastPoint.x, lastPoint.y);
            cxt.lineTo(touch.pageX, touch.pageY);
            cxt.stroke();
            cxt.closePath();
      }
}

//设置密码
function setPwd(cxt){
      if(firstPwd===""){
            if(touchPoints.length<minLength){
                  mes.innerHTML="密码太短，至少需要"+minLength+"个点";
                  init(cxt,points);
            }else{
                  firstPwd=touchPoints.join("");
                  mes.innerHTML="请再次输入手势密码";
                  init(cxt,points);
            }
      }else{
            var secondPwd=touchPoints.join("");
            if(firstPwd!==secondPwd){
                  firstPwd="";
                  drawLineAndCir(cxt,errorColor);
                  mes.innerHTML="两次输入不一致，重新设置";
                  setTimeout(function(){init(cxt,points)},400);
            }else{
                  localStorage.setItem("pwd",secondPwd);
                  mes.innerHTML="密码设置成功";
                  init(cxt,points);
            }
      }
      
}

//验证密码
function verifyPwd(cxt){
      firstPwd="";
      var verify=touchPoints.join("");
      var pwd=localStorage.getItem("pwd");
      if(verify===pwd){
            drawLineAndCir(cxt,rightColor);
            mes.innerHTML="密码正确";
            setTimeout(function(){init(cxt,points)},400);
      }else{
            drawLineAndCir(cxt,errorColor);
            mes.innerHTML="输入密码不正确";
            setTimeout(function(){init(cxt,points)},400);
      }
}

//如果两点直线之间有一个点，则返回这个点
function addMiddle(i){
      var mid=-1;
      var length=touchPoints.length;
      if(touchPoints[length-1]==0 && i==2){
            mid=1;
      }
      if(touchPoints[length-1]==3 && i==5){
            mid=4;
      }
      if(touchPoints[length-1]==6 && i==8){
            mid=7;
      }
      if(touchPoints[length-1]==0 && i==6){
            mid=3;
      }
      if(touchPoints[length-1]==1 && i==7){
            mid=4;
      }
      if(touchPoints[length-1]==2 && i==8){
            mid=5;
      }
      if(touchPoints[length-1]==0 && i==8){
            mid=4;
      }
      if(touchPoints[length-1]==2 && i==6){
            mid=4;
      }
      return mid;
}