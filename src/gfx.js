"use strict";

class Gfx
{
	constructor()
	{
		this.engine = null;
		this.activeSceneIndex = null;
		this.scene = null;
		this.vr = null;
		this.materials = [];
		this.orientationWorking = true;
		this.orientationA = 0;
		this.orientationB = 0;
		this.orientationC = 0;
		this.spheres = [];
		this.router = {
			objects: [],
			rotationY: 0,
			rotationYTarget: - Math.PI / 2
		};
		// this.shadowGenerator = null;
		
		this.objectPrototypes = {};
	}
	
	init()
	{
		this.engine = new BABYLON.Engine(_canvas, true, { preserveDrawingBuffer: true, stencil: true });
		
		this.scene = this.createScene();
		this.scene.activeCamera.inputs.clear();
		
		this.switchScene(2);
		
		this.engine.runRenderLoop(this.onRenderLoop.bind(this));
		bindEvent(_canvas, "click", this.onClick.bind(this));
		bindEvent(window, "resize", this.onResize.bind(this));
	}
	
	selectNextSphere(dx, dy)
	{
	}
	
	selectSphere(px, py)
	{
	}
	
	setSphereHover()
	{
	}
	
	addSphere(x, y, z, text, clickCallback, hoverEnterCallback, hoverExitCallback, sceneIndex)
	{
		let a;
		
		// a = this.placeObject(OBJ_CLICKABLE_SPHERE, { x: x, y: y, z: z }, {});
		a = BABYLON.MeshBuilder.CreateSphere("sphere", { diameter: 0.2, segments: 1 }, this.scene);
		a.convertToFlatShadedMesh();
		a.position.x = x;
		a.position.y = y;
		a.position.z = z;
		
		this.spheres.push({
			originalY: y,
			text: text,
			clickCallback: clickCallback,
			hoverEnterCallback: hoverEnterCallback,
			hoverExitCallback: hoverExitCallback,
			sceneIndex: sceneIndex,
			gfxObject: a
		});
	}
	
	message(s)
	{
		console.log(s);
		document.getElementById("message").innerHTML = s;
	}
	
	switchScene(index)
	{
		this.activeSceneIndex = index;
		
		this.scene.light2.setEnabled(false);
		this.scene.light3.setEnabled(false);
		
		if (index == 0)
		{
			// office
			this.scene.clearColor = new BABYLON.Color3(0.6, 0.6, 0.6);
			this.scene.fogColor = new BABYLON.Color3(0.6, 0.6, 0.6);
			this.scene.fogStart = 10;
			this.scene.fogEnd = 20;
			this.scene.light2.setEnabled(true);
		}
		else if (index == 1)
		{
			// street
			this.scene.clearColor = new BABYLON.Color3(0.38, 0.75, 0.9);
			this.scene.fogColor = new BABYLON.Color3(0.38, 0.75, 0.9);
			this.scene.fogStart = 20;
			this.scene.fogEnd = 50;
			this.scene.light3.setEnabled(true);
		}
		else
		{
			// router
			this.scene.clearColor = new BABYLON.Color3(0.9, 0.9, 0.9);
			this.scene.fogColor = new BABYLON.Color3(0.9, 0.9, 0.9);
			this.scene.fogStart = 10;
			this.scene.fogEnd = 20;
			// this.scene.light2.setEnabled(true);
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
		a.name = ""; // BABYLON._raySelectionPredicate depends on a name
		_merge(a.position, position);
		_merge(a.rotation, rotation);
		a.setEnabled(true);
		// this.shadowGenerator.addShadowCaster(a, true);
		
		return a;
	}
	
	createScene()
	{
		let scene, plane, camera, a, i;
		
		scene = new BABYLON.Scene(this.engine);
		scene.ambientColor = new BABYLON.Color3(0.38, 0.75, 0.9);
		scene.fogMode = BABYLON.Scene.FOGMODE_LINEAR;
		
		
		scene.light1 = new BABYLON.HemisphericLight("hemiLight", new BABYLON.Vector3(-1, 1, 0), scene);
		scene.light1.diffuse = new BABYLON.Color3(0.72, 0.70, 0.65);
		scene.light1.specular = new BABYLON.Color3(1.0, 0.9, 0.5);
		scene.light1.groundColor = new BABYLON.Color3(0.2, 0.2, 0.2);
		
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
		this.loadModelFromString(OBJ_DESK, "1  20  50  0  0  0 0 5 5 0 5 5 50 5 0 50 5 0 0 10 5 0 10 5 50 10 0 50 10 0 50 0 100 50 0 100 50 44 0 50 44 0 51 0 100 51 0 100 51 44 0 51 44  0 1 2 3 4 0 3 7 1 5 6 2 12 8 9 13 9 10 14 13 11 8 12 15 15 12 13 14  2 3 4 0 0 0 0 0 0 0 0 0 3 1 95 0 0 0 0 0", scene);
		this.loadModelFromString(OBJ_OFFICE_WALLS, "1  100  50  0  50  0 0 100 10 0 100 10 12 100 0 30 100 16 12 100 16 0 100 100 31 100 100 0 100 100 0 0 100 30 0 76 27 97 76 5 97 23 5 97 23 27 97 100 0 110 100 20 110 0 20 110 10 12 99 10 0 99 16 0 99 16 12 99 17 13 99 17 13 100 9 13 100 9 13 99 9 0 99 17 0 99 17 0 100 0 0 110  25 18 17 24 26 27 22 21 19 26 21 20 17 20 21 24 18 1 2 17 17 2 4 20 16 28 14 15 7 8 9 6 6 4 5 7 0 1 2 3 2 4 6 3 13 12 11 10  3 11 1 0 0 0 0 0 0 0 0 6 5 0 0 0 0 0 0 0 1 0 6 0 0 0 0 0 0 0", scene);
		this.loadModelFromString(OBJ_FLOOR_WARNING, "1  30  4  0  9  0 0 0 10 0 0 9 24 9 0 24 9 3 0 0 3 6 2 7 6 2 7 0 0 0 0 18 3 0 18 3 6 16 7 0 18 10 0 18 7 6 16  7 1 2 6 5 6 2 3 0 4 5 3 8 9 10 3 10 13 2 3 11 12 2 13  0 0 6 0 0 0 0 0 0 0", scene);
		this.loadModelFromString(OBJ_ROUTER_BOX, "1  10  30  20  30  30 20 30 50 20 30 50 25 30 30 25 30 22 18 30 22 27 30 62 27 30 62 18 30 22 18 70 22 27 70 62 27 70 62 18 70  4 7 1 0 4 0 3 5 3 2 6 5 1 7 6 2 7 11 10 6 5 6 10 9 8 4 5 9 4 8 11 7 11 8 9 10  0 1 8 0 0 0 0 0 0 0 0 0 1 0 0 0 0 0 0 0", scene);
		this.loadModelFromString(OBJ_ROUTER_PORT_NONE, "0  1  0  0  0  0 0 0 50 0 0 50 50 0 0 50 0  0 1 2 3  0 0 1 0 0 0 0 0 0 0", scene);
		this.loadModelFromString(OBJ_ROUTER_PORT_ETH, "1  1  0  0  0  0 0 0 50 0 0 50 50 0 0 50 0 8 5 0 42 5 0 42 28 0 34 28 0 8 28 0 16 28 0 34 34 0 16 34 0 8 5 30 8 28 30 16 28 30 16 34 30 34 34 30 34 28 30 42 28 30 42 5 30  0 4 8 3 11 10 2 3 7 6 2 10 6 5 1 2 0 1 5 4 8 9 11 3 12 4 5 19 12 13 8 4 12 19 18 17 9 14 15 11 15 16 10 11 17 7 10 16 17 18 6 7 19 5 6 18 17 14 13 12 14 17 16 15 8 13 14 9  0 6 11 0 0 0 0 0 0 0 3 0 6 0 0 0 0 0 0 0", scene);
		this.loadModelFromString(OBJ_ROUTER_PORT_POWER, "1  1  0  0  0  0 0 0 50 0 0 50 50 0 0 50 0 24 26 2 14 25 0 36 25 0 25 36 0 25 14 0 32 18 0 32 32 0 18 32 0 18 18 0 26 24 0 24 24 0 26 26 2 14 25 30 18 32 30 25 36 30 32 32 30 36 25 30 32 18 30 25 14 30 18 18 30 24 26 30 26 26 30 26 24 30 24 24 30 0 0 0 0 25 0 25 50 0 50 25 0 25 0 0  24 4 15 25 27 14 4 24 15 13 26 25 13 14 27 26 14 13 15 4 21 9 6 20 22 8 9 21 23 12 8 22 22 21 18 23 21 20 19 18 23 18 17 16 12 23 16 5 11 17 18 7 5 16 17 11 18 19 10 7 20 6 10 19 0 12 5 29 29 5 11 3 0 32 8 12 32 1 9 8 9 1 31 6 6 31 2 10 10 2 30 7 11 7 30 3  0 16 8 0 0 0 0 0 0 0 1 5 11 0 0 0 0 0 0 0 3 0 5 0 0 0 0 0 0 0", scene);
		// this.loadModelFromString(OBJ_ROUTER_PLUG_NONE, "", scene);
		// this.loadModelFromString(OBJ_ROUTER_PLUG_ETH, "", scene);
		this.loadModelFromString(OBJ_ROUTER_PLUG_POWER, "1  1  50  0  36  9 9 40 41 9 40 33 37 40 17 37 40 9 0 48 14 25 40 36 25 40 25 36 40 25 14 40 32 18 40 32 32 40 18 32 40 18 18 40 41 9 48 25 0 48 41 0 48 14 25 0 18 32 0 25 36 0 32 32 0 36 25 0 32 18 0 25 14 0 18 18 0 9 28 65 26 26 48 25 9 48 9 9 48 0 0 0 10 28 40 25 39 40 41 25 40 25 9 40 9 0 65 17 37 65 25 39 65 33 37 65 41 25 65 41 9 65 41 0 65  23 12 8 22 22 8 9 21 20 6 10 19 21 9 6 20 5 16 17 11 18 19 10 7 22 21 18 23 21 20 19 18 23 18 17 16 11 17 18 7 12 23 16 5 26 13 1 32 27 0 29 24 14 15 13 26 4 14 26 27 33 4 27 24 0 12 5 29 29 5 11 3 0 32 8 12 32 1 9 8 9 1 31 6 6 31 2 10 10 2 30 7 11 7 30 3 0 27 26 32 15 39 38 13 1 38 37 31 31 37 36 2 2 36 35 30 3 30 35 34 29 3 34 24 39 33 24 38 38 24 36 37 36 24 34 35  2 11 23 0 0 0 0 0 0 0 1 0 11 0 0 0 0 0 0 0", scene);
		
		
		// === office ===
		
		scene.light2 = new BABYLON.PointLight("", new BABYLON.Vector3(-96, 4, 1), scene);
		scene.light2.intensity = 0.4;
		
		scene.light4 = new BABYLON.PointLight("", new BABYLON.Vector3(-101, 2, 7.5), scene);
		scene.light4.intensity = 0.4;
		
		
		a = this.quickCanvasMaterial(512, 200, 200, scene);
		
		a.ctx.fillStyle = "#808080";
		a.ctx.fillRect(0, 0, 512, 512);
		a.ctx.strokeStyle = "#000000";
		a.ctx.lineWidth = 3;
		a.ctx.strokeRect(-10, -10, 512, 512);
		
		a.texture.update();
		
		plane = BABYLON.Mesh.CreatePlane("", 100, scene);
		plane.position.y = -0.02;
		plane.position.x = -100;
		// plane.receiveShadows = true;
		plane.material = a.material;
		plane.rotation.x = _rotation(0.25);
		
		
		a = this.quickCanvasMaterial(512, 200, 200, scene);
		
		a.ctx.fillStyle = "#eeeeee";
		a.ctx.fillRect(0, 0, 512, 512);
		a.ctx.strokeStyle = "#666655";
		a.ctx.lineWidth = 3;
		a.ctx.strokeRect(-10, -10, 512, 512);
		
		a.texture.update();
		
		plane = BABYLON.Mesh.CreatePlane("", 14, scene);
		plane.position.y = -0.01;
		plane.position.z = 3;
		plane.position.x = -100;
		// plane.receiveShadows = true;
		plane.material = a.material;
		plane.rotation.x = _rotation(0.25);
		
		
		this.placeObject(OBJ_OFFICE_WALLS, { x: -100 + 2, y: 0, z: 2 }, {});
		this.placeObject(OBJ_FLOOR_WARNING, { x: -100 - 4, y: 0, z: 5.5 }, { x: 0, y: _rotation(-0.22), z: 0 });
		this.placeObject(OBJ_FLOOR_WARNING, { x: -100 - 5, y: 0, z: 2 }, { x: 0, y: _rotation(-0.2), z: 0 });
		
		this.placeObject(OBJ_DESK, { x: -100, y: 0, z: 0.4 }, { x: 0, y: _rotation(0.02), z: 0 });
		
		this.addSphere(-100, 2.5, 6.7, "Test", function() { _gfx.switchScene(1); }, null, null, 1);
		
		
		// === street ===
		
		scene.light3 = new BABYLON.PointLight("", new BABYLON.Vector3(-50, 150, 500), scene);
		scene.light3.intensity = 0.4;
		
		// this.shadowGenerator = new BABYLON.ShadowGenerator(1024, light1);
		// this.shadowGenerator.useBlurExponentialShadowMap = true;
		// this.shadowGenerator.blurKernel = 32;
		
		plane = BABYLON.Mesh.CreatePlane("", 100, scene);
		plane.position.y = 0;
		plane.position.z = 20;
		// plane.receiveShadows = true;
		plane.material = this.quickMaterial(0.2, 0.8, 1.0, 1.0, scene);
		plane.rotation.x = _rotation(0.25);
		
		
		// === router ===
		
		plane = BABYLON.Mesh.CreatePlane("", 100, scene);
		plane.position.x = 100;
		plane.position.y = 0;
		plane.position.z = 20;
		// plane.receiveShadows = true;
		plane.material = this.quickMaterial(0.8, 0.8, 0.8, 1.0, scene);
		plane.rotation.x = _rotation(0.25);
		
		this.router.objects = [];
		
		this.router.objects.push(this.placeObject(OBJ_ROUTER_BOX, { x: 100 - 0.125, y: 1, z: 1 }, {}));
		this.router.objects.push(this.placeObject(OBJ_ROUTER_PORT_ETH, { x: 100 - 0.125 + 0, y: 1, z: 1 }, {}));
		this.router.objects.push(this.placeObject(OBJ_ROUTER_PORT_ETH, { x: 100 - 0.125 + 0.05, y: 1, z: 1 }, {}));
		this.router.objects.push(this.placeObject(OBJ_ROUTER_PORT_NONE, { x: 100 - 0.125 + 0.10, y: 1, z: 1 }, {}));
		this.router.objects.push(this.placeObject(OBJ_ROUTER_PORT_POWER, { x: 100 - 0.125 + 0.15, y: 1, z: 1 }, {}));
		this.router.objects.push(this.placeObject(OBJ_ROUTER_PLUG_POWER, { x: 100 - 0.125 + 0.15, y: 1, z: 1 }, { x: 0, y: _rotation(0.5), z: 0 }));
		
		for (i=0; i<this.router.objects.length; i++)
		{
			this.router.objects[i].originalPosition = _copy(this.router.objects[i].position);
			this.router.objects[i].originalRotation = _copy(this.router.objects[i].rotation);
		}
		
		this.addSphere(100, 1.3, 1, "Test", function() { _gfx.router.rotationYTarget -= Math.PI; }, null, null, 1);
		
		scene.onBeforeAnimationsObservable.add(this.onUpdate.bind(this));
		
		scene.vr = scene.createDefaultVRExperience();
		scene.vr.enableInteractions();
		
		return scene;
	}
	
	stepRouterRotation()
	{
		let i, n, a, b, c, center;
		
		this.router.rotationY += (this.router.rotationYTarget - this.router.rotationY) * 0.1;
		n = this.router.rotationY;
		
		center = { x: 100, y: 1, z: 1.2 };
		
		for (i=0; i<this.router.objects.length; i++)
		{
			a = this.router.objects[i];
			
			b = a.originalPosition.x - center.x;
			c = a.originalPosition.z - center.z;
			
			a.position.x = center.x + b * Math.sin(n) + c * Math.cos(n);
			a.position.z = center.z + b * Math.cos(n) + c * Math.sin(n);
			a.rotation.y = a.originalRotation.y + n - Math.PI/2;
		}
	}
	
	tick()
	{
		let i;
		
		for (i=0; i<this.spheres.length; i++)
		{
			this.spheres[i].gfxObject.rotation.y -= 0.02;
			this.spheres[i].gfxObject.position.y = this.spheres[i].originalY + Math.sin(this.spheres[i].gfxObject.rotation.y) * 0.1;
		}
		
		this.stepRouterRotation();
	}
	
	onClick()
	{
		let i, pickResult;
		
		pickResult = _gfx.scene.pick(_gfx.scene.pointerX, _gfx.scene.pointerY);
		
		if (pickResult.hit)
		{
			for (i=0; i<this.spheres.length; i++)
			{
				if (pickResult.pickedMesh == this.spheres[i].gfxObject)
				{
					if (this.spheres[i].clickCallback)
					{
						this.spheres[i].clickCallback.call();
					}
				}
			}
			
			if (DEV_BUILD)
			{
				console.log(pickResult.pickedPoint.x + ", " + pickResult.pickedPoint.y + ", " + pickResult.pickedPoint.z);
			}
		}
	}
	
	onInputSetupDone()
	{
	}
	
	onInputSetupFailed()
	{
	}
	
	onUpdate()
	{
		let a, b, c;
		
		this.scene.activeCamera.minZ = 0.1;
		
		// mouse controls
		if (!_gfx.scene.vr.isInVRMode)
		{
			this.orientationA = 0;
			this.orientationB = 0;
			this.orientationC = 0;
			
			_gfx.scene.activeCamera.rotationQuaternion.y = _rotation(((_input.cursor[0] - 0.5) * 0.1));
			_gfx.scene.activeCamera.rotationQuaternion.x = _rotation(((_input.cursor[1] - 0.5) * 0.05) + 0.02);
		}
		else
		{
			a = _gfx.scene.activeCamera.inputs.attached.deviceOrientation._alpha;
			b = _gfx.scene.activeCamera.inputs.attached.deviceOrientation._beta;
			c = _gfx.scene.activeCamera.inputs.attached.deviceOrientation._gamma;
			
			if (a != 0 || b != 0 || c != 0)
			{
				this.scene.orientationWorking = true;
				
				if (c < 0)
				{
					c = c + 90;
				}
				else
				{
					c = c - 90;
				}
				
				if (c < 0)
				{
					a = a - 180;
					
					if (b < 0)
					{
						b += 180;
					}
					else
					{
						b += -180;
					}
					
					b = b * -1;
				}
				
				a = a - 90;
			}
			
			this.orientationA = a;
			this.orientationB = b;
			this.orientationC = c;
		}
		
		tickCatchUp();
		
		if (this.activeSceneIndex == 0)
		{
			// office.frame();
			_gfx.scene.activeCamera.position.x = -100;
			_gfx.scene.activeCamera.position.y = 1.4;
			_gfx.scene.activeCamera.position.z = 0;
		}
		else if (this.activeSceneIndex == 1)
		{
			_player.updateObjects();
		}
		else
		{
			_gfx.scene.activeCamera.position.x = 100;
			_gfx.scene.activeCamera.position.y = 1.2;
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
