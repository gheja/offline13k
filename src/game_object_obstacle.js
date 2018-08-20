"use strict";

class GameObjectObstacle extends GameObject
{
	constructor(x, y, r, a, b)
	{
		super();
		
		this.mapX = x;
		this.mapY = y;
		this.radius = r;
		this.distance = 0;
		this.paused = false;
		
		this.blockDown = a;
		this.blockUp = b;
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
