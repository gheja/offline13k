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

let _audioCtx;
let _audioSourceObj;

let _windowHidden = false;
let _firstUserInteraction = true;

function onMouseDown(e)
{
	let exception;
	
//	if (_firstUserInteraction)
	{
		// do not throw an error when music is still loading
		try
		{
			musicStart();
			_firstUserInteraction = false;
		}
		catch (exception)
		{
		}
	}
}

function musicGenerate()
{
	let exception;
	
	try
	{
		let songGen = new sonantx.MusicGenerator(_music);
		_audioCtx = new AudioContext();
		
		songGen.createAudioBuffer(function(buffer) {
			_audioSourceObj = _audioCtx.createBufferSource();
			_audioSourceObj.loop = true;
			_audioSourceObj.buffer = buffer;
			_audioSourceObj.connect(_audioCtx.destination);
		});
	}
	catch (exception)
	{
	}
}

function musicStart()
{
	_audioSourceObj.start();
}

function tick()
{
	_ticks++;
	
/*
	if (_ticks % 60 == 0)
	{
		_gameSpeed *= 1.02;
	}
*/
	
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
	_gameSpeed = 0.05;
	_ticks = 0;
	_gfx = new Gfx();
	_gfx.init();
	
	_level = new Level();
	_player = new GameObjectPlayer();
	_input = new InputKeyboard();
	
	tickInit();
	
	_player.init();
	_level.generate();
	_level.load();
	
	window.setInterval(frame, 1000 / FPS);
	
	musicGenerate();
	
	bindEvent(_canvas, "click", onMouseDown);
	bindEvent(_canvas, "touchstart", onMouseDown);
	
	if (DEV_BUILD)
	{
		bindEvent(window, "focus", function() { _windowHidden = false; });
		bindEvent(window, "blur", function() { _windowHidden = true; });
	}
}

bindEvent(window, "load", init);
