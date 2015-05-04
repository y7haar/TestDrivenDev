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
    
        tddjs.namespace("server.controller").NameListGenerator = {
            setNameList: setNameList,
            getNameList: getNameList
        };
    
}());


