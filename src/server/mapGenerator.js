/* 
 * Source-Code for MapGenerator
 */

tddjs.namespace("server.controller").mapGenerator =  mapGenerator;

function mapGenerator()
{
    var _grid;
    
    function setGridSize(x,y){
        _grid = createArray(x,y);
    }
    
    function getMapGrid(){
        return _grid;
    }
    function getMapWidth(){
        return _grid.length;
    }
    function getMapHeight(){
        return _grid[0].length;
    }
    
    function createArray(length) {
        var arr = new Array(length || 0),
            i = length;

        if (arguments.length > 1) {
            var args = Array.prototype.slice.call(arguments, 1);
            while(i--) arr[length-1 - i] = createArray.apply(this, args);
        }

        return arr;
    }
    
    this.setGridSize = setGridSize;
    this.getMapGrid = getMapGrid;
    this.getMapWidth = getMapWidth;
    this.getMapHeight = getMapHeight;
};