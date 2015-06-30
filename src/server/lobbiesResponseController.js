/* 
 * Source-Code for lobbiesResponseController
 */

if (typeof module !== "undefined")
{
    module.exports = lobbiesResponseController;
}

else
{
    tddjs.namespace("server.controller").lobbiesResponseController = lobbiesResponseController;
}


function lobbiesResponseController()
{
    var _lobbyController = tddjs.server.controller.lobbyController.getInstance();
    
    // Needed because of different Scope in NodeJs
    var _self = this;
}