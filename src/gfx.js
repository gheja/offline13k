"use strict";

class Gfx
{
	constructor()
	{
		this.engine = null;
		this.scene1 = null;
		this.vr = null;
		this.mat2 = null;
		this.multiMaterial = null;
		// this.shadowGenerator = null;
		
		this.objectPrototypes = {};
	}
	
	init()
	{
		this.engine = new BABYLON.Engine(_canvas, true, { preserveDrawingBuffer: true, stencil: true });
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
		material.alpha = a;
		
		return material;
	}
	
	loadModelFromString(key, s, scene)
	{
		let mesh, positions, indices, normals, vertexData, i, model, a;
		
		// initialize mesh
		mesh = new BABYLON.Mesh("", scene);
		
		// process the string (values should be integers but they are strings this way)
		a = s.split("  ");
		
		model = {
			flatShaded: a[0],
			scale: a[1],
			points: a[2].split(" "),
			faces: a[3].split(" "),
			groups: a[4].split(" ")
		};
		
		positions = [];
		indices = [];
		normals = [];
		
		// "* 1" is the cheap way to convert a string to integer
		
		for (i=0; i<model.points.length; i++)
		{
			positions.push(model.points[i] * 1); // pad all positions except Y
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
		
		vertexData = new BABYLON.VertexData();
		vertexData.positions = positions;
		vertexData.indices = indices;
		vertexData.normals = normals;
		
		vertexData.applyToMesh(mesh);
		
		// mesh.material = this.quickMaterial(0.5, 0.5, 0.5, 1, scene);
		mesh.material = this.multiMaterial;
		mesh.isPickable = false;
		mesh.setEnabled(false);
		mesh.scaling.x = 0.001 * model.scale;
		mesh.scaling.y = 0.001 * model.scale;
		mesh.scaling.z = 0.001 * model.scale;
		
		if (model.flatShaded * 1)
		{
			mesh.convertToFlatShadedMesh();
		}
		
		mesh.subMeshes = [];
		
		for (i=0; i<model.groups.length; i += 10)
		{
			 mesh.subMeshes.push(new BABYLON.SubMesh(model.groups[i] * 1, 0, model.points.length, model.groups[i + 1] * 1 * 6, (model.groups[i + 2] * 1 - model.groups[i + 1] * 1 + 1) * 6, mesh));
		}
		
		this.objectPrototypes[key] = mesh;
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
		a.setEnabled(true);
		// this.shadowGenerator.addShadowCaster(a, true);
		
		return a;
	}
	
	createScene()
	{
		let scene, plane, light1, light2, camera, a;
		
		scene = new BABYLON.Scene(this.engine);
		scene.clearColor = new BABYLON.Color3(0.38, 0.75, 0.9);
		scene.ambientColor = new BABYLON.Color3(0.38, 0.75, 0.9);
		scene.fogColor = new BABYLON.Color3(0.38, 0.75, 0.9);
		
		light1 = new BABYLON.PointLight("", new BABYLON.Vector3(-50, 100, 300), scene);
		light1.intensity = 0.8;
		
		light2 = new BABYLON.PointLight("", new BABYLON.Vector3(0, 150, -300), scene);
		light2.intensity = 0.6;
		
		camera = new BABYLON.FreeCamera("", new BABYLON.Vector3(0, 1.7, -20), scene);
		camera.rotation.x = _rotation(0.03);
		camera.minZ = 0.2;
		
		this.multiMaterial = new BABYLON.MultiMaterial("", scene);
		this.multiMaterial.subMaterials.push(this.quickMaterial(0.5, 0.5, 0.5, 1.0, scene));
		this.multiMaterial.subMaterials.push(this.quickMaterial(1.0, 0, 0, 1.0, scene));
		this.multiMaterial.subMaterials.push(this.quickMaterial(0, 1.0, 0, 1.0, scene));
		this.multiMaterial.subMaterials.push(this.quickMaterial(0, 0, 1.0, 1.0, scene));
		
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
		
		scene.onBeforeAnimationsObservable.add(this.onUpdate.bind(this));
		
		// Enable VR
		this.vr = scene.createDefaultVRExperience();
		
		a = "1  10  0 0 0 100 0 0 100 100 0 0 100 0 100 100 100 100 0 100 0 0 100 0 100 100  0 1 2 3 1 5 4 2 5 6 7 4 6 0 3 7 3 2 4 7  0 0 4 0 0 0 0 0 0 0";
		
		this.loadModelFromString(OBJ_OBSTACLE_FULL, a, scene);
		this.loadModelFromString(OBJ_OBSTACLE_UPPER, a, scene);
		this.loadModelFromString(OBJ_OBSTACLE_LOWER, a, scene);
		this.loadModelFromString(OBJ_EDGE, a, scene);
//		this.loadModelFromString(OBJ_PLAYER, "1  10  20 20 0 80 20 0 50 50 20 20 50 50 80 50 50 80 20 100 20 20 100 50 50 80  0 1 2 3 1 5 4 2 5 6 7 4 6 0 3 7 3 2 4 7", scene);
// 		this.loadModelFromString(OBJ_PLAYER, "1  10  12 5 0 79 20 0 50 50 20 7 50 50 80 50 50 80 20 100 20 20 100 50 50 80  1 5 4 2 5 6 7 4 6 0 3 7 3 2 4 7 0 1 2 3  5 4 4 0 0 0 0 0 0 0 0 1 3 0 0 0 0 0 0 0 1 0 0 0 0 0 0 0 0 0", scene);
//		this.loadModelFromString(OBJ_HAND, "0  10  12 5 0 79 20 0 50 50 20 7 50 50 80 50 50 80 20 100 20 20 100 50 50 80  6 0 3 7 3 2 4 7 1 5 4 2 5 6 7 4 0 1 2 3  5 4 4 0 0 0 0 0 0 0 0 3 3 0 0 0 0 0 0 0 2 0 2 0 0 0 0 0 0 0", scene);
		
		a = "1  1  0 0 0 100 0 0 100 100 0 0 100 0 100 100 100 100 0 100 0 0 100 0 100 100  0 1 2 3 1 5 4 2 5 6 7 4 6 0 3 7 3 2 4 7  0 0 4 0 0 0 0 0 0 0";
 		this.loadModelFromString(OBJ_PLAYER, a, scene);
		this.loadModelFromString(OBJ_HAND, a, scene);
		
//		this.loadModelFromString(OBJ_HAND, "1  1  0 0 0 100 0 0 100 100 0 0 100 0 100 100 100 100 0 100 0 0 100 0 100 100  0 1 2 3 1 5 4 2 5 6 7 4 6 0 3 7 3 2 4 7  0 0 4 0 0 0 0 0 0 0", scene);
		
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
