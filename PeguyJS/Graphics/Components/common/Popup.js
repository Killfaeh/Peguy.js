function Popup($content)
{
	///////////////
	// Attributs //
	///////////////

	// Structure du composant

	var content = $content;

	var html = '<div class="popup" >'
					+ '<div id="popupContent" class="popupContent" >'
						+ '<div id="innerPopupContent" class="innerPopupContent" >'
							+ '<div id="closeIcon" class="close" ><Icon fileName="icons" name="close-icon" width="20" height="20" /></div>'
							+ content
							+ '<div class="wall" ></div>'
						+ '</div>'
					+ '</div>'
					+ '<div class="wall" ></div>'
				+ '</div>';
				
	var component = new Component(html);

	// Style

	component.addConfigStyle("popup", function ()
	{
		return {
			common:
			{
				'this': { backgroundColor: (function() { return STYLE.popupScreenColor; })() },

				'popupContent':
				{
					border: (function() { return STYLE.popupBorder; })(),
					borderRadius: (function() { return STYLE.popupBorderRadius; })(),
					backgroundColor: (function() { return STYLE.popupBackGroundColor; })(),
					boxShadow: (function() { return STYLE.popupBoxShadow; })(),
				},
			},
		};
	});

	component.applyConfigStyle();

	/*
// Style

component.addConfigStyle("popup", function ()
{
	return {
		common:
		{},
		
		classic:
		{
	"multi-tag": {},
	"popup": {
		"backgroundColor": (function() { return STYLE.popupBackgroundColor; })()
	},
	"popupContent": {
		"border": (function() { return STYLE.popupBorder; })(),
		"backgroundColor": (function() { return STYLE.popupBackgroundColor; })(),
		"boxShadow": (function() { return STYLE.popupBoxShadow; })()
	}
},
		
		mobile:
		{
	"multi-tag": {},
	"popup": {
		"backgroundColor": (function() { return STYLE.popupBackgroundColor; })()
	},
	"popupContent": {
		"border": (function() { return STYLE.popupBorder; })(),
		"backgroundColor": (function() { return STYLE.popupBackgroundColor; })(),
		"boxShadow": (function() { return STYLE.popupBoxShadow; })()
	}
},
	};
});

component.applyConfigStyle();
	//*/

	// Variables opérationnelles

	var popupMouseDown = false;
	var innerMouseDown = false;
	
	//////////////
	// Méthodes //
	//////////////

	this.onHide = function() { return true; };

	this.hide = function()
	{
		setTimeout(function()
		{
			var confirmHide = $this.onHide();
		
			if (confirmHide !== false)
			{
				if (component)
					component.remove();
				
				if (utils.isset($this.blur) && $this instanceof Window)
					$this.blur();
				
				$this.unconnectAll();
					
				Components.removePopup($this);
			}
			
		}, 50);
	};
	
	this.close = this.hide;

	////////////////////////////
	// Gestion des événements //
	////////////////////////////

	component.getById('closeIcon').onClick = this.hide;

	this.onInnerClick = function() {};

	if (Loader.getMode() === 'classic')
	{
		component.getById('popupContent').onMouseDown = function()
		{
			popupMouseDown = true;
			innerMouseDown = true;
		};
		
		component.getById('popupContent').onClick = function()
		{
			$this.onInnerClick();
			popupMouseDown = false;
			innerMouseDown = false;
		};
	
		component.onMouseDown = function() { popupMouseDown = true; };
	
		component.onClick = function()
		{
			if (innerMouseDown === false && popupMouseDown === true)
				this.hide();
	
			popupMouseDown = false;
			innerMouseDown = false;
		};
		
		var inputList = [];
		var inputNodes = component.getElementsByTagName("input");
		var selectNodes = component.getElementsByTagName("select");
		var textareaNodes = component.getElementsByTagName("textarea");
		
		for (var i = 0; i < inputNodes.length; i++)
			inputList.push(inputNodes[i]);
		
		for (var i = 0; i < selectNodes.length; i++)
			inputList.push(selectNodes[i]);
		
		for (var i = 0; i < textareaNodes.length; i++)
			inputList.push(textareaNodes[i]);
		
		for (var i = 0; i < inputList.length; i++)
		{
			inputList[i].addEvent('mousedown', function($event)
			{
				popupMouseDown = true;
				innerMouseDown = true;
			});
			
			inputList[i].addEvent('click', function($event)
			{
				$this.onInnerClick();
				popupMouseDown = false;
				innerMouseDown = false;
			});
		}
	}

	////////////////
	// Accesseurs //
	////////////////

	// GET
	this.getContent = function() { return content; };
	this.isInnerMouseDown = function() { return innerMouseDown; };
	
	// SET
	this.setContent = function($content)
	{
		content = $content;
		component.getById("popupContent").appendChild(component.stringToHtml(content));
	};
	
	this.setInnerMouseDown = function($innerMouseDown) { innerMouseDown = $innerMouseDown; };
	
	//////////////
	// Héritage //
	//////////////
	
	var $this = utils.extend(component, this);
	Components.addPopup($this);
	$this.focus();
	return $this; 
}