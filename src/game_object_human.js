"use strict";

class GameObjectHuman extends GameObject
{
	constructor()
	{
		super();
		
		this.timeJump = 0;
		this.timeDuck = 0;
		
		this.gfxObject = _gfx.placeObject(OBJ_PLAYER, {}, {});
		
		this.limbs.push({ gfxObject: _gfx.placeObject(OBJ_HAND, {}, {}), pad: { x: 0, y: 0, z: 0 }, padTarget: { x: -0.2, y: 0.0, z: 0 }});
		this.limbs.push({ gfxObject: _gfx.placeObject(OBJ_HAND, {}, {}), pad: { x: 0, y: 0, z: 0 }, padTarget: { x:  0.2, y: 0.0, z: 0 }});
		this.limbs.push({ gfxObject: _gfx.placeObject(OBJ_HAND, {}, {}), pad: { x: 0, y: 0, z: 0 }, padTarget: { x: -0.3, y: 1.0, z: 0 }});
		this.limbs.push({ gfxObject: _gfx.placeObject(OBJ_HAND, {}, {}), pad: { x: 0, y: 0, z: 0 }, padTarget: { x:  0.3, y: 1.0, z: 0 }});
		this.limbs.push({ gfxObject: _gfx.placeObject(OBJ_HAND, {}, {}), pad: { x: 0, y: 0, z: 0 }, padTarget: { x:  0.0, y: 1.8, z: 0 }});
		
		this.animations = [];
		
		// running
		this.animations.push({
			frame: 0,
			length: 40,
			active: true,
			// TODO: flatten this?
			data: [
				[  0, [ 0, -0.2,  0.0,  0.4 ], [ 3,  0.2,  1.0,  0.4 ] ],
				[ 10, [ 0, -0.2,  0.1, -0.8 ], [ 3,  0.2,  0.8, -0.8 ] ],
				[ 20, [ 0, -0.2,  0.5, -1.0 ], [ 3,  0.2,  0.8, -0.8 ] ],
				[ 30, [ 0, -0.2,  0.1,  0.5 ], [ 3,  0.2,  1.0,  0.5 ] ],
				
				[  0, [ 1,  0.2,  0.5, -1.0 ], [ 2, -0.2,  0.8, -0.8 ] ],
				[ 10, [ 1,  0.2,  0.1,  0.5 ], [ 2, -0.2,  1.0,  0.5 ] ],
				[ 20, [ 1,  0.2,  0.0,  0.4 ], [ 2, -0.2,  1.0,  0.5 ] ],
				[ 30, [ 1,  0.2,  0.1, -0.8 ], [ 2, -0.2,  0.8, -0.8 ] ],
				
				[  5,  [ 4,  0.0, 1.8,  0.0 ] ],
				[ 15,  [ 4,  0.1, 1.7,  0.1 ] ],
				[ 25,  [ 4,  0.0, 1.8,  0.0 ] ],
				[ 35,  [ 4, -0.1, 1.7, -0.1 ] ],
			]
		});
		
		// jumping
		this.animations.push({
			frame: 0,
			length: 1,
			active: false,
			// TODO: flatten this?
			data: [
				[  0, [ 0, -0.2,  0.4,  0.4 ], [ 1,  0.2,  0.0, -0.4 ], [ 2, -0.2,  0.8, -0.5 ], [ 3,  0.2,  1.3,  0.8 ], [ 4, -0.1, 1.5, 0.3 ] ],
			]
		});
		
		// ducking
		this.animations.push({
			frame: 0,
			length: 1,
			active: false,
			// TODO: flatten this?
			data: [
				[  0, [ 0, -0.1,  0.3,  1.3 ], [ 1, -0.1,  0.0,  -0.3 ], [ 2,  0.1,  0.3, 1.1 ], [ 3,  0.1,  0.2, -0.5 ], [ 4, 0.1, 0.3, -1.2 ] ],
			]
		});
		
		// falling
		this.animations.push({
			frame: 0,
			length: 1,
			active: false,
			// TODO: flatten this?
			data: [
				[  0, [ 0, -0.2,  0.1,  0.3 ], [ 1,  0.2,  0.1, -0.3 ], [ 2,  -0.5,  1.9,  0.3 ], [ 3,  0.5, 1.9, 0.3 ], [ 4,  0.0, 1.8, 0.0 ] ],
			]
		});
		
		this.updateLimbs(true);
	}
	
	updateObjects()
	{
		this.gfxObject.position.x = this.mapX;
		this.gfxObject.position.z = this.mapY;
		this.updateAnimation();
		this.updateLimbs(false);
	}
	
	tick()
	{
	}
}
