"use strict";

function debugInit()
{
	let obj;
	
	obj = document.createElement("canvas");
	obj.id = "c1";
	
	document.body.appendChild(obj);
}

function debugDraw()
{
	let obj, width, height, zoom, x, y, c, ctx;
	
	zoom = 8;
	
	obj = document.getElementById("c1");
	
	ctx = obj.getContext("2d");
	
	width = LEVEL_WIDTH * zoom;
	height = LEVEL_HEIGHT * zoom;
	
	obj.width = width;
	obj.height = height;
	obj.style.width = width;
	obj.style.height = height;
	
	fixCanvasContextSmoothing(ctx);
	
	ctx.fillStyle = "#888";
	ctx.fillRect(0, 0, LEVEL_WIDTH * zoom, LEVEL_HEIGHT * zoom);
	for (y=0; y<LEVEL_HEIGHT; y++)
	{
		for (x=0; x<LEVEL_WIDTH; x++)
		{
			c = _level.map[y][x];
			
			ctx.fillStyle = TILE_COLORS[c];
			ctx.fillRect(x * zoom, (LEVEL_HEIGHT - y) * zoom, zoom, zoom);
			
			c = _level.mapObjects[y][x];
			
			ctx.fillStyle = OBJ_COLORS[c];
			ctx.fillRect(x * zoom + 1, (LEVEL_HEIGHT - y) * zoom + 1, zoom - 2, zoom - 2);
		}
	}
	
	ctx.fillStyle = "#0d0";
	ctx.strokeStyle = "#030";
	ctx.lineWidth = zoom / 2;
	ctx.strokeRect(_player.mapX * zoom + 1, (LEVEL_HEIGHT - _player.mapY) * zoom + 1, zoom - 2, zoom - 2);
	ctx.fillRect(_player.mapX * zoom + 1, (LEVEL_HEIGHT - _player.mapY) * zoom + 1, zoom - 2, zoom - 2);
	
	ctx.fillStyle = "rgba(255,255,0," + (_player.timeJump / TIME_JUMP) + ")";
	ctx.fillRect(_player.mapX * zoom + 1, (LEVEL_HEIGHT - _player.mapY) * zoom + 1, zoom - 2, zoom - 2);
	
	ctx.fillStyle = "rgba(0,255,255," + (_player.timeDuck / TIME_DUCK) + ")";
	ctx.fillRect(_player.mapX * zoom + 1, (LEVEL_HEIGHT - _player.mapY) * zoom + 1, zoom - 2, zoom - 2);
}
