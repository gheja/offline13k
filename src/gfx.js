"use strict";

class Gfx
{
	constructor()
	{
		this.engine = null;
		this.activeSceneIndex = null;
		this.scene = null;
		this.vr = null;
		this.mat2 = null; // << remove this
		this.materials = [];
		// this.shadowGenerator = null;
		
		this.objectPrototypes = {};
	}
	
	init()
	{
		this.engine = new BABYLON.Engine(_canvas, true, { preserveDrawingBuffer: true, stencil: true });
		
		this.scene = this.createScene();
		this.scene.activeCamera.inputs.clear();
		this.scene.activeCamera.inputs.addMouse();
		
		this.switchScene(0);
		
		window.setInterval(function() {
			if (_gfx.activeSceneIndex == 0)
			{
				_gfx.switchScene(1);
			}
			else
			{
				_gfx.switchScene(0);
			}
		}, 2000)
		
		this.engine.runRenderLoop(this.onRenderLoop.bind(this));
		
		bindEvent(window, "resize", this.onResize.bind(this));
	}
	
	message(s)
	{
		console.log(s);
		document.getElementById("message").innerHTML = s;
	}
	
	switchScene(index)
	{
		this.activeSceneIndex = index;
		
		if (index == 0)
		{
			this.scene.clearColor = new BABYLON.Color3(0.6, 0.6, 0.6);
			this.scene.fogColor = new BABYLON.Color3(0.6, 0.6, 0.6);
			this.scene.fogStart = 10;
			this.scene.fogEnd = 20;
		}
		else
		{
			this.scene.clearColor = new BABYLON.Color3(0.38, 0.75, 0.9);
			this.scene.fogColor = new BABYLON.Color3(0.38, 0.75, 0.9);
			this.scene.fogStart = 20;
			this.scene.fogEnd = 70;
		}
	}
	
	createDefaultMaterials(scene)
	{
		this.materials.push(this.quickMaterial(0.5, 0.5, 0.5, 1.0, scene));
		this.materials.push(this.quickMaterial(1.0, 0, 0, 1.0, scene));
		this.materials.push(this.quickMaterial(0, 1.0, 0, 1.0, scene));
		this.materials.push(this.quickMaterial(0, 0, 1.0, 1.0, scene));
	}
	
	quickMaterial(r, g, b, a, scene)
	{
		let material;
		
		material = new BABYLON.StandardMaterial("", scene);
		material.diffuseColor = new BABYLON.Color3(r, g, b);
		material.ambientColor = new BABYLON.Color3(r * 0.2, g * 0.2, b * 0.2);
		material.alpha = a;
		
		return material;
	}
	
	quickCanvasMaterial(size, u, v, scene)
	{
		let texture, ctx, material;
		
		texture = new BABYLON.DynamicTexture("", size, scene, true);
		texture.wrapU = true;
		texture.wrapV = true;
		texture.uScale = u;
		texture.vScale = v;
		
		ctx = texture.getContext();
		
		material = new BABYLON.StandardMaterial("", scene);
		material.diffuseTexture = texture;
		
		return { material: material, texture: texture, ctx: ctx };
	}
	
	loadModelFromString(key, s, scene)
	{
		let mesh, positions, indices, normals, vertexData, i, j, k, model, a, b;
		
		a = s.split("  ");
		
		model = {
			flatShaded: a[0],
			scale: a[1],
			center: [ a[2], a[3], a[4] ],
			points: a[5].split(" "),
			faces: a[6].split(" "),
			groups: a[7].split(" ")
		};
		
		mesh = new BABYLON.Mesh("custom", scene);
		mesh.isPickable = false;
		
		positions = [];
		indices = [];
		normals = [];
		
		// "* 1" is the cheap way to convert a string to integer
		
		for (i=0; i<model.points.length; i++)
		{
			positions.push(model.points[i] * 1 - model.center[i % 3] * 1);
		}
		
		for (i=0; i<model.faces.length; i += 4)
		{
			indices.push(model.faces[i] * 1);
			indices.push(model.faces[i + 1] * 1);
			indices.push(model.faces[i + 2] * 1);
			
			indices.push(model.faces[i + 2] * 1);
			indices.push(model.faces[i + 3] * 1);
			indices.push(model.faces[i] * 1);
		}
		
		BABYLON.VertexData.ComputeNormals(positions, indices, normals);
		
		for (i=0; i<model.groups.length; i += 10)
		{
			for (j=0; j<model.groups[i + 3] * 1 + 1; j++)
			{
				a = new BABYLON.Mesh("custom", scene);
				a.material = this.materials[model.groups[i]];
				a.parent = mesh;
				
				b = new BABYLON.VertexData();
				b.positions = _copy(positions);
				b.indices = indices.slice(model.groups[i + 1] * 1 * 6, (model.groups[i + 1] * 1 + model.groups[i + 2] * 1) * 6);
				b.normals = _copy(normals);
				
				for (k=0; k<b.positions.length; k+=3)
				{
					b.positions[k] += model.groups[i + 4] * 1 * j;
					b.positions[k] += model.groups[i + 5] * 1 * j;
					b.positions[k] += model.groups[i + 6] * 1 * j;
				}
				
				b.applyToMesh(a);
				
				if (model.flatShaded)
				{
					a.convertToFlatShadedMesh();
				}
				
			}
		}
		
		mesh.scaling.x = 0.001 * model.scale;
		mesh.scaling.y = 0.001 * model.scale;
		mesh.scaling.z = 0.001 * model.scale;
		mesh.setEnabled(false);
		
		this.objectPrototypes[key] = mesh;
	}
	
	placeObject(key, position, rotation)
	{
		let a, b, c, i;
		
		if (DEV_BUILD)
		{
			if (!this.objectPrototypes[key])
			{
				throw "Could not find object by key \"" + key + "\"";
			}
		}
		
		a = this.objectPrototypes[key].clone();
		_merge(a.position, position);
		_merge(a.rotation, rotation);
		a.setEnabled(true);
		// this.shadowGenerator.addShadowCaster(a, true);
		
		return a;
	}
	
	createScene()
	{
		let scene, plane, light1, light2, camera, a;
		
		scene = new BABYLON.Scene(this.engine);
		scene.ambientColor = new BABYLON.Color3(0.38, 0.75, 0.9);
		scene.fogMode = BABYLON.Scene.FOGMODE_LINEAR;
		
		light1 = new BABYLON.PointLight("", new BABYLON.Vector3(-50, 100, 300), scene);
		light1.intensity = 0.8;
		
		light2 = new BABYLON.PointLight("", new BABYLON.Vector3(0, 150, -300), scene);
		light2.intensity = 0.6;
		
		camera = new BABYLON.FreeCamera("", new BABYLON.Vector3(0, 1.7, 0), scene);
		camera.rotation.x = _rotation(0.03);
		camera.minZ = 0.2;
		
		
		// common objects
		this.createDefaultMaterials(scene);
		this.loadModelFromString(OBJ_OBSTACLE_FULL, "1  20  50  0  50  30 0 30 70 0 30 80 46 20 20 60 20 30 0 30 30 0 70 70 0 70 85 100 80 20 60 80  0 1 2 3 5 0 3 8 1 6 7 2 3 2 7 8 5 8 7 6  1 0 5 0 0 0 0 0 0 0", scene);
		this.loadModelFromString(OBJ_OBSTACLE_UPPER, "1  20  50  0  50  0 0 0 5 0 0 5 40 30 0 40 30 0 0 4 0 40 35 0 0 65 0 0 70 0 47 35 5 0 70 5 0 65 4 47 35 5 40 35 5 0 5 0 50 30 0 50 35 10 50 35 10 50 30 17 50 35 17 50 30 9 40 30 11 40 35 24 50 35 24 50 30 16 40 30 79 40 30 90 40 30 89 50 30 89 50 35 87 50 35 87 50 30 90 40 35 2 40 30  1 13 12 2 3 2 11 8 10 9 11 12 6 10 12 5 7 8 11 9 7 6 5 8 4 0 3 5 0 1 2 3 20 24 23 19 19 23 22 18 32 20 19 17 17 19 18 16 26 31 28 27 14 17 16 15 3 32 17 14 26 27 30 25 27 28 29 30 5 3 14 15  0 12 6 0 0 0 0 0 0 0 1 10 2 5 14 0 0 0 0 0 0 8 2 4 14 0 0 0 0 0 0 0 8 1 85 0 0 0 0 0", scene);
		this.loadModelFromString(OBJ_OBSTACLE_LOWER, "0  20  50  0  50  30 0 0 70 0 1 100 10 20 0 10 0 30 0 30 30 0 70 83 0 94 60 28 80 40 40 80  0 1 2 3 5 0 3 8 1 6 7 2 3 2 7 8  3 0 4 0 0 0 0 0 0 0", scene);
		this.loadModelFromString(OBJ_EDGE, "1  50  16  0  25  0 0 0 33 0 0 33 70 0 0 50 0 0 90 50 33 90 50 33 0 50 0 0 50  0 1 2 3 7 0 3 4 1 6 5 2 3 2 5 4  0 0 4 0 0 0 0 0 0 0", scene);
 		this.loadModelFromString(OBJ_PLAYER, "1  1  50  0  50  0 0 0 100 0 0 100 100 0 0 100 0 0 100 100 100 100 100 100 0 100 0 0 100  0 1 2 3 3 2 5 4 7 0 3 4 1 6 5 2  0 0 4 0 0 0 0 0 0 0", scene);
		this.loadModelFromString(OBJ_HAND, "1  1  50  0  50  0 0 0 100 0 0 100 100 0 0 100 0 0 100 100 100 100 100 100 0 100 0 0 100  0 1 2 3 3 2 5 4 7 0 3 4 1 6 5 2  0 0 4 0 0 0 0 0 0 0", scene);
		this.loadModelFromString(OBJ_DESK, "1  20  50  0  0  0 0 5 5 0 5 5 50 5 0 50 5 0 0 10 5 0 10 5 50 10 0 50 10 0 50 0 100 50 0 100 50 44 0 50 44 0 53 0 100 53 0 100 53 44 0 53 44  0 1 2 3 4 0 3 7 1 5 6 2 12 8 9 13 9 10 14 13 11 8 12 15 15 12 13 14  2 3 4 0 0 0 0 0 0 0 0 0 3 1 95 0 0 0 0 0", scene);
		
		
		// === office ===
		
		a = this.quickCanvasMaterial(512, 200, 200, scene);
		
		a.ctx.fillStyle = "#808080";
		a.ctx.fillRect(0, 0, 512, 512);
		a.ctx.strokeStyle = "#000000";
		a.ctx.lineWidth = 3;
		a.ctx.strokeRect(-10, -10, 512, 512);
		
		a.texture.update();
		
		plane = BABYLON.Mesh.CreatePlane("", 100, scene);
		plane.position.x = -100;
		// plane.receiveShadows = true;
		plane.material = a.material;
		plane.rotation.x = _rotation(0.25);
		
		
		// === street ===
		
		this.mat2 = this.quickMaterial(0.2, 0.8, 1.0, 1.0, scene);
		
		// this.shadowGenerator = new BABYLON.ShadowGenerator(1024, light1);
		// this.shadowGenerator.useBlurExponentialShadowMap = true;
		// this.shadowGenerator.blurKernel = 32;
		
		plane = BABYLON.Mesh.CreatePlane("", 100, scene);
		plane.position.y = 0;
		plane.position.z = 20;
		// plane.receiveShadows = true;
		plane.material = this.mat2;
		plane.rotation.x = _rotation(0.25);
		
		this.placeObject(OBJ_DESK, { x: -100, y: 0, z: 0.3 }, { x: 0, y: _rotation(0.02), z: 0 });
		
		scene.onBeforeAnimationsObservable.add(this.onUpdate.bind(this));
		
		scene.vr = scene.createDefaultVRExperience();
		
		return scene;
	}
	
	onInputSetupDone()
	{
	}
	
	onInputSetupFailed()
	{
	}
	
	onUpdate()
	{
		this.scene.activeCamera.minZ = 0.1;
		
		if (this.activeSceneIndex == 1)
		{
			tickCatchUp();
			_player.updateObjects();
		}
		else
		{
			// office.frame();
			_gfx.scene.activeCamera.position.x = -100;
			_gfx.scene.activeCamera.position.y = 1.3;
			_gfx.scene.activeCamera.position.z = 0;
		}
	}
	
	onResize()
	{
		this.engine.resize();
	}
	
	onRenderLoop()
	{
		if (DEV_BUILD)
		{
			if (_windowHidden)
			{
				return;
			}
		}
		this.scene.render();
	}
}
