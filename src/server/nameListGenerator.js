/* 
 *  Source-Code for NameListGenerator
 */

tddjs.namespace("server.controller").nameListGenerator =  nameListGenerator;

function nameListGenerator()
{
    var _nameList = [];
    var _currentIndex = 0;

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
    
    function getNextName()
    {
        _currentIndex %= _nameList.length;
        return _nameList[_currentIndex++];
    }

    this.setNameList = setNameList;
    this.getNameList = getNameList;
    this.shuffleNameList = shuffleNameList;
    this.getNextName = getNextName;
    
};


