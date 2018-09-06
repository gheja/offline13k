"use strict";

const TPS = 60;
const FPS = 60;
const DEV_BUILD = true;

const LEVEL_WIDTH = 14;
const LEVEL_HEIGHT = 100;

const OBJ_DISABLED = 0;
const OBJ_UNDECIDED = 1;
const OBJ_NONE = 2;
const OBJ_OBSTACLE_LOWER = 3;
const OBJ_OBSTACLE_UPPER = 4;
const OBJ_OBSTACLE_FULL = 5;
const OBJ_EDGE = 6;
const OBJ_PLAYER = 7;
const OBJ_HAND = 7;

const OBJ_MODEL_FIRST = OBJ_OBSTACLE_LOWER;
const OBJ_MODEL_LAST = OBJ_HAND;

const TILE_DISABLED = 0;
const TILE_UNDECIDED = 1;
const TILE_EDGE = 2;
const TILE_ROAD = 3;
const TILE_WALK = 4;

const TILE_COLORS = [ "#222", "#d0d", "#eb2", "#888", "#ccc" ];
const OBJ_COLORS = [ "rgba(0,0,0,0)", "#f0f", "rgba(0,0,0,0)", "#e00", "#0ae", "#ea0" ];

const TIME_JUMP = TPS / 2;
const TIME_DUCK = TPS / 2;
const MOVE_SPEED_X = 3 / TPS;
