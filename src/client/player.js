/* 
 * Source Code für Spieler
 */
(function(){
 
    var name = "";
    
    function getName()
    {
       return name; 
    }
    
    function setName(newName)
    {
        if(typeof(newName) !== "string")
            throw new TypeError("Not a String");
        
        name = newName;
    }
 
    tddjs.namespace("client").Player = {
        getName: getName,
        setName: setName
    };
}());

