function MenuBar()
{
	///////////////
	// Attributs //
	///////////////

	var html = '<div class="menuBar" >'
					+ '<div id="background-screen" class="background-screen" ></div>'
					+ '<ul id="children-list" class="root-children-list" ></ul>'
				+ '</div>';
				
	var component = new ListComponent(html);
	component.setNode(component.getById('children-list'));
	
	var isOpen = false;
	
	var menuIcon = Loader.getSVG('icons', 'menu-icon', 25, 25);
	var mobileItem = new MenuItem("");
	mobileItem.getById('menu-item-label').insertAt(menuIcon, 0);
	mobileItem.style.padding = "3px";
	mobileItem.addClass('rootMenuItem');
	
	var classicWidth = 0;
	var mode = 'classic';
	
	/*
// Style

component.addConfigStyle("menuBar", function ()
{
	return {
		common:
		{},
		
		classic:
		{
	"multi-tag": {
		".menuBar .root-children-list .children-list .menuSeparator div": [
			"border-Bottom: (function() { return STYLE.menuBarBorderBottom; })()
		]
	},
	"menuBar": {
		"borderBottom": (function() { return STYLE.menuBarBorderBottom; })(),
		"backgroundColor": (function() { return STYLE.menuBarBackgroundColor; })(),
		"backgroundImage": (function() { return STYLE.menuBarBackgroundImage; })(),
		"boxShadow": (function() { return STYLE.menuBarBoxShadow; })()
	},
	"enlighted": {
		"backgroundColor": (function() { return STYLE.menuBarBackgroundColor; })()
	},
	"disable": {
		"color": (function() { return STYLE.menuBarColor; })()
	},
	"arrow": {
		"color": (function() { return STYLE.menuBarColor; })()
	},
	"children-list": {
		"border": (function() { return STYLE.menuBarBorder; })(),
		"backgroundColor": (function() { return STYLE.menuBarBackgroundColor; })(),
		"boxShadow": (function() { return STYLE.menuBarBoxShadow; })()
	},
	"shortcut": {
		"color": (function() { return STYLE.menuBarColor; })()
	}
},
		
		mobile:
		{
	"multi-tag": {
		".menuBar .root-children-list .children-list .menuSeparator div": [
			"border-Bottom: (function() { return STYLE.menuBarBorderBottom; })()
		]
	},
	"menuBar": {
		"border": (function() { return STYLE.menuBarBorder; })(),
		"backgroundColor": (function() { return STYLE.menuBarBackgroundColor; })(),
		"boxShadow": (function() { return STYLE.menuBarBoxShadow; })()
	},
	"enlighted": {
		"backgroundColor": (function() { return STYLE.menuBarBackgroundColor; })()
	},
	"rootMenuItem": {
		"backgroundColor": (function() { return STYLE.menuBarBackgroundColor; })()
	},
	"arrow": {
		"color": (function() { return STYLE.menuBarColor; })()
	},
	"backArrow": {
		"color": (function() { return STYLE.menuBarColor; })()
	},
	"children-list": {
		"border": (function() { return STYLE.menuBarBorder; })(),
		"backgroundColor": (function() { return STYLE.menuBarBackgroundColor; })(),
		"boxShadow": (function() { return STYLE.menuBarBoxShadow; })()
	}
},
	};
});

component.applyConfigStyle();
	//*/

	//////////////
	// Méthodes //
	//////////////

	this.addElement = function($element, $noresize)
	{
		var list = $this.addToList($element);

		if (Array.isArray($element))
			$element.forEach(function($el) { if ($el.update) { $el.update(); } });
		else if ($element.update)
			$element.update();

		if ($noresize !== true)
			$this.onResize();

		return list;
	};

	this.insertElementInto = function($element, $index, $noresize)
	{
		var list = $this.insertIntoListAt($element, $index);

		if (Array.isArray($element))
			$element.forEach(function($el) { if ($el.update) { $el.update(); } });
		else
			$element.update();

		if ($noresize !== true)
			$this.onResize();

		return list;
	};

	this.removeElement = function($element, $noresize)
	{
		var list = $this.removeFromList($element);

		if ($noresize !== true)
			$this.onResize();

		return list;
	};

	this.removeAllElement = function($noresize)
	{
		var list = $this.removeAllFromList();

		if ($noresize !== true)
			$this.onResize();

		return list;
	};
	
	this.openAll = function() { component.execAll([ 'openAll' ]); };
	
	this.closeAll = this.closeAllChildren = function()
	{
		$this.setOpen(false);
		component.execAll([ 'closeAll' ]);

	};
	
	this.closeParent = function()
	{
		this.closeAll();
		$this.setOpen(false);
		//document.getElementById('main').removeChild($this);
	};

	this.enableByNames = function($names)
	{
		component.getList().forEach(function($element)
		{
			if ($element.getName && $names.includes($element.getName()))
				$element.setDisable(false);
			
			if ($element.enableByNames)
				$element.enableByNames($names);
		});
	};

	this.disableByNames = function($names)
	{
		component.getList().forEach(function($element)
		{
			if ($element.getName && $names.includes($element.getName()))
				$element.setDisable(true);
			
			if ($element.disableByNames)
				$element.disableByNames($names);
		});
	};
	
	var computeClassicWidth = function()
	{
		return component.getList().reduce(function($width, $element) { return $width + $element.offsetWidth }, 0);
	};
	
	var toMobile = function()
	{
		var elementsToMove = component.getList().map(function($element) { return $element; });

		elementsToMove.forEach(function($element)
		{
			$this.removeElement($element, true);
			mobileItem.addElement($element);
			
			if ($element.update)
				$element.update();
		});
		
		$this.addElement(mobileItem, true);
		
		mode = 'mobile';
	};
	
	var toClassic = function()
	{
		var elementsToMove = component.getList().map(function($element) { return $element; });
		
		$this.removeElement(mobileItem, true);

		elementsToMove.forEach(function($element)
		{
			mobileItem.removeElement($element);
			$this.addElement($element, true);
			
			if ($element.update)
				$element.update();
		});
		
		mode = 'classic';
	};

	////////////////////////////
	// Gestion des événements //
	////////////////////////////

	this.onCancel = function() {};

	this.onClick = component.getById('children-list').onClick = component.getById('background-screen').onClick = function()
	{
		//document.getElementById('main').removeChild($this);
		$this.onCancel();
		$this.setOpen(false);
		$this.closeAllChildren();
	};
	
	//component.getById('children-list').onClick = function() {};
	
	this.onContextMenu = component.getById('children-list').onContextMenu = component.getById('background-screen').onContextMenu = function($event)
	{
		Events.preventDefault($event);
		//document.getElementById('main').removeChild($this);
		$this.onCancel();
		$this.setOpen(false);
		$this.closeAllChildren();
	};
	
	component.getById('children-list').onMouseOut = function() { component.execAll([ 'unlightAll' ]); };
	
	this.onResize = function()
	{
		if (classicWidth === 0 || mode === 'classic')
			classicWidth = computeClassicWidth();
		
		var parentNode = $this.parentNode;
		
		if (utils.isset(parentNode))
		{
			//console.log("Redimensionnement de la fenêtre : " + mode + ', ' + classicWidth + ', ' + parentNode.offsetWidth);
			//console.log(parentNode);
			
			if (mode === 'classic' && classicWidth > parentNode.offsetWidth)
				toMobile();
			else if (mode === 'mobile' && classicWidth <= parentNode.offsetWidth)
				toClassic();
		}
	};

	////////////////
	// Accesseurs //
	////////////////

	// GET
	
	this.isOpen = function() { return isOpen; };
	this.getElementsList = function() { return component.getList(); };
	this.getListNode = function() { return component.getById('root-children-list'); };

	this.getByName = function($name)
	{
		for (var i = 0; i < component.getList().length; i++)
		{
			var element = component.getList()[i];

			if (element.getName)
			{
				if (element.getName() === $name)
					return element;
				else 
				{
					var item = element.getByName($name)

					if (item)
						return item;
				}
			}
		}

		return null;
	};
	
	// SET
	
	this.setOpen = function($isOpen)
	{
		isOpen = $isOpen;
		
		if (isOpen === true)
		{
			var parentNode = $this.parentNode;
			
			if (utils.isset(parentNode))
			{
				var menuHeight = $this.offsetHeight;
				var parentWidth = parentNode.offsetWidth;
				var parentHeight = parentNode.offsetHeight;
				
				if (Loader.getMode() === 'classic')
				{
					component.getById('background-screen').style.display = 'block';
					component.getById('background-screen').style.width = parentWidth + 'px';
					component.getById('background-screen').style.height = (parentHeight - menuHeight) + 'px';
				}
			}
		}
		else
			component.getById('background-screen').style.display = 'none';
	};

	this.loadElementFromJSON = function($item)
	{
		if ($item.separator)
			return new MenuSeparator();
		else
		{
			var label = $item.label;
			var name = $item.name;
			var shortcut = $item.shortcut;
			var onAction = $item.onAction;
			var disable = $item.disable;
			var children = $item.children;

			var item = new MenuItem(label, name, shortcut);

			if (name)
				item.setName(name);

			if (onAction)
				item.onAction = onAction;

			if (disable === true)
				item.setDisable(true);

			if (children && children.length > 0)
				item.loadFromJSON(children);

			return item;
		}
	};
	
	//////////////
	// Héritage //
	//////////////
	
	var $this = utils.extend(component, this);
	return $this; 
}