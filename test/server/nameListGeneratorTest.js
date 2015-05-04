/* 
 *  Tests for NameListGenerator
 */

TestCase("NameListGeneratorTest", {
    
    setUp: function () {
        this.nameListGenerator = Object.create(tddjs.server.controller.NameListGenerator);
        this.initialArray = [1, 2, 3, 4];
    },

  "test object of NameListGenerator should not be undefined": function () { 
       assertObject(this.nameListGenerator);
  },
  
    "test NameListGenerator should store a given array": function () { 
        assertNotSame(this.initialArray, this.nameListGenerator.getNameList());
        
        this.nameListGenerator.setNameList(this.initialArray);
        
        assertSame(this.initialArray, this.nameListGenerator.getNameList());
 
  }
  
});






