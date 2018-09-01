"use strict";

let _level;
let _player;
let _input;
let _gameSpeed;
let _ticks;
let _nextTickTime;
let _obstacles;
let _gfx;

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
	
	now = performance.now();
	
	while (_nextTickTime < now)
	{
		tick();
		_nextTickTime += 1000 / TPS;
	}
	
	debugDraw();
}

function init()
{
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
}

bindEvent(window, "load", init);
