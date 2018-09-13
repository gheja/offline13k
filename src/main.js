"use strict";

let _canvas;
let _level;
let _player;
let _input;
let _gameSpeed;
let _ticks;
let _nextTickTime;
let _puzzle;
let _gfx;
let _nextLevelNumber = 0;
let _obstacles = [];
let _levelGfxObjects = [];

let _audioCtx;
let _audioSourceObj;

let _windowHidden = false;
let _firstUserInteraction = true;

/*
function checkFirstInteraction()
{
	let exception;
	
	if (_firstUserInteraction)
	{
		try
		{
			startAudio();
			_firstUserInteraction = false;
		}
		catch (exception)
		{
		}
	}
}
*/

let _audio = [];

function updateAudio()
{
	let i;
	
	for (i=0; i<3; i++)
	{
		_audio[i].volume += (_audio[i].targetVolume - _audio[i].volume) * 0.1;
	}
}

function switchAudio(index)
{
	let i;
	
	for (i=0; i<3; i++)
	{
		_audio[i].targetVolume = (i == index) ? 1 : 0;
	}
	
	_audio[index].currentTime = 0;
	_audio[index].play();
}

function prepareAudio()
{
	let exception, i, player, a;
	
	for (i=0; i<3; i++)
	{
		player = new CPlayer();
		player.init(_musics[i]);
		
		while (player.generate() < 1) {}
		
		a = document.createElement("audio");
		a.src = URL.createObjectURL(new Blob([ player.createWave() ], { type: "audio/wav" }));
		a.targetVolume = (i == 0) ? 1 : 0;
		a.volume =  a.targetVolume;
		a.loop = true;
		a.play();
		
		_audio[i] = a;
		_audio.push(a);
	}
}

function musicStart()
{
	_audioSourceObj.start();
}

function inputSetupDone()
{
	
}

function inputSetupFailed()
{
	
}

function disposeLevelGfxObjects()
{
	let i;
	
	for (i=0; i<_levelGfxObjects.length; i++)
	{
		_levelGfxObjects[i].dispose();
	}
	
	_levelGfxObjects.length = 0;
	
	for (i=0; i<_obstacles.length; i++)
	{
		_obstacles[i].gfxObject.dispose();
	}
	
	_obstacles.length = 0;
}


function startLevel(a, b)
{
	// console.log(_gfx.hoveredSphere.level);
	disposeLevelGfxObjects();
	
	_level.generate(_gfx.hoveredSphere.level);
	_level.load();
	_player.restart();
	_puzzle.setup(0);
	_gfx.switchScene(SCENE_STREET);
	switchAudio(1);
}

function addNewLevel()
{
	_gfx.addSphere(-100 + Math.random() * 5, 0.5 + Math.random() * 2, 6.5, 0.3, "Start level", startLevel, { "level": _nextLevelNumber });
	
	_nextLevelNumber++;
}

function tick()
{
	_ticks++;
	
	if (_ticks == 2)
	{
		_input.setup(_canvas, [ "Up", "Down", "Left", "Right", "Select" ], inputSetupDone, inputSetupFailed, _gfx.updateMessage);
	}
	
	if (_gfx.activeSceneIndex == 1)
	{
		_player.tick();
	}
	_gfx.tick();
	_puzzle.tick();
	updateAudio();
}

function tickInit()
{
	_nextTickTime = performance.now();
}

function tickCatchUp()
{
	let now;
	
	now = performance.now();
	
	if (_nextTickTime < now - 5000)
	{
		_nextTickTime = now - 1;
		
		if (DEV_BUILD)
		{
			console.log("Skipping ticks.");
		}
	}
	
	while (_nextTickTime < now)
	{
		tick();
		_nextTickTime += 1000 / TPS;
	}
}

function gameBack()
{
	_gfx.updateMessage("");
	_gfx.switchScene(SCENE_OFFICE);
	switchAudio(0);
}

function gameLost()
{
	_gfx.updateMessage("Ouch!");
	window.setTimeout(gameBack, 2000);
}

function gameWon()
{
	_gfx.updateMessage("The customer is back online again!");
	window.setTimeout(gameBack, 2000);
	window.setTimeout(function() { addNewLevel(); _gfx.updateMessage("Oh no, another customer went offline."); }, 4000);
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
	_puzzle = new Puzzle();
	
	tickInit();
	
	_player.init();
	
	addNewLevel();
	
	prepareAudio();
}

bindEvent(window, "load", init);
