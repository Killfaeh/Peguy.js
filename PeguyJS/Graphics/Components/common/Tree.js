function Tree($ordered)
{
	///////////////
	// Attributs //
	///////////////
	
	this.isTree = true;
	
	var ordered = ($ordered === "true" || $ordered === true) ? true : false;
	var editMode = false;
	var selectedElement = null;
	
	var html = '<ul id="tree" class="tree" ><div class="mask" ></div></ul>';
	
	if (ordered === true)
		html = '<ol id="tree" class="tree" ><div class="mask" ></div></ol>';

	var component = new ListComponent(html);

	/*
// Style

component.addConfigStyle("tree", function ()
{
	return {
		common:
		{},
		
		classic:
		{
	"multi-tag": {
		".tree .virtual-item div": [
			"background-Color: (function() { return STYLE.treeBackgroundColor; })(),
			"border: (function() { return STYLE.treeBorder; })()
		]
	},
	"element-label:hover": {
		"backgroundColor": (function() { return STYLE.treeBackgroundColor; })()
	},
	"element-label": {
		"border": (function() { return STYLE.treeBorder; })()
	},
	"arrow": {
		"color": (function() { return STYLE.treeColor; })()
	},
	"virtual-item": {
		"color": (function() { return STYLE.treeColor; })()
	},
	"ghost-item": {
		"border": (function() { return STYLE.treeBorder; })(),
		"backgroundColor": (function() { return STYLE.treeBackgroundColor; })(),
		"color": (function() { return STYLE.treeColor; })()
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
	
	//// Désélectionner tout ////

	var deselectAll = function()
	{
		component.execAll([ 'deselectAll', 'deselect' ]);
		selectedElement = null;
	};
	
	this.deselectAll = function() { deselectAll(); };
	
	//// Supprimer le style de survole à tout les enfants ////
	
	this.dragOutAll = function()
	{
		component.removeClass('drag-over');
		component.execAll([ 'dragOutAll', 'dragOut' ]);
	};
	
	//// Ajouter un élément ////
	
	this.addElement = function($element)
	{
		// Si un élément est déjà sélectionné on ajoute le nouvel élément à celui déjà sélectionné
		if (selectedElement)
		{
			// Si l'élément sélectionné est une brache, on lui ajoute le nouvel élément
			if (selectedElement.addElement)
			{
				selectedElement.addElement($element);
				$element.setParentBranch(selectedElement);
			}
			// Sinon on l'ajoute au parent
			else
			{
				var parentBranch = selectedElement.getParentBranch();

				if (parentBranch === $this)
				{
					$this.addToList($element);

					if (Array.isArray($element))
						$element.forEach(function($el) { $el.setParentBranch($this); });
					else
						$element.setParentBranch($this);
				}
				else
				{
					parentBranch.addElement($element);

					if (Array.isArray($element))
						$element.forEach(function($el) { $el.setParentBranch($this); });
					else
						$element.setParentBranch($this);
				}
			}
		}
		// Sinon on l'ajoute à la racine
		else
		{
			$this.addToList($element);

			if (Array.isArray($element))
				$element.forEach(function($el) { $el.setParentBranch($this); });
			else
				$element.setParentBranch($this);
		}

		if (Array.isArray($element))
			$element.forEach(function($el) { initElementEvents($el); });
		else
			initElementEvents($element);
	};
	
	//// Supprimer un élément ////

	this.removeElement = function($element)
	{
		var index = component.getList().indexOf($element);
		
		if (index < 0)
			component.execAll([ 'removeElement' ], [$element]);

		while (index >= 0)
		{
			component.getList().splice(index, 1);
			index = component.getList().indexOf($element);
		}
		
		var parent = $element.parentNode;
		
		if (parent === component.getById('tree'))
			component.getById('tree').removeChild($element);
		
		return $element;
	};
	
	//// Supprimer tous les éléments ////

	this.empty = function() { return $this.removeAllFromList(); };

	//// Supprimer tous les éléments d'une branche ////
	
	this.emptyBranch = function($branch)
	{
		$branch.empty();
		onChange();
	};
	
	//// Ouvrir tous les éléments ////
	
	this.openAll = function() { component.execAll([ 'openAll' ]); };
	
	//// Fermer tous les éléments ////
	
	this.closeAll = function() { component.execAll([ 'closeAll' ]); };

	this.refresh = function()
	{
		$this.onRefresh($this);
		component.execAll([ 'refresh' ]);
	};

	///////////////////////////////////
	// Initialisation des événements //
	///////////////////////////////////

	var initElementEvents = function($element)
	{
		// Quand l'élément est sélectionné

		$element.onSelect = function($selectedElement)
		{
			deselectAll();
			selectedElement = $selectedElement;
			$this.onSelect(selectedElement);

			return true;
		};
		
		//$element.onChange = function($element2) { onChange($element2); };
		
		// Quand l'élément est déplacé
		// On vérifie si on passe au dessus d'un autre élément et si oui on déclenche la fonction de survole
		
		$element.onDrag = function($x, $y)
		{
			var overLayer = null;
			
			if (editMode === true)
			{
				$this.dragOutAll();
				overLayer = component.testAll('getOverLayer', [$x, $y, $element], function($overLayer) { return $overLayer; });
				
				if (!overLayer)
					overLayer = $this;
			}
		
			return overLayer;
		};
		
		// Quand l'élément est lâché après un déplacement
		
		$element.onRelease = function($element2, $index, $oldIndex)
		{
			if (editMode === true)
			{
				var oldParentBranch = $element2.getParentBranch();
				var newParentBranch = $element2.getParentNode().parentNode;
				
				if (newParentBranch.tagName.toLowerCase() !== 'li')
					newParentBranch = $this;
				
				var moved = $this.onRelease($element2, oldParentBranch, newParentBranch);

				console.log(moved);

				if (moved === true)
				{
					// Retirer l'élément déplacé de l'ancien parent
					
					if (oldParentBranch.setParentBranch)
						oldParentBranch.removeElement($element2);
					else
						$this.removeElement($element2);
					
					// Ajouter l'élément déplacé au nouveau parent
					
					if (newParentBranch.insertElementInto)
						newParentBranch.insertElementInto($element2, $index);
					else
					{
						component.getList().splice($index-1, 0, $element2);
						$this.insertAt($element2, $index);
					}
					
					$element2.setParentBranch(newParentBranch);
					
					$this.dragOutAll();
					
					onChange($element2);
				}
				// Si quelque chose interdit le déplacement, on remet l'élément à sa place
				else
				{
					if (oldParentBranch.setParentBranch)
						oldParentBranch.removeElement($element2);
					else
						$this.removeElement($element2);

					if (oldParentBranch.insertElementInto)
						oldParentBranch.insertElementInto($element2, $oldIndex);
					else
					{
						component.getList().splice($oldIndex-1, 0, $element2);
						$this.insertAt($element2, $oldIndex);
					}
					
					$element2.setParentBranch(oldParentBranch);

					$this.dragOutAll();
				}
			}
		};
		
		$element.onChange = function($data) { onChange($data); };
		$element.setEditMode(editMode);
		$element.select();
		onChange();
	};

	var removeElementEvents = function($element)
	{
		$element.onSelect = function() {};
		$element.onDrag = function() {};
		$element.onRelease = function() {};
		$element.onChange = function() {};
	};

	this.initElementEvents = function($element) { initElementEvents($element); };
	this.removeElementEvents = function($element) { removeElementEvents($element); };
	
	this.onSelect = function($data) {};
	this.onRelease = function($element, $oldParent, $newParent) { return true; };
	this.onChange = function($data) {};
	var onChange = function($data) { $this.onChange($data); };
	this.onRefresh = function($element) {};
	
	this.onClick = function() { deselectAll(); };
	this.onKeyUp = function($event) { component.execAllEvents([ 'onKeyUp' ], $event); };
	
	////////////////
	// Accesseurs //
	////////////////

	// GET

	this.getBranches = function() { return component.getList(); };
	this.getElementsList = this.getBranches;
    this.getSelectedElement = function() { return selectedElement; };

	this.getJSON = function()
	{
		var jsonData = { "type": "tree", "ordered": ordered, "elementsList": [] };
		jsonData.elementsList = component.getList().map(function($element) { return $element.getJSON(); });
		return jsonData;
	};

	// SET
	
	this.setEditMode = function($editMode)
	{
		editMode = $editMode;
		
		if (editMode === true)
			$this.addClass('edit-mode');
		else
			$this.removeClass('edit-mode');
		
		component.execAll([ 'setEditMode' ], [editMode]);
	};

	this.loadFromJSON = function($json, $callback)
	{
		ordered = $json.ordered;

		$this.addElement($json.elementsList.map(function($element)
		{
			var item = new TreeLeaf($element.label);

			if ($callback)
				item = $callback($element);
			else if ($element.type === "branch")
				item = new TreeBranch($element.label, ordered);

			item.loadFromJSON($element, $callback);
			$this.deselectAll();
			return item;
		}));
	};

	//////////////
	// Héritage //
	//////////////

	var $this = utils.extend(component, this);
	return $this; 
}