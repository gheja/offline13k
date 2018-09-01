"use strict";

const LEVEL_WIDTH = 14;
const LEVEL_HEIGHT = 100;

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

class Level
{
	constructor()
	{
		this.map = [];
		this.mapObjects = [];
	}
	
	generate()
	{
		let x, y, a, b, map, baseSegment, baseSegment2, rand1, rand2;
		
		rand1 = new AlmostRandom(595);
		rand2 = new AlmostRandom(7611);
		
		this.map = [];
		this.mapObjects = [];
		
		baseSegment =  [ 0, 0, 0, 0, 2, 4, 3, 3, 4, 2, 0, 0, 0, 0 ];
		baseSegment2 = [ 0, 0, 0, 0, 6, 1, 1, 1, 1, 6, 0, 0, 0, 0 ];
		
		for (y=0; y<LEVEL_HEIGHT; y++)
		{
			for (x=0; x<LEVEL_WIDTH; x++)
			{
				b = _copy(baseSegment2);
				
				if (y < 1)
				{
					a = _copy(baseSegment);
				}
				else
				{
					a = _copy(this.map[y - 1]);
					
					if (rand1.chance(0.2))
					{
						if (rand1.chance(0.25))
						{
							b[rand2.randomInteger(5, 9)] = OBJ_OBSTACLE;
						}
						else if (rand1.chance(0.5))
						{
							b[rand2.randomInteger(5, 9)] = OBJ_OBSTACLE_LOW;
						}
						else
						{
							b[rand2.randomInteger(5, 9)] = OBJ_OBSTACLE_HIGH;
						}
					}
					
					if (rand1.chance(0.1))
					{
						b[rand2.randomInteger(5, 9)] = OBJ_OBSTACLE;
					}
				}
				
				this.map.push(a);
				this.mapObjects.push(b);
			}
		}
		
		for (y=0; y<LEVEL_HEIGHT; y++)
		{
			for (x=0; x<LEVEL_WIDTH; x++)
			{
				if (this.mapObjects[y][x] == OBJ_UNDECIDED)
				{
					this.mapObjects[y][x] = OBJ_NONE;
				}
			}
		}
	}
	
	load()
	{
		let x, y, a;
		
		_obstacles = [];
		
		for (y=0; y<LEVEL_HEIGHT; y++)
		{
			for (x=0; x<LEVEL_WIDTH; x++)
			{
				a = this.mapObjects[y][x];
				if (a != OBJ_NONE)
				{
					_obstacles.push(new GameObjectObstacle(x, y, 0.5, a));
				}
			}
		}
	}
}
