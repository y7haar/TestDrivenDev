/* 
 * Tests for MapGenerator
 */


TestCase("MapGeneratorTest", {
    
    setUp: function () {
        this.mapGenerator = new tddjs.server.controller.nameListGenerator();
    },
    
    tearDown: function () {

    },
    
    "test object of MapGenerator should not be undefined": function () { 
       assertObject(this.MPGenerator);
    }
});