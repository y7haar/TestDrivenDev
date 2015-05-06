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
        name = newName;
    }
 
    tddjs.namespace("client").Player = {
        getName: getName,
        setName: setName
    };
}());

