"use strict";

class Skeleton
{
	constructor()
	{
		this.poses = [];
		this.bones = [];
		
		if (DEV_BUILD)
		{
			this.boneDebugLines = null;
		}
	}
	
	addBone(a, parentIndex)
	{
		this.bones.push(a);
		
		if (parentIndex !== null)
		{
			a.parent = this.bones[parentIndex];
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
			bone.a = bone.a + (bone.targetA - bone.a) * 0.03;
			bone.b = bone.b + (bone.targetB - bone.b) * 0.03;
			
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
	
	update(position)
	{
		this.updateChildBones(null, { x: position.x, y: position.y, z: position.z, a: 0, b: 0 });
		
		if (DEV_BUILD)
		{
			let i, a, b;
			
			if (this.boneDebugLines)
			{
				this.boneDebugLines.dispose();
			}
			
			a = [];
			a.push(new BABYLON.Vector3(position.x, position.y, position.z));
			
			for (i=0; i<this.bones.length; i++)
			{
				b = this.bones[i];
				
				a.push(new BABYLON.Vector3(b.gfxObject.position.x, b.gfxObject.position.y, b.gfxObject.position.z));
			}
			
			a.push(new BABYLON.Vector3(b.gfxObject.position.x, 0, b.gfxObject.position.z));
			a.push(new BABYLON.Vector3(b.gfxObject.position.x, 0, position.z));
			
			this.boneDebugLines = BABYLON.MeshBuilder.CreateLines("lines", { points: a }, _gfx.scene1);
		}
	}
	
	setPose(x)
	{
		if (x == 0)
		{
			this.bones[0].setTargetA(0.3);
			this.bones[1].setTargetA(0.6);
		}
		
		if (x == 1)
		{
			this.bones[0].setTargetA(0.6);
			this.bones[1].setTargetA(0.3);
		}
		
	}
}
