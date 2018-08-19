"use strict";

class AlmostRandom
{
	constructor(seed = 42)
	{
		this.seed = seed;
	}
	
	random()
	{
		// these numbers are from random.org
		this.seed = (this.seed * 2328947 + 31781) % 59235921;
		
		// really.
		return (this.seed % 3806751) / 3806754;
	}
	
	chance(x)
	{
		return (this.random() < x);
	}
	
	randomInteger(min, max)
	{
		return (this.random() * (max - min) + min) | 0;
	}
	
	randomUInt32()
	{
		return this.randomInteger(0, 65535);
	}
}
