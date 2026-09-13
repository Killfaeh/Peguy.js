function ContextMenu($mouseX, $mouseY)
{
	///////////////
	// Attributs //
	///////////////

	var mouseX = $mouseX;
	var mouseY = $mouseY;

	var html = '<div class="contextMenu" >'
					+ '<ul id="children-list" class="root-children-list" ></ul>'
				+ '</div>';
				
	var component = new ListComponent(html);
	component.setNode(component.getById('children-list'));
	
	/*
// Style

component.addConfigStyle("contextMenu", function ()
{
	return {
		common:
		{},
		
		classic:
		{
	"multi-tag": {},
	"root-children-list": {
		"border": (function() { return STYLE.contextMenuBorder; })(),
		"backgroundColor": (function() { return STYLE.contextMenuBackgroundColor; })(),
		"boxShadow": (function() { return STYLE.contextMenuBoxShadow; })()
	},
	"enlighted": {
		"backgroundColor": (function() { return STYLE.contextMenuBackgroundColor; })()
	},
	"arrow": {
		"color": (function() { return STYLE.contextMenuColor; })()
	},
	"children-list": {
		"border": (function() { return STYLE.contextMenuBorder; })(),
		"backgroundColor": (function() { return STYLE.contextMenuBackgroundColor; })(),
		"boxShadow": (function() { return STYLE.contextMenuBoxShadow; })()
	}
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

	this.update = function()
	{
		// Gérer le cas où la liste sort de l'écran
		var panelWidth = component.getById('children-list').offsetWidth;
		var panelHeight = component.getById('children-list').offsetHeight;
		var panelPosition = component.getById('children-list').position();
		
		/*
		console.log(panelPosition);
		console.log("Panel height : " + panelHeight);
		console.log("Screen height : " + Screen.getHeight());
		//*/
		
		/*
		if (panelHeight > Screen.getHeight())
		{
			component.getById('children-list').setStyle("height", (Screen.getHeight()-20) + "px");
			component.getById('children-list').setStyle("top", "10px");
			component.getById('children-list').setStyle("overflow", "auto");
		}
		else if (panelPosition.y + panelHeight > Screen.getHeight())
		{
			component.getById('children-list').setStyle("top", "unset");
			component.getById('children-list').setStyle("bottom", "10px");
		}
		else
		{
			component.getById('children-list').setStyle("height", "unset");
			component.getById('children-list').setStyle("top", panelPosition.y + "px");
			component.getById('children-list').setStyle("bottom", "unset");
			component.getById('children-list').setStyle("overflow", "unset");
		}
		//*/
		
		if (panelHeight > Screen.getHeight() || panelWidth > Screen.getWidth())
		{
			if (panelHeight > Screen.getHeight())
			{
				component.getById('children-list').setStyle("height", (Screen.getHeight()-20) + "px");
				component.getById('children-list').setStyle("top", "10px");
			}
			
			if (panelWidth > Screen.getWidth())
			{
				component.getById('children-list').setStyle("width", (Screen.getWidth()-20) + "px");
				component.getById('children-list').setStyle("left", "10px");
			}
			
			component.getById('children-list').setStyle("overflow", "auto");
		}
		else
			component.getById('children-list').setStyle("overflow", "unset");
		
		if (panelHeight <= Screen.getHeight())
		{
			if (panelPosition.y + panelHeight > Screen.getHeight())
			{
				component.getById('children-list').setStyle("top", "unset");
				component.getById('children-list').setStyle("bottom", "10px");
			}
			else
			{
				component.getById('children-list').setStyle("height", "unset");
				component.getById('children-list').setStyle("top", panelPosition.y + "px");
				component.getById('children-list').setStyle("bottom", "unset");
			}
		}
		
		if (panelWidth <= Screen.getWidth())
		{
			if (panelPosition.x + panelWidth > Screen.getWidth())
			{
				component.getById('children-list').setStyle("left", "unset");
				component.getById('children-list').setStyle("right", "10px");
			}
			else
			{
				component.getById('children-list').setStyle("width", "unset");
				component.getById('children-list').setStyle("left", panelPosition.x + "px");
				component.getById('children-list').setStyle("right", "unset");
			}
		}
	};

	this.addElement = function($element) { return $this.addToList($element); };
	this.insertElementInto = function($element, $index) { return $this.insertIntoListAt($element, $index); };
	this.removeElement = function($element) { return $this.removeFromList($element); };
	this.removeAllElement = function() { return $this.removeAllFromList(); };
	
	this.openAll = function() { component.execAll([ 'openAll' ]); };
	this.closeAll = this.closeAllChildren = function() { component.execAll([ 'closeAll' ]); };
	
	this.closeParent = function()
	{
		this.closeAll();
		document.getElementById('main').removeChild($this);
	};

	////////////////////////////
	// Gestion des événements //
	////////////////////////////

	component.onChange = function() { $this.update(); };

	this.onCancel = function() {};

	this.onClick = function()
	{
		if (utils.isset($this.parentNode))
			document.getElementById('main').removeChild($this);
		
		$this.onCancel();
	};
	
	component.getById('children-list').onClick = function() {};
	
	this.onContextMenu = function($event)
	{
		Events.preventDefault($event);
		
		if (utils.isset($this.parentNode))
			document.getElementById('main').removeChild($this);
	};
	
	component.getById('children-list').onMouseOut = function() { component.execAll([ 'closeAll', 'unlightAll' ]); };

	////////////////
	// Accesseurs //
	////////////////

	// GET
	
	this.getElementsList = function() { return component.getList(); };
	this.getListNode = function() { return component.getById('children-list'); };
	
	// SET
	
	//////////////
	// Héritage //
	//////////////
	
	var $this = utils.extend(component, this);

	document.getElementById('main').appendChild($this);
	var childrenList = component.getById('children-list');
	childrenList.style.left = mouseX + 'px';
	childrenList.style.top = mouseY + 'px';
	$this.update();
	
	return $this; 
}