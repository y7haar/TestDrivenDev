/* 
 *  Tests for NameListGenerator
 */

TestCase("NameListGeneratorTest", {
    
    setUp: function () {
        this.nameListGenerator = Object.create(tddjs.server.controller.NameListGenerator);
    },

  "test object of NameListGenerator should not be undefined": function () { 
       assertObject(this.nameListGenerator);
  }
  
});






