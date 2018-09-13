"use strict";

const PORT_NONE = 0;
const PORT_WAN = 1;
const PORT_LAN = 2;
const PORT_POWER = 3;

const LED_OFF = 0;
const LED_BLINKING = 1;
const LED_ON = 2;
const LED_ON_FLASHING = 3;

const POWER_AC = 0;
const POWER_DC1 = 1;
const POWER_DC2 = 2;


class Puzzle
{
	constructor()
	{
		this.hasReset = true;
		this.wifi = false;
		this.powerCurrentMin = 500;
		this.powerVoltage = 9;
		this.powerType = POWER_DC1;
		this.powerOk = true;
		this.ports = [ ];
		this.cables = [ ];
		this.selectedCable = null;
		this.frozen = false;
		this.fried = false;
		
		this.adapterCurrent = 500;
		this.adapterVoltage = 9;
		this.adapterType = POWER_DC1;
		this.adapterBroken = false;
		this.adapterConnected = true;
		
		this.ledPowerStatus = LED_ON;
		this.ledUplinkStatus = LED_ON;
		this.ledDownlinkStatus = LED_ON;
		this.ledWifiStatus = LED_ON;
		this.ledReadyStatus = LED_ON;
		
		this.bootTime = 0;
		
		this.bootTime1 = 300; // power
		this.bootTime2 = 400; // uplink
		this.bootTime3 = 500; // downlink
		this.bootTime4 = 600; // wifi/lan
		this.bootTime5 = 900; // ready
		
		this.gfxObjects = [];
		this.spheres = [];
		this.rotationY = 0;
		this.rotationYTarget = - Math.PI / 2;
		this.rearVisible = false;
		
		// this.frontFace = null;
		
		this.frontFaceMaterial = _gfx.quickCanvasMaterial(512, 1, 0.08/0.4, _gfx.scene);
		
		this.createPorts();
	}
	
	updateSpheres()
	{
		let i;
		
		for (i=0; i<this.ports.length; i++)
		{
			this.ports[i].sphere.gfxObject.setEnabled(false);
			
			if (this.rearVisible && this.ports[i].type != PORT_NONE)
			{
				if (this.selectedCable === null && this.ports[i].cable !== null)
				{
					this.ports[i].sphere.text = "Disconnect";
					this.ports[i].sphere.gfxObject.setEnabled(true);
				}
				
				if (this.selectedCable !== null && this.ports[i].cable === null)
				{
					this.ports[i].sphere.text = "Connect";
					this.ports[i].sphere.gfxObject.setEnabled(true);
				}
			}
		}
		
		for (i=0; i<this.cables.length; i++)
		{
			if (this.cables[i].type == PORT_NONE)
			{
				continue;
			}
			
			this.cables[i].sphere.gfxObject.setEnabled(false);
			
			this.cables[i].sphere.gfxObject.position.x = this.cables[i].gfxObject.position.x;
			this.cables[i].sphere.gfxObject.position.y = this.cables[i].gfxObject.position.y + 0.1;
			this.cables[i].sphere.gfxObject.position.z = this.cables[i].gfxObject.position.z;
			
			if (this.rearVisible)
			{
				if (this.selectedCable === null && this.cables[i].port === null)
				{
					this.cables[i].sphere.gfxObject.setEnabled(true);
				}
			}
		}
	}
	
	updateGfxObjects()
	{
		let i, a;
		
		for (i=0; i<this.cables.length; i++)
		{
			a = this.cables[i];
			
			if (a.type == PORT_NONE)
			{
				continue;
			}
			
			a.gfxObject.originalPosition.x = 100 - 0.125 + 0.05 * a.position;
			
			if (a.port !== null)
			{
				a.gfxObject.originalPosition.y = 1;
			}
			else
			{
				a.gfxObject.originalPosition.y = 0.85;
			}
		}
	}
	
	addGfxObject(a, b, c)
	{
		this.gfxObjects.push(_gfx.placeObject(a, b, c));
		
		return this.gfxObjects[this.gfxObjects.length - 1];
	}
	
	createGfxObjects()
	{
		let i, a, b;
		
		this.addGfxObject(OBJ_ROUTER_BOX, { x: 100 - 0.125, y: 1, z: 1 }, {});
		
		for (i=0; i<this.ports.length; i++)
		{
			if (this.ports[i].type == PORT_LAN)
			{
				a = OBJ_ROUTER_PORT_ETH;
			}
			else if (this.ports[i].type == PORT_WAN)
			{
				a = OBJ_ROUTER_PORT_ETH2;
			}
			else if (this.ports[i].type == PORT_POWER)
			{
				a = OBJ_ROUTER_PORT_POWER;
			}
			else
			{
				a = OBJ_ROUTER_PORT_NONE;
			}
			
			this.addGfxObject(a, { x: 100 - 0.125 + i * 0.05, y: 1, z: 1 }, {});
		}
		this.addGfxObject(OBJ_ROUTER_PORT_POWER, { x: 100 - 0.125 + 0.15, y: 1, z: 1 }, {});
		
		for (i=0; i<this.cables.length; i++)
		{
			if (this.cables[i].type == PORT_LAN)
			{
				a = OBJ_ROUTER_PLUG_ETH;
			}
			else if (this.cables[i].type == PORT_WAN)
			{
				a = OBJ_ROUTER_PLUG_ETH2;
			}
			else if (this.cables[i].type == PORT_POWER)
			{
				a = OBJ_ROUTER_PLUG_POWER;
			}
			else
			{
				continue;
			}
			
			this.cables[i].gfxObject = this.addGfxObject(a, { x: 100 - 0.125 + i * 0.05, y: 1, z: 1 }, {});
		}
		
		let plane = BABYLON.Mesh.CreatePlane("", 1, _gfx.scene);
		plane.scaling.y = 0.08;
		plane.scaling.x = 0.4;
		plane.position.y = 1.025;
		plane.position.x = 100;
		plane.position.z = 1.401;
		plane.rotation.y = _rotation(0.5);
		plane.material = this.frontFaceMaterial.material;
		// plane.rotation.x = _rotation(0.25);
		
		this.gfxObjects.push(plane);
		
		for (i=0; i<this.gfxObjects.length; i++)
		{
			this.gfxObjects[i].originalPosition = _copy(this.gfxObjects[i].position);
			this.gfxObjects[i].originalRotation = _copy(this.gfxObjects[i].rotation);
		}
	}
	
	disposeGfxObjects()
	{
		let i;
		
		for (i=0; i<this.gfxObjects.length; i++)
		{
			this.gfxObjects[i].dispose();
		}
		
		this.gfxObjects.length = 0;
	}
	
	stepRotation()
	{
		let i, n, a, b, c, center;
		
		this.rotationY += (this.rotationYTarget - this.rotationY) * 0.1;
		n = this.rotationY;
		
		center = { x: 100, y: 1, z: 1.2 };
		
		for (i=0; i<this.gfxObjects.length; i++)
		{
			a = this.gfxObjects[i];
			
			b = a.originalPosition.x - center.x;
			c = a.originalPosition.z - center.z;
			
			a.position.x = center.x + b * Math.sin(n) + c * Math.cos(n);
			a.position.y = a.originalPosition.y;
			a.position.z = center.z + b * Math.cos(n) + c * Math.sin(n);
			a.rotation.y = a.originalRotation.y + n - Math.PI/2;
		}
		
		this.rearVisible = false;
		
		if (Math.abs(((n % PI2 + PI2) % PI2) - Math.PI / 2) < 0.1)
		{
			this.rearVisible = true;
		}
		
//		this.router.a.gfxObject.setEnabled(this.router.rearVisible);
	}
	
	rotateRouter()
	{
		this.rotationYTarget -= Math.PI;
	}
	
	
	
	// === game logic ===
	
	destroy()
	{
		// this.ports.length = 0;
		this.cables.length = 0;
		this.disposeGfxObjects();
	}
	
	setup(level)
	{
		this.destroy();
		
		this.fried = false;
		
		this.reset();
		
		if (level < 1)
		{
			this.ports[0].type = PORT_WAN;
			this.ports[1].type = PORT_LAN;
			this.ports[2].type = PORT_NONE;
			this.ports[3].type = PORT_POWER;
			
			this.cables.push({ type: PORT_WAN,   position: 0, gfxObject: null, port: null, sphere: _gfx.addSphere(0, 0, 0, 0.05, "Select", this.selectCable.bind(this, 0)) });
			this.cables.push({ type: PORT_LAN,   position: 1, gfxObject: null, port: null, sphere: _gfx.addSphere(0, 0, 0, 0.05, "Select", this.selectCable.bind(this, 1)) });
			this.cables.push({ type: PORT_NONE,  position: 2, gfxObject: null, port: null, sphere: _gfx.addSphere(0, 0, 0, 0.05, "Select", this.selectCable.bind(this, 2)) });
			this.cables.push({ type: PORT_POWER, position: 3, gfxObject: null, port: null, sphere: _gfx.addSphere(0, 0, 0, 0.05, "Select", this.selectCable.bind(this, 3)) });
			
			this.selectedCable = this.cables[0];
			this.connectCable(0);
			
			this.selectedCable = this.cables[1];
			this.connectCable(1);
			
			// this.selectedCable = this.cables[2];
			// this.connectCable(2);
			
			this.selectedCable = this.cables[3];
			this.connectCable(3);
			
			this.selectedCable = null;
			
			switch (Math.floor(Math.random() * 4))
			{
				case 0:
					this.frozen = true;
				break;
				
				case 1:
					this.disconnectCable(0);
				break;
				
				case 2:
					this.disconnectCable(1);
				break;
				
				case 3:
					this.disconnectCable(3);
				break;
			}
		}
		
		this.disposeGfxObjects();
		this.createGfxObjects();
	}
	
	createPorts()
	{
		this.spheres.push(_gfx.addSphere(100, 1.15, 1, 0.05, "Rotate", this.rotateRouter.bind(this)));
		// this.spheres.push(_gfx.addSphere(100, 1.20, 1, 0.05, "Test", function() { console.log("e"); _puzzle.setup(0); console.log("f"); }));
		
		this.ports.push({ type: PORT_NONE, cable: null, sphere: _gfx.addSphere(100 - 0.1 + 0.00, 1.08, 1, 0.05, "", this.toggleConnection.bind(this, 0)) });
		this.ports.push({ type: PORT_NONE, cable: null, sphere: _gfx.addSphere(100 - 0.1 + 0.05, 1.08, 1, 0.05, "", this.toggleConnection.bind(this, 1)) });
		this.ports.push({ type: PORT_NONE, cable: null, sphere: _gfx.addSphere(100 - 0.1 + 0.10, 1.08, 1, 0.05, "", this.toggleConnection.bind(this, 2)) });
		this.ports.push({ type: PORT_NONE, cable: null, sphere: _gfx.addSphere(100 - 0.1 + 0.15, 1.08, 1, 0.05, "", this.toggleConnection.bind(this, 3)) });
	}
	
	reset()
	{
		this.ledPowerStatus = LED_OFF;
		this.ledUplinkStatus = LED_OFF;
		this.ledDownlinkStatus = LED_OFF;
		this.ledWifiStatus = LED_OFF;
		this.ledReadyStatus = LED_OFF;
		
		this.bootTime = 0;
		this.frozen = false;
	}
	
	getMaxBootTime()
	{
		let i, j, ok, wan_ok, lan_ok;
		
		if (!this.powerOk || this.frozen || this.fried)
		{
			return 10;
		}
		
		wan_ok = true;
		lan_ok = true;
		
		for (i=0; i<this.cables.length; i++)
		{
			if (this.cables[i].port === null || this.cables[i].type != this.cables[i].port.type)
			{
				if (this.cables[i].type == PORT_WAN)
				{
					wan_ok = false;
				}
				else if (this.cables[i].type == PORT_LAN)
				{
					lan_ok = false;
				}
			}
		}
		
		if (!wan_ok)
		{
			return this.bootTime1 - 1;
		}
		
		if (!lan_ok)
		{
			return this.bootTime3 - 1;
		}
		
		return 910;
	}
	
	checkSuccess()
	{
		let i;
		
		if (!this.powerOk)
		{
			return false;
		}
		
		for (i=0; i<this.cables.length; i++)
		{
			if (!this.cables[i].port === null)
			{
				return false;
			}
			
			if (this.cables[i].type != this.ports[this.cables[i].position].type)
			{
				return false;
			}
		}
	}
	
	updatePower()
	{
		let i, j;
		
		this.adapterConnected = false;
		this.powerOk = false;
		
		for (i=0; i<this.ports.length; i++)
		{
			if (this.ports[i].type == PORT_POWER && this.ports[i].cable !== null)
			{
				this.adapterConnected = true;
			}
		}
		
		if (!this.adapterConnected)
		{
			return;
		}
		
		if (this.adapterBroken)
		{
			return;
		}
		
		if (this.powerType != this.adapterType)
		{
			this.fried = true;
			return;
		}
		
		if (this.powerVoltage < this.adapterVoltage)
		{
			this.fried = true;
			return;
		}
		
		if (this.powerCurrentMin > this.adapterCurrent)
		{
			return;
		}
		
		this.powerOk = true;
	}
	
	selectCable(index)
	{
		this.selectedCable = this.cables[index];
	}
	
	connectCable(portIndex)
	{
		if (DEV_BUILD)
		{
			if (!this.selectedCable)
			{
				console.log("No cable selected!");
				return;
			}
		}
		
		this.ports[portIndex].cable = this.selectedCable;
		this.selectedCable.position = portIndex;
		this.selectedCable.port = this.ports[portIndex];
		this.selectedCable = null;
	}
	
	disconnectCable(portIndex)
	{
		// TODO: make sure cables don't overlap
		
		this.ports[portIndex].cable.port = null;
		this.ports[portIndex].cable = null;
	}
	
	toggleConnection(portIndex)
	{
		if (this.ports[portIndex].cable == null)
		{
			this.connectCable(portIndex);
		}
		else
		{
			this.disconnectCable(portIndex);
		}
	}
	
	getNewAdapter()
	{
		this.adapterCurrent = 500;
		this.adapterVoltage = 9;
		this.adapterType = POWER_DC1;
		this.adapterBroken = false;
		this.adapterConnected = false;
		
		// AC: "\u23E6" "\u223F"
		// DC: "\u2393"
	}
	
	createPowerLabel(ctx, width, height)
	{
		
	}
	
	drawFrontFace()
	{
		let height, top, c, i, a, b;
		
		height = 512 * (0.08/0.4);
		top = 512 - height;
		
		c = this.frontFaceMaterial.ctx;
		
		c.fillStyle = "#111";
		c.fillRect(0, top, 512, 128);
		
		c.font = "16px Arial";
		c.textBaseline = "top";
		c.textAlign="center";
		
		a = [
			[ "POWER", this.ledPowerStatus ],
			[ "UPLINK", this.ledUplinkStatus ],
			[ "DOWNLINK", this.ledDownlinkStatus ],
			[ "WIFI", this.ledWifiStatus ],
			[ "LAN", this.ledWifiStatus ],
			[ "READY", this.ledReadyStatus ]
		];
		
		for (i=0; i<a.length; i++)
		{
			b = a[i][1];
			
			if (this.frozen)
			{
				b = LED_ON;
			}
			
			if (this.fried || !this.powerOk)
			{
				b = LED_OFF;
			}
			
			c.fillStyle = "#131";
			if (b == LED_ON)
			{
				c.fillStyle = "#6f2";
			}
			else if (b == LED_BLINKING && (_ticks % 70 > 35))
			{
				c.fillStyle = "#6f2";
			}
			else if (b == LED_ON_FLASHING && (_ticks % 33 > 5 && _ticks % 75 > 5))
			{
				c.fillStyle = "#6f2";
			}
			c.fillRect(45 + i * 80, top + height - 65, 10, 30);
			
			c.fillStyle = "#ccc";
			c.fillText(a[i][0], 50 + i * 80, top + height - 25);
		}
		
		this.frontFaceMaterial.texture.update();
		// ctx.fillStyle
	}
	
	tick()
	{
		this.updatePower();
		
		if (!this.powerOk)
		{
			this.reset();
		}
		else if (this.frozen)
		{
			//
		}
		else if (this.fried)
		{
			//
		}
		else
		{
			if (this.bootTime == 0)
			{
				this.ledPowerStatus = LED_BLINKING;
			}
			
			if (this.bootTime == 30)
			{
				this.ledUplinkStatus = LED_BLINKING;
			}
			
			if (this.bootTime == this.bootTime1)
			{
				this.ledUplinkStatus = LED_ON;
				this.ledDownlinkStatus = LED_BLINKING;
			}
			
			if (this.bootTime == this.bootTime2)
			{
				this.ledDownlinkStatus = LED_ON;
				this.ledWifiStatus = LED_BLINKING;
			}
			
			if (this.bootTime == this.bootTime3)
			{
				this.ledWifiStatus = LED_ON;
			}
			
			if (this.bootTime == this.bootTime4)
			{
				this.ledPowerStatus = LED_ON;
				this.ledReadyStatus = LED_ON;
			}
			
			if (this.bootTime == 700)
			{
				gameWon();
			}
			
			this.bootTime = Math.min(this.bootTime + 1, this.getMaxBootTime());
		}
		
		this.drawFrontFace();
		this.stepRotation();
		this.updateGfxObjects();
		this.updateSpheres();
		
		// console.log(this.bootTime);
	}
}
