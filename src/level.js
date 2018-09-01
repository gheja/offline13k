"use strict";

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
							b[rand2.randomInteger(5, 9)] = OBJ_OBSTACLE_FULL;
						}
						else if (rand1.chance(0.5))
						{
							b[rand2.randomInteger(5, 9)] = OBJ_OBSTACLE_LOWER;
						}
						else
						{
							b[rand2.randomInteger(5, 9)] = OBJ_OBSTACLE_UPPER;
						}
					}
					
					if (rand1.chance(0.1))
					{
						b[rand2.randomInteger(5, 9)] = OBJ_OBSTACLE_FULL;
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
				
				if (a >= OBJ_MODEL_FIRST && a <= OBJ_MODEL_LAST)
				{
					_obstacles.push(new GameObjectObstacle(x, y, 0.5, a));
				}
			}
		}
	}
}
