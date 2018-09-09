"use strict";

const INPUT_STATE_FIRST_INPUT = 1;
const INPUT_STATE_SETUP = 2;
const INPUT_STATE_FINISHED = 3;
const INPUT_STATE_MESSAGE = 4;

class InputJS
{
	constructor()
	{
		this.inputs = [];
		this.cursor = [ 0.5, 0.5 ];
		this.controls = [];
		this.callbackDone = null;
		this.callbackFailed = null;
		this.callbackMessage = null;
		this.timer = null;
		this.state = INPUT_STATE_FIRST_INPUT;
		
		window.setInterval(this.update.bind(this), 1000/60);
	}
	
	attach(obj)
	{
		obj.addEventListener("mousemove", this.handleMouseMove.bind(this));
		obj.addEventListener("keydown", this.handleEvent.bind(this, 1));
		obj.addEventListener("keyup", this.handleEvent.bind(this, 0));
		obj.addEventListener("mousedown", this.handleEvent.bind(this, 1));
		obj.addEventListener("mouseup", this.handleEvent.bind(this, 0));
		obj.addEventListener("wheel", this.handleEvent.bind(this, 0));
		obj.addEventListener("touchstart", this.handleEvent.bind(this, 1));
		obj.addEventListener("touchend", this.handleEvent.bind(this, 0));
	}
	
	setup(obj, controls, callbackDone, callbackFailed, callbackMessage)
	{
		let i;
		
		this.attach(obj);
		
		for (i=0; i<controls.length; i++)
		{
			this.controls.push({ text: controls[i], input: null });
		}
		
		this.callbackDone = callbackDone;
		this.callbackFailed = callbackFailed;
		this.callbackMessage = callbackMessage;
		
		this.state = INPUT_STATE_FIRST_INPUT;
		this.startTimer("Use any input.", this.inputFailed.bind(this), 5000);
	}
	
	inputFailed()
	{
		this.state = INPUT_STATE_FINISHED;
		this.callbackFailed.call();
	}
	
	newControlConfigured(input)
	{
		this.controls[this.controls.length - 1].input = input;
	}
	
	stopTimer()
	{
		if (this.timer)
		{
			window.clearTimeout(this.timer);
			this.timer = null;
		}
	}
	
	startTimer(message, callback, time)
	{
		this.stopTimer();
		this.callbackMessage.call(_gfx, message); // TODO: meh
		this.timer = window.setTimeout(callback, time);
	}
	
	skipNextInput()
	{
	}
	
	askForNextInput()
	{
		let i;
		
		for (i=0; i<this.controls.length; i++)
		{
			if (this.controls[i].input === null)
			{
				this.state = INPUT_STATE_SETUP;
				this.startTimer("Press a key for " + this.controls[i].text, this.skipNextInput.bind(this), 1000);
				return;
			}
		}
		
		this.state = INPUT_STATE_FINISHED;
		this.startTimer("Everything is configured, nice!", this.setupDone.bind(this), 1000);
	}
	
	setupDone()
	{
		this.clearWasActiveFlags();
		this.state = INPUT_STATE_FINISHED;
	}
	
	setValue(key, value, saveDefault, twoWay)
	{
		let i;
		
		if (twoWay)
		{
			this.setValue(key + "pos", (value > 0 ? value : 0), saveDefault, false);
			this.setValue(key + "neg", (value < 0 ? value : 0), saveDefault, false);
			return;
		}
		
		if (!this.inputs[key])
		{
			this.inputs[key] = {
				initial: saveDefault ? value : 0, 
				value: 0,
				active: false,
				wasActive: false
			};
		}
		
		this.inputs[key].value = value;
		this.inputs[key].active = Math.abs(value - this.inputs[key].initial) > 0.8;
		this.inputs[key].wasActive = this.inputs[key].wasActive || this.inputs[key].active;
		
		if (this.inputs[key].active)
		{
			if (this.state == INPUT_STATE_FIRST_INPUT || this.state == INPUT_STATE_SETUP)
			{
				if (this.state == INPUT_STATE_SETUP)
				{
					for (i=0; i<this.controls.length; i++)
					{
						if (this.controls[i].input === null)
						{
							this.controls[i].input = this.inputs[key];
							break;
						}
					}
				}
				
				this.state = INPUT_STATE_MESSAGE;
				this.startTimer("Thanks!", this.askForNextInput.bind(this), 1000)
			}
		}
	}
	
	clearWasActiveFlags()
	{
		let i;
		
		for (i=0; i<this.inputs.length; i++)
		{
			this.inputs[i].wasActive = false;
		}
	}
	
	handleMouseMove(event)
	{
		this.cursor[0] = event.clientX / event.target.width;
		this.cursor[1] = event.clientY / event.target.height;
	}
	
	handleEvent(value, event)
	{
		if (event instanceof KeyboardEvent)
		{
			this.setValue(event.code ? event.code : event.key, value, false, false);
		}
		if (event instanceof TouchEvent)
		{
			this.setValue("touch", value, false, false);
		}
		else if (event instanceof WheelEvent)
		{
			this.setValue("wheelX", event.deltaX, false, false);
			this.setValue("wheelY", event.deltaY, false, false);
			this.setValue("wheelZ", event.deltaZ, false, false);
		}
		else if (event instanceof MouseEvent)
		{
			this.setValue("mousebutton" + event.button, value, false, false);
			this.handleMouseMove(event);
		}
		
		if (event.cancellable)
		{
			event.preventDefault();
		}
	}
	
	query()
	{
		let i, result;
		
		result = {};
		
		for (i=0; i<this.controls.length; i++)
		{
			result[this.controls[i].text] = (this.controls[i].input && this.controls[i].input.wasActive);
		}
		
		this.clearWasActiveFlags();
		
		return result;
	}
	
	update()
	{
		let gamepads, i, j;
		
		gamepads = navigator.getGamepads ? navigator.getGamepads() : (navigator.webkitGetGamepads ? navigator.webkitGetGamepads() : []);
		
		for (i=0; i<gamepads.length; i++)
		{
			if (gamepads[i])
			{
				if (gamepads[i].buttons)
				{
					for (j=0; j<gamepads[i].buttons.length; j++)
					{
						this.setValue("gamepad" + i + "button" + j, gamepads[i].buttons[j].value ? gamepads[i].buttons[j].value : (gamepads[i].buttons[j].pressed ? 1 : 0), false, false);
					}
				}
				
				if (gamepads[i].axes)
				{
					for (j=0; j<gamepads[i].axes.length; j++)
					{
						this.setValue("gamepad" + i + "axis" + j, gamepads[i].axes[j], true, true);
					}
				}
			}
		}
		
/*
		let s;
		
		s = "";
		
		for (i in this.inputs)
		{
			s += i + ": " + this.inputs[i].value + " " + (this.inputs[i].active ? "*active*" : "") + "\n";
		}
		
		this.setValue("wheelX", 0);
		this.setValue("wheelY", 0);
		this.setValue("wheelZ", 0);
		
		document.getElementById("status").innerHTML = s;
*/
	}
}
