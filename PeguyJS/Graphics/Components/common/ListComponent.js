function ListComponent($html)
{
	////////////////
	// Attributes //
	////////////////

	var list = [];

	var component = new Component($html);
	var node = component;

	/*
{{INSERT CODE}}
	//*/

	/////////////
	// Methods //
	/////////////

	//// Gestion du contenu de la liste ////

	this.addToList = function($element, $noOnChange)
	{
		if (Array.isArray($element))
		{
			var elementsToAdd = [];

			for (var i = 0; i < $element.length; i++)
			{
				if (!list.includes($element[i]) && !elementsToAdd.includes($element[i]))
				{
					$this.initElementEvents($element[i]);
					if ($element[i].setParent) { $element[i].setParent($this); }
					elementsToAdd.push($element[i]);
				}
			}

			list = list.concat(elementsToAdd);

			if (node)
				node.appendChildren(elementsToAdd);
		}
		else
		{
			var index = list.indexOf($element);
		
			if (!list.includes($element))
			{
				list.push($element);

				if (node)
					node.appendChild($element);

				$this.initElementEvents($element);

				if ($element.setParent)
					$element.setParent($this);
			}
		}

		if (!$noOnChange)
			$this.onChange($element);

		return list;
	};

	var insertOneIntoListAt = function($element, $index)
	{
		var offsetIndex = $index;
		var index = list.indexOf($element);
		
		if (index >= 0)
		{
			if (index <= offsetIndex)
				offsetIndex--;

			list.splice(index, 1);
		}
		
		list.splice(offsetIndex, 0, $element);
		$this.initElementEvents($element);
			
		if ($element.setParent)
			$element.setParent($this);

		return offsetIndex;
	};

	this.insertIntoListAt = function($element, $index, $noOnChange)
	{
		var offsetIndex = $index;

		if (Array.isArray($element))
		{
			for (var i = 0; i < $element.length; i++)
			{
				offsetIndex = insertOneIntoListAt($element[i], offsetIndex);
				offsetIndex++;
			}

			if (node)
				node.insertChildrenAt($element, $index);
		}
		else
		{
			insertOneIntoListAt($element, $index);

			if (node)
				node.insertAt($element, $index);
		}

		if (!$noOnChange)
			$this.onChange($element);

		return list;
	};

	var removeFromList = function($element)
	{
		var index = list.indexOf($element);
		
		if (index >= 0)
		{
			if ($element.setParent) { $element.setParent(null); }
			list.splice(index, 1);
			$element.remove();
			$this.removeElementEvents($element);
		}
	};

	this.removeFromList = function($element)
	{
		if (Array.isArray($element))
		{
			for (var i = 0; i < $element.length; i++)
				removeFromList($element[i]);
		}
		else
			removeFromList($element);

		$this.onChange($element);

		return list;
	};

	this.removeAllFromList = function()
	{
		for (var i = 0; i < list.length; i++)
		{
			$this.removeElementEvents(list[i]);
			if (list[i].setParent) { list[i].setParent(null); }
		}

		list = [];

		if (node)
			node.innerHTML = '';

		$this.onChange(null);
		return list;
	};

	this.testSort = function($elementI, $elementJ) { return false; };

	this.sortList = function()
	{
		// A optimier avec la méthode sort
		for (var i = 0; i < list.length; i++)
		{
			for (j = i; j < list.length; j++)
			{
				if ($this.testSort(list[i], list[j]))
				{
					var tmp = list[j];
					list[j] = list[i];
					list[i] = tmp;
				}
			}
		}
		
		list.forEach(function($element) { node.appendChild($element); });
	};

	//// Exécuter des opérations sur chaque élément de la liste ////

	this.execAll = function($methods, $params, $callback)
	{
		for (var i = 0; i < list.length; i++)
		{
			for (var j = 0; j < $methods.length; j++)
			{
				if (list[i][$methods[j]])
				{
					var result = list[i][$methods[j]].apply(null, $params);

					if ($callback)
						$callback(result, list[i]);
				}
			}
		}
	};

	this.execAllEvents = function($methods, $event, $callback)
	{
		for (var i = 0; i < list.length; i++)
		{
			for (var j = 0; j < $methods.length; j++)
			{
				if (list[i][$methods[j]])
				{
					var result = list[i][$methods[j]]($event);

					if ($callback)
						$callback(result, list[i]);
				}
			}
		}
	};

	this.testAll = function($method, $params, $callback)
	{
		for (var i = 0; i < list.length; i++)
		{
			if (list[i][$method])
			{
				var result = list[i][$method].apply(null, $params);

				if ($callback)
				{
					var test = $callback(result, list[i]);

					if (test)
						return test;
				}
			}
		}

		return false;
	};

	/////////////////
	// Init events //
	/////////////////

	this.initElementEvents = function($element) {};
	this.removeElementEvents = function($element) {};
	this.onChange = function($element) {};

	///////////////////////
	// Getters & Setters //
	///////////////////////

	// GET

	this.getList = function() { return list; };

	this.getElementJSON = function($element)
	{
		if ($element.getJSON)
			return $element.getJSON();

		return $element;
	};

	this.getJSON = function() { return list.map(function($element) { return $this.getElementJSON($element); }); };

	// SET

	this.setList = function($list) { list = $list; };
	this.setNode = function($node) { node = $node; };
	this.loadElementFromJSON = function($element) { return $element; };

	this.loadFromJSON = function($json)
	{
		$this.removeAllFromList();
		this.addToList($json.map(function($element) { return $this.loadElementFromJSON($element); }));
	};

	////////////
	// Extend //
	////////////

	var $this = utils.extend(component, this);
	return $this;
}