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
    // <editor-fold defaultstate="collapsed" desc="color-array">
    var _colors=[
        "#f00",
        "#0f0",
        "#055"
    ];
    var _usedColor=[];
    function getRandomColor(){
        return "#"+Math.floor(Math.random()*10)+Math.floor(Math.random()*10)+Math.floor(Math.random()*10);
    }
    // </editor-fold>
    var _btn =[];
    var _countries =[];
    var _gridMap;
    var _gridMapW;
    var _gridMapH;
    var _map;
    
    var _selectedImg = new Image();
    _selectedImg.src = "client/ui/selectedImg.png";
    var _hoverImg = new Image();
    _hoverImg.src = "client/ui/hoverImg.png";
    
    
    function init(){
        _getMap();
        _initMap();
        drawGame();
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
        var w = (_ctx.canvas.width-border-_gridMap.length)/_gridMap.length;
        var h = (_ctx.canvas.height-border-bottom-_gridMap[0].length)/_gridMap[0].length;

        for(x=0;x<_gridMap.length;x++){
            for(y=0;y<_gridMap[0].length;y++){
                _ctx.strokeStyle="#000";
                _ctx.fillStyle = "#552700";
                _ctx.fillStyle=_getContinentFromCountryById(_gridMap[x][y].id).color;
                _ctx.lineWidth="1";
                _ctx.fillRect(x+(x*w)+border/2,y+(y*h)+border/2,w+2,h+2);

                if(_gridMap[x][y].hover){
                    _ctx.drawImage(_hoverImg, x+(x*w)+border/2,y+(y*h)+border/2,w+2,h+2);

                }

                if(_gridMap[x][y].selected){
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
            if(_gridMap[x][y].id !== _gridMap[x-1][y].id)
            {
                _ctx.beginPath();
                _ctx.moveTo(x+(x*w)+border/2, y+(y*h)+border/2);
                _ctx.lineTo(x+(x*w)+border/2+0, y+(y*h)+border/2+h+offset);
                _ctx.stroke();
            }
            if(_gridMap[x][y].id !== _gridMap[x][y-1].id)
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
                if(_gridMap[x][y].id !== _gridMap[x][y-1].id)
                {
                    _ctx.beginPath();
                    _ctx.moveTo(x+(x*w)+border/2, y+(y*h)+border/2);
                    _ctx.lineTo(x+(x*w)+border/2+w+offset, y+(y*h)+border/2+0);
                    _ctx.stroke();
                }
            }
            else if(y===0 && x>0 )
            {
                if(_gridMap[x][y].id !== _gridMap[x-1][y].id)
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
    function _deserialize(map){
        map=JSON.parse(map);
        
        _gridMapW=map.gridMap.length;
        _gridMapH=map.gridMap[0].length;
        _gridMap=map.gridMap;
        
        var cache_countrys=[];
        var countrys=[];
        //get all Countrys
        for(var x=0; x<map.gridMap.length; x++){
            for(var y=0; y<map.gridMap[0].length; y++){
                if(cache_countrys.indexOf(map.gridMap[x][y].id) === -1)
                    cache_countrys.push(map.gridMap[x][y].id);
            }
        }
        for(var i=0; i<cache_countrys.length; i++){
            countrys[i] = new tddjs.client.map.country();
            countrys[i].id=cache_countrys[i];
            countrys[i].setName("ID:"+cache_countrys[i]);
        }
        
        //init Borders
        for(var c=0;c<map.continents.length;c++){
            for(var countr=0;countr<map.continents[c].countries.length;countr++){
                for(var b=0; b<map.continents[c].countries[countr].borders.length; b++){
                    _addBorder(map.continents[c].countries[countr].id,map.continents[c].countries[countr].borders[b]);
                }
            }
        }
        function _addBorder(id,idBorder){
            var c;
            var cBorder;
            for(var i=0; i<countrys.length; i++){
                if(countrys[i].id === id){
                    c=i;
                    break;
                }
            }
            for(var i=0; i<countrys.length; i++){
                if(countrys[i].id === idBorder){
                    cBorder=i;
                    break;
                }
            }
            countrys[c].addBorder(countrys[cBorder]);
        }
       
        var cache_continents=[];
        var continents=[];
        //get all Continents
        for(var c=0;c<map.continents.length;c++){
            if(cache_continents.indexOf(map.continents[c].id) === -1)
                    cache_continents.push(map.continents[c].id);
        }
        for(var i=0; i<cache_continents.length; i++){
            continents[i] = new tddjs.client.map.continent();
            continents[i].id=cache_continents[i];
            continents[i].setName("ID:"+cache_continents[i]);
            continents[i].color=getRandomColor();
        }
        
        //init Countinents
        for(var c=0;c<map.continents.length;c++){
            for(var country=0; country<map.continents[c].countries.length; country++){
                _addCountry(map.continents[c].id,map.continents[c].countries[country].id);
            }
        }
        function _addCountry(id,idCountry){
            var c;
            var cCountry;
            for(var i=0; i<continents.length; i++){
                if(continents[i].id === id){
                    c=i;
                    break;
                }
            }
            for(var i=0; i<countrys.length; i++){
                if(countrys[i].id === idCountry){
                    cCountry=i;
                    break;
                }
            }
            continents[c].addCountry(countrys[cCountry]);
        }
        
        //generate Map
        _map = new tddjs.client.map.map();
        for(var i=0; i<continents.length; i++)
            _map.addContinent(continents[i]);
        
        /* 
        _map.continents = [];
        for(var c=0;c<map.continents.length;c++){
            _map.continents[c] = new tddjs.client.map.continent();
            _map.continents[c].setUnitBonus(map.continents[c].unitBonus);
            
            _map.continents[c].countries = [];
            for(var countr=0;countr<map.continents.length;countr++){
                var country = new tddjs.client.map.country();
                _map.continents[c].addCountry(country);
            }
        }
        */
        return _map;
    }
    
    function _getMap(map){
        //daten vom server
        _deserialize(map);
        
        _initGridMap();
    }
    
    function _initGridMap(){
        //for-each country in map
        //_gridMap[x][y]=country (der id an x,y)
        for(var x=0; x<_gridMapW; x++){
            for(var y=0; y<_gridMapH; y++){
                _gridMap[x][y] = _getCountryById(_gridMap[x][y].id);
            }
        }
    }
    
    function _getCountryById(id){
        for(var c in _map.getContinents()){
            for(var countr in _map.getContinents()[c].getCountrys())
                if(_map.getContinents()[c].getCountrys()[countr].id === id)
                    return _map.getContinents()[c].getCountrys()[countr];
        }
    }
    
    function _getContinentFromCountryById(id){
        for(var c in _map.getContinents()){
            for(var countr in _map.getContinents()[c].getCountrys())
                if(_map.getContinents()[c].getCountrys()[countr].id === id)
                    return _map.getContinents()[c];
        }
    }
    
    function _initMap(aGridMap){
        _gridMap = aGridMap;
        for(x=0;x<_gridMap.length;x++){
            for(y=0;y<_gridMap[0].length;y++){
                if(_countries.indexOf(_gridMap[x][y]) === -1)
                    _countries.push(_gridMap[x][y]);
            }
        }
    }
    
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
    this._getMap = _getMap;
    this._getCountries = _getCountries;
    this._deserialize = _deserialize;
    
    //helper
}