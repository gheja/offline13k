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
		this.timeJumpCooldown = 0;
		this.timeDuckCooldown = 0;
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
				if (this.timeDuckCooldown == 0 && _obstacles[i].blockUp)
				{
					console.log("hit");
				}
				else if (this.timeJumpCooldown == 0 && _obstacles[i].blockDown)
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
		
		_gfx.scene.activeCamera.position.x = this.gfxObject.position.x;
		_gfx.scene.activeCamera.position.y = this.gfxObject.position.y + 2.3;
		_gfx.scene.activeCamera.position.z = this.gfxObject.position.z - 1.5;
		
		if (_gfx.scene.vr.isInVRMode)
		{
			_gfx.scene.activeCamera.position.z += -1.5;
		}
		
		this.updateAnimation();
		this.updateLimbs(false);
	}
	
	tick()
	{
		let a, b, mapXFraction;
		
		
		a = _input.query();
		
		mapXFraction = Math.abs(this.mapX - Math.round(this.mapX));
		
		if (mapXFraction < 0.001)
		{
			if (a["Right"] && this.mapX <= 7)
			{
				this.targetMapX = Math.round(this.mapX) + 1;
			}
			else if (a["Left"] && this.mapX >= 6)
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
		if (this.timeJumpCooldown <= 0 && this.timeDuckCooldown <= 0)
		{
			if (a["Up"])
			{
				this.timeJumpCooldown = TIME_JUMP_COOLDOWN;
				this.speedZ = 0.25;
			}
			else if (a["Down"])
			{
				this.timeDuckCooldown = TIME_DUCK_COOLDOWN;
			}
		}
		
		this.speedZ = this.speedZ - 0.9 / TPS; // gravity
		
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
		
		if (this.timeJumpCooldown > 0)
		{
			this.timeJumpCooldown--;
		}
		
		if (this.timeDuckCooldown > 0)
		{
			this.timeDuckCooldown--;
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
			// no separate timer for real ducking
			if (this.timeDuckCooldown > TIME_DUCK_COOLDOWN - TIME_DUCK)
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
