/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


AssertionsTestCase = TestCase("AssertionsTestCase");
  
AssertionsTestCase.prototype.testAlwaysPass = function(){
  var expected = 1, actual = 1;
  assertEquals("The vales should be the same", expected, actual);
  assertEquals(expected, actual);
  
  var myStr = "hello";
  assertString("The variable should contain a string", myStr);
  assertString(myStr);
};
  
AssertionsTestCase.prototype.testAlwaysFail = function(){
  assertEquals(1, 2);
};
 
AssertionsTestCase.prototype.testAlwaysFailWithMessage = function(){
  assertEquals("1<>2", 1, 2);
};