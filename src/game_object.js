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
		
		this.bones = [];
		
		if (DEV_BUILD)
		{
			this.boneDebugLines = null;
		}
	}
	
	updateChildBones(parent, position)
	{
		let p, bone, a, i;
		
		for (i=0; i<this.bones.length; i++)
		{
			if (this.bones[i].parent != parent)
			{
				continue;
			}
			
			bone = this.bones[i];
			bone.posA = Math.min(bone.posA + bone.speedA, bone.maxA);
			
			bone.a = smoothstep(bone.startA, bone.targetA, bone.posA / bone.maxA);
			
			p = _copy(position);
			
			p.a += bone.a;
			p.b += bone.b;
			p.x += Math.sin(_rotation(p.a)) * Math.cos(_rotation(p.b)) * bone.length;
			p.y += Math.sin(_rotation(p.a)) * Math.sin(_rotation(p.b)) * bone.length;
			p.z += Math.cos(_rotation(p.a)) * bone.length;
			
			bone.gfxObject.position.x = p.x;
			bone.gfxObject.position.y = p.y;
			bone.gfxObject.position.z = p.z;
			
			this.updateChildBones(bone, p);
		}
	}
	
	updateBones()
	{
		this.updateChildBones(null, { x: this.gfxObject.position.x, y: this.gfxObject.position.y, z: this.gfxObject.position.z, a: 0, b: 0 });
		
		if (DEV_BUILD)
		{
			let i, a, b;
			
			if (this.boneDebugLines)
			{
				this.boneDebugLines.dispose();
			}
			
			a = [];
			a.push(new BABYLON.Vector3(_player.gfxObject.position.x, _player.gfxObject.position.y, _player.gfxObject.position.z));
			
			for (i=0; i<this.bones.length; i++)
			{
				b = this.bones[i];
				
				a.push(new BABYLON.Vector3(b.gfxObject.position.x, b.gfxObject.position.y, b.gfxObject.position.z));
			}
			
			a.push(new BABYLON.Vector3(b.gfxObject.position.x, 0, b.gfxObject.position.z));
			a.push(new BABYLON.Vector3(b.gfxObject.position.x, 0, this.gfxObject.position.z));
			
			this.boneDebugLines = BABYLON.MeshBuilder.CreateLines("lines", { points: a }, _gfx.scene1);
		}
	}
}
