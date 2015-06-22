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
    else
        throw new Error("Wrong parametercount!");
    // <editor-fold defaultstate="collapsed" desc="color-array">
    var _colors=[
    /*    "#FF8F3D",
        "#0ff",
        "#733ECA",
        "#FFEF3D",
        "#7AEA38",
        "#F13964",
        "#7B3DCA"*/
        "#8F5F64",
        "#958463",
        "#464F64",
        "#5C7D53",
        "#5F3B3F",
        "#63573D",
        "#2C3342",
        "#3A5434",
        "#592228",
        "#5D4A24",
        "#1C263E",
        "#284E1E"
    ];
    var _usedColor=0;
    function getRandomColor(){
        //return "#"+Math.floor(Math.random()*10)+Math.floor(Math.random()*10)+Math.floor(Math.random()*10);
        if(_usedColor>=_colors.length)
            _usedColor=0;
        return _colors[_usedColor++];
    }
    // </editor-fold>
    var _btn =[];
    var _countries =[];
    var _gridMap;
    var _gridMapW;
    var _gridMapH;
    var _map;
    var _water;
    
    var _selectedImg = new Image();
    _selectedImg.src = "client/ui/selectedImg.png";
    var _hoverImg = new Image();
    _hoverImg.src = "client/ui/hoverImg.png";
    var _activImg = new Image();
    _activImg.src = "client/ui/attackImg.png";
    var _waterImg = new Image();
    _waterImg.src = "client/ui/waterImg.png";
    
    var imgCacheMap;
    var imgCachePlayer;
    var imgCacheUnits;
    var imgCacheHover=[];
    var imgCacheSelected=[];
    var imgCacheActiv=[];
    
    var countryStrHover;
    var countryStrSelected;
    
    
    var serializedMap;
    function init(map){
        serializedMap=map;/*
        _getMap(serializedMap);
        _initGridMap();
        _initMap();
        _cacheCountryCenter();
        drawGame();*/
        window.requestAnimationFrame(drawLoading);
    }
    
    // <editor-fold defaultstate="collapsed" desc="draw-functions">
    // <editor-fold defaultstate="collapsed" desc="loading...">
    var step=0;
    var maxSteps=25;
    function drawLoading(){
        var w = 0;//(_ctx.canvas.width-border-_gridMap.length)/_gridMap.length;
        var h = 0;//(_ctx.canvas.height-border-bottom-_gridMap[0].length)/_gridMap[0].length;
        if(step>10){
            w = (_ctx.canvas.width-border-_gridMap.length)/_gridMap.length;
            h = (_ctx.canvas.height-border-bottom-_gridMap[0].length)/_gridMap[0].length;
        }
        clear();
        // <editor-fold defaultstate="collapsed" desc="loading-order">
        switch(step){
            //init map
            case 0: _loading("get Map...");
                break;
            case 1: _getMap(serializedMap);
                    _loading("get Map...");
                break;
                
            case 2: _loading("init GridMap...");
                break;
            case 3: _initGridMap();
                    _loading("init GridMap...");
                break;
                
            case 4: _loading("init Map...");
                break;
            case 5: _initMap();
                    _loading("init Map...");
                break;
                
            case 6: _loading("cache Country Center...");
                break;
            case 7: _cacheCountryCenter();
                    _loading("cache Country Center...");
                break;  
                
            //cache drawing
            case 10: _loading("Caching Map...");
                break;
            case 11: cacheMap(w,h);
                    _loading("Caching Map...");
                break;
                    
            case 12: _loading("Caching Hover...");
                break;
            case 13: cacheHover(w,h);
                    _loading("Caching Hover...");
                break;
                 
            case 14: _loading("Caching Selected...");
                break;
            case 15: cacheSelected(w,h);
                    _loading("Caching Selected...");
                break;
                  
            case 16: _loading("Caching Activ...");
                break;
            case 17: cacheAttack(w,h);
                    _loading("Caching Activ...");
                break;
                    
            case 18: _loading("Caching Player...");
                break;
            case 19: cachePlayer(w,h);
                    _loading("Caching Player...");
                break;
              
            case 20: _loading("Caching Units...");
                break;
            case 21: cacheUnits(w,h);
                    _loading("Caching Units...");
                break;
                    
            default: _loading("Loading...");
                break;
        }
        // </editor-fold>
        step++;
        if(step <= maxSteps)
            window.requestAnimationFrame(drawLoading);
        else
            window.requestAnimationFrame(_afterLoading);
    }
    function _loading(str){
        clear();
        _ctx.fillStyle = "#555";
        _ctx.lineWidth="1";
        _ctx.font = "25px Arial";
        _ctx.fillRect(5,_ctx.canvas.height/2-20,step/maxSteps*_ctx.canvas.width-5,40);
        _ctx.fillStyle = "#000";
        _ctx.fillText(str,_ctx.canvas.width/2-_ctx.measureText(str).width/2,_ctx.canvas.height/2+5);
    }
    function _afterLoading(){
        _ctx.canvas.addEventListener('mousemove', mouseMove, false);
        _ctx.canvas.addEventListener('mousedown', mouseDown, false);
        window.requestAnimationFrame(drawGame);
    }
    // </editor-fold>
    function drawGame(){
        clear();
        if(!imgCacheMap)
            cacheAll();
        drawCache();
        drawUI();
    }
    function drawCache(){
        _ctx.putImageData(imgCacheMap,0,0);
        //_ctx.drawImage(imgCachePlayer,0,0);
        
        countryStrSelected="|";
        for (var i in _countries){
            if(_countries[i].activ){
                var id=_countries[i].id;
                for (var j in imgCacheActiv)
                    if(imgCacheActiv[j].id === id)
                        _ctx.drawImage(imgCacheActiv[j].img,0,0);
            }
            if(_countries[i].selected){
                var id=_countries[i].id;
                for (var j in imgCacheSelected)
                    if(imgCacheSelected[j].id === id)
                        _ctx.drawImage(imgCacheSelected[j].img,0,0);
                countryStrSelected = countryStrSelected+_countries[i].getName()+"|";
            }   
        }
        
        _ctx.drawImage(imgCacheUnits,0,0);
    }
    
    var border=50; //25 an jeder seite
    var bottom=50; //insg 75 unten frei für menü etc
    function cacheAll(){
        var w = (_ctx.canvas.width-border-_gridMap.length)/_gridMap.length;
        var h = (_ctx.canvas.height-border-bottom-_gridMap[0].length)/_gridMap[0].length;
        
        cacheMap(w,h);
        cacheHover(w,h);
        cacheSelected(w,h);
        cacheAttack(w,h);
        cachePlayer(w,h);
        cacheUnits(w,h);
    }
    // <editor-fold defaultstate="collapsed" desc="CacheMap + Overlays">
    function cacheMap(w,h){
        clear();
        for(x=0;x<_gridMap.length;x++){
                for(y=0;y<_gridMap[0].length;y++){
                    _ctx.strokeStyle="#000";
                    _ctx.fillStyle = "#552700";
                    
                    if(_gridMap[x][y].id < 0){ //water
                        _ctx.drawImage(_waterImg, x+(x*w)+border/2,y+(y*h)+border/2,w+2,h+2);
                    }
                    else{
                        _ctx.fillStyle=_getContinentFromCountryById(_gridMap[x][y].id).color;
                        _ctx.lineWidth="1";
                        _ctx.fillRect(x+(x*w)+border/2,y+(y*h)+border/2,w+2,h+2);
                    }
                    

                    drawMapBorder(x,y,w,h);
                }
            }
        imgCacheMap=_ctx.getImageData(0,0,_ctx.canvas.width,_ctx.canvas.height);
    }
    function cachePlayer(w,h){
        clear();
        for(x=0;x<_gridMap.length;x++){
            for(y=0;y<_gridMap[0].length;y++){
                if(_gridMap[x][y].id > 0){
                    _ctx.fillStyle = "#fff";//_gridMap[x][y].getOwner().getColor();
                    _ctx.fillRect(x+(x*w)+border/2+w/2,y+(y*h)+border/2+h/2,1,1);
                }
            }
        }
        imgCachePlayer = new Image();
        imgCachePlayer.src=_ctx.canvas.toDataURL('image/png');

    }
    function cacheUnits(w,h){
        clear();
        for(var i in _countries){
            var id = _countries[i].id;
            var ok=false
            for(x=0;x<_gridMap.length;x++){
                for(y=0;y<_gridMap[0].length;y++){
                    if(_gridMap[x][y].id === id){
                        if(_gridMap[x][y].id > 0){
                            var cx=_gridMap[x][y].centerX;//+h/2+6;
                            var cy=_gridMap[x][y].centerY;//+w/2;
                            _ctx.fillStyle = "rgba(200,140,0,0.5)";
                            _ctx.beginPath();
                            _ctx.arc(cx+(cx*w)+border/2+w/2+4,cy+(cy*h)+border/2+h/2-4,10,0,2*Math.PI);
                            _ctx.fill();
                            _ctx.font="12px Georgia";
                            _ctx.fillStyle = "#fff";
                            _ctx.fillText(_gridMap[x][y].getUnitCount(),cx+(cx*w)+border/2+w/2,cy+(cy*h)+border/2+h/2);
                            ok=true;
                            break;
                        }
                    }
                }
                if(ok)
                    break;
            }
        }
        imgCacheUnits = new Image();
        imgCacheUnits.src=_ctx.canvas.toDataURL('image/png');
    }
    function cacheHover(w,h){
        clear();
        for(var i in _countries){
            var id = _countries[i].id;
            for(x=0;x<_gridMap.length;x++){
                for(y=0;y<_gridMap[0].length;y++){
                    if(_gridMap[x][y].id === id)
                        if(_gridMap[x][y].id > 0)
                            _ctx.drawImage(_hoverImg, x+(x*w)+border/2,y+(y*h)+border/2,w+2,h+2);
                }
            }
            var img = new Image();
            img.src=_ctx.canvas.toDataURL('image/png');
            imgCacheHover.push({id:id,img:img});
            clear();
        }
    }
    function cacheSelected(w,h){
        clear();
        for(var i in _countries){
            var id = _countries[i].id;
            for(x=0;x<_gridMap.length;x++){
                for(y=0;y<_gridMap[0].length;y++){
                    if(_gridMap[x][y].id === id)
                        if(_gridMap[x][y].id > 0)
                            _ctx.drawImage(_selectedImg, x+(x*w)+border/2,y+(y*h)+border/2,w+2,h+2);
                }
            }
            var img = new Image();
            img.src=_ctx.canvas.toDataURL('image/png');
            imgCacheSelected.push({id:id,img:img});
            clear();
        }
    }
    function cacheAttack(w,h){
        clear();
        for(var i in _countries){
            var id = _countries[i].id;
            for(x=0;x<_gridMap.length;x++){
                for(y=0;y<_gridMap[0].length;y++){
                    if(_gridMap[x][y].id === id)
                        if(_gridMap[x][y].id > 0)
                            _ctx.drawImage(_activImg, x+(x*w)+border/2,y+(y*h)+border/2,w+2,h+2);
                }
            }
            var img = new Image();
            img.src=_ctx.canvas.toDataURL('image/png');
            imgCacheActiv.push({id:id,img:img});
            clear();
        }
    }
    // </editor-fold>
    function drawMapBorder(x,y,w,h){
        var offset=1;
        _ctx.lineWidth="2";
        _ctx.strokeStyle="#000";
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
        _ctx.fillStyle = "#B89F89";//"#D49B6A";
        _ctx.fillRect(0,_ctx.canvas.height-border/2,_ctx.canvas.width,border/2);
        _ctx.fillRect(0,0,_ctx.canvas.width,border/2);
        _ctx.fillRect(0,0,border/2,_ctx.canvas.height);
        _ctx.fillRect(_ctx.canvas.width-border/2,0,border/2,_ctx.canvas.height);

        _ctx.fillStyle = "#E3CFBE";//#FFD1AA";
        _ctx.fillRect(border/2,_ctx.canvas.height-border/2-bottom,_ctx.canvas.width-border,bottom);

        //draw buttons
        for (var i in _btn)
           _btn[i].draw();

       //Text
       _ctx.font="20px Georgia";
       _ctx.fillStyle = "#000000";/*
       _ctx.fillText(stateStr,_ctx.canvas.width/2-_ctx.measureText(stateStr).width/2,20);*/
       _ctx.fillStyle = "#000000";
       _ctx.fillText(countryStrHover,_ctx.canvas.width-border-_ctx.measureText(countryStrHover).width,_ctx.canvas.height-border/2-bottom+20);
       _ctx.fillStyle = "#FF0000";
       _ctx.fillText(countryStrSelected,_ctx.canvas.width-border-_ctx.measureText(countryStrSelected).width,_ctx.canvas.height-border/2-bottom+40);
    }
    
    function clear(){
        _ctx.fillStyle = "#ebebeb";
        _ctx.fillRect(0,0,_ctx.canvas.width, _ctx.canvas.height);
        _ctx.clearRect(0,0,_ctx.canvas.width,_ctx.canvas.height);
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
    function mouseMove(oEvent){
        var x = Math.round((oEvent.offsetX) * _gridMap.length / (_ctx.canvas.width-border));
        var y = Math.round((oEvent.offsetY) * _gridMap[0].length / (_ctx.canvas.height-border));

        clear();
        drawGame();

        for (var i in _btn)
            _btn[i].isCoordOnButton(oEvent.offsetX,oEvent.offsetY);
        
        var id = _gridMap[x][y].id;
        for (var i in imgCacheHover){
            if(imgCacheHover[i].id === id){
                _ctx.drawImage(imgCacheHover[i].img,0,0);
                countryStrHover=_gridMap[x][y].getName()+" ("+_getContinentFromCountryById(id).getName()+")";
                /*
                _ctx.font="20px Georgia";
                _ctx.fillStyle = "#fff";
                _ctx.fillText(_gridMap[x][y].getName(),oEvent.offsetX+15,oEvent.offsetY+20);
                _ctx.fillText("UNITS: "+_gridMap[x][y].getUnitCount(),oEvent.offsetX+15,oEvent.offsetY+40);*/
            }
        }
    }
    function mouseDown(oEvent){
        var x = Math.round((oEvent.offsetX) * _gridMap.length / (_ctx.canvas.width-border));
        var y = Math.round((oEvent.offsetY) * _gridMap[0].length / (_ctx.canvas.height-border));

        clear();
        //drawGame();
        _gridMap[x][y].selected=!_gridMap[x][y].selected;
        if(_gridMap[x][y].selected){
            for(var i in _gridMap[x][y].getBorders()){
                _gridMap[x][y].getBorders()[i].activ=true;
            }
        }
        else
        {
            for(var i in _gridMap[x][y].getBorders()){
                _gridMap[x][y].getBorders()[i].activ=false;
            }
        }
        drawGame();
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
        var cache_water;
        //get all Countrys
        for(var x=0; x<map.gridMap.length; x++){
            for(var y=0; y<map.gridMap[0].length; y++){
                if(cache_countrys.indexOf(map.gridMap[x][y].id) === -1 && map.gridMap[x][y].id >= 0)
                    cache_countrys.push(map.gridMap[x][y].id);
                else if(map.gridMap[x][y].id < 0)
                    cache_water=map.gridMap[x][y];
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
            //if(cBorder) //<<<<<<<<<<--------------------------------HACK!!!!!!!!!!!!!
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
        
        _water = new tddjs.client.map.water();
        _water.id = -1;
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
        
        //_initGridMap();
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
        if(id < 0)
            return _water;
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
    
    function _initMap(){
        //_gridMap = aGridMap;
        for(x=0;x<_gridMap.length;x++){
            for(y=0;y<_gridMap[0].length;y++){
                if(_countries.indexOf(_gridMap[x][y]) === -1)
                    _countries.push(_gridMap[x][y]);
            }
        }
        //_cacheCountryCenter();
    }
    
    function _getCountries(){
        if(_countries.length === 0)
            throw new Error("Call _initMap first!");
        return _countries;
    }
    
    function _cacheCountryCenter(){
        /*
        for(x=5;x<_gridMap.length-5;x++){
            for(y=5;y<_gridMap[0].length-5;y++){
                if(_gridMap[x][y].id === _gridMap[x-5][y].id)
                    if(_gridMap[x][y].id === _gridMap[x][y-5].id)
                        if(_gridMap[x][y].id === _gridMap[x+5][y].id)
                            if(_gridMap[x][y].id === _gridMap[x][y+5].id){
                                _gridMap[x][y].centerX=x;
                                _gridMap[x][y].centerY=y;
                            }
            }
        }
        */
        for(var i in _countries){
            var id = _countries[i].id;
            var cur_max_x=0;
            var cur_max_y=0;
            var last_max_x=0;
            var last_max_y=0;
            var best_pos=[];
            
            for(x=0;x<_gridMap.length;x++){
                for(y=0;y<_gridMap[0].length;y++){
                    if(_gridMap[x][y].id===id){
                        cur_max_x=0;
                        cur_max_y=0;
                        var pos_x=x;
                        var pos_y=y;
                        while(pos_x<_gridMap.length && _gridMap[pos_x][y].id===id){
                            pos_x++;
                            cur_max_x++;
                        }
                        while(pos_y<_gridMap[x].length && _gridMap[x][pos_y].id===id){
                            pos_y++;
                            cur_max_y++;
                        }
                        best_pos.push({x:x,y:y,max_x:cur_max_x,max_y:cur_max_y});
                        /*
                        if(cur_max_x>last_max_x && cur_max_y>last_max_y){
                            last_max_x=cur_max_x;
                            last_max_y=cur_max_y;
                            _gridMap[x][y].centerX=x;
                            _gridMap[x][y].centerY=y;
                        }*/
                    }
                }
            }
            var ratio=0;
            var last_ratio=100;
            var area=0;
            var last_area=area;
            var pos={x:0,y:0};
            for(var j in best_pos){
                ratio=best_pos[j].max_y/best_pos[j].max_x;
                area=best_pos[j].max_y*best_pos[j].max_x;
                if(ratio <= 1)
                    ratio=best_pos[j].max_x/best_pos[j].max_y;
                if(ratio <= last_ratio && area>=last_area){
                    last_ratio=ratio;
                    last_area=area;
                    pos.x=best_pos[j].x;//+Math.round(best_pos[j].max_x/2);
                    pos.y=best_pos[j].y;//+Math.round(best_pos[j].max_y/2);
                    if(ratio === 1)
                        break;
                }
            }
            _countries[i].centerX=pos.x;
            _countries[i].centerY=pos.y;
        }
    }
    // </editor-fold>
    
    
    
    //public
    this.init = init;
    this.drawGame=drawGame;
    this.drawLoading=drawLoading;
    
    this.addButton = addButton;
    this.getButtons = getButtons;
    this.mouseMove = mouseMove;
    this.mouseDown = mouseDown;
    
    //private
    this._initMap = _initMap;
    this._getMap = _getMap;
    this._getCountries = _getCountries;
    this._deserialize = _deserialize;
    
    //helper
}