function TabManager()
{
	///////////////
	// Attributs //
	///////////////

	var html = '<div class="tabManager" >'
					+ '<ul id="tabs" class="tabs" ></ul>'
					+ '<div id="openHiddenTabs" class="openHiddenTabs" >'
						+ '<span id="hiddenTabsCount" class="hiddenTabsCount" >0</span>'
						+ '<span id="hiddenTabsIcon" class="hiddenTabsIcon" ></span>'
						+ '<div class="wall" ></div>'
					+ '</div>'
					+ '<div id="invisibleFreezeScreen" class="invisibleFreezeScreen" ></div>'
					+ '<ul id="hiddenTabs" class="hiddenTabs" ></ul>'
					+ '<div id="content" class="content" ></div>'
				+ '</div>';

	var component = new Component(html);
	
	// Composants
	
	var openIcon = Loader.getSVG('icons', 'down-double-arrow-icon', 10, 10);
	component.getById('hiddenTabsIcon').appendChild(openIcon);
	
	var invisibleFreezeScreen = new InvisibleFreezeScreen();
	component.getById('invisibleFreezeScreen').appendChild(invisibleFreezeScreen);
	
	var hiddenTabs = component.getById('hiddenTabs');
	
	var editMode = false;
	
	/*
// Style

component.addConfigStyle("tabManager", function ()
{
	return {
		common:
		{},
		
		classic:
		{
	"multi-tag": {
		".tabManager .virtual-tab div": [
			"background-Color: (function() { return STYLE.tabManagerBackgroundColor; })(),
			"border: (function() { return STYLE.tabManagerBorder; })()
		]
	},
	"tabManager": {
		"backgroundColor": (function() { return STYLE.tabManagerBackgroundColor; })()
	},
	"tabs": {
		"borderBottom": (function() { return STYLE.tabManagerBorderBottom; })(),
		"backgroundColor": (function() { return STYLE.tabManagerBackgroundColor; })()
	},
	"tab": {
		"borderRight": (function() { return STYLE.tabManagerBorderRight; })(),
		"borderTop": (function() { return STYLE.tabManagerBorderTop; })(),
		"borderBottom": (function() { return STYLE.tabManagerBorderBottom; })(),
		"backgroundColor": (function() { return STYLE.tabManagerBackgroundColor; })(),
		"backgroundImage": (function() { return STYLE.tabManagerBackgroundImage; })(),
		"color": (function() { return STYLE.tabManagerColor; })()
	},
	"unselectMargin": {
		"backgroundColor": (function() { return STYLE.tabManagerBackgroundColor; })(),
		"borderTop": (function() { return STYLE.tabManagerBorderTop; })()
	},
	"selected": {
		"backgroundColor": (function() { return STYLE.tabManagerBackgroundColor; })(),
		"backgroundImage": (function() { return STYLE.tabManagerBackgroundImage; })(),
		"borderLeft": (function() { return STYLE.tabManagerBorderLeft; })(),
		"borderBottom": (function() { return STYLE.tabManagerBorderBottom; })(),
		"color": (function() { return STYLE.tabManagerColor; })()
	},
	"openHiddenTabs": {
		"borderLeft": (function() { return STYLE.tabManagerBorderLeft; })(),
		"borderBottom": (function() { return STYLE.tabManagerBorderBottom; })(),
		"backgroundColor": (function() { return STYLE.tabManagerBackgroundColor; })()
	},
	"hiddenTabs": {
		"border": (function() { return STYLE.tabManagerBorder; })(),
		"backgroundColor": (function() { return STYLE.tabManagerBackgroundColor; })(),
		"boxShadow": (function() { return STYLE.tabManagerBoxShadow; })()
	},
	"tab:hover": {
		"backgroundColor": (function() { return STYLE.tabManagerBackgroundColor; })()
	},
	"virtual-tab": {
		"color": (function() { return STYLE.tabManagerColor; })()
	},
	"ghost-tab": {
		"borderLeft": (function() { return STYLE.tabManagerBorderLeft; })(),
		"borderRight": (function() { return STYLE.tabManagerBorderRight; })(),
		"borderTop": (function() { return STYLE.tabManagerBorderTop; })(),
		"borderBottom": (function() { return STYLE.tabManagerBorderBottom; })(),
		"backgroundColor": (function() { return STYLE.tabManagerBackgroundColor; })(),
		"color": (function() { return STYLE.tabManagerColor; })()
	}
},
		
		mobile:
		{
	"multi-tag": {},
	"tabManager": {
		"backgroundColor": (function() { return STYLE.tabManagerBackgroundColor; })()
	},
	"tabs": {
		"borderBottom": (function() { return STYLE.tabManagerBorderBottom; })(),
		"backgroundColor": (function() { return STYLE.tabManagerBackgroundColor; })()
	},
	"tab": {
		"borderRight": (function() { return STYLE.tabManagerBorderRight; })(),
		"borderTop": (function() { return STYLE.tabManagerBorderTop; })(),
		"borderBottom": (function() { return STYLE.tabManagerBorderBottom; })(),
		"backgroundColor": (function() { return STYLE.tabManagerBackgroundColor; })(),
		"backgroundImage": (function() { return STYLE.tabManagerBackgroundImage; })(),
		"color": (function() { return STYLE.tabManagerColor; })()
	},
	"unselectMargin": {
		"backgroundColor": (function() { return STYLE.tabManagerBackgroundColor; })(),
		"borderTop": (function() { return STYLE.tabManagerBorderTop; })()
	},
	"selected": {
		"backgroundColor": (function() { return STYLE.tabManagerBackgroundColor; })(),
		"backgroundImage": (function() { return STYLE.tabManagerBackgroundImage; })(),
		"borderLeft": (function() { return STYLE.tabManagerBorderLeft; })(),
		"borderBottom": (function() { return STYLE.tabManagerBorderBottom; })(),
		"color": (function() { return STYLE.tabManagerColor; })()
	},
	"openHiddenTabs": {
		"borderLeft": (function() { return STYLE.tabManagerBorderLeft; })(),
		"borderBottom": (function() { return STYLE.tabManagerBorderBottom; })(),
		"backgroundColor": (function() { return STYLE.tabManagerBackgroundColor; })()
	},
	"hiddenTabs": {
		"border": (function() { return STYLE.tabManagerBorder; })(),
		"backgroundColor": (function() { return STYLE.tabManagerBackgroundColor; })(),
		"boxShadow": (function() { return STYLE.tabManagerBoxShadow; })()
	},
	"tab:hover": {
		"backgroundColor": (function() { return STYLE.tabManagerBackgroundColor; })()
	},
	"virtual-tab": {
		"color": (function() { return STYLE.tabManagerColor; })()
	},
	"virtual-tab-border": {
		"backgroundColor": (function() { return STYLE.tabManagerBackgroundColor; })(),
		"border": (function() { return STYLE.tabManagerBorder; })()
	},
	"ghost-tab": {
		"borderLeft": (function() { return STYLE.tabManagerBorderLeft; })(),
		"borderRight": (function() { return STYLE.tabManagerBorderRight; })(),
		"borderTop": (function() { return STYLE.tabManagerBorderTop; })(),
		"borderBottom": (function() { return STYLE.tabManagerBorderBottom; })(),
		"backgroundColor": (function() { return STYLE.tabManagerBackgroundColor; })(),
		"color": (function() { return STYLE.tabManagerColor; })()
	}
},
	};
});

component.applyConfigStyle();
	//*/

	// Contenu
	
	var tabList = [];
	var tabListHistory = [];
	var content = null;
	var selected = null;
	
	// Paramètres
	
	var hiddenTabsDisplayed = false;
	
	//////////////
	// Méthodes //
	//////////////
	
	this.unselectAll = function()
	{
		for (var i = 0; i < tabList.length; i++)
			tabList[tabList.length-1-i].unselect();
		
		updateZindex();
	};
	
	//// Supprimer le style de survole à tout les enfants ////
	
	this.dragOutAll = function()
	{
		component.removeClass('drag-over');
		tabList.forEach(function($tab) { $tab.dragOut(); });
	};
	
	this.addTab = function($tab)
	{
		var index = tabList.indexOf($tab);
		
		if (index < 0)
		{
			tabList.push($tab);
			component.getById('tabs').appendChild($tab);
			$tab.setParent($this);
		}
		
		$tab.setEditMode(editMode);
		$tab.onDrag = function($x, $y) { return onDragTab($x, $y, $tab); };
		$tab.onRelease = function($tab2, $index) { return onRelease($tab2, $index); };
		$tab.select();
		$this.updateTabs();
	};
	
	this.insertTabInto = function($tab, $index)
	{
		var index = tabList.indexOf($tab);
		
		if (index >= 0)
			tabList.splice(index, 1);
		
		tabList.splice($index, 0, $tab);
		component.getById('tabs').insertAt($tab, $index);
		$tab.setParent($this);
		$tab.setEditMode(editMode);
		$tab.onDrag = function($x, $y) { return onDragTab($x, $y, $tab); };
		$tab.onRelease = function($tab2, $index) { return onRelease($tab2, $index); };
		$tab.select();
		$this.updateTabs();
	};
	
	this.removeTab = function($tab)
	{
		$tab.unselect();
		
		var index = tabList.indexOf($tab);
		
		if (index >= 0)
		{
			tabList.splice(index, 1);
			
			if (utils.isset($tab.parentNode))
				$tab.parentNode.removeChild($tab);
			
			if (content === $tab.getContent())
				component.getById('content').removeAllChildren();
			
			if ($tab === selected && tabList.length > 0)
			{
				if (index > 0)
					tabList[index-1].select();
				else
					tabList[0].select();
			}
		}
		
		$this.removeFromHistory($tab);
		
		$this.updateTabs();
	};
	
	this.removeAllTab = function()
	{
		$this.unselectAll();
		tabList = [];
		tabListHistory = [];
		content = null;
		component.getById('tabs').removeAllChildren();
		hiddenTabs.removeAllChildren();
		component.getById('content').removeAllChildren();
		
		$this.updateTabs();
	};

	this.selectFirst = function()
	{
		if (tabList[0])
			tabList[0].select();
	};
	
	this.addToHistory = function($tab)
	{
		var index = tabListHistory.indexOf($tab);
		
		if (index >= 0)
			tabListHistory.splice(index, 1);
		
		tabListHistory.push($tab);
	};
	
	this.removeFromHistory = function($tab)
	{
		var index = tabListHistory.indexOf($tab);
		
		if (index >= 0)
			tabListHistory.splice(index, 1);
	};
	
	this.appendContent = function($content)
	{
		content = $content;
		component.getById('content').removeAllChildren();
		component.getById('content').appendChild($content);
		
		if (content && content.onResize)
			content.onResize();
	};
	
	var updateZindex = function()
	{
		var displayed = component.getById('tabs').childNodes;
		
		for (var i = 0; i < displayed.length; i++)
			displayed[displayed.length-1-i].style.zIndex = i;
	};
	
	this.updateTabs = function()
	{
		component.getById('tabs').removeAllChildren();
		hiddenTabs.removeAllChildren();
		component.getById('openHiddenTabs').style.display = 'block';
		
		var tabsBlockWidth = component.getById('tabs').offsetWidth - component.getById('openHiddenTabs').offsetWidth;
		
		component.getById('tabs').appendChildren(tabList);
		
		var totalTabsWidth = tabList.reduce(function($size, $tab) { return $size + $tab.offsetWidth; }, 0);
		
		if (totalTabsWidth > tabsBlockWidth)
		{
			var rebuildWidth = 0;
			var displayed = [];
			var hidden = [];
			
			for (var i = tabListHistory.length-1; i >= 0; i--)
			{
				rebuildWidth = rebuildWidth + tabListHistory[i].offsetWidth;
				
				if (rebuildWidth >= tabsBlockWidth)
					hidden.push(tabListHistory[i]);
				else
					displayed.push(tabListHistory[i]);
			}
			
			component.getById('tabs').removeAllChildren();
			
			for (var i = displayed.length-1; i >= 0; i--)
				component.getById('tabs').appendChild(displayed[i]);
			
			hiddenTabs.appendChildren(hidden);
			
			component.getById('hiddenTabsCount').innerHTML = hidden.length;
		}
		else
			component.getById('openHiddenTabs').style.display = 'none';
		
		updateZindex();
	};
	
	var resize = function()
	{
		var componentPosition = component.getById('openHiddenTabs').position();
		var componentWidth = component.getById('openHiddenTabs').offsetWidth;
		var panelWidth = hiddenTabs.offsetWidth;
		var panelHeight = hiddenTabs.offsetHeight;
		var panelPosition = hiddenTabs.position();
		var right = Screen.width - componentPosition.x - component.getById('openHiddenTabs').offsetWidth;
		
		invisibleFreezeScreen.resize(component.getById('tabs'));
		
		hiddenTabs.style.zIndex = "10000000000";
		hiddenTabs.style.minWidth = component.getById('openHiddenTabs').offsetWidth + "px";
		hiddenTabs.style.right = right + 'px';
		hiddenTabs.style.top = (componentPosition.y+component.getById('openHiddenTabs').offsetHeight) + 'px';
		
		if (panelHeight > Screen.getHeight())
		{
			hiddenTabs.style.height = (Screen.getHeight()-20) + "px";
			hiddenTabs.style.top = "7px";
			hiddenTabs.style.overflow = "auto";
		}
		else if (componentPosition.y + component.getById('openHiddenTabs').offsetHeight + panelHeight > Screen.getHeight())
			hiddenTabs.style.top = (componentPosition.y-panelHeight) + "px";
	};
	
	this.autoResize = function()
	{
		
		var width = $this.offsetWidth;
		
		if (width <= 0)
			setTimeout(function() { $this.autoResize(); }, 20);
		else
			$this.onResize();
	};
	
	this.displayHiddenTabs = function()
	{
		invisibleFreezeScreen.display(component.getById('tabs'));
		document.getElementById('main').appendChild(invisibleFreezeScreen);
		hiddenTabs.style.display = "block";
		document.getElementById('main').appendChild(hiddenTabs);
		
		resize();
		
		hiddenTabsDisplayed = true;
	};
	
	this.hideHiddenTabs = function()
	{
		invisibleFreezeScreen.hide();
		hiddenTabs.style.display = "none";
		
		if (hiddenTabs.parentNode)
			hiddenTabs.parentNode.removeChild(hiddenTabs);
		
		hiddenTabsDisplayed = false;
	};
	
	var onDragTab = function($x, $y, $tab)
	{
		var overLayer = null;
		
		$this.dragOutAll();

		tabList.every(function($t)
		{
			if ($t !== $tab)
			{
				overLayer = $t.getOverLayer($x, $y, $tab);
				
				if (overLayer)
					return false;
			}

			return true;
		});
		
		if (!overLayer)
			overLayer = $this.getById('tabs');
		
		return overLayer;
	};
	
	var onRelease = function($tab, $index) { $this.insertTabInto($tab, $index); };
	
	///////////////////////////////////
	// Initialisation des événements //
	///////////////////////////////////
	
	component.getById('openHiddenTabs').onClick = function()
	{
		if (hiddenTabsDisplayed === false)
			$this.displayHiddenTabs();
		else
			$this.hideHiddenTabs();
	};
	
	invisibleFreezeScreen.onClick = function() { $this.hideHiddenTabs(); };
	component.getById('tabs').onClick = function() { $this.hideHiddenTabs(); };
	
	this.onResize = function()
	{
		$this.updateTabs();
		
		if (hiddenTabsDisplayed === true)
			resize();

		if (selected && selected.getContent().onResize)
			selected.getContent().onResize();
	};

	this.onKeyDown = function($event)
	{
		tabList.forEach(function($tab) { $tab.onKeyDown($event); });
		
		if (selected)
			selected.getContent().onKeyDown($event);
	};
	
	this.onKeyUp = function($event)
	{
		tabList.forEach(function($tab) { $tab.onKeyUp($event); });
		
		if (selected)
			selected.getContent().onKeyUp($event);
	};
	
	////////////////
	// Accesseurs //
	////////////////
	
	// GET
	
	this.isEditMode = function() { return editMode; };
	this.getTabList = function() { return tabList; };
	this.getContent = function() { return content; };
	this.getSelected = function() { return selected };
	this.getHiddenTabs = function() { return hiddenTabs; };
	
	// SET
	
	this.setEditMode = function($editMode)
	{ 
		editMode = $editMode;
		
		if (editMode === true)
		{
			component.getById('tabs').addClass('editMode');
			hiddenTabs.addClass('editMode');
		}
		else
		{
			component.getById('tabs').removeClass('editMode');
			hiddenTabs.removeClass('editMode');
		}
	};
	
	this.setSelected = function($selected){ selected = $selected; };
	
	//////////////
	// Héritage //
	//////////////
	
	var $this = utils.extend(component, this);
	setTimeout(function() { $this.autoResize(); }, 20);
	return $this; 
}