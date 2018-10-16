class FoodData {
    constructor() {
        
        this.MEAT = {
            "parts":
            [
                {
                    "id": "meat-01",
                    "sprite": "meat-01",
                    "scale": 1,
                    "position": {
                        "x": 0,
                        "y": 21
                    }
                },
                {
                    "id": "meat-02",
                    "sprite": "meat-02",
                    "scale": 1,
                    "position": {
                        "x": 103,
                        "y": 0
                    }
                },
                {
                    "id": "meat-03",
                    "sprite": "meat-03",
                    "scale": 1,
                    "position": {
                        "x": 220,
                        "y": -1
                    }
                },
                {
                    "id": "meat-04",
                    "sprite": "meat-04",
                    "scale": 1,
                    "position": {
                        "x": 355,
                        "y": 8
                    }
                }
            ],
            "connections":
            [
                {
                    "id": "conn1",
                    "sources": ["meat-01"],
                    "targets": ["meat-02"]
                },
                {
                    "id": "conn2",
                    "sources": ["meat-02"],
                    "targets": ["meat-03"]
                },
                {
                    "id": "conn3",
                    "sources": ["meat-03"],
                    "targets": ["meat-04"]
                }
            ],
            "sliceMarks":
            [
                {
                    "id": "slice1",
                    "startPos":{ "x": 100, "y": -10},
                    "endPos":{ "x": 100, "y": 210},
                    "intersectedConnections": ["conn1"]
                },
                {
                    "id": "slice2",
                    "startPos":{ "x": 220, "y": -20},
                    "endPos":{ "x": 220, "y": 225},
                    "intersectedConnections": ["conn2"]
                },
                {
                    "id": "slice3",
                    "startPos":{ "x": 350, "y": -10},
                    "endPos":{ "x": 350, "y": 210},
                    "intersectedConnections": ["conn3"]
                }
            ]
        };


        this.BAWANG_DAUN = {
            "parts":
            [
                {
                    "id": "bawangdaun-01",
                    "sprite": "bawangdaun-01",
                    "scale": 1,
                    "position": {
                        "x": -59,
                        "y": 17
                    }
                },
                {
                    "id": "bawangdaun-02",
                    "sprite": "bawangdaun-02",
                    "scale": 1,
                    "position": {
                        "x": 103,
                        "y": 50
                    }
                },
                {
                    "id": "bawangdaun-03",
                    "sprite": "bawangdaun-03",
                    "scale": 1,
                    "position": {
                        "x": 222,
                        "y": 105
                    }
                },
                {
                    "id": "bawangdaun-04",
                    "sprite": "bawangdaun-04",
                    "scale": 1,
                    "position": {
                        "x": 342,
                        "y": 122
                    }
                },
                {
                    "id": "bawangdaun-05",
                    "sprite": "bawangdaun-05",
                    "scale": 1,
                    "position": {
                        "x": 462,
                        "y": 120
                    }
                }
            ],
            "connections":
            [
                {
                    "id": "conn1",
                    "sources": ["bawangdaun-01"],
                    "targets": ["bawangdaun-02"]
                },
                {
                    "id": "conn2",
                    "sources": ["bawangdaun-02"],
                    "targets": ["bawangdaun-03"]
                },
                {
                    "id": "conn3",
                    "sources": ["bawangdaun-03"],
                    "targets": ["bawangdaun-04"]
                },
                {
                    "id": "conn4",
                    "sources": ["bawangdaun-04"],
                    "targets": ["bawangdaun-05"]
                }
            ],
            "sliceMarks":
            [
                {
                    "id": "slice1",
                    "startPos":{ "x": 100, "y": 20},
                    "endPos":{ "x": 100, "y": 240},
                    "intersectedConnections": ["conn1"]
                },
                {
                    "id": "slice2",
                    "startPos":{ "x": 220, "y": 90},
                    "endPos":{ "x": 220, "y": 200},
                    "intersectedConnections": ["conn2"]
                },
                {
                    "id": "slice3",
                    "startPos":{ "x": 335, "y": 90},
                    "endPos":{ "x": 335, "y": 200},
                    "intersectedConnections": ["conn3"]
                },
                {
                    "id": "slice4",
                    "startPos":{ "x": 455, "y": 90},
                    "endPos":{ "x": 455, "y": 200},
                    "intersectedConnections": ["conn4"]
                }
            ]
        };

        this.CARROT = {
            "parts":
            [
                {
                    "id": "carrot-01",
                    "sprite": "carrot-01",
                    "scale": 1,
                    "position": {
                        "x": -59,
                        "y": 55
                    }
                },
                {
                    "id": "carrot-02",
                    "sprite": "carrot-02",
                    "scale": 1,
                    "position": {
                        "x": 20,
                        "y": 30
                    }
                },
                {
                    "id": "carrot-03",
                    "sprite": "carrot-03",
                    "scale": 1,
                    "position": {
                        "x": 107,
                        "y": 30
                    }
                },
                {
                    "id": "carrot-04",
                    "sprite": "carrot-04",
                    "scale": 1,
                    "position": {
                        "x": 175,
                        "y": 35
                    }
                },
                {
                    "id": "carrot-05",
                    "sprite": "carrot-05",
                    "scale": 1,
                    "position": {
                        "x": 233,
                        "y": 44
                    }
                },
                {
                    "id": "carrot-06",
                    "sprite": "carrot-06",
                    "scale": 1,
                    "position": {
                        "x": 293,
                        "y": 57
                    }
                },
                {
                    "id": "carrot-07",
                    "sprite": "carrot-07",
                    "scale": 1,
                    "position": {
                        "x": 353,
                        "y": 74
                    }
                }
                
            ],
            "connections":
            [
                {
                    "id": "conn1",
                    "sources": ["carrot-01"],
                    "targets": ["carrot-02"]
                },
                {
                    "id": "conn2",
                    "sources": ["carrot-02"],
                    "targets": ["carrot-03"]
                },
                {
                    "id": "conn3",
                    "sources": ["carrot-03"],
                    "targets": ["carrot-04"]
                },
                {
                    "id": "conn4",
                    "sources": ["carrot-04"],
                    "targets": ["carrot-05"]
                },
                {
                    "id": "conn5",
                    "sources": ["carrot-05"],
                    "targets": ["carrot-06"]
                },
                {
                    "id": "conn6",
                    "sources": ["carrot-06"],
                    "targets": ["carrot-07"]
                }
            ],
            "sliceMarks":
            [
                {
                    "id": "slice1",
                    "startPos":{ "x": 12, "y": 60},
                    "endPos":{ "x": 12, "y": 160},
                    "intersectedConnections": ["conn1"]
                },
                {
                    "id": "slice2",
                    "startPos":{ "x": 100, "y": 20},
                    "endPos":{ "x": 100, "y": 200},
                    "intersectedConnections": ["conn2"]
                },
                {
                    "id": "slice3",
                    "startPos":{ "x": 167, "y": 20},
                    "endPos":{ "x": 167, "y": 200},
                    "intersectedConnections": ["conn3"]
                },
                {
                    "id": "slice4",
                    "startPos":{ "x": 230, "y": 20},
                    "endPos":{ "x": 230, "y": 200},
                    "intersectedConnections": ["conn4"]
                },
                {
                    "id": "slice5",
                    "startPos":{ "x": 290, "y": 20},
                    "endPos":{ "x": 290, "y": 200},
                    "intersectedConnections": ["conn5"]
                },
                {
                    "id": "slice6",
                    "startPos":{ "x": 350, "y": 50},
                    "endPos":{ "x": 350, "y": 180},
                    "intersectedConnections": ["conn6"]
                }
            ]
        };

        this.FISH = {
            "parts":
            [
                {
                    "id": "fish-01",
                    "sprite": "fish-01",
                    "scale": 1,
                    "position": {
                        "x": -9,
                        "y": 40
                    }
                },
                {
                    "id": "fish-02",
                    "sprite": "fish-02",
                    "scale": 1,
                    "position": {
                        "x": 103,
                        "y": 0
                    }
                },
                {
                    "id": "fish-03",
                    "sprite": "fish-03",
                    "scale": 1,
                    "position": {
                        "x": 234,
                        "y": 9
                    }
                },
                {
                    "id": "fish-04",
                    "sprite": "fish-04",
                    "scale": 1,
                    "position": {
                        "x": 357,
                        "y": 30
                    }
                }
            ],
            "connections":
            [
                {
                    "id": "conn1",
                    "sources": ["fish-01"],
                    "targets": ["fish-02"]
                },
                {
                    "id": "conn2",
                    "sources": ["fish-02"],
                    "targets": ["fish-03"]
                },
                {
                    "id": "conn3",
                    "sources": ["fish-03"],
                    "targets": ["fish-04"]
                }
            ],
            "sliceMarks":
            [
                {
                    "id": "slice1",
                    "startPos":{ "x": 100, "y": -10},
                    "endPos":{ "x": 100, "y": 210},
                    "intersectedConnections": ["conn1"]
                },
                {
                    "id": "slice2",
                    "startPos":{ "x": 230, "y": -20},
                    "endPos":{ "x": 230, "y": 225},
                    "intersectedConnections": ["conn2"]
                },
                {
                    "id": "slice3",
                    "startPos":{ "x": 350, "y": -10},
                    "endPos":{ "x": 350, "y": 210},
                    "intersectedConnections": ["conn3"]
                }
            ]
        };

        this.LOBAK = {
            "parts":
            [
                {
                    "id": "lobak-01",
                    "sprite": "lobak-01",
                    "scale": 1,
                    "position": {
                        "x": -60,
                        "y": 10
                    }
                },
                {
                    "id": "lobak-02",
                    "sprite": "lobak-02",
                    "scale": 1,
                    "position": {
                        "x": 107,
                        "y": 60
                    }
                },
                {
                    "id": "lobak-03",
                    "sprite": "lobak-03",
                    "scale": 1,
                    "position": {
                        "x": 246,
                        "y": 78
                    }
                },
                {
                    "id": "lobak-04",
                    "sprite": "lobak-04",
                    "scale": 1,
                    "position": {
                        "x": 373,
                        "y":107
                    }
                }
            ],
            "connections":
            [
                {
                    "id": "conn1",
                    "sources": ["lobak-01"],
                    "targets": ["lobak-02"]
                },
                {
                    "id": "conn2",
                    "sources": ["lobak-02"],
                    "targets": ["lobak-03"]
                },
                {
                    "id": "conn3",
                    "sources": ["lobak-03"],
                    "targets": ["lobak-04"]
                }
            ],
            "sliceMarks":
            [
                {
                    "id": "slice1",
                    "startPos":{ "x": 100, "y": 70},
                    "endPos":{ "x": 100, "y": 180},
                    "intersectedConnections": ["conn1"]
                },
                {
                    "id": "slice2",
                    "startPos":{ "x": 240, "y": 70},
                    "endPos":{ "x": 240, "y": 200},
                    "intersectedConnections": ["conn2"]
                },
                {
                    "id": "slice3",
                    "startPos":{ "x": 370, "y": 90},
                    "endPos":{ "x": 370, "y": 190},
                    "intersectedConnections": ["conn3"]
                }
            ]
        };


    }
}


