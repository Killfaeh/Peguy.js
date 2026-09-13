function FreezeScreen($content)
{
	///////////////
	// Attributs //
	///////////////

	// Structure du composant

	var content = $content;

	var html = '<div id="freezeScreen" class="freezeScreen" >'
					+ '<div id="freezeScreenContent" class="freezeScreenContent" >' + content + '<div class="wall" ></div></div>'
					+ '<div id="wall" class="wall" ></div>'
				+ '</div>';
				
	var component = new Component(html);

	// Style

	component.addConfigStyle("freezeScreen", function ()
	{
		return {
			common:
			{
				'this':
				{
					backgroundColor: (function() { return STYLE.popupFreezeScreenColor; })(),
				},
			}
		};
	});

	component.applyConfigStyle();
	
	//////////////
	// Méthodes //
	//////////////

	this.hide = function()
	{
		if (utils.isset(component) && utils.isset(component.parentNode))
			component.parentNode.removeChild(component);
	};

	////////////////
	// Accesseurs //
	////////////////

	// GET
	this.getContent = function() { return content; };
	
	// SET
	this.setContent = function($content)
	{
		content = $content;
		component.getById("freezeScreenContent").empty();
		component.getById("freezeScreenContent").appendChild(component.stringToHtml(content));
	};
	
	//////////////
	// Héritage //
	//////////////
	
	var $this = utils.extend(component, this);
	return $this;
}