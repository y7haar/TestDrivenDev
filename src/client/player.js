/* 
 * Source Code für Spieler
 */
(function(){
 
    var name = "";
    
    function getName()
    {
       return name; 
    }
 
    tddjs.namespace("client").Player = {
        getName: getName
    };
}());

