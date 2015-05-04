/* 
 *  Source-Code for NameListGenerator
 */
(function ()
{
        var _nameList = [];
        
        function setNameList(aNameList)
        {
            _nameList = aNameList;
        }
        
        function getNameList()
        {
            return _nameList;
        }
        
        function shuffleNameList()
        {
            var currentIndex = _nameList.length;
            
            while(currentIndex > 0)
            {
                // calculate new random index
                var randomIndex = Math.floor(Math.random() * currentIndex--);
                
                //  swap elements
                var swapValue = _nameList[currentIndex];
                _nameList[currentIndex] = _nameList[randomIndex];
                _nameList[randomIndex] = swapValue;
            }
        }
    
        tddjs.namespace("server.controller").NameListGenerator = {
            setNameList: setNameList,
            getNameList: getNameList,
            shuffleNameList: shuffleNameList
        };
    
}());


