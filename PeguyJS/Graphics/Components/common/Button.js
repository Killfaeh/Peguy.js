function Button($label)
{
	///////////////
	// Attributs //
	///////////////
	
	var label = $label;
	
	var labelToDisplay = dataManager.encodeHTMLEntities(label);
	
	var enable = true;
	
	var html = '<button class="button" >' + labelToDisplay + '</button>';
	
	var component = new Component(html);
	
	// Style

	component.addConfigStyle("button", function ()
	{
	    return {
	        common:
	        {
	        	"this":
				{
					"color": (function() { return STYLE.buttonsTextColor; })(),
					"fontWeight": (function() { return STYLE.buttonsFontWeight; })(),
					"backgroundColor": (function() { return STYLE.buttonsBackgroundColor; })(),
					"backgroundImage": (function() { return STYLE.buttonsBackgroundImage; })(),
					"border": (function() { return STYLE.buttonsBorder; })(),
					"borderRadius": (function() { return STYLE.buttonsBorderRadius; })()
				},
				
				"multi-tag":
	        	{
					".disabledButton":
	        		[
						"color: " + (function() { return STYLE.disableButtonsTextColor; })(),
						"backgroundColor: " + (function() { return STYLE.disableButtonsBackgroundColor; })(),
						"border: " + (function() { return STYLE.disableButtonsBorder; })()
					]
				},
	        },
	    };
	});

	component.applyConfigStyle();

	
	//////////////
	// Méthodes //
	//////////////
	
	////////////////////////////
	// Gestion des événements //
	////////////////////////////
	
	this.onAction = function($value) {};
	
	this.onClick = function($event)
	{
		if (enable === true)
			$this.onAction();
	}
	
	////////////////
	// Accesseurs //
	////////////////
	
	// GET
	this.getLabel = function() { return label; };
	
	// SET
	
	this.setLabel = function($label)
	{
		label = $label;
		labelToDisplay = dataManager.encodeHTMLEntities(label);
		labelToDisplay = labelToDisplay.replaceAll("&#160;", " ");
		$this.removeAllChildren();
		$this.appendChild(utils.createText(labelToDisplay));
	};
	
	this.setEnable = function($enable)
	{
		enable = $enable;
		
		if (enable === true)
			$this.removeClass('disabledButton');
		else
			$this.addClass('disabledButton');
	};
	
	//////////////
	// Héritage //
	//////////////
	
	var $this = utils.extend(component, this);
	return $this; 
}