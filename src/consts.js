"use strict";

const TPS = 60;
const FPS = 60;
const DEV_BUILD = true;

const LEVEL_WIDTH = 14;
const LEVEL_HEIGHT = 100;

const MODEL_OBSTACLE_LOWER = 1;
const MODEL_OBSTACLE_UPPER = 2;
const MODEL_OBSTACLE_FULL = 3;
const MODEL_EDGE = 4;
const MODEL_PLAYER = 5;

const TILE_DISABLED = 0;
const TILE_UNDECIDED = 1;
const TILE_EDGE = 2;
const TILE_ROAD = 3;
const TILE_WALK = 4;

const OBJ_DISABLED = 0;
const OBJ_UNDECIDED = 1;
const OBJ_NONE = 2;
const OBJ_OBSTACLE = 3;
const OBJ_OBSTACLE_LOW = 4;
const OBJ_OBSTACLE_HIGH = 5;
const OBJ_EDGE = 6;

const TILE_COLORS = [ "#222", "#d0d", "#eb2", "#888", "#ccc" ];
const OBJ_COLORS = [ "rgba(0,0,0,0)", "#f0f", "rgba(0,0,0,0)", "#e00", "#0ae", "#ea0" ];

