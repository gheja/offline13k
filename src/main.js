"use strict";

let _canvas;
let _level;
let _player;
let _input;
let _gameSpeed;
let _ticks;
let _nextTickTime;
let _obstacles;
let _gfx;

let _windowHidden = false;

function tick()
{
	_ticks++;
	
	if (_ticks % 60 == 0)
	{
		_gameSpeed *= 1.02;
	}
	
	_player.tick();
}

function tickInit()
{
	_nextTickTime = performance.now();
}

function frame()
{
	let now;
	
	if (DEV_BUILD)
	{
		if (_windowHidden)
		{
			return;
		}
	}
	
	now = performance.now();
	
	while (_nextTickTime < now)
	{
		tick();
		_nextTickTime += 1000 / TPS;
	}
}

function init()
{
	_canvas = document.getElementById("c");
	_level = new Level();
	_player = new GameObjectPlayer();
	_input = new InputKeyboard();
	_gameSpeed = 0.05;
	_ticks = 0;
	_gfx = new Gfx();
	_gfx.init();
	
	tickInit();
	
	_player.init();
	_level.generate();
	_level.load();
	
	window.setInterval(frame, 1000 / FPS);
	if (DEV_BUILD)
	{
		bindEvent(window, "focus", function() { _windowHidden = false; });
		bindEvent(window, "blur", function() { _windowHidden = true; });
	}

}

bindEvent(window, "load", init);
