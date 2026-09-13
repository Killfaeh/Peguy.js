function AutoComplete($list)
{
	///////////////
	// Attributs //
	///////////////
	
	var value = null;
	var selectedIndex = null;
	var list = $list ? $list : [];
	
	var displayIndex = null;
	var displayedLines = [];
	
	var enable = true;
	var open = false;
	
	var enlighted = null;
	var searchDate = new Date();
	
	var emptyMessage = '';
	
	var html = '<div class="autoComplete" >'
					+ '<p class="selectedBlock" >'
						+ '<input type="text" id="selectedElement" name="selectedElement" autocomplete="off" />'
						+ '<div id="truncate" class="truncate"></div>'
					+ '</p>'
				+ '</div>';
				
	var component = new Component(html);
	
	var selectedElement = component.getById('selectedElement');
	
	var invisibleFreezeScreen = new InvisibleFreezeScreen();
	
	var panel = new FloatingPanel('<table id="list" ></table>');
	panel.addClass('autoCompletePanel');
	
	var listTable = panel.getById('list');
	
	
	// Style

	component.addConfigStyle("autoComplete", function ()
	{
	    return {
	        classic:
	        {
				"multi-tag":
	        	{
					".autoCompletePanel .selected":
	        		[
						"background-color: " + (function() { return STYLE.autoCompleteSeletedBackgroundColor; })(),
	        		],
					
					".autoCompletePanel tr:hover":
	        		[
						"background-color: " + (function() { return STYLE.autoCompleteSeletedBackgroundColor; })(),
	        		]
				},
	        	
				"truncate":
	        	{
					"backgroundImage": (function() { return STYLE.autoCompleteTruncateMask; })()
				},
			},
	        
	    };
	});

	component.applyConfigStyle();

	
	//////////////
	// Méthodes //
	//////////////
	
	//// Ouverture Fermeture ////
	
	this.open = function()
	{
		if (enable)
		{
			$this.buildInterface(selectedElement.value);
			$this.onOpen();
			invisibleFreezeScreen.display($this);
			panel.display();
			resize();
			open = true;
		}
	};
	
	this.close = function()
	{
		$this.onClose();
		$this.truncateSelectedValue();
		invisibleFreezeScreen.hide();
		panel.hide();
		open = false;
	};
	
	var toggle = function()
	{
		if (open)
			$this.close();
		else
			$this.open();
	};
			
	//// Dimensions ////
	
	this.truncateSelectedValue = function()
	{
		var textSize = utils.getInputTextSize(selectedElement);
		
		if (textSize.width > selectedElement.offsetWidth-15)
			component.getById('truncate').style.display = 'block';
		else
			component.getById('truncate').style.display = 'none';
	};
	
	var resize = function()
	{
		var componentPosition = selectedElement.position();
		var componentWidth = selectedElement.offsetWidth;
		var panelWidth = panel.offsetWidth;
		var panelHeight = panel.offsetHeight;
		var panelPosition = panel.position();
		
		invisibleFreezeScreen.resize(selectedElement);
		
		panel.style.minWidth = componentWidth + 'px';
		listTable.style.minWidth = componentWidth + 'px';
		panel.style.left = componentPosition.x + 'px';
		//panel.style.left = (componentPosition.x + componentWidth/2 - panelWidth/2) + 'px';
		panel.style.top = (componentPosition.y + selectedElement.offsetHeight) + 'px';
		
		if (panelHeight > Screen.getHeight())
		{
			panel.style.left = (componentPosition.x + component.offsetWidth - panelWidth - 27) + 'px';
			panel.style.height = (Screen.getHeight()-20) + "px";
			panel.style.top = "7px";
			panel.style.overflow = "auto";
		}
		else if (componentPosition.y + selectedElement.offsetHeight + panelHeight > Screen.getHeight())
		{
			var delta = componentPosition.y + selectedElement.offsetHeight + panelHeight - Screen.getHeight() - 25;
			panel.style.left = (componentPosition.x + component.offsetWidth - panelWidth - 27) + 'px';
			panel.style.top = (componentPosition.y - delta) + "px";
		}
	};
	
	this.autoResize = function()
	{
		var autoCompleteSize = $this.offsetWidth;
		
		if (autoCompleteSize <= 0)
			requestAnimationFrame(function() { $this.autoResize(); });
		else
			$this.truncateSelectedValue();
	};
		
	//// Construction de la liste affichée ////
	
	this.emptyDisplayedLines = function()
	{
		displayedLines = [];
		listTable.empty();
	};
		
	// À surcharger
	this.createLineData = function($line, $index)
	{
		if ($line === value)
			displayIndex = $index;
		
		return { index: $index, value: $line };
	};
	
	// À surcharger
	this.matchLine = function($input, $line)
	{
		var match = false;
		
		var regex = RegExp($input.removeAccents().toLowerCase());
		
		if ($input === "" || regex.test(dataManager.encodeHTMLEntities($line.value).removeAccents().toLowerCase()))
			match = true;
		
		return match;
	};
	
	// À surcharger
	this.createDisplayedLine = function($line, $displayIndex)
	{
		return '<tr index="' + $line.index + '" id="' + $displayIndex + '" displayNum="' + $displayIndex + '" value="' + $line.value + '" >' 
					+ '<td>' + dataManager.encodeHTMLEntities($line.value) + '</td>'
				+ '</tr>';
	};
		
	this.buildInterface = function($input, $load)
	{
		$this.emptyDisplayedLines();
		displayIndex = null;
		
		list.forEach(function($line, $index)
		{
			var lineData = $this.createLineData($line, $index);
			
			if ($this.matchLine($input, lineData))
				displayedLines.push(lineData);
		});
			
		var listHTML = displayedLines.map(function($line, $index) { return $this.createDisplayedLine($line, $index); }).join('');
		
		listTable.innerHTML = listHTML;
		
		var lineNodes = listTable.getElementsByTagName('tr');
		
		if (lineNodes && lineNodes.length > 0)
		{
			if (enable)
			{
				for (var i = 0; i < lineNodes.length; i++)
				{
					lineNodes[i].onClick = function()
					{
						var rowIndex = this.getAttribute('index');
						
						selectedIndex = rowIndex;
						value = this.getAttribute('value');
						selectedElement.value = value;
						$this.select(rowIndex);
						$this.truncateSelectedValue();
						this.style.backgroundColor = 'none';
					};
				}
				
				$this.enlight(displayIndex);
			}
		}
		else
			listTable.innerHTML = '<tr class="error" ><td>' + dataManager.encodeHTMLEntities(emptyMessage) + '</td></tr>';
	};
	
	//// Surbrillance ////
	
	this.select = function($input)
	{
		this.onSelect($input);
		$this.close();
	};
	
	this.enlight = function($index)
	{
		if (displayedLines.length > 0 && utils.isset($index) && $index >= 0)
		{
			var lines = listTable.getElementsByTagName('tr');
			var line = null;
			
			for (var i = 0; i < lines.length; i++)
			{
				var index = parseInt(lines[i].getAttribute('displayNum'));
				
				if (parseInt($index) === index)
				{
					lines[i].addClass('selected');
					enlighted = index;
					line = lines[i];
				}
				else
					lines[i].removeClass('selected');
			}
			
			if (utils.isset(line))
			{
				var lineTop = parseInt(line.offsetTop);
				var lineHeight = parseInt(line.offsetHeight);
				var panelHeight = parseInt(panel.offsetHeight);
				var panelScroll = parseInt(panel.scrollTop);
				
				if (lineTop + lineHeight > panelScroll + panelHeight)
					panelScroll = lineTop - panelHeight + lineHeight;
				else if (lineTop < panelScroll)
					panelScroll = lineTop;
				
				if (utils.isset(panel.scrollTo))
					panel.scrollTo(0, panelScroll);
				else
					panel.scrollTop = panelScroll;
			}
		}
	};

	///////////////////////////////////
	// Initialisation des événements //
	///////////////////////////////////
	
	this.onChange = function($value) {};
	this.onSelect = function() { $this.onChange(value); };
	this.onOpen = function() {};
	this.onClose = function() {};
	
	component.onClick = function() { toggle(); };
	selectedElement.onClick = function() { toggle(); };
	invisibleFreezeScreen.onClick = function() { $this.close(); };

	this.onTyping = function($value) {};

	var rerouteKeyCode = [13, 38, 40];

	selectedElement.addEvent('keydown', function($event)
	{
		if (rerouteKeyCode.includes($event.keyCode))
		{
			Events.preventDefault($event);
			onKeyDown($event);
		}
	});
	
	selectedElement.addEvent('keyup', function($event)
	{

		if (rerouteKeyCode.includes($event.keyCode))
			Events.preventDefault($event);

		if (enable === true)
		{
			Events.onTipText($event, function()
			{
				searchDate = new Date();
				//$this.buildInterface(selectedElement.value);
				$this.open();
				$this.onTyping(selectedElement.value);
			});
		}
	});
	
	var onKeyDown = function($event)
	{
		if (open)
		{
			if ($event.keyCode === 13)
			{
				var row = displayedLines[enlighted];
				value = row.value;
				selectedElement.value = value;
				$this.select(row.index);
			}
			else if ($event.keyCode === 38)
			{
				if (enlighted !== null)
				{
					enlighted--;

					if (enlighted < 0)
						enlighted = displayedLines.length-1;
				}
				else
					enlighted = displayedLines.length-1;

				$this.enlight(enlighted);
			}
			else if ($event.keyCode === 40)
			{
				if (enlighted !== null)
				{
					enlighted++;

					if (enlighted >= displayedLines.length)
						enlighted = 0;
				}
				else
					enlighted = 0;

				$this.enlight(enlighted);
			}
		}
	};
	
	panel.onKeyDown = onKeyDown;
	panel.onClick = function() {};
	
	this.onResize = function()
	{
		$this.truncateSelectedValue();
		
		if (open)
			resize();
	};
	
	////////////////
	// Accesseurs //
	////////////////

	// GET
	
	this.getValue = function() { return selectedElement.value; };
	this.getDisplayedIndex = function() { return displayIndex; };
	this.getList = function() { return list; };
	this.isEnable = function() { return enable; };
	this.isOpen = function() { return open; };
	this.getEmptyMessage = function() { return emptyMessage; };
	
	// SET
	
	this.setValue = function ($value)
	{
		var value = $value;
		selectedElement.value = $value;
		$this.truncateSelectedValue();
		$this.buildInterface($value);
	};
	
	this.setDisplayIndex = function($index) { displayIndex = $index; };
	
	this.setPlaceholder = function($placeholder) { selectedElement.setAttribute('placeholder', $placeholder); };
	this.setList = function($list) { list = $list; };
	
	this.setEnable = function($enable)
	{
		enable = $enable;

		if (enable === true)
			selectedElement.removeAttribute('disabled');
		else
			selectedElement.setAttribute('disabled', true);
	};
	
	this.setEmptyMessage = function($emptyMessage) { emptyMessage = $emptyMessage; };
	
	//////////////
	// Héritage //
	//////////////
	
	var $this = utils.extend(component, this);
	requestAnimationFrame(function() { $this.autoResize(); });
	return $this; 
}