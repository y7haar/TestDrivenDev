/* 
 * Testcases for Player on the server side
 */
TestCase("PlayerServerTest",
        {
            setUp: function() {
                this.player1 = new tddjs.server.player();
            },
            "test Player Object should be created": function()
            {
                assertObject(this.player1);
            },
            "test Player should have the needed Function": function()
            {
                assertFunction(this.player1.getColor);
                assertFunction(this.player1.setColor);
                assertFunction(this.player1.setId);
                assertFunction(this.player1.getId);
                assertFunction(this.player1.getName);
                assertFunction(this.player1.setName);

                assertFunction(this.player1.serialize);
            },
            "test Playername should be defined": function() {
                assertNotUndefined(this.player1.getName());
            },
            "test Playername should be able to setted and getted correctly": function()
            {
                var test;
                var player = this.player1;
                this.player1.setName("Ranol");

                assertEquals("Ranol", this.player1.getName());
                assertException(function() {
                    player.setName(test);
                }, "TypeError");
                assertException(function() {
                    player.setName(125);
                }, "TypeError");
                assertException(function() {
                    player.setName(player);
                }, "TypeError");
            },
            "test token should be able to setted and getted correctly": function()
            {
                this.player1.setToken("dgdfgdfg");

                assertEquals("dgdfgdfg", this.player1.getToken());
            },
            "test should throw Error when token is not a string": function()
            {
                var player = this.player1;

                assertException(function() {
                    player.setToken(4);
                }, "TypeError");
                assertNoException(function() {
                    player.setToken("ad");
                });
            },
            "test should throw Error when token is setted more than once": function()
            {
                var player = this.player1;

                assertNoException(function() {
                    player.setToken("ad");
                });
                assertException(function() {
                    player.setToken("ad");
                }, "Error");
            },
            
            "test player should have function to set NodeJs Response object": function()
            {
                assertFunction(this.player1.setResponseObject);
            },
            
            "test player should have function to get NodeJs Response object": function()
            {
                assertFunction(this.player1.getResponseObject);
            },
            
            "test setter / getter for ResponseObject should work": function()
            {
                var obj = {};
                assertUndefined(this.player1.getResponseObject());
                this.player1.setResponseObject(obj);
                assertSame(obj, this.player1.getResponseObject());
            },
            
            "test Should be able to set and get Hex-Values for Colors": function()
            {
                this.player1.setColor("#FFFFFF");

                assertEquals("#FFFFFF", this.player1.getColor());
            },
            "test Shouldnt be able to set invalid Values for Hex-Colors": function()
            {
                var player = this.player1;

                assertException(function() {
                    player.setColor(125);
                }, "TypeError");
                assertException(function() {
                    player.setColor("#FFFFF");
                }, "Error");
                assertException(function() {
                    player.setColor("#FFFFFFF");
                }, "Error");
                assertException(function() {
                    player.setColor("FFFFFF");
                }, "Error");
                assertException(function() {
                    player.setColor("*000000");
                }, "Error");
                assertException(function() {
                    player.setColor("#-90000");
                }, "Error");
                assertException(function() {
                    player.setColor("#FF!FFF");
                }, "Error");
            },
            "test Should be able to set and get the player-Id as Number. Id should be only able to get set once": function()
            {
                this.player1.setId(1);
                var player = this.player1;

                assertTrue(this.player1.getId() === 1);
                assertException(function() {
                    player.setId("Fisch");
                }, "TypeError");
                assertException(function() {
                    player.setId(2);
                }, "Error");
            },
            "test Should be able to serialize a Player correctly": function()
            {
                this.player1.setId(2);
                this.player1.setName("Ranol");
                this.player1.setColor("#FFFFFF");

                var json = this.player1.serialize();
                json = JSON.parse(json);

                assertObject(json);
                assertEquals(2, json.id);
                assertEquals("Ranol", json.name);
                assertEquals("#FFFFFF", json.color);
                assertEquals("human", json.type);
            },
            "test Should be able to serialize a Player correctly as object": function()
            {
                this.player1.setId(2);
                this.player1.setName("Ranol");
                this.player1.setColor("#FFFFFF");

                var json = this.player1.serializeAsObject();

                assertObject(json);
                assertEquals(2, json.id);
                assertEquals("Ranol", json.name);
                assertEquals("#FFFFFF", json.color);
                assertEquals("human", json.type);
            },
            "test Should be able to deserialize a Player correctly": function()
            {
                var json = {
                    id: 2,
                    name: "Peter",
                    color: "#FFFFFF",
                    type: "bot"
                };

                this.player1.deserialize(json);

                assertEquals(2, this.player1.getId());
                assertEquals("Peter", this.player1.getName());
                assertEquals("#FFFFFF", this.player1.getColor());
                assertEquals("bot", this.player1.getType());
            },
            "test Should throw error if Id is incorrect on deserialize": function()
            {
                var player1 = this.player1;
                var json = {
                    id: "asd",
                    name: "Peter",
                    color: "#FFFFFF"
                };

                assertException(function() {
                    player1.deserialize(json);
                }, "TypeError");
            },
            "test Should not throw error and set Id if Id is not included in json": function()
            {
                var player1 = this.player1;
                player1.setId(1);

                var id = player1.getId();

                var json = {
                    name: "Peter",
                    color: "#FFFFFF",
                    type: "human"
                };

                assertNoException(function() {
                    player1.deserialize(json);
                });
                assertEquals(id, player1.getId());


            },
            "test Should throw error if name is incorrect on deserialize": function()
            {
                var player1 = this.player1;

                var json = {
                    id: 2,
                    name: 4,
                    color: "#FFFFFF",
                    type: "bot"
                };


                assertException(function() {
                    player1.deserialize(json);
                }, "TypeError");
            },
            "test Should throw error if color is incorrect on deserialize": function()
            {
                var player1 = this.player1;

                var json = {
                    id: 2,
                    name: "Peter",
                    color: "#hjk",
                    type: "bot"
                };

                assertException(function() {
                    player1.deserialize(json);
                }, "Error");
            },
            "test Should throw error if type is incorrect on deserialize": function()
            {
                var player1 = this.player1;

                var json = {
                    id: 2,
                    name: "Peter",
                    color: "#hjk",
                    type: "UltraBasher"
                };

                assertException(function() {
                    player1.deserialize(json);
                }, "Error");
            },
            "test player should have setter for type": function()
            {
                assertFunction(this.player1.setType);
            },
            "test player should have getter for type": function()
            {
                assertFunction(this.player1.getType);
            },
            "test setter for type should only accept a string human or bot, else throw Exception": function()
            {
                var player1 = this.player1;

                assertNoException(function() {
                    player1.setType("human");
                });
                assertNoException(function() {
                    player1.setType("Human");
                });

                assertNoException(function() {
                    player1.setType("bot");
                });
                assertNoException(function() {
                    player1.setType("Bot");
                });

                assertException(function() {
                    player1.setType("boot");
                }, "TypeError");
                assertException(function() {
                    player1.setType("UltraNatzer1337");
                }, "TypeError");

            },
            "test type should be setted to human by default": function()
            {
                assertEquals("human", this.player1.getType());
            },
            "test player should store a type attribute to differntiate between human player and bot": function()
            {
                assertEquals("human", this.player1.getType());

                this.player1.setType("Bot");
                assertEquals("bot", this.player1.getType());

                this.player1.setType("human");
                assertEquals("human", this.player1.getType());
            },
            
            "test player should should hold value for current unitCount": function()
            {
                assertNotUndefined(this.player1.unitCount);
            },
            "test player should implement setUnitCount method": function()
            {
                assertFunction(this.player1.setUnitCount);
            },
            "test player.unitCount should be 0 at init": function()
            {
                assertEquals(0, this.player1.unitCount);
            },
            "test player.setUnitCount should set unitCount": function()
            {
                this.player1.setUnitCount(500);
                assertEquals(500, this.player1.unitCount);
            },
            "test player.setUnitCount should throw expection if argument is not int": function()
            {
                var player1 = this.player1;
             
                assertException(function() {
                    player1.setUnitCount("onehundred");
                }, "TypeError");
                assertException(function() {
                    player1.setUnitCount({unitcount: 123});
                }, "TypeError");
            }
        });

