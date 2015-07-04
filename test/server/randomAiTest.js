/* 
 *  Tests for randomAi
 */

TestCase("RandomAiTest", {
    setUp: function() {
        this.ai = new tddjs.server.controller.randomAi();
    },
    
    tearDown: function() {
    },
    
    "test object of ai should not be undefined": function() {
        assertObject(this.ai);
    }

});
