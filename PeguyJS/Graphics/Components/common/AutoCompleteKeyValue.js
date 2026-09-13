function AutoCompleteKeyValue($list)
{
	///////////////
	// Attributs //
	///////////////
	
	var selectedKey = "";
	
	var autoComplete = new AutoComplete($list);

	//////////////
	// Méthodes //
	//////////////
	
	this.onSelect = function($index)
	{
		var list = this.getList();
		var row = list[$index];
		selectedKey = row.key;
		$this.onChange(selectedKey);
	};
	
	this.selectByKey = function($key)
	{
		for (var i = 0; i < this.getList().length; i++)
		{
			if ($key === this.getList()[i].key)
			{
				$this.select(i);
				i = this.getList().length;
			}
		}
	};

	this.createLineData = function($line, $index)
	{
		if ($line.value === $this.getValue())
			$this.setDisplayIndex($index);
		
		return { index: $index, key: $line.key, value: $line.value };
	};
	
	this.matchLine = function($input, $line)
	{
		var match = false;
		
		var regex = RegExp($input.removeAccents().toLowerCase());
		
		if ($input === "" 
			|| regex.test(dataManager.encodeHTMLEntities($line.key).removeAccents().toLowerCase())
			|| regex.test(dataManager.encodeHTMLEntities($line.value).removeAccents().toLowerCase()))
		{
			match = true;
		}
		
		return match;
	};
	
	this.createDisplayedLine = function($line, $displayIndex)
	{
		return '<tr index="' + $line.index + '" id="' + $displayIndex + '" displayNum="' + $displayIndex + '" key="' + $line.key + '" value="' + $line.value + '" >' 
					+ '<td>' + dataManager.encodeHTMLEntities($line.value) + '</td>' 
				+ '</tr>';
	};
	
	autoComplete.onClose = function() { selectedKey = ""; };
	
	////////////////
	// Accesseurs //
	////////////////
	
	// GET
	
	this.getKey = function() { return selectedKey; };

	// SET

	this.setKey = function($key) { selectedKey = $key; };
	
	//////////////
	// Héritage //
	//////////////
	
	var $this = utils.extend(autoComplete, this);
	return $this; 
}