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
	
	_player.tick();
	_gfx.tick();
}

function tickInit()
{
	_nextTickTime = performance.now();
}

function tickCatchUp()
{
	let now;
	
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
	// _input = new InputKeyboard();
	_input = new InputJS();
	_input.setup(_canvas, [ "Up", "Down", "Left", "Right", "Select" ], _gfx.onInputSetupDone, _gfx.onInputSetupFailed, _gfx.message);
	
	tickInit();
	
	_player.init();
	_level.generate();
	_level.load();
	
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
