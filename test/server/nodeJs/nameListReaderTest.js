/* 
 *  Test case for nameList Reader
 *  
 */

TestCase("NameListReaderTest", {
    
    setUp: function () {
      this.nameListReader = new tddjs.server.controller.nameListReader();
    },
    
    tearDown: function(){
        delete this.nameListReader;
    },

  "test object of nameListReader should not be undefined": function () { 
        assertObject(this.nameListReader);
  }
  
});




