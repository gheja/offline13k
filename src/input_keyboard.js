"use strict";

class InputKeyboard extends Input
{
	constructor()
	{
		super();
		
		this.keys = {
			"up": { codes: [ "ArrowUp" ], pressed: false, newEvent: false },
			"right": { codes: [ "ArrowRight" ], pressed: false, newEvent: false },
			"down": { codes: [ "ArrowDown" ], pressed: false, newEvent: false },
			"left": { codes: [ "ArrowLeft" ], pressed: false, newEvent: false }
		};
		
		bindEvent(window, "keydown", this.onKeyDown.bind(this));
		bindEvent(window, "keyup", this.onKeyUp.bind(this));
	}
	
	handleKeyChange(e, pressed)
	{
		let i;
		
		for (i in this.keys)
		{
			if (this.keys[i].codes.indexOf(e.key) !== -1 || this.keys[i].codes.indexOf(e.code) !== -1)
			{
				if (this.keys[i].pressed != pressed)
				{
					this.keys[i].newEvent = true;
				}
				
				this.keys[i].pressed = pressed;
				
				break;
			}
		}
	}
	
	onKeyDown(e)
	{
		this.handleKeyChange(e, true);
	}
	
	onKeyUp(e)
	{
		this.handleKeyChange(e, false);
	}
	
	clearNewFlags()
	{
		let i;
		
		for (i in this.keys)
		{
			this.keys[i].newEvent = false;
		}
	}
	
	query()
	{
		let result;
		
		result = {
			x: 0,
			y: 0
		};
		
		if (this.keys["up"].pressed)
		{
			result.y += -1;
		}
		if (this.keys["down"].pressed)
		{
			result.y += 1;
		}
		if (this.keys["left"].pressed)
		{
			result.x += -1;
		}
		if (this.keys["right"].pressed)
		{
			result.x += 1;
		}
		
		this.clearNewFlags();
		
		return result;
	}
}
