/* 
 * Sourcecode for gameUiController
 */


tddjs.namespace("client.ui").gameUiController = gameUiController;

function gameUiController(aGLC,aCtx){
    
    var gameLoopController = null;
    var _ctx = null;
    if(arguments.length === 2){
        gameLoopController = aGLC;
        _ctx = aCtx;
    }
    
    var _btn =[];
    var _countries =[];
    var _gridMap;
    
    var _selectedImg = new Image();
    _selectedImg.src = "client/ui/selectedImg.png";
    var _hoverImg = new Image();
    _hoverImg.src = "client/ui/hoverImg.png";
    
    
    function init(){
        
    }
    
    // <editor-fold defaultstate="collapsed" desc="draw-functions">
    function drawGame(){
        clear();
        drawMap();
        drawUI();
    }
    
    var border=50; //25 an jeder seite
    var bottom=50; //insg 75 unten frei für menü etc
    function drawMap(){
        var w = (_ctx.canvas.width-border-_gridMap.cellGrid.length)/_gridMap.cellGrid.length;
        var h = (_ctx.canvas.height-border-bottom-_gridMap.cellGrid[0].length)/_gridMap.cellGrid[0].length;

        for(x=0;x<_gridMap.cellGrid.length;x++){
            for(y=0;y<_gridMap.cellGrid[0].length;y++){
                _ctx.strokeStyle="#000";
                _ctx.fillStyle = "#552700";
                _ctx.fillStyle=_gridMap.cellGrid[x][y].color;
                _ctx.lineWidth="1";
                _ctx.fillRect(x+(x*w)+border/2,y+(y*h)+border/2,w+2,h+2);

                if(_gridMap.cellGrid[x][y].hover){
                    _ctx.drawImage(_hoverImg, x+(x*w)+border/2,y+(y*h)+border/2,w+2,h+2);

                }

                if(_gridMap.cellGrid[x][y].selected){
                    _ctx.drawImage(_selectedImg, x+(x*w)+border/2,y+(y*h)+border/2,w+2,h+2);
                }

                drawMapBorder(x,y,w,h);
            }
        }
    }
    function drawMapBorder(x,y,w,h){
        var offset=1;
        _ctx.lineWidth="2";
        _ctx.strokeStyle="#00F";
        if(x>0 && y>0){
            if(_gridMap.cellGrid[x][y].id !== _gridMap.cellGrid[x-1][y].id)
            {
                _ctx.beginPath();
                _ctx.moveTo(x+(x*w)+border/2, y+(y*h)+border/2);
                _ctx.lineTo(x+(x*w)+border/2+0, y+(y*h)+border/2+h+offset);
                _ctx.stroke();
            }
            if(_gridMap.cellGrid[x][y].id !== _gridMap.cellGrid[x][y-1].id)
            {
                _ctx.beginPath();
                _ctx.moveTo(x+(x*w)+border/2, y+(y*h)+border/2);
                _ctx.lineTo(x+(x*w)+border/2+w+offset, y+(y*h)+border/2+0);
                _ctx.stroke();
            }
        }
        else{
            if(x===0 && y>0 )
            {
                if(_gridMap.cellGrid[x][y].id !== _gridMap.cellGrid[x][y-1].id)
                {
                    _ctx.beginPath();
                    _ctx.moveTo(x+(x*w)+border/2, y+(y*h)+border/2);
                    _ctx.lineTo(x+(x*w)+border/2+w+offset, y+(y*h)+border/2+0);
                    _ctx.stroke();
                }
            }
            else if(y===0 && x>0 )
            {
                if(_gridMap.cellGrid[x][y].id !== _gridMap.cellGrid[x-1][y].id)
                {
                    _ctx.beginPath();
                    _ctx.moveTo(x+(x*w)+border/2, y+(y*h)+border/2);
                    _ctx.lineTo(x+(x*w)+border/2+0, y+(y*h)+border/2+h+offset);
                    _ctx.stroke();
                }
            }
        }
        _ctx.beginPath();
        _ctx.moveTo(border/2,border/2);
        _ctx.lineTo(_ctx.canvas.width-border/2, border/2);
        _ctx.lineTo(_ctx.canvas.width-border/2, _ctx.canvas.height-border/2-bottom);
        _ctx.lineTo(border/2, _ctx.canvas.height-border/2-bottom);
        _ctx.lineTo(border/2, border/2);
        _ctx.stroke();
    }
    
    function drawUI(){
        //draw borders etc
        _ctx.fillStyle = "#D49B6A";
        _ctx.fillRect(0,_ctx.canvas.height-border/2,_ctx.canvas.width,border/2);
        _ctx.fillRect(0,0,_ctx.canvas.width,border/2);
        _ctx.fillRect(0,0,border/2,_ctx.canvas.height);
        _ctx.fillRect(_ctx.canvas.width-border/2,0,border/2,_ctx.canvas.height);

        _ctx.fillStyle = "#FFD1AA";
        _ctx.fillRect(border/2,_ctx.canvas.height-border/2-bottom,_ctx.canvas.width-border,bottom);

        //draw buttons
        for (var i in _btn)
           _btn[i].draw();

       //Text
       _ctx.font="20px Georgia";
       _ctx.fillStyle = "#000000";
       _ctx.fillText(stateStr,_ctx.canvas.width/2-_ctx.measureText(stateStr).width/2,20);
       _ctx.fillStyle = "#000000";
       _ctx.fillText(countryStrHover,_ctx.canvas.width-border-_ctx.measureText(countryStrHover).width,_ctx.canvas.height-border/2-bottom+20);
       _ctx.fillStyle = "#FF0000";
       _ctx.fillText(countryStrSelected,_ctx.canvas.width-border-_ctx.measureText(countryStrSelected).width,_ctx.canvas.height-border/2-bottom+40);
    }
    function clear(){
        _ctx.fillStyle = "#ebebeb";
        _ctx.fillRect(0,0,_ctx.canvas.width, _ctx.canvas.height);
    }
    // </editor-fold>
    
    // <editor-fold defaultstate="collapsed" desc="UI-functions">
    function addButton(aBtn){
        if(arguments.length < 1)
            throw new Error("Wrong parametercount!");
        if(!(aBtn instanceof tddjs.client.ui.button))
            throw new TypeError("Parameter ist not instance of Button");
        _btn.push(aBtn);
    }
    function getButtons(){
        return _btn;
    }
    // </editor-fold>
    
    
    // <editor-fold defaultstate="collapsed" desc="Map-functions">
    function _initMap(aGridMap){
        _gridMap = aGridMap;
        for(x=0;x<_gridMap.cellGrid.length;x++){
            for(y=0;y<_gridMap.cellGrid[0].length;y++){
                if(_countries.indexOf(_gridMap.cellGrid[x][y]) === -1)
                    _countries.push(_gridMap.cellGrid[x][y]);
            }
        }
    }
    
    function _extendCountries(){
        if(_countries.length === 0)
            throw new Error("Call _initMap first!");
        for (var i=0; i<_countries.length; ++i)
            _countries[i]._isOnCoord=_isOnCoord;
    }
    // <editor-fold defaultstate="collapsed" desc="Country helper">
    function _isOnCoord(x,y){
        console.log(this);
        return null;
    }
    // </editor-fold>
    
    function _getCountries(){
        if(_countries.length === 0)
            throw new Error("Call _initMap first!");
        return _countries;
    }
    // </editor-fold>
    
    
    
    //public
    this.init = init;
    this.drawGame=drawGame;
    this.addButton = addButton;
    this.getButtons = getButtons;
    
    //private
    this._initMap = _initMap;
    this._getCountries = _getCountries;
    this._extendCountries = _extendCountries;
    
    //helper
}