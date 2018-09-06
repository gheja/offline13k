"use strict";

class GameObjectPlayer extends GameObjectHuman
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
	
	init()
	{
	}
	
	updateObstacles()
	{
		let i;
		
		for (i=0; i<_obstacles.length; i++)
		{
			_obstacles[i].update();
		}
	}
	
	checkCollision()
	{
		let i;
		
		for (i=0; i<_obstacles.length; i++)
		{
			if (_obstacles[i].distance == 0)
			{
				if (this.timeDuck == 0 && _obstacles[i].blockUp)
				{
					console.log("hit");
				}
				else if (this.timeJump == 0 && _obstacles[i].blockDown)
				{
					console.log("hit");
				}
				else
				{
					console.log("almost");
				}
			}
			else if (_obstacles[i].distance <= 2)
			{
				// if it is in the current or next lane
				if (Math.round(this.mapX) == Math.round(_obstacles[i].mapX) || Math.round(this.targetMapX) == Math.round(_obstacles[i].mapX))
				{
					console.log("near");
				}
			}
		}
	}
	
	updateObjects()
	{
		this.gfxObject.position.x = this.mapX;
		this.gfxObject.position.z = this.mapY;
		
		if (_gfx.vr.isInVRMode)
		{
			_gfx.vr.currentVRCamera.position.x = this.gfxObject.position.x;
			_gfx.vr.currentVRCamera.position.y = this.gfxObject.position.y + 1.7;
			_gfx.vr.currentVRCamera.position.z = this.gfxObject.position.z - 1.5;
			_gfx.vr.currentVRCamera.minZ = 0.2;
		}
		else
		{
			_gfx.scene1.activeCamera.position.x = this.gfxObject.position.x;
			_gfx.scene1.activeCamera.position.y = this.gfxObject.position.y + 1.7;
			_gfx.scene1.activeCamera.position.z = this.gfxObject.position.z - 3;
		}
		
		this.updateAnimation();
		this.updateLimbs();
	}
	
	tick()
	{
		let a, b, mapXFraction;
		
		
		a = _input.query();
		
		mapXFraction = Math.abs(this.mapX - Math.round(this.mapX));
		
		if (mapXFraction < 0.001)
		{
			if (a.x > 0.5 && this.mapX <= 7)
			{
				this.targetMapX = Math.round(this.mapX) + 1;
			}
			else if (a.x < -0.5 && this.mapX >= 6)
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
		else if (this.timeDuck > 0)
		{
			this.timeDuck--;
		}
		else
		{
		}
		
		this.mapY += this.speedY;
		this.mapX += this.speedX;
		
		if (this.mapY > 100)
		{
			this.mapY = 0;
		}
		
		this.updateObstacles();
		this.checkCollision();
	}
}
