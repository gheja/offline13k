"use strict";

class GameObjectObstacle extends GameObject
{
	constructor(x, y, r, a)
	{
		super();
		
		this.mapX = x;
		this.mapY = y;
		this.radius = r;
		this.distance = 0;
		this.paused = false;
		
		this.blockDown = a == OBJ_OBSTACLE_LOW || a == OBJ_OBSTACLE;
		this.blockUp = a == OBJ_OBSTACLE_HIGH || a == OBJ_OBSTACLE;
		
		switch (a)
		{
			case OBJ_OBSTACLE:
				this.gfxObject = _gfx.placeObject(MODEL_OBSTACLE_FULL, { x: x, y: 0, z: y }, {});
			break;
			
			case OBJ_OBSTACLE_LOW:
				this.gfxObject = _gfx.placeObject(MODEL_OBSTACLE_LOWER, { x: x, y: 0, z: y }, {});
			break;
			
			case OBJ_OBSTACLE_HIGH:
				this.gfxObject = _gfx.placeObject(MODEL_OBSTACLE_UPPER, { x: x, y: 0, z: y }, {});
			break;
			
			case OBJ_EDGE:
				this.gfxObject = _gfx.placeObject(MODEL_EDGE, { x: x, y: 0, z: y }, {});
			break;
		}
	}
	
	tick()
	{
		this.mapY += this.speedY;
		this.mapX += this.speedX;
	}
	
	update()
	{
		// this.distance = distance(_player.mapX, _player.mapY, this.mapX, this.mapY);
		// this.collided = this.distance < _obstacles[i].radius;
		
		// distance of player's center of the edge of this object
		this.distance = Math.max(distance(_player.mapX, _player.mapY, this.mapX, this.mapY) - this.radius, 0);
	}
}
