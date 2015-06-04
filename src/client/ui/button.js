/* 
 *
 */

tddjs.namespace("client.ui").button = button;

function button(x,y,str,ctx){
    
    var x=x;
    var y=y;
    var str=str;
    var ctx=ctx;
    
    var hover=false;
    var size=20;
    
    function setText(text){
        str = text;
    }
    
    function isCoordOnButton(_x,_y){
        hover=(_x>=x && _x<=x+ctx.measureText(str).width+10 && _y>=y && _y <= y+size+10);
        return hover;
    }
    
    function click(){
        alert("CLICK");
    }
    
    function draw(){
        ctx.fillStyle= "#000";
        ctx.strokeStyle="#fff";
        ctx.font = size+"px Arial";

        if(hover)
        {
            ctx.fillStyle = "#0f0";
        }

        ctx.fillRect(x,y,ctx.measureText(str).width+10,size+10);
        ctx.strokeRect(x,y,ctx.measureText(str).width+10,size+10);
        ctx.fillStyle= "#fff";
        ctx.fillText(str,x+5,y+size);
    }
    
    
    this.draw=draw;
    this.isCoordOnButton=isCoordOnButton;
    this.click=click;
    this.setText=setText;
}