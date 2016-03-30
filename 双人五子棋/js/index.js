var canvas = document.getElementById('canvas'),
	currName = document.getElementById('currName'),
	context = canvas.getContext('2d'),
	me = true,//判断哪方
	chess = [];//棋盘各点落子情况
//初始化棋盘
for (var i = 0; i < 20; i++) {
	chess[i] = [];
	for (var j = 0; j < 20; j++) {
		chess[i][j] = 0;
	}
}
//绘制棋盘
var drawBg = function(){
	for (var i = 0; i < 20; i++) {
		context.strokeStyle = '#666';
		context.moveTo(i*25+15,15);
		context.lineTo(i*25+15,490);
		context.stroke();
		context.moveTo(15,i*25+15);
		context.lineTo(490,i*25+15);
		context.stroke();
	}
}
//点击落子
canvas.onclick = function(event){
	var currX = Math.floor(event.offsetX/25),
		currY = Math.floor(event.offsetY/25);
	if (chess[currX][currY] == 0) {
		drawChess(currX,currY,me);
		if (me) {
			chess[currX][currY] = 1;
			currName.innerHTML = "白方请";
		}else{
			chess[currX][currY] = 2;
			currName.innerHTML = "黑方请";
		}
		judge(currX,currY,me);
		me = !me;
	}
	
}
//绘制棋子
var drawChess = function(x,y,me){
	context.beginPath();
	var grad = context.createRadialGradient(x*25+13,y*25+13,8,x*25+13,y*25+13,2);
	if (me) {
		grad.addColorStop(0,'#000');
		grad.addColorStop(1,'#fff');
		context.fillStyle = grad;
	}else{
		grad.addColorStop(0,'#D1D1D1');
		grad.addColorStop(1,'#F9F9F9');
		context.fillStyle = grad;
	}
	context.arc(x*25+15,y*25+15,12,0,Math.PI*2);
	context.fill();
	context.closePath();
}
var dire = [];//获取各方向连续相同棋子数量（8个方向）
//判断五子赢家
var judge = function(currX,currY,me){
	for (var i = 0; i < 8; i++) {
		dire[i] = 0;
		judgeOne(currX,currY,i);
	}
	for (var i = 0; i < 4; i++) {
		if ((dire[i]+dire[i+4])>=4) {
			if (me) {
				if(confirm("黑方赢,再来一局！")){
					location.reload();
				}
			}else{
				if(confirm("白方赢,再来一局！")){
					location.reload();
				}
			}

		}
	}
}
//判断当前棋子是否构成五子
var judgeOne = function(x,y,z){
	var curr = chess[x][y],
		work = false;
	switch(z) {
		case 0:
			if (x > 0 && y > 0) {
				--x;
				--y;
				work = true;
			}
			break;
		case 1:
			if (y > 0) {
				--y;
				work = true;
			}
			break;
		case 2:
			if (x < 19  && y > 0) {
				++x;
				--y;
				work = true;
			}
			break;
		case 3:
			if (x < 19) {
				++x;
				work = true;
			}
			break;
		case 4:
			if (x < 19 && y < 19) {
				++x;
				++y;
				work = true;
			}
			break;
		case 5:
			if (y < 19) {
				++y;
				work = true;
			}
			break;
		case 6:
			if (x > 0 && y < 19) {
				--x;
				++y;
				work = true;
			}
			break;
		case 7:
			if (x > 0) {
				--x;
				work = true;
			}
			break;
		default:
			break;
	}
	if ((chess[x][y] == curr) && work ) {
		dire[z]++;
		judgeOne(x,y,z);
	}
}
//调用绘制棋盘函数
drawBg();