function InvisibleFreezeScreen()
{
	///////////////
	// Attributs //
	///////////////
	

	var html = '<div class="invisibleFreezeScreen" >'
					+ '<div id="invisibleFreezeScreenLeft" class="invisibleFreezeScreenLeft" ></div>'
					+ '<div id="invisibleFreezeScreenRight" class="invisibleFreezeScreenRight" ></div>'
					+ '<div id="invisibleFreezeScreenTop" class="invisibleFreezeScreenTop" ></div>'
					+ '<div id="invisibleFreezeScreenBottom" class="invisibleFreezeScreenBottom" ></div>'
				+ '</div>';
				
	var component = new Component(html);
	
	/*
// Style

component.addConfigStyle("invisibleFreezeScreen", function ()
{
	return {
		common:
		{},
		
		classic:
		{
	"multi-tag": {}
},
		
		mobile:
		{},
	};
});

component.applyConfigStyle();
	//*/

	//////////////
	// Méthodes //
	//////////////
	
	this.resize = function($elementToSurround)
	{
		if (utils.isset($elementToSurround))
		{
			var screenWidth = document.getElementById('main').offsetWidth;
			var screenHeight = document.getElementById('main').offsetHeight;
			var elementWidth = $elementToSurround.offsetWidth;
			var elementHeight = $elementToSurround.offsetHeight;
			var elementPosition = $elementToSurround.position();
			
			component.getById('invisibleFreezeScreenLeft').style.right = (screenWidth-elementPosition.x) + 'px';
			component.getById('invisibleFreezeScreenRight').style.left = (elementPosition.x+elementWidth) + 'px';
			component.getById('invisibleFreezeScreenTop').style.bottom = (screenHeight-elementPosition.y) + 'px';
			component.getById('invisibleFreezeScreenBottom').style.top = (elementPosition.y+elementHeight) + 'px';
		}
	};
	
	this.display = function($elementToSurround)
	{
		document.getElementById('main').appendChild($this);
		$this.resize($elementToSurround);
	};
	
	this.hide = function()
	{
		$this.remove();
	};

	////////////////////////////
	// Gestion des événements //
	////////////////////////////
	
	////////////////
	// Accesseurs //
	////////////////

	// GET
	
	// SET
	
	//////////////
	// Héritage //
	//////////////
	
	var $this = utils.extend(component, this);
	return $this; 
}