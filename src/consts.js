"use strict";

const TPS = 60;
const FPS = 60;
const DEV_BUILD = true;
const PI2 = Math.PI * 2;

const LEVEL_WIDTH = 14;
const LEVEL_HEIGHT = 100;

const OBJ_DISABLED = 0;
const OBJ_UNDECIDED = 1;
const OBJ_NONE = 2;

const OBJ_OBSTACLE_LOWER = 3;
const OBJ_OBSTACLE_UPPER = 4;
const OBJ_OBSTACLE_FULL = 5;
const OBJ_EDGE = 6;

const OBJ_PLAYER = 11;
const OBJ_HAND = 12;
const OBJ_DESK = 13;
const OBJ_TILE = 14;
const OBJ_OFFICE_WALLS = 15;
const OBJ_FLOOR_WARNING = 16;
const OBJ_ROUTER_BOX = 17;
const OBJ_ROUTER_PORT_NONE = 18;
const OBJ_ROUTER_PORT_ETH = 19;
const OBJ_ROUTER_PORT_POWER = 20;
const OBJ_ROUTER_PLUG_NONE = 21;
const OBJ_ROUTER_PLUG_ETH = 22;
const OBJ_ROUTER_PLUG_POWER = 23;

const OBJ_MODEL_FIRST = OBJ_OBSTACLE_LOWER;
const OBJ_MODEL_LAST = OBJ_PLAYER - 1;

const TILE_DISABLED = 0;
const TILE_UNDECIDED = 1;
const TILE_EDGE = 2;
const TILE_ROAD = 3;
const TILE_WALK = 4;

const TILE_COLORS = [ "#222", "#d0d", "#eb2", "#888", "#ccc" ];
const OBJ_COLORS = [ "rgba(0,0,0,0)", "#f0f", "rgba(0,0,0,0)", "#e00", "#0ae", "#ea0" ];

const TIME_JUMP = 0.5 * TPS;
const TIME_DUCK = 0.5 * TPS;
const TIME_JUMP_COOLDOWN = 0.8 * TPS;
const TIME_DUCK_COOLDOWN = 0.8 * TPS;
const MOVE_SPEED_X = 3 / TPS;
