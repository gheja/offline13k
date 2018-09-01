// based on https://github.com/cljsjs/packages/tree/master/babylon/resources/cljsjs/babylon/common

var BABYLON = {
	"Color3": function () {},
	"Color4": function () {},
	"Vector2": function () {},
	"Vector3": function () {},
	"Vector4": function () {},
	"Quaternion": function () {},
	"Matrix": function () {},
	"Plane": function () {
		return {
			"material": 0
		};
	},
	"Viewport": function () {},
	"Frustum": function () {},
	"Ray": function () {},
	"Space": {
		"0": {},
		"1": {},
		"LOCAL": {},
		"WORLD": {}
	},
	"Axis": function () {},
	"BezierCurve": function () {},
	"Orientation": {
		"0": {},
		"1": {},
		"CW": {},
		"CCW": {}
	},
	"Angle": function () {},
	"Arc2": function () {},
	"PathCursor": function () {},
	"Path2": function () {},
	"Path3D": function () {},
	"Curve3": function () {},
	"PositionNormalVertex": function () {},
	"PositionNormalTextureVertex": function () {},
	"SIMDHelper": function () {},
	"Database": function () {},
	"Internals": {
		"TGATools": function () {},
		"DDSTools": function () {},
		"AndOrNotEvaluator": function () {},
		"MeshLODLevel": function () {}
	},
	"SmartArray": function () {},
	"SmartCollection": function () {},
	"Tools": function () {},
	"AsyncLoop": function () {},
	"_DepthCullingState": function () {},
	"_AlphaState": function () {},
	"EngineCapabilities": function () {},
	"Engine": function () {
		return {
			"runRenderLoop": function() {}
		};
	},
	"Node": function () {},
	"FilesInput": function () {},
	"IntersectionInfo": function () {},
	"PickingInfo": function () {},
	"BoundingSphere": function () {},
	"BoundingBox": function () {},
	"BoundingInfo": function () {},
	"AbstractMesh": function () {},
	"Light": function () {
		return {
			"intensity": 0
		};
	},
	"PointLight": function () {},
	"SpotLight": function () {},
	"HemisphericLight": function () {},
	"DirectionalLight": function () {},
	"ShadowGenerator": function () {
 		return {
			"addShadowCaster": function() {}
		};
	},
	"Collider": function () {},
	"CollisionWorker": {},
	"WorkerTaskType": {
		"0": {},
		"1": {},
		"2": {},
		"INIT": {},
		"UPDATE": {},
		"COLLIDE": {}
	},
	"WorkerReplyType": {
		"0": {},
		"1": {},
		"SUCCESS": {},
		"UNKNOWN_ERROR": {}
	},
	"CollisionCoordinatorWorker": function () {},
	"CollisionCoordinatorLegacy": function () {},
	"VRCameraMetrics": function () {},
	"Camera": function () {
		return {
			"attachControl": function() {}
		};
	},
	"TargetCamera": function () {},
	"FreeCamera": function () {},
	"FollowCamera": function () {},
	"TouchCamera": function () {},
	"ArcRotateCamera": function () {},
	"DeviceOrientationCamera": function () {},
	"Gamepads": function () {},
	"StickValues": function () {},
	"Gamepad": function () {},
	"GenericPad": function () {},
	"Xbox360Button": {
		"0": {},
		"1": {},
		"2": {},
		"3": {},
		"4": {},
		"5": {},
		"6": {},
		"7": {},
		"8": {},
		"9": {},
		"A": {},
		"B": {},
		"X": {},
		"Y": {},
		"Start": {},
		"Back": {},
		"LB": {},
		"RB": {},
		"LeftStick": {},
		"RightStick": {}
	},
	"Xbox360Dpad": {
		"0": {},
		"1": {},
		"2": {},
		"3": {},
		"Up": {},
		"Down": {},
		"Left": {},
		"Right": {}
	},
	"Xbox360Pad": function () {},
	"GamepadCamera": function () {},
	"RenderingManager": function () {},
	"RenderingGroup": function () {},
	"Scene": function () {
		return {
			"onBeforeAnimationsObservable": {},
			"createDefaultVRExperience": function() {
				return {
					"currentVRCamera": {}
				};
			},
			"render": function() {},
			"FOGMODE_LINEAR": 0,
			"fogMode": 0,
			"fogStart": 0,
			"fogEnd": 0,
			"ambientColor": 0,
			"clearColor": 0,
			"fogColor": 0,
			"activeCamera": function() {
				return {
					"clear": function() {},
					"addMouse": function() {}
				};
			}
		};
	},
	"VertexBuffer": function () {},
	"InstancedMesh": function () {},
	"_InstancesBatch": function () {},
	"Mesh": function () {
		return {
			"CreatePlane": function() {
				return {
					"receiveShadows": 0,
					"blurKernel": 0
				};
			}
		};
	},
	"SubMesh": function () {},
	"BaseTexture": function () {},
	"Texture": function () {},
	"CubeTexture": function () {},
	"RenderTargetTexture": function () {},
	"ProceduralTexture": function () {},
	"MirrorTexture": function () {},
	"DynamicTexture": function () {},
	"VideoTexture": function () {},
	"CustomProceduralTexture": function () {},
	"WoodProceduralTexture": function () {},
	"FireProceduralTexture": function () {},
	"CloudProceduralTexture": function () {},
	"GrassProceduralTexture": function () {},
	"RoadProceduralTexture": function () {},
	"BrickProceduralTexture": function () {},
	"MarbleProceduralTexture": function () {},
	"EffectFallbacks": function () {},
	"Effect": function () {},
	"Material": function () {},
	"FresnelParameters": function () {},
	"StandardMaterial": function () {
		return {
			"diffuseColor": 0
		};
	},
	"MultiMaterial": function () {},
	"SceneLoader": function () {},
	"SpriteManager": function () {},
	"Sprite": function () {},
	"Layer": function () {},
	"Particle": function () {},
	"ParticleSystem": function () {},
	"Animation": function () {},
	"Animatable": function () {},
	"EasingFunction": function () {},
	"CircleEase": function () {},
	"BackEase": function () {},
	"BounceEase": function () {},
	"CubicEase": function () {},
	"ElasticEase": function () {},
	"ExponentialEase": function () {},
	"PowerEase": function () {},
	"QuadraticEase": function () {},
	"QuarticEase": function () {},
	"QuinticEase": function () {},
	"SineEase": function () {},
	"BezierCurveEase": function () {},
	"Octree": function () {},
	"OctreeBlock": function () {},
	"Bone": function () {},
	"Skeleton": function () {},
	"PostProcess": function () {},
	"PostProcessManager": function () {},
	"PassPostProcess": function () {},
	"BlurPostProcess": function () {},
	"RefractionPostProcess": function () {},
	"BlackAndWhitePostProcess": function () {},
	"ConvolutionPostProcess": function () {},
	"FilterPostProcess": function () {},
	"FxaaPostProcess": function () {},
	"StereoscopicInterlacePostProcess": function () {},
	"LensFlare": function () {},
	"LensFlareSystem": function () {},
	"CannonJSPlugin": function () {},
	"OimoJSPlugin": function () {},
	"PhysicsEngine": function () {},
	"SceneSerializer": function () {},
	"CSG": function () {},
	"VRDistortionCorrectionPostProcess": function () {},
	"JoystickAxis": {
		"0": {},
		"1": {},
		"2": {},
		"X": {},
		"Y": {},
		"Z": {}
	},
	"VirtualJoystick": function () {},
	"VirtualJoysticksCamera": function () {},
	"ShaderMaterial": function () {},
	"VertexData": function () {},
	"AnaglyphPostProcess": function () {},
	"Tags": function () {},
	"PostProcessRenderPass": function () {},
	"PostProcessRenderEffect": function () {},
	"PostProcessRenderPipeline": function () {},
	"PostProcessRenderPipelineManager": function () {},
	"DisplayPassPostProcess": function () {},
	"BoundingBoxRenderer": function () {},
	"Condition": function () {},
	"ValueCondition": function () {},
	"PredicateCondition": function () {},
	"StateCondition": function () {},
	"Action": function () {},
	"ActionEvent": function () {},
	"ActionManager": function () {},
	"InterpolateValueAction": function () {},
	"SwitchBooleanAction": function () {},
	"SetStateAction": function () {},
	"SetValueAction": function () {},
	"IncrementValueAction": function () {},
	"PlayAnimationAction": function () {},
	"StopAnimationAction": function () {},
	"DoNothingAction": function () {},
	"CombineAction": function () {},
	"ExecuteCodeAction": function () {},
	"SetParentAction": function () {},
	"PlaySoundAction": function () {},
	"StopSoundAction": function () {},
	"Geometry": function () {},
	"GroundMesh": function () {},
	"LinesMesh": function () {},
	"OutlineRenderer": function () {},
	"MeshAssetTask": function () {},
	"TextFileAssetTask": function () {},
	"BinaryFileAssetTask": function () {},
	"ImageAssetTask": function () {},
	"TextureAssetTask": function () {},
	"AssetsManager": function () {},
	"VRDeviceOrientationFreeCamera": function () {},
	"WebVRFreeCamera": function () {},
	"SceneOptimization": function () {},
	"TextureOptimization": function () {},
	"HardwareScalingOptimization": function () {},
	"ShadowsOptimization": function () {},
	"PostProcessesOptimization": function () {},
	"LensFlaresOptimization": function () {},
	"ParticlesOptimization": function () {},
	"RenderTargetsOptimization": function () {},
	"MergeMeshesOptimization": function () {},
	"SceneOptimizerOptions": function () {},
	"SceneOptimizer": function () {},
	"AudioEngine": function () {},
	"Sound": function () {},
	"SoundTrack": function () {},
	"DebugLayer": function () {},
	"RawTexture": function () {},
	"Polygon": function () {},
	"PolygonMeshBuilder": function () {},
	"SimplificationSettings": function () {},
	"SimplificationQueue": function () {},
	"SimplificationType": {
		"0": {},
		"QUADRATIC": {}
	},
	"DecimationTriangle": function () {},
	"DecimationVertex": function () {},
	"QuadraticMatrix": function () {},
	"Reference": function () {},
	"QuadraticErrorSimplification": function () {},
	"Analyser": function () {},
	"DepthRenderer": function () {},
	"SSAORenderingPipeline": function () {},
	"VolumetricLightScatteringPostProcess": function () {},
	"LensRenderingPipeline": function () {},
	"ColorCorrectionPostProcess": function () {},
	"AnaglyphFreeCamera": function () {},
	"AnaglyphArcRotateCamera": function () {},
	"AnaglyphGamepadCamera": function () {},
	"StereoscopicFreeCamera": function () {},
	"StereoscopicArcRotateCamera": function () {},
	"StereoscopicGamepadCamera": function () {},
	"MeshBuilder": function() {
		return {
			"CreateBox": function() {
				return {
					"setEnabled": function() {},
					"createInstance": function() {},
					"scaling": { "x": 0, "y": 0, "z": 0 },
					"position": { "x": 0, "y": 0, "z": 0 },
					"rotation": { "x": 0, "y": 0, "z": 0 }
				};
			}
		};
	}
}
