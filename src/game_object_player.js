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
		this.speedZ = 0;
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
		this.gfxObject.position.x = (this.mapX - 0.5) * 2;
		this.gfxObject.position.y = this.mapZ;
		this.gfxObject.position.z = this.mapY * 3;
		
		if (_gfx.vr.isInVRMode)
		{
			_gfx.vr.currentVRCamera.position.x = this.gfxObject.easePosition.x;
			_gfx.vr.currentVRCamera.position.y = this.gfxObject.easePosition.y + 2.3;
			_gfx.vr.currentVRCamera.position.z = this.gfxObject.easePosition.z - 1.5;
			_gfx.vr.currentVRCamera.minZ = 0.2;
		}
		else
		{
			_gfx.scene1.activeCamera.position.x = this.gfxObject.easePosition.x;
			_gfx.scene1.activeCamera.position.y = this.gfxObject.easePosition.y + 2.3;
			_gfx.scene1.activeCamera.position.z = this.gfxObject.easePosition.z - 3;
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
		if (this.speedZ == 0 && this.timeDuck == 0)
		{
			if (a.y < -0.5)
			{
				this.timeJump = TIME_JUMP;
				this.speedZ = 0.4;
			}
			else if (a.y > 0.5)
			{
				this.timeDuck = TIME_DUCK;
			}
		}
		
		this.speedZ = this.speedZ - 1 / TPS; // gravity
		
		this.mapY += this.speedY;
		this.mapX += this.speedX;
		this.mapZ += this.speedZ;
		
		// ground contact
		if (this.mapZ < 0)
		{
			this.mapZ = 0;
			this.speedZ = 0;
		}
		
		if (this.mapY > 100)
		{
			this.mapY = 0;
		}
		
		if (this.timeJump > 0)
		{
			this.timeJump--;
		}
		
		if (this.timeDuck > 0)
		{
			this.timeDuck--;
		}
		
		if (this.speedZ > 0)
		{
			// jumping
			this.animationStartStop([ 1 ], [ 0, 2, 3 ]);
		}
		else if (this.speedZ < 0)
		{
			// falling
			this.animationStartStop([ 3 ], [ 0, 1, 2 ]);
		}
		else
		{
			if (this.timeDuck > 5)
			{
				// ducking
				this.animationStartStop([ 2 ], [ 0, 1, 3 ]);
			}
			else
			{
				// running
				this.animationStartStop([ 0 ], [ 1, 2, 3 ]);
			}
		}
		
		this.updateObstacles();
		this.checkCollision();
	}
}
