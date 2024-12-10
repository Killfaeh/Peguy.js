
////////////////////////////////////////////////////////////////////
//// Developed by Suisei aka Killfaeh aka Amandine Hachin, 2020 ////
////                  http://suiseipark.com/                    ////
////              http://suiseipark.blogspot.fr/                ////
////                http://killfaeh.tumblr.com/                 ////
////             https://www.facebook.com/suiseipark            ////
////////////////////////////////////////////////////////////////////

function GLCylinder($radius1, $radius2, $height, $angle, $deltaX, $deltaY, $thetaResolution, $heightResolution, $fill, $bottomClosed, $topClosed, $radiusResolution, $textureMode)
{
	///////////////
	// Attributs //
	///////////////
	
	var glBuffer = new GLBuffer();
	
	var radius1 = $radius1;
	var radius2 = $radius2;
	var height = $height;
	var angle = $angle;
	
	if (angle <= 0.0 || angle > 360.0)
		angle = 360.0;
	
	var deltaX = $deltaX;
	var deltaY = $deltaY;
	
	var thetaResolution = $thetaResolution;
	var heightResolution = $heightResolution;
	var radiusResolution = $radiusResolution;
	var fill = $fill;
	var bottomClosed = $bottomClosed;
	var topClosed = $topClosed;
	
	var textureMode = 0;
	// 0 : Même texture sur les 3 faces (texture en une partie)
	// 1 : Une texture pour le cylindre une autre pour les couvercle (texture en 2 parties)
	// 2 : Une texture pour le cylindre une par couvercle (texture en 3 parties)
	
	if (utils.isset($textureMode))
		textureMode = $textureMode;
	
	//////////////
	// Méthodes //
	//////////////

	var init = function()
	{
		var cylinderData = GLData.createCylinderData(radius1, radius2, height, angle, deltaX, deltaY, thetaResolution, heightResolution, fill);

		glBuffer.setVertices(cylinderData.vertices);
		glBuffer.setNormals(cylinderData.normals);
		glBuffer.setTangentsX(cylinderData.tangentsX);
		glBuffer.setTangentsY(cylinderData.tangentsY);
		glBuffer.setTexture(cylinderData.texture);
		glBuffer.setColors(cylinderData.colors);
		glBuffer.setIndices(cylinderData.indices);

		if (bottomClosed === true)
		{
			var disc1 = new GLDisc(radius1, angle, radiusResolution, thetaResolution);
			disc1.setX(-deltaX/2.0);
			disc1.setY(-deltaY/2.0);
			disc1.setZ(-height/2.0);
			disc1.reverseNormals();
			glBuffer = glBuffer.fuse(disc1);
		}

		if (topClosed === true)
		{
			var disc2 = new GLDisc(radius2, angle, radiusResolution, thetaResolution);
			disc2.setX(deltaX/2.0);
			disc2.setY(deltaY/2.0);
			disc2.setZ(height/2.0);
			glBuffer = glBuffer.fuse(disc2);
		}
	};
	
	////////////////
	// Accesseurs //
	////////////////
	
	// GET
	
	// SET
	
	//////////////
	// Héritage //
	//////////////
	
	init();
	var $this = utils.extend(glBuffer, this);
	return $this;
}

if (Loader !== null && Loader !== undefined)
	Loader.hasLoaded("gl-cylinder");