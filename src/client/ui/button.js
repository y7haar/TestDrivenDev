/* 
 *
 */

tddjs.namespace("client.ui").button = button;

function button(x,y,str,ctx){
    
    var x=x;
    var y=y;
    var str=str;
    var ctx=ctx;
    
    
    function draw(){
        ctx.fillStyle= "#000";
        ctx.strokeStyle="#fff";
        ctx.font = "20px Arial";
/*
        if(mouse_x >= x && mouse_x <= ctx.measureText(str).width+x
                && mouse_y >= y && mouse_y <= 20+y)
        {
            ctx.fillStyle = "#0f0";
        }
*/
        ctx.fillRect(x,y,ctx.measureText(str).width+10,30);
        ctx.strokeRect(x,y,ctx.measureText(str).width+10,30);
        ctx.fillStyle= "#fff";
        ctx.fillText(str,x+5,y+20);
    }
    
    
    this.draw=draw;
}