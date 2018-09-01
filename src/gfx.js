"use strict";

class Gfx
{
	constructor()
	{
		this.engine = null;
		this.scene1 = null;
		this.canvas = document.getElementById("c");
		this.vr = null;
		this.mat2 = null;
		
		this.objectPrototypes = {};
	}
	
	init()
	{
		this.engine = new BABYLON.Engine(this.canvas, true, { preserveDrawingBuffer: true, stencil: true });
		this.scene1 = this.createScene();
		this.engine.runRenderLoop(this.onRenderLoop.bind(this));
		this.scene1.activeCamera.inputs.clear();
		this.scene1.activeCamera.inputs.addMouse();
		
		bindEvent(window, "resize", this.onResize.bind(this));
	}
	
	quickMaterial(r, g, b, a, scene)
	{
		let material;
		
		material = new BABYLON.StandardMaterial("", scene);
		material.diffuseColor = new BABYLON.Color3(r, g, b);
		material.ambientColor = new BABYLON.Color3(r * 0.2, g * 0.2, b * 0.2);
		if (a !== undefined)
		{
			material.alpha = a;
		}
		
		return material;
	}
	
	createObjectPrototype(definition, key)
	{
		let a;
		
		a = BABYLON.MeshBuilder.CreateBox("", {}, this.scene1);
		a.game = _copy(definition);
		a.scaling.x = 1;
		a.scaling.y = a.game.height;
		a.setEnabled(false);
		a.material = this.mat2;
		
		this.objectPrototypes[key] = a;
	}
	
	placeObject(key, position, rotation)
	{
		let a;
		
		if (DEV_BUILD)
		{
			if (!this.objectPrototypes[key])
			{
				throw "Could not find object by key \"" + key + "\"";
			}
		}
		
		a = this.objectPrototypes[key].createInstance();
		_merge(a.position, position);
		_merge(a.rotation, rotation);
		a.position.y += this.objectPrototypes[key].game.z + this.objectPrototypes[key].game.height / 2;
		// _shadowGenerator.addShadowCaster(a, true);
		
		return a;
	}
	
	createScene()
	{
		let scene, plane, light1, light2, camera, a;
		
		scene = new BABYLON.Scene(this.engine);
		scene.clearColor = new BABYLON.Color3(98/255, 193/255, 229/255);
		scene.ambientColor = new BABYLON.Color3(98/255, 193/255, 229/255);
		scene.fogColor = new BABYLON.Color3(98/255, 193/255, 229/255);
		
		light1 = new BABYLON.PointLight("", new BABYLON.Vector3(0, 10, 60), scene);
		light1.intensity = 0.8;
		
		light2 = new BABYLON.PointLight("", new BABYLON.Vector3(0, 100, -100), scene);
		light2.intensity = 0.6;
		
		camera = new BABYLON.FreeCamera("", new BABYLON.Vector3(0, 1.7, -20), scene);
		camera.rotation.x = _rotation(0.03);
		camera.minZ = 0.2;
		
		this.mat2 = this.quickMaterial(0.2, 0.8, 1.0);
		
		// _shadowGenerator = new BABYLON.ShadowGenerator(1024, _light);
		// _shadowGenerator.useBlurExponentialShadowMap = true;
		// _shadowGenerator.blurKernel = 32;
		
		plane = BABYLON.Mesh.CreatePlane("", 100, scene);
		plane.position.y = 0;
		plane.position.z = 20;
		// plane.receiveShadows = true;
		plane.material = this.mat2;
		plane.rotation.x = _rotation(0.25);
		
		scene.onBeforeAnimationsObservable.add(this.onUpdate.bind(this));
		
		// Enable VR
		this.vr = scene.createDefaultVRExperience();
		
		this.createObjectPrototype({ height: 1, z: 0 }, "block");
		this.createObjectPrototype({ height: 0.3, z: 0.7 }, "upper");
		this.createObjectPrototype({ height: 0.3, z: 0 }, "lower");
		this.createObjectPrototype({ height: 4, z: 0 }, "building");
		
		// player object
		a = BABYLON.MeshBuilder.CreateBox("", {}, this.scene1);
		a.game = { height: 0.2, z: 0.2 };
		a.scaling.x = 0.5;
		a.scaling.y = 0.5;
		a.scaling.z = 0.5;
		a.setEnabled(false);
		a.material = this.quickMaterial(0.9, 0.2, 0.1);
		this.objectPrototypes["player"] = a;
		
		scene.fogMode = BABYLON.Scene.FOGMODE_LINEAR;
		scene.fogStart = 20;
		scene.fogEnd = 70;
		
		return scene;
	}
	
	onUpdate()
	{
		let a, b;
		
		_player.updateObjects();
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
		
		frame();
		this.scene1.render();
	}
}
