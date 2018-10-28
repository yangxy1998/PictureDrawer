/* Doodle Drawing Library
 *
 * Drawable and Primitive are base classes and have been implemented for you.
 * Do not modify them! 
 *
 * Stubs have been added to indicate where you need to complete the
 * implementation.
 * Please email me if you find any errors!
 */

/*
 * Root container for all drawable elements.
 */
var drawX=0;
var drawY=0;
/**
 *
 * @param x {number} to remember the x-position after translated
 * @param y {number} to remember the y-position after translated
 */
function setDraw(x,y){
    drawX+=x;
    drawY+=y;
}
/**
 *
 * @param x {number} to rollback the x-position after translated
 * @param y {number} to rollback the y-position after translated
 */
function clearDraw(x,y){
    drawX-=x;
    drawY-=y;
}

function Doodle (context) {
    this.context = context;
    this.children = [];
}

Doodle.prototype.draw = function() {
 	// Your draw code here
    drawX=0;
    drawY=0;
    this.context.clearRect(0,0,this.context.width,this.context.height);
    for(var i=0;i<this.children.length;i++){
        this.context.save();
        this.children[i].draw(this.context);
    }
};

/* Base class for all drawable objects.
 * Do not modify this class!
 */
function Drawable (attrs) {
    var dflt = { 
        left: 0,
        top: 0,
        visible: true,
        theta: 0,
        scale: 1
    };
    attrs = mergeWithDefault(attrs, dflt);
    this.left = attrs.left;
    this.top = attrs.top;
    this.visible = attrs.visible;
    this.theta = attrs.theta*Math.PI/180;
    this.scale = attrs.scale;
}

/*
 * Summary: returns the calculated width of this object
 */
Drawable.prototype.getWidth = function(context) {
    if(this.width==undefined){
        console.log("ERROR: Calling unimplemented draw method on drawable object.");
        return 0;
    }
    return this.width;
}

/*
 * Summary: returns the calculated height of this object
 */
Drawable.prototype.getHeight = function(context) {
    if(this.height==undefined){
        console.log("ERROR: Calling unimplemented draw method on drawable object.");
        return 0;
    }
    return this.height;
}

/*
 * Summary: Uses the passed in context object (passed in by a doodle object)
 * to draw itself.
 */
Drawable.prototype.draw = function(context) {
    if(context==undefined){
        console.log("ERROR: Calling unimplemented draw method on drawable object.");
    }
};


/* Base class for objects that cannot contain child objects.
 * Do not modify this class!
 */
function Primitive(attrs) {
    var dflt = {
        lineWidth: 1,
        color: "black"
    };
    attrs = mergeWithDefault(attrs, dflt);
    Drawable.call(this, attrs);
    this.lineWidth = attrs.lineWidth;
    this.color = attrs.color;
}
Primitive.inheritsFrom(Drawable);

function Text(attrs) {
    var dflt = {
        content: "",
        fill: "black", //color
        font: "Helvetica", //font family
        size: 12, //Size in pt
        bold: false //bold boolean
    };
    attrs = mergeWithDefault(attrs, dflt);
    Drawable.call(this, attrs);
  
    //Rest of constructor code here
    this.content=attrs.content;
    this.color=attrs.fill;
    this.font=attrs.font;
    this.size=attrs.size;
    this.bold=attrs.bold;
    this.height=this.top;
    if(attrs.height>this.top)this.top=attrs.height;
}
Text.inheritsFrom(Drawable);

//Text methods here
/**
 *
 * @param context the canvas context
 * @returns {boolean} whether the text is or not valid or in the path.
 */
Text.prototype.draw=function(context) {
    context.strokeStyle=this.color;
    context.fillStyle=this.color;
    context.font=getFont(this.bold,this.size,this.font);
    //Judge the text is or not valid or in the path.
    var inPath=context.isPointInPath(this.left+drawX,this.top+drawY);
    if(inPath){
        context.fillText(this.content,this.left,this.top);
        return true;
    }
    else{
        context.fillText(this.content,this.left,this.top);
        return false;
    }
}
/**
 * In case of the text is out of path.
 * @param context the canvas context
 * @param left {Number} the number of left start
 * @param top {Number} the number of top start
 */
Text.prototype.drawPosition=function(context,left,top) {
    context.fillText(this.content,left,top);
}
/**
 * @param bold {boolean} bold or not
 * @param size {Number} size of the text
 * @param font {String} font of the text
 * @return the completed font settings of the text
 */
function getFont(bold,size,font){
    var text="";
    if(bold)text="bold "+size+"pt "+font;
    else{
        text=size+"pt "+font;
    }
    return text;
}
function DoodleImage(attrs) {
    var dflt = {
        width: -1,
        height: -1,
        src: "",
    };
    attrs = mergeWithDefault(attrs, dflt);
    Drawable.call(this, attrs);
 
    //Rest of constructor code here
    this.width= attrs.width;
    this.height=attrs.height;
    this.src=attrs.src;
}
DoodleImage.inheritsFrom(Drawable);

//DoodleImage methods here
DoodleImage.prototype.draw=function(context){
    var img=new Image();
    img.src=this.src;
    if(this.width<=0||this.height<=0)context.drawImage(img,this.left,this.top,img.width,img.height);
    else context.drawImage(img,this.left,this.top,this.width,this.height);
    return true;
}

function Line(attrs) {
    var dflt = {
        startX: 0,
        startY: 0,
        endX: 0,
        endY: 0
    };
    attrs = mergeWithDefault(attrs, dflt);
    Primitive.call(this, attrs);
    //Rest of constructor code here
    this.startX=attrs.startX;
    this.startY=attrs.startY;
    this.endX=attrs.endX;
    this.endY=attrs.endY;
}
Line.inheritsFrom(Primitive);

//Line methods here
Line.prototype.draw=function(context){
    context.lineWidth=this.lineWidth;
    context.strokeStyle=this.color;
    context.fillStyle=this.color;
    context.beginPath();
    context.moveTo(this.startX,this.startY);
    context.lineTo(this.endX,this.endY);
    context.closePath();
    context.fill();
    context.stroke();
    return true;
}

function Rectangle(attrs) {
    var dflt = {
        x: 0,
        y: 0,
        width: 0,
        height: 0,
    };
    attrs = mergeWithDefault(attrs, dflt);
    Primitive.call(this, attrs);
    //Rest of constructor code here
    this.x=attrs.x;
    this.y=attrs.y;
    this.width=attrs.width;
    this.height=attrs.height;
}
Rectangle.inheritsFrom(Primitive);

//Rectangle Methods here
Rectangle.prototype.draw=function(context){
    context.strokeStyle=this.color;
    context.fillStyle=this.color;
    context.beginPath();
    context.lineWidth=this.lineWidth;
    context.strokeRect(this.left,this.top,this.width,this.height);
    context.closePath();
    context.fill();
    context.stroke();
    return true;
}

function Container(attrs) {
    var dflt = {
        width: 100,
        height: 100,
        fill: false,
        borderColor: "black",
        borderWidth: 0,
    };
    attrs = mergeWithDefault(attrs, dflt);
    Drawable.call(this, attrs);    
    //Rest of constructor code here
    this.children=[];
    this.width=attrs.width;
    this.height=attrs.height;
    this.fill=attrs.fill;
    this.borderColor=attrs.borderColor;
    this.borderWidth=attrs.borderWidth;
}
Container.inheritsFrom(Drawable);

//Rest of container methods here

Container.prototype.draw=function(context){
    context.save();
    context.beginPath();
    context.rect(this.left,this.top,this.width,this.height);
    if(this.fill!=false){
        context.fillStyle=this.fill;
        context.fillRect(this.left,this.top,this.width,this.height);
        context.fill();
    }
    if(this.borderWidth>0){
        context.strokeStyle=this.borderColor;
        context.lineWidth=this.borderWidth;
        context.strokeRect(this.left,this.top,this.width,this.height);
        context.stroke();
    }
    context.closePath();
    context.clip();
    for(var i=0;i<this.children.length;i++){
        context.translate(this.left,this.top);
        setDraw(this.left,this.top);
        if(!this.children[i].draw(context))this.children[i].drawPosition(context,this.width/2,this.height/2);
        clearDraw(this.left,this.top);
        context.translate(-(this.left),-(this.top));
    }
    context.restore();
    return true;
}

function Pile(attrs) {
  Container.call(this, attrs);   
  //Rest of constructor code here
    this.children=[];
}
Pile.inheritsFrom(Container);

//Rest of pile methods here

Pile.prototype.draw=function(context){
    context.save();
    context.beginPath();
    context.rect(this.left,this.top,this.width,this.height);
    if(this.fill!=false){
        context.fillStyle=this.fill;
        context.fillRect(this.left,this.top,this.width,this.height);
        context.fill();
    }
    if(this.borderWidth>0){
        context.strokeStyle=this.borderColor;
        context.lineWidth=this.borderWidth;
        context.strokeRect(this.left,this.top,this.width,this.height);
        context.stroke();
    }
    context.closePath();
    context.clip();
    for(var i=0;i<this.children.length;i++){
        context.translate(this.left,this.top);
        setDraw(this.left,this.top);
        this.children[i].draw(context);
        clearDraw(this.left,this.top);
        context.translate(-(this.left),-(this.top));
    }
    context.restore();
    return true;
}

function Row(attrs) {
  Container.call(this, attrs);    
  //Rest of constructor code here
    this.children=[];
}
Row.inheritsFrom(Container);

//Rest of row methods here

Row.prototype.draw=function(context){
    context.save();
    context.beginPath();
    context.rect(this.left,this.top,this.width,this.height);
    if(this.fill!=false){
        context.fillStyle=this.fill;
        context.fillRect(this.left,this.top,this.width,this.height);
        context.fill();
    }
    if(this.borderWidth>0){
        context.strokeStyle=this.borderColor;
        context.lineWidth=this.borderWidth;
        context.strokeRect(this.left,this.top,this.width,this.height);
        context.stroke();
    }
    context.closePath();
    context.clip();
    var left= this.left,top=this.top;
    for(var i=0;i<this.children.length;i++){
        context.translate(left,top+(this.height-this.children[i].height)/2);
        setDraw(left,top+(this.height-this.children[i].height)/2);
        if(!this.children[i].draw(context)) {
            context.translate(-(left),-(top+(this.height-this.children[i].height)/2));
            context.translate(left,top);
            this.children[i].drawPosition(context, 0, this.height/2+this.children[i].size);
            context.translate(-left,-top);
            context.translate(left,top+(this.height-this.children[i].height)/2);
        }
        clearDraw(left,top+(this.height-this.children[i].height)/2);
        context.translate(-(left),-(top+(this.height-this.children[i].height)/2));
        left=left+this.children[i].width;
    }
    context.restore();
    return true;
}

function Column(attrs) {
  Container.call(this, attrs);  
  //Rest of constructor code here
    this.children=[];
}
Column.inheritsFrom(Container);

//Rest of column methods here

Column.prototype.draw=function(context){
    context.save();
    context.beginPath();
    context.rect(this.left,this.top,this.width,this.height);
    if(this.fill!=false){
        context.fillStyle=this.fill;
        context.fillRect(this.left,this.top,this.width,this.height);
        context.fill();
    }
    if(this.borderWidth>0){
        context.strokeStyle=this.borderColor;
        context.lineWidth=this.borderWidth;
        context.strokeRect(this.left,this.top,this.width,this.height);
        context.stroke();
    }
    context.closePath();
    context.clip();
    var left=this.left,top=this.top;
    for(var i=0;i<this.children.length;i++){
        context.translate(left+(this.width-this.children[i].width)/2,top);
        setDraw(left+(this.width-this.children[i].width)/2,top);
        if(!this.children[i].draw(context)) {
            context.translate(-(left+(this.width-this.children[i].width)/2),-(top));
            context.translate(left,top);
            this.children[i].drawPosition(context, 0, this.children[i].size);
            context.translate(-left,-top);
            context.translate(left+(this.width-this.children[i].width)/2,top);
        }
        clearDraw(left+(this.width-this.children[i].width)/2,top);
        context.translate(-(left+(this.width-this.children[i].width)/2),-(top));
        top=top+this.children[i].height;
    }
    context.restore();
    return true;
}

function Circle(attrs) {
  Container.call(this, attrs);      
  var dflt = {
    layoutCenterX: this.width / 2,
    layoutCenterY: this.height / 2,
    layoutRadius: Math.min(this.width, this.height) / 2 - 30
  };
  attrs = mergeWithDefault(attrs, dflt);
  //Rest of constructor code here
    this.children=[];
    this.layoutCenterX=attrs.layoutCenterX;
    this.layoutCenterY=attrs.layoutCenterY;
    this.layoutRadius=attrs.layoutRadius;
}
Circle.inheritsFrom(Container);

//Rest of circle methods here

Circle.prototype.draw=function(context){
    context.beginPath();
    context.translate(this.left,this.top);
    context.translate(this.layoutCenterX,this.layoutCenterY);
    for(var i=0;i<this.children.length;i++){
        context.rotate(i*(2*Math.PI/this.children.length));
        context.translate(0,this.layoutRadius);
        context.rotate(-(i*(2*Math.PI/this.children.length)));
        this.children[i].draw(context);
        context.rotate(i*(2*Math.PI/this.children.length));
        context.translate(0,-(this.layoutRadius));
        context.rotate(-(i*(2*Math.PI/this.children.length)));
    }
    context.translate(-(this.left),-(this.top));
    context.translate(-(this.layoutCenterX),-(this.layoutCenterY));
    context.closePath();
    return true;
}

function OvalClip(attrs) {
  Container.call(this, attrs);
  //Rest of constructor code here
    this.children=[];
}
OvalClip.inheritsFrom(Container);

//Rest of ovalClip methods here

OvalClip.prototype.draw=function(context){
    var x=this.left+this.width/ 2,y=this.top+this.height/2;
    var a=this.width/ 2,b=this.height/2;
    var k = .5522848, ox = a * k,oy = b * k;
    context.save();
    context.beginPath();
    context.moveTo(x - a , y);
    context.bezierCurveTo(x - a, y - oy, x - ox, y - b, x, y - b);
    context.bezierCurveTo(x + ox, y - b, x + a, y - oy, x + a, y);
    context.bezierCurveTo(x + a, y + oy, x + ox, y + b, x, y + b);
    context.bezierCurveTo(x - ox, y + b, x - a, y + oy, x - a, y);
    if(this.fill!=false){
        context.fillStyle=this.fill;
        context.fill();
    }
    if(this.borderWidth>0){
        context.strokeStyle=this.borderColor;
        context.lineWidth=this.borderWidth;
        context.stroke();
    }
    context.closePath();
    context.clip();
    for(var i=0;i<this.children.length;i++){
        context.translate(this.left,this.top);
        setDraw(this.left,this.top);
        this.children[i].draw(context);
        clearDraw(this.left,this.top);
        context.translate(-(this.left),-(this.top));
    }
    context.restore();
}


function Point(attrs) {
    var dflt = {
        color: "black",
        radius: 3,
    };
    attrs = mergeWithDefault(attrs, dflt);
    Primitive.call(this,attrs);
    this.radius=attrs.radius;
}
Point.inheritsFrom(Primitive);
Point.prototype.draw=function(context){
    context.strokeStyle=this.color;
    context.fillStyle=this.color;
    context.beginPath();
    context.lineWidth=this.lineWidth;
    context.arc(this.left,this.top,this.radius,0,360);
    context.fill();
    context.stroke();
    context.closePath();
    return true;
}
function PointGroup(attrs){
    Primitive.call(this,attrs);
    this.children=[];
}
PointGroup.inheritsFrom(Primitive);
PointGroup.prototype.draw=function(context){
    for(var i=0;i<this.children.length;i++)this.children[i].draw(context);
    return true;
}
/**
 * Measurement function to measure canvas fonts
 *
 * @return: Array with two values: the first [0] is the width and the seconds [1] is the height 
 *          of the font to be measured. 
 **/
function MeasureText(text, bold, font, size)
{
    // This global variable is used to cache repeated calls with the same arguments
    var str = text + ':' + bold + ':' + font + ':' + size;
    if (typeof(__measuretext_cache__) == 'object' && __measuretext_cache__[str]) {
        return __measuretext_cache__[str];
    }

    var div = document.createElement('DIV');
        div.innerHTML = text;
        div.style.position = 'absolute';
        div.style.top = '-100px';
        div.style.left = '-100px';
        div.style.fontFamily = font;
        div.style.fontWeight = bold ? 'bold' : 'normal';
        div.style.fontSize = size + 'pt';
    document.body.appendChild(div);
    
    var size = [div.offsetWidth, div.offsetHeight];

    document.body.removeChild(div);
    
    // Add the sizes to the cache as adding DOM elements is costly and can cause slow downs
    if (typeof(__measuretext_cache__) != 'object') {
        __measuretext_cache__ = [];
    }
    __measuretext_cache__[str] = size;
    
    return size;
}