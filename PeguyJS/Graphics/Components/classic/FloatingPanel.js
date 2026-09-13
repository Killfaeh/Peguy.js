function FloatingPanel($html)
{
	///////////////
	// Attributs //
	///////////////
	
	var html = '<div class="floatingPanel" >' + $html + '</div>';
	var component = new Component(html);

	// Style

	component.addConfigStyle("floatingPanel", function ()
	{
		return {
			classic:
			{
				"this":
				{
					"border": (function() { return STYLE.floatingPanelBorder; })(),
					"backgroundColor": (function() { return STYLE.floatingPanelBackgroundColor; })(),
					"boxShadow" : (function() { return STYLE.floatingPanelBoxShadow; })()
				},
			},
			
		};
	});

	component.applyConfigStyle();

	//////////////
	// Méthodes //
	//////////////
	
	this.display = function()
	{
		document.getElementById('main').appendChild(component);
		Components.focus.floatPanel = $this;
	};
		
	this.hide = function()
	{
		component.remove();
		Components.focus.floatPanel = null;
	};
	
	//////////////
	// Héritage //
	//////////////
	
	var $this = utils.extend(component, this);
	return $this; 
}