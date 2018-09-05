"use strict";

class Bone
{
	constructor(gfxObject, length)
	{
		this.gfxObject = gfxObject;
		this.parent = null;
		this.length = length;
		this.a = 0;
		this.b = 0;
		this.targetA = 0;
		this.targetB = 0;
	}
	
	setTargetA(x)
	{
		this.targetA = x;
		this.startA = this.a;
		this.posA = 0;
		this.maxA = 1;
	}
}
