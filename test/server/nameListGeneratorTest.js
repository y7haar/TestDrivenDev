/* 
 *  Tests for NameListGenerator
 */

TestCase("NameListGeneratorTest", {
    
    setUp: function () {
        this.nameListGenerator = new tddjs.server.controller.nameListGenerator();
        this.initialArray = [1, 2, 3, 4];
    },
    
    tearDown: function () {
        this.nameListGenerator.getNameList().length = 0;
    },

  "test object of NameListGenerator should not be undefined": function () { 
       assertObject(this.nameListGenerator);
  },
  
    "test NameListGenerator should store a given array": function () { 
        assertNotSame(this.initialArray, this.nameListGenerator.getNameList());
        this.nameListGenerator.setNameList(this.initialArray);
        assertSame(this.initialArray, this.nameListGenerator.getNameList());
  },
  
      "test given array should be randomly shuffled and still contain every value": function () { 
        this.nameListGenerator.setNameList(this.initialArray);
        this.nameListGenerator.shuffleNameList();
         
        this.shuffled = this.nameListGenerator.getNameList();
        
        /*
         *  tests if the array still holds every given element
         */
        assertTrue(this.shuffled[0] === 1 || this.shuffled[1] === 1 || this.shuffled[2] === 1 || this.shuffled[3] === 1);
        assertTrue(this.shuffled[0] === 2 || this.shuffled[1] === 2 || this.shuffled[2] === 2 || this.shuffled[3] === 2);
        assertTrue(this.shuffled[0] === 3 || this.shuffled[1] === 3 || this.shuffled[2] === 3 || this.shuffled[3] === 3);
        assertTrue(this.shuffled[0] === 4 || this.shuffled[1] === 4 || this.shuffled[2] === 4 || this.shuffled[3] === 4);
  },
  
   "test nameListGenerator should have a function to get the next entry": function () { 
        assertFunction(this.nameListGenerator.getNextName);
  },
  
   "test nameListGenerator getNextName should return names in correct order": function () { 
       this.nameListGenerator.setNameList(this.initialArray);
       assertEquals(1, this.nameListGenerator.getNextName());
       assertEquals(2, this.nameListGenerator.getNextName());
       assertEquals(3, this.nameListGenerator.getNextName());
       assertEquals(4, this.nameListGenerator.getNextName());
  },
  
   "test nameListGenerator getNextName should return names in same order as getNameList after shuffling": function () { 
       this.nameListGenerator.setNameList(this.initialArray);
       this.nameListGenerator.shuffleNameList();
       
       var list = this.nameListGenerator.getNameList();
       
       assertEquals(list[0], this.nameListGenerator.getNextName());
       assertEquals(list[1], this.nameListGenerator.getNextName());
       assertEquals(list[2], this.nameListGenerator.getNextName());
       assertEquals(list[3], this.nameListGenerator.getNextName());
  },
  
  "test nameListGenerator getNextName should return names from beginning, if next is called more often than number of names": function () { 
       this.nameListGenerator.setNameList(this.initialArray);

       assertEquals(1, this.nameListGenerator.getNextName());
       assertEquals(2, this.nameListGenerator.getNextName());
       assertEquals(3, this.nameListGenerator.getNextName());
       assertEquals(4, this.nameListGenerator.getNextName());
       
       assertEquals(1, this.nameListGenerator.getNextName());
       assertEquals(2, this.nameListGenerator.getNextName());
       assertEquals(3, this.nameListGenerator.getNextName());
       assertEquals(4, this.nameListGenerator.getNextName());
  }
  
});






