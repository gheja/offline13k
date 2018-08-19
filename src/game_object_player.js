"use strict";

const TIME_JUMP = TPS / 2;
const TIME_DUCK = TPS / 2;
const MOVE_SPEED_X = 3 / TPS;

class GameObjectPlayer extends GameObject
{
	constructor()
	{
		super();
		
		this.mapX = 7;
		this.mapY = 0.2;
		this.mapZ = 0;
		this.speedY = 0;
		this.speedX = 0;
		this.timeJump = 0;
		this.timeDuck = 0;
		this.targetMapX = 7;
	}
	
	tick()
	{
		let a, b, mapXFraction;
		
		a = _input.query();
		
		mapXFraction = Math.abs(this.mapX - Math.round(this.mapX));
		
		if (mapXFraction < 0.001)
		{
			if (a.x > 0.5)
			{
				this.targetMapX = Math.round(this.mapX) + 1;
			}
			else if (a.x < -0.5)
			{
				this.targetMapX = Math.round(this.mapX) - 1;
			}
		}
		else if (mapXFraction < 0.1)
		{
			if (Math.abs(this.targetMapX - this.mapX) < 0.1)
			{
				// snap to whole mapX
				this.mapX = Math.round(this.mapX);
			}
		}
		
		this.speedX = 0;
		this.speedY = _gameSpeed;
		
		if (this.targetMapX < this.mapX)
		{
			this.speedX += -MOVE_SPEED_X;
		}
		else if (this.targetMapX > this.mapX)
		{
			this.speedX += MOVE_SPEED_X;
		}
		
		// not jumping or ducking
		if (this.timeJump == 0 && this.timeDuck == 0)
		{
			if (a.y < -0.5)
			{
				this.timeJump = TIME_JUMP;
			}
			else if (a.y > 0.5)
			{
				this.timeDuck = TIME_DUCK;
			}
		}
		
		if (this.timeJump > 0)
		{
			this.timeJump--;
		}
		
		if (this.timeDuck > 0)
		{
			this.timeDuck--;
		}
		
		this.mapY += this.speedY;
		this.mapX += this.speedX;
	}
}
