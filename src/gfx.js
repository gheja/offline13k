"use strict";

class Gfx
{
	constructor()
	{
		this.engine = null;
		this.scene1 = null;
		this.canvas = document.getElementById("c");
		
		this.objectPrototypes = {};
	}
	
	init()
	{
		this.engine = new BABYLON.Engine(this.canvas, true, { preserveDrawingBuffer: true, stencil: true });
		this.scene1 = this.createScene();
		this.engine.runRenderLoop(this.onRenderLoop.bind(this));
		
		bindEvent(window, "resize", this.onResize.bind(this));
	}
	
	createObjectPrototype(definition, key)
	{
		let a;
		
		a = BABYLON.MeshBuilder.CreateBox("", { "size": 2 }, this.scene1);
		// a.material = _material;
		a.setEnabled(false);
		
		this.objectPrototypes[key] = a;
	}
	
	placeObject(key, position, rotation)
	{
		let a;
		
		if (DEBUG)
		{
			if (!this.objectPrototypes[key])
			{
				throw "Could not find object by key \"" + key + "\"";
			}
		}
		
		a = this.objectPrototypes[key].createInstance();
		_merge(a.position, position);
		_merge(a.rotation, rotation);
		// _shadowGenerator.addShadowCaster(a, true);
		
		return a;
	}
	
	createScene()
	{
		let scene, plane, light1, light2, camera, mat2, sphere, vrHelper;
		
		scene = new BABYLON.Scene(this.engine);
		
		light1 = new BABYLON.PointLight("", new BABYLON.Vector3(0, 10, 60), scene);
		light1.intensity = 0.8;
		
		light2 = new BABYLON.PointLight("", new BABYLON.Vector3(0, 100, 200), scene);
		light2.intensity = 0.6;
		
		camera = new BABYLON.FreeCamera("", new BABYLON.Vector3(0, 10, -10), scene);
		camera.attachControl(this.canvas, true);
		
		mat2 = new BABYLON.StandardMaterial("sa", scene);
		mat2.diffuseColor = new BABYLON.Color3(0.2, 0.8, 1.0);
		
		// material = new BABYLON.StandardMaterial("sphere material", scene);
		// // material.alpha = 0.5;
		// material.backFaceCulling = true;
		
		// _shadowGenerator = new BABYLON.ShadowGenerator(1024, _light);
		// _shadowGenerator.useBlurExponentialShadowMap = true;
		// _shadowGenerator.blurKernel = 32;
		
		plane = BABYLON.Mesh.CreatePlane("", 100, scene);
		plane.position.y = -10;
		plane.position.z = 20;
		// plane.receiveShadows = true;
		plane.material = mat2;
		plane.rotation.x = _rotation(0.25);
		
		// scene.onBeforeRenderObservable.add(onUpdate);
		
		// Enable VR
		vrHelper = scene.createDefaultVRExperience({ "createDeviceOrientationCamera": true });
		
		this.createObjectPrototype("", "a");
		this.placeObject("a", { x: 3, y: 4, z: 10 }, {});
		this.placeObject("a", { x: 2, y: 2, z: 15 }, {});
		
		return scene;
	}
	
	onResize()
	{
		this.engine.resize();
	}
	
	onRenderLoop()
	{
		this.scene1.render();
	}
}
