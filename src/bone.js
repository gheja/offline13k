"use strict";

class Bone
{
	constructor(gfxObject, parent, length, a, b)
	{
		this.gfxObject = gfxObject;
		this.parent = parent;
		this.length = length;
		this.a = a;
		this.b = b;
		this.startA = 0;
		this.targetA = 0;
		this.posA = 0;
		this.maxA = 1;
		this.speedA = 1 / TPS;
	}
	
	setTargetA(x)
	{
		this.targetA = x;
		this.startA = this.a;
		this.posA = 0;
		this.maxA = 1;
	}
}
