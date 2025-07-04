function Demo01()
{
	////////////////
	// Attributes //
	////////////////

	var canvas = new Canvas3DEditor(800, 600);

	canvas.setBackgroundColor(0.15, 0.15, 0.15, 1.0);

	// Create lights

	var mainLight = new GLLight();
	mainLight.setColor([1.0, 1.0, 1.0, 1.0]);
	mainLight.setDirection([1.0, 1.25, -2.0]);
					
	var auxLight = new GLLight();
	auxLight.setColor([0.225, 0.2, 0.25, 1.0]);
	//auxLight.setColor([1.0, 0.75, 0.0, 1.0]);
	auxLight.setDirection([-1.0, -1.25, 2.0]);
					
	ambientLight = [0.1, 0.1, 0.1, 1.0];
	//ambientLight = [0.25, 0.25, 0.25, 1.0];
	//ambientLight = [0.5, 0.5, 0.5, 1.0];

	canvas.setAmbientLight(ambientLight);
	canvas.addLight(mainLight);
	canvas.addLight(auxLight);

	var redMaterial = new GLMaterial();
	redMaterial.setBaseColor([1.0, 0.0, 0.0]);
	redMaterial.setSpecularColor([1.0, 1.0, 0.0]);
	redMaterial.setSpecular(10.0);

	var blueMaterial = new GLMaterial();
	blueMaterial.setBaseColor([0.0, 0.1, 1.0]);
	blueMaterial.setSpecularColor([0.0, 1.0, 1.0]);
	blueMaterial.setSpecular(10.0);

	// Create objects

	var workingGrid = new GLWorkingGrid();
	var workingMark = new GLWorkingMark();

	var cube = new GLCuboid(1.0, 1.0, 1.0, 0);
	cube.setVertexShaderName('vertex-material');
	cube.setFragmentShaderName('fragment-material');

	var cube2 = new GLCuboid(2.0, 0.5, 0.5, 0);
	cube2.setTheta(45.0);
	var cube3 = cube.fuse(cube2);
	cube3.setMaterial(redMaterial);
	//cube3.solidify(0.1, 0.000001);
	//cube3.setOutline(true);
	//cube3.setOutlineWidth(0.05);
	//cube3.setOutlineColor([0.3, 0.0, 0.0, 1.0]);
	//cube3.setOutlineOffset = function($outlineOffset) { outlineOffset = $outlineOffset; };
	//cube3.setFindEdges(true);
	//cube3.debug();

	var copyCube1 = new GLInstance(cube3);
	copyCube1.setX(-1.5);
	var copyCube2 = new GLInstance(cube3);
	copyCube2.setX(1.5);
	copyCube2.setTheta(45.0);

	var group = new GLGroup();

	group.addInstance(copyCube1);
	group.addInstance(copyCube2);
	group.setZ(3.0);
	group.setPhi(45.0);
	group.setScaleX(1.5);
	group.setScaleY(1.5);
	group.setScaleZ(1.5);

	var disc = new GLDisc(0.5, 300.0, 5, 32);
	disc.setMaterial(blueMaterial);
	//disc.debug();
	disc.setVertexShaderName('vertex-material');
	disc.setFragmentShaderName('fragment-material');
	disc = disc.getInstance();
	disc.setY(3.0);

	var cylinder = new GLCylinder(1.0, 0.5, 2.0, 300.0, 0.1, 0.2, 32, 10, true, true, true, 3);
	cylinder.setMaterial(redMaterial);
	//cylinder.debug();
	cylinder.setVertexShaderName('vertex-material');
	cylinder.setFragmentShaderName('fragment-material');
	cylinder = cylinder.getInstance();
	cylinder.setY(-3.0);

	var sphere1 = new GLUVSphere(1.0, 350.0, 170.0, 0.0, 32, 32);
	sphere1.setMaterial(redMaterial);
	//sphere1.debug();
	sphere1.setVertexShaderName('vertex-material');
	sphere1.setFragmentShaderName('fragment-material');
	sphere1 = sphere1.getInstance();
	sphere1.setX(3.0);

	var cone = new GLCone(1.0, 2.0, 360.0, 0.1, 0.2, 32, 10, true, true, 3);
	cone.setMaterial(blueMaterial);
	//cone.debug();
	cone.setVertexShaderName('vertex-material');
	cone.setFragmentShaderName('fragment-material');
	cone = cone.getInstance();
	cone.setX(3.0);
	cone.setY(3.0);

	var sphere2 = new GLCuboidSphere(1.0, 32);
	sphere2.setMaterial(blueMaterial);
	//sphere2.debug();
	sphere2.setVertexShaderName('vertex-material');
	sphere2.setFragmentShaderName('fragment-material');
	sphere2 = sphere2.getInstance();
	sphere2.setX(-3.0);
	sphere2.setY(-3.0);

	var ellipsoid1 = new GLUVEllipsoid(2.0, 1.0, 0.5, 32);
	ellipsoid1.setMaterial(redMaterial);
	//ellipsoid1.debug();
	ellipsoid1.setVertexShaderName('vertex-material');
	ellipsoid1.setFragmentShaderName('fragment-material');
	ellipsoid1 = ellipsoid1.getInstance();
	ellipsoid1.setX(3.0);
	ellipsoid1.setY(-3.0);
	ellipsoid1.setTheta(45.0);
	ellipsoid1.setScale(0.75);

	var rect1 = new GLRect(1.5, 1.0);
	rect1.setMaterial(blueMaterial);
	//rect1.debug();
	rect1.setVertexShaderName('vertex-material');
	rect1.setFragmentShaderName('fragment-material');
	rect1 = rect1.getInstance();
	rect1.setX(-3.0);
	rect1.setY(3.0);

	//var polygonVertices = [{x: -0.5, y: 0.25}, {x: 0.0, y: 0.0}, {x: 0.5, y: -0.5}, {x: 0.75, y: 0.0}, {x: 0.5, y: 0.5}];
	var polygonVertices = [[-0.5, 0.25], [0.0, 0.0], [0.5, -0.5], [0.75, 0.0], [0.5, 0.5]];

	var polygon = new GLPolygon(polygonVertices, 'z', true);
	polygon.setMaterial(redMaterial);
	//polygon.debug();
	polygon.setVertexShaderName('vertex-material');
	polygon.setFragmentShaderName('fragment-material');
	polygon = polygon.getInstance();
	polygon.setX(-3.0);
	//polygon.setY(3.0);

	var line = new GLLine(-5.0, -5.0, 0.0, 5.0, 5.0, 5.0);
	line.setMaterial(blueMaterial);
	//line.debug();
	line.setVertexShaderName('vertex-material');
	line.setFragmentShaderName('fragment-material');
	line = line.getInstance();
	line.setZ(5.0);

	var prism1 = new GLPrism(1.0, 0.5, 2.0, 360.0, 0.1, 0.2, 5, 10, true, true, true, 3);
	prism1.setMaterial(redMaterial);
	//prism1.debug();
	prism1.setVertexShaderName('vertex-material');
	prism1.setFragmentShaderName('fragment-material');
	prism1 = prism1.getInstance();
	prism1.setY(5.0);
	prism1.setX(1.5);

	var prism2 = new GLPrismFromPolygon(1.0, 0.5, 2.0, 0.4, -0.3, polygonVertices, 10, true, true);
	prism2.setMaterial(blueMaterial);
	//prism2.debug();
	prism2.setVertexShaderName('vertex-material');
	prism2.setFragmentShaderName('fragment-material');
	prism2 = prism2.getInstance();
	prism2.setY(1.5);
	prism2.setX(5.0);

	var pyramid1 = new GLPyramid(1.0, 2.0, 300.0, 0.1, 0.2, 5, 10, true, true, 3);
	pyramid1.setMaterial(redMaterial);
	pyramid1.debug();
	pyramid1.setVertexShaderName('vertex-material');
	pyramid1.setFragmentShaderName('fragment-material');
	pyramid1 = pyramid1.getInstance();
	pyramid1.setY(5.0);
	pyramid1.setX(-1.5);

	var pyramid2 = new GLPyramidFromPolygon(1.0, 2.0, 0.1, 0.2, polygonVertices, 10, true);
	pyramid2.setMaterial(blueMaterial);
	//pyramid2.debug();
	pyramid2.setVertexShaderName('vertex-material');
	pyramid2.setFragmentShaderName('fragment-material');
	pyramid2 = pyramid2.getInstance();
	pyramid2.setX(5.0);
	pyramid2.setY(-1.5);

	var ring = new GLRing(0.5, 1.0, 200, 32);
	ring.setMaterial(redMaterial);
	//ring.debug();
	ring.setVertexShaderName('vertex-material');
	ring.setFragmentShaderName('fragment-material');
	ring = ring.getInstance();
	ring.setX(-5.0);
	ring.setY(1.5);

	var quad = new GLQuad([{x: 0.0, y: 0.0, z: 0.0}, {x: 1.0, y: 0.0, z: -0.1}, {x: 0.9, y: 0.0, z: 0.5}, {x: -0.2, y: 0.0, z: 0.4}]);
	quad.setMaterial(blueMaterial);
	//quad.debug();
	quad.setVertexShaderName('vertex-material');
	quad.setFragmentShaderName('fragment-material');
	quad = quad.getInstance();
	quad.setY(-5.0);
	quad.setX(-1.5);

	var pipe = new GLPipe(0.5, 1.0, 0.6, 0.9, 2.0, 200, 0.4, -0.3, 32, 10, true, true, true);
	pipe.setMaterial(redMaterial);
	//pipe.debug();
	pipe.setVertexShaderName('vertex-material');
	pipe.setFragmentShaderName('fragment-material');
	pipe = pipe.getInstance();
	pipe.setX(-5.0);
	pipe.setY(-1.5);

	var revolutionVertices = [
		{x: 0.0, z: 0.0, smoothZ: false}, // 0
		{x: 0.3, z: 0.0, smoothZ: false}, // 1
		{x: 0.3125, z: 0.0125, smoothZ: true}, // 2
		{x: 0.3, z: 0.025, smoothZ: true}, // 3
		{x: 0.1, z: 0.075, smoothZ: true}, // 4
		{x: 0.066, z: 0.1, smoothZ: true}, // 5
		{x: 0.033, z: 0.2, smoothZ: true}, // 6
		{x: 0.025, z: 0.3, smoothZ: true}, // 7
		{x: 0.033, z: 0.375, smoothZ: true}, // 8
		{x: 0.075, z: 0.466, smoothZ: true}, // 9
		{x: 0.133, z: 0.5, smoothZ: true}, // 10
		{x: 0.233, z: 0.55, smoothZ: true}, // 11
		{x: 0.3, z: 0.6, smoothZ: true}, // 12
		{x: 0.333, z: 0.7, smoothZ: true}, // 13
		{x: 0.334, z: 0.75, smoothZ: true}, // 13 bis
		{x: 0.330, z: 0.8, smoothZ: true}, // 14
		{x: 0.3125, z: 0.9, smoothZ: true}, // 15
		{x: 0.275, z: 0.9875, smoothZ: true}, // 16
		{x: 0.266, z: 1.0, smoothZ: true}, // 17
		{x: 0.25, z: 0.975, smoothZ: true}, // 18
		{x: 0.275, z: 0.9, smoothZ: true}, // 19
		{x: 0.3, z: 0.8, smoothZ: true}, // 20
		{x: 0.275, z: 0.7, smoothZ: true}, // 21
		{x: 0.233, z: 0.6, smoothZ: true}, // 22
		{x: 0.15, z: 0.55, smoothZ: true}, // 23
		{x: 0.066, z: 0.525, smoothZ: true}, // 24
		{x: 0.0, z: 0.525, smoothZ: false}, // 25
	];

	var revolution1 = new GLRevolution(revolutionVertices, 100.0, true, 32, true, true);
	revolution1.setMaterial(redMaterial);
	//revolution1.debug();
	revolution1.setVertexShaderName('vertex-material');
	revolution1.setFragmentShaderName('fragment-material');
	revolution1 = revolution1.getInstance();
	revolution1.setX(-5.0);
	revolution1.setY(-5.0);

	var revolution2 = new GLPrismRevolution(revolutionVertices, 300.0, true, 6, true, true);
	revolution2.setMaterial(blueMaterial);
	//revolution2.debug();
	revolution2.setVertexShaderName('vertex-material');
	revolution2.setFragmentShaderName('fragment-material');
	revolution2 = revolution2.getInstance();
	//revolution2.setX(-5.0);
	//revolution2.setY(-5.0);

	canvas.addInstance(workingGrid);
	canvas.addInstance(workingMark);
	//canvas.addInstance(copyCube1);
	//canvas.addInstance(copyCube2);
	canvas.addInstance(group);
	canvas.addInstance(disc);
	canvas.addInstance(cylinder);
	canvas.addInstance(sphere1);
	canvas.addInstance(cone);
	canvas.addInstance(sphere2);
	canvas.addInstance(ellipsoid1);
	canvas.addInstance(rect1);
	canvas.addInstance(polygon);
	canvas.addInstance(line);
	canvas.addInstance(prism1);
	canvas.addInstance(prism2);
	canvas.addInstance(pyramid1);
	canvas.addInstance(pyramid2);
	canvas.addInstance(ring);
	canvas.addInstance(quad);
	canvas.addInstance(pipe);
	canvas.addInstance(revolution1);
	canvas.addInstance(revolution2);

	//canvas.setOutline({ 'enable': true, 'width': 0.1, 'color': [0.0, 0.0, 0.0, 1.0]});

	/////////////
	// Methods //
	/////////////

	this.render = function render()
	{
		this.execSuper('render', [], render);
	};

	this.resize = function resize()
	{
		var width = document.getElementById('main').offsetWidth;
		var height = document.getElementById('main').offsetHeight;
		this.execSuper('resize', [width, height], resize);
		$this.render();
	};

	///////////////////////////
	// Events initialisation //
	///////////////////////////

	canvas.onKeyDown = function($event)
	{
		if ($event.keyCode === 48)
		{
			canvas.changeView(CAMERA_VIEWS.PERSPECTIVE);
		}
		else if ($event.keyCode === 49)
		{
			canvas.changeView(CAMERA_VIEWS.FRONT);
		}
		else if ($event.keyCode === 50)
		{
			canvas.changeView(CAMERA_VIEWS.BACK);
		}
		else if ($event.keyCode === 51)
		{
			canvas.changeView(CAMERA_VIEWS.LEFT);
		}
		else if ($event.keyCode === 52)
		{
			canvas.changeView(CAMERA_VIEWS.RIGHT);
		}
		else if ($event.keyCode === 53)
		{
			canvas.changeView(CAMERA_VIEWS.TOP);
		}
		else if ($event.keyCode === 54)
		{
			canvas.changeView(CAMERA_VIEWS.BOTTOM);
		}
	};

	/////////////////
	// Inheritance //
	/////////////////
	
	var $this = utils.extend(canvas, this);
	canvas.focus();
	return $this; 
}

if (Loader !== null && Loader !== undefined)
	Loader.hasLoaded("demo01");