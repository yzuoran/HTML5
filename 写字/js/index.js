var canvas = document.getElementById('canvas'),
	context = canvas.getContext('2d'),
	currLoc = null;
	interVal = 5,
	radius = 1,
	isMousedown = false,
	lastLoc = 0,
	lastTime = 0,
	lastLine = 0,
	dis = 0,
	tim = 0,
	maxLine = 20,
	minLine = 1,
	maxV = 10,
	minV = 0.1,
	color = ['#000','#f00','#99cc33','#ff0','#0f0'],
	currColor = color[0];
canvas.width = Math.min(500,$(window).width()-20);
canvas.height = canvas.width;
var drawBg = function(){
	context.save();
	context.strokeStyle = '#f00';
	context.beginPath();
	context.moveTo(0,0);
	context.lineWidth = 6;
	context.lineTo(canvas.width,0);
	context.lineTo(canvas.width,canvas.height);
	context.lineTo(0,canvas.height);
	context.closePath();
	context.stroke();
	context.fillStyle = '#f00';
	context.lineWidth = 1;
	for (var i = 1; i < canvas.width/interVal; i++) {
		context.beginPath();
		context.moveTo(i*interVal,i*interVal);
		context.arc(i*interVal,i*interVal,radius,0,Math.PI*2);
		context.fill();
		context.closePath();
		context.beginPath();
		context.moveTo(i*interVal,canvas.height-i*interVal);
		context.arc(i*interVal,canvas.height-i*interVal,radius,0,Math.PI*2);
		context.fill();
		context.closePath();
		context.beginPath();
		context.moveTo(canvas.width/2,i*interVal);
		context.arc(canvas.width/2,i*interVal,radius,0,Math.PI*2);
		context.fill();
		context.closePath();
		context.beginPath();
		context.moveTo(i*interVal,canvas.height/2);
		context.arc(i*interVal,canvas.height/2,radius,0,Math.PI*2);
		context.fill();
		context.closePath();
	}
	context.restore();
}
drawBg();
var beginDraw = function(point){
	isMousedown = true;
	lastLoc = getMouse(point.x,point.y);
	lastTime = new Date().getTime();
}
var endDraw = function(){
	isMousedown = false;
}
canvas.onmousedown = function(event){
	event.preventDefault();
	beginDraw({x:event.clientX,y:event.clientY});
}
canvas.onmouseup = function(event){
	event.preventDefault();
	endDraw();
}
canvas.onmouseout = function(event){
	event.preventDefault();
	endDraw();
}
canvas.onmousemove = function(event){
	event.preventDefault();
	if (isMousedown) {
		draw({x:event.clientX,y:event.clientY});
	}
}
canvas.addEventListener('touchstart',function(e){
	var touch =e.touches[0];
	beginDraw({x:touch.pageX,y:touch.pageY});
},false);
canvas.addEventListener('touchend',function(){
	endDraw();
},false);
canvas.addEventListener('touchmove',function(e){
	var touch =e.touches[0];
	if (isMousedown) {
		draw({x:touch.pageX,y:touch.pageY});
	}
})
var getMouse = function(x,y){
	var canvasBound = canvas.getBoundingClientRect();
	return {x : x-canvasBound.left , y : y-canvasBound.top};
}
var draw = function(point){
	var currTime = new Date().getTime();
	currLoc = getMouse(point.x,point.y);
	dis = getDis(lastLoc,currLoc);
	tim = currTime - lastTime;
	var currLine = getLine(dis,tim);
	context.lineWidth =	currLine;
	context.lineCap = 'round';
	context.lineJoin = 'round';
	context.beginPath();
	context.strokeStyle = currColor;
	context.moveTo(lastLoc.x,lastLoc.y);
	context.lineTo(currLoc.x,currLoc.y);
	context.stroke();
	lastLoc = currLoc;
	lastTime = currTime;
	lastLine = currLine;
}
var getDis = function(last,curr){
	return Math.sqrt((last.x - curr.x)*(last.x - curr.x) + (last.y - curr.y)*(last.y - curr.y));
}
var getLine = function(s,t){
	var v = s/t;
	var lin = 0;
	if (v > maxV) {
		lin = maxLine;
	}else if (v < minV) {
		lin = minLine;
	}else {
		lin = maxLine-(maxLine-minLine)*(v-minV)/(maxV-minV);
	}
	if (lastLine == 0) {
		return lin;
	}else{
		return lastLine*2/3 + lin/3;
	}
}
$('ul').css("width",Math.min(500,$(window).width()-20)+'px');
$('li:eq(0)').css("border","2px solid #000");
$('li').each(function(index){
	$(this).click(function(){
		if (index===5) {
			context.clearRect(0,0,canvas.width,canvas.height);
			drawBg();
		}else{
			currColor = color[index];
			$('li').css("border","2px solid #fff");
			$(this).css("border","2px solid "+color[index]);
		}
	})
})