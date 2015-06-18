/* 
 *  Source-Code for NameListGenerator
 */

if (typeof module !== "undefined")
{
    module.exports = nameListGenerator;
}

else
{
    tddjs.namespace("server.controller").nameListGenerator = nameListGenerator;
}

function nameListGenerator()
{

    var _nameList = [];
    var _currentIndex = 0;
    var DEFAULT_LIST = "./nameLists/games.txt";

    function readFileList(file, callback)
    {
        var fs = require('fs');

        fs.readFile(file, {encoding: "utf-8"}, function(err, data) {

            if (err)
                throw err;

            var splits = data.split("\n");
            setNameList(splits);

            callback();
        });
    }

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

        while (currentIndex > 0)
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
    this.readFileList = readFileList;
    this.DEFAULT_LIST = DEFAULT_LIST;

}
