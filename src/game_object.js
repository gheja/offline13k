"use strict";

class GameObject
{
	constructor()
	{
		this.mapX = 0;
		this.mapY = 0;
		this.mapZ = 0;
		this.speedX = 0;
		this.speedY = 0;
		this.rotation = 0;
		
		this.gfxObject = null;
		this.limbs = [];
		this.animations = [];
	}
	
	setLimbPadTarget(limbIndex, x, y, z)
	{
		this.limbs[limbIndex].padTarget.x = x;
		this.limbs[limbIndex].padTarget.y = y;
		this.limbs[limbIndex].padTarget.z = z;
	}
	
	animationStartStop(start, stop)
	{
		let i;
		
		for (i=0; i<start.length; i++)
		{
			this.animations[start[i]].active = true;
		}
		
		for (i=0; i<stop.length; i++)
		{
			this.animations[stop[i]].active = false;
		}
	}
	
	updateAnimation()
	{
		let i, j, k, a;
		
		for (i=0; i<this.animations.length; i++)
		{
			a = this.animations[i];
			if (a.active)
			{
				a.frame = (a.frame + 1) % a.length;
				for (j=0; j<a.data.length; j++)
				{
					if (a.data[j][0] == a.frame)
					{
						for (k=1; k<a.data[j].length; k++)
						{
							this.setLimbPadTarget(a.data[j][k][0], a.data[j][k][1], a.data[j][k][2], a.data[j][k][3]);
						}
					}
				}
			}
		}
	}
	
	updateLimbs(wrap)
	{
		let a, i, limb;
		
		a = 0.2;
		
		if (wrap)
		{
			a = 1;
		}
		
		for (i=0; i<this.limbs.length; i++)
		{
			limb = this.limbs[i];
			
			limb.pad.x += (limb.padTarget.x - limb.pad.x) * a;
			limb.pad.y += (limb.padTarget.y - limb.pad.y) * a;
			limb.pad.z += (limb.padTarget.z - limb.pad.z) * a;
			
			limb.gfxObject.position.x = this.gfxObject.position.x + limb.pad.x;
			limb.gfxObject.position.y = this.gfxObject.position.y + limb.pad.y;
			limb.gfxObject.position.z = this.gfxObject.position.z + limb.pad.z;
		}
	}
}
