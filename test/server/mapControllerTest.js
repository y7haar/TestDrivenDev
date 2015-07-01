/* 
 * Testcases for MapController
 */


TestCase("MapControllerTest", {
    setUp: function (){
        this.mapCon = tddjs.server.controller.mapController();
    }, 
    tearDown: function (){
        delete this.mapCon;
    },
    
    "test object of mapController should not be undefined": function(){  
        assertObject(this.mapCon);
    },
    
    "test if mapController has a instance of mapGenerator after init": function(){  
        this.mapCon.init();
        var mapGen = this.mapCon.getMapGenerator();
        
        assertInstanceOf(tddjs.server.controller.mapController,mapGen);
    },
    
    "test mapController should be setup before getMap is called":function(){
        assertException(this.mapCon.getMap(),"Error");
    },
    
    "test mapController should be setup before getSerializedMap is called":function(){
        assertException(this.mapCon.getSerializedMap(),"Error");
    },
    
    "test if mapController return valid serverMap": function(){  
        this.mapCon.init();
        //TODO: strukture überlegen, wie was aufgerufen werden muss
        this.mapCon.setPlayer(); //<- evtl in init direkt legen
        
        var map = this.mapCon.getMap();
        //TODO: test map
    },
    
    "test if mapController return valid serialized clientMap": function(){  
        //TODO: test für serialisierte map
    },
    
    "test mapController should return same map if not reseted": function(){  
        //TODO: gleicher test wie "test if mapController return valid serverMap"
        // nur 2mal, um zu testen ob 2mal die selbe map kommt
        
        var map = this.mapCon.getMap();
        var map2 = this.mapCon.getMap();
        
        assertEquals(map,map2);
    },
    
    "test if mapController produce different mapSizes for different Playercount": function(){  
        //TODO: test dass unterschiedliche gridSizes gibt
    }
    
});
