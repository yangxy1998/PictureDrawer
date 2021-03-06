var mode=0;
var mode1="";

window.onload = function () {
    this.canvas = document.getElementById("myCanvas");
    var context = canvas.getContext("2d");
    this.root = new Doodle(context);
    this.pointContainer = new Container({
        width: 1024,
        height: 768,
        left: 0,
        top: 0,
        borderWidth: 5
    });
    this.root.children.push(this.pointContainer);
    this.root.clear=function(){
        this.context.clearRect(0,0,1024,768);
    }
    this.root.draw();
}
document.getElementById("line").onclick=function(e){
    mode=1;
}
document.getElementById('rect').onclick=function(e){
    mode=2;
}
document.getElementById('undo').onclick=function(e){
    window.pointContainer.children.pop();
    window.root.clear();
    window.root.draw();
}
document.getElementById('pen').onclick=function(e){
    mode=3;
    this.isDown=false;
}
document.getElementById('point').onclick=function(e){
    mode=4;
}
document.getElementById('red').onclick=function(e){
    //TODO
	mode1='red';
}
document.getElementById('green').onclick=function(e){
    //TODO
	mode1='green';
}
document.getElementById('blue').onclick=function(e){
    //TODO
	mode1='blue';
}
document.getElementById('black').onclick=function(e){
    //TODO
	mode1='black';
}
document.getElementById('myCanvas').onmousedown=function(e){
    if(mode==1){
        this.line=new Line({
            startX: e.pageX-this.offsetLeft,
            startY: e.pageY-this.offsetTop,
            lineWidth: document.getElementById('width').value,
            //TODO
			color:mode1,
        });
    }
    else if(mode==2){
        this.rectangle=new Rectangle({
            left: e.pageX-this.offsetLeft,
            top: e.pageY-this.offsetTop,
            lineWidth: document.getElementById('width').value,
            //TODO
			color:mode1,
        });
    }
    else if(mode==3){
        this.isDown=true;
        this.pointGroup=new PointGroup();
        window.pointContainer.children.push(this.pointGroup);
    }
    else if(mode==4){
        this.point=new Point({
            left: e.pageX-this.offsetLeft,
            top: e.pageY-this.offsetTop,
            radius: document.getElementById('width').value,
            //TODO
			color:mode1,
        });
        window.pointContainer.children.push(this.point);
        window.root.draw();
    }
}
document.getElementById('myCanvas').onmouseup=function(e){
    if(mode==1){
        this.line.endX=e.pageX-this.offsetLeft;
        this.line.endY=e.pageY-this.offsetTop;
        window.pointContainer.children.push(this.line);
        window.root.draw();
    }
    else if(mode==2){
        if(e.pageX-this.offsetLeft<this.rectangle.left){
            this.rectangle.width=this.rectangle.left-(e.pageX-this.offsetLeft);
            this.rectangle.left=e.pageX-this.offsetLeft;
        }
        else{
            this.rectangle.width=e.pageX-this.offsetLeft-this.rectangle.left;
        }
        if(e.pageY-this.offsetTop<this.rectangle.top){
            this.rectangle.height=this.rectangle.top-(e.pageY-this.offsetTop);
            this.rectangle.top=e.pageY-this.offsetTop;
        }
        else{
            this.rectangle.height=e.pageY-this.offsetTop-this.rectangle.top;
        }
        window.pointContainer.children.push(this.rectangle);
        window.root.draw();
    }
    else if(mode==3){
        this.isDown=false;
    }
}
document.getElementById('myCanvas').onmousemove=function(e){
    if(mode==3){
        if(this.isDown){
            this.point=new Point({
                left: e.pageX-this.offsetLeft,
                top: e.pageY-this.offsetTop,
                radius: document.getElementById('width').value,
                //TODO
				color:mode1,
            });
            this.pointGroup.children.push(this.point);
            window.root.draw();
        }
    }
}
document.getElementById('save').onclick = function (e) {
    var type = document.getElementById('sel').value,
        w = document.getElementById('imgW').value,
        h = document.getElementById('imgH').value;
    f = document.getElementById('imgFileName').value;
    Canvas2Image.saveAsImage(canvas, w, h, type,f);
}
document.getElementById('convert').onclick = function (e) {
    var type = document.getElementById('sel').value,
        w = document.getElementById('imgW').value,
        h =document.getElementById('imgH').value;
    document.getElementById('imgs').appendChild(Canvas2Image.convertToImage(canvas, w, h, type))
}