function ComboBox($name, $options, $currentValue, $freeOption)
{
	///////////////
	// Attributs //
	///////////////

	var name = $name ? $name : '';
	var options = $options ? $options : [];
	var currentValue = $currentValue ? $currentValue : '';
	var currentIndex = 0;
	var freeOption = $freeOption ? true : false;
	
	if (freeOption === true)
		options.push({ name: KEYWORDS.otherChoice, value: '{{[[*]]}}', color: null });
	
	var enable = true;
	var open = false;
	var enlighted = null;

	var html = '<div class="select" >'
					+ '<div>'
						+ '<input type="text" id="selected" class="selected" readonly="readonly" />'
						+ '<span id="icon" class="icon" >'
							+ '<Icon id="openIcon" fileName="icons" name="sort-icon" width="17" height="17" ></Icon>'
							+ '<div class="wall" ></div>'
						+ '</span>'
					+ '</div>'
				+ '</div>';

	var component = new Component(html);

	var selectInput = component.getById('selected');
	selectInput.setAttribute('readonly', 'readonly');
	
	var icon = component.getById('openIcon');
	icon.style.width = '17px';
	
	var panel = new FloatingPanel('<ul id="list" ></ul>');
	panel.addClass('selectPanel');
	
	// Style

	component.addConfigStyle("comboBox", function ()
	{
	    return {
	        
	        classic:
	        {
				"multi-tag":
	        	{
					'.color-icon': 
					[
						'border: ' + (function() { return STYLE.comboBoxBorder; })()
					],
					
					".selectPanel .selected":
	        		[
						"background-color: " + (function() { return STYLE.comboBoxSeletedBackgroundColor; })(),
	        		],
					
					".selectPanel il:hover":
	        		[
						"background-color: " + (function() { return STYLE.comboBoxSeletedBackgroundColor; })(),
	        		]
				},
				
				/*
				"selected":
				{
					"backgroundColor": (function() { return STYLE.comboBoxBackgroundColor; })()
				},
					//*/
			},
	        
	        mobile:
	        {
				"displayedOption":
	        	{
					"backgroundColor": (function() { return STYLE.comboBoxBackgroundColor; })()
				}
			},
	    };
	});

	component.applyConfigStyle();

	var list = panel.getById('list');

	var invisibleFreezeScreen = new InvisibleFreezeScreen();

	//////////////
	// Méthodes //
	//////////////
	
	//// Ouverture Fermeture ////
	
	this.open = function()
	{
		if (enable)
		{
			$this.onOpen();
			$this.enlight(currentIndex);
			invisibleFreezeScreen.display($this);
			panel.display();
			//resize();
			requestAnimationFrame(function() { $this.autoResize(); });
			open = true;
		}
	};
	
	this.close = function()
	{
		$this.onClose();
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
	
	var resize = function()
	{
		var componentPosition = selectInput.position();
		var componentWidth = selectInput.offsetWidth;
		var panelWidth = panel.offsetWidth;
		var panelHeight = panel.offsetHeight;
		var panelPosition = panel.position();

		panel.style.minWidth = selectInput.offsetWidth + "px";
		panel.style.minHeight = selectInput.offsetHeight + "px";
		panel.style.left = componentPosition.x + 'px';
		panel.style.top = (componentPosition.y + selectInput.offsetHeight) + 'px';
		
		if (panelHeight > Screen.getHeight())
		{
			panel.style.left = (componentPosition.x + component.offsetWidth - panelWidth - 27) + 'px';
			panel.style.height = (Screen.getHeight()-20) + "px";
			panel.style.top = "7px";
			panel.style.overflow = "auto";
		}
		else if (componentPosition.y + selectInput.offsetHeight + panelHeight > Screen.getHeight())
		{
			var delta = componentPosition.y + selectInput.offsetHeight + panelHeight - Screen.getHeight() - 25;
			panel.style.left = (componentPosition.x + component.offsetWidth - panelWidth - 27) + 'px';
			panel.style.top = (componentPosition.y-delta) + "px";
		}
	};
	
	this.autoResize = function()
	{
		var inputSize = selectInput.offsetWidth;
		
		if (inputSize <= 0)
			requestAnimationFrame(function() { $this.autoResize(); });
		else
			resize();
	};
	
	//// Construction de la liste affichée ////

	var loadOptions = function()
	{
		//console.log(name);
		//console.log(options);
		
		var optionsList = options.map(function($option, $index)
		{
			var option = new ComboBoxItem($option.name, $option.value, $option.color);
			option.set('index', $index);
			
			option.onClick = function()
			{
				var index = this.get('index');
				$this.select(index);
			};

			if (currentValue === $option.value)
			{
				option.setSelected(true);
				selectInput.value = $option.name;
				enlighted = $index;
				currentIndex = $index;
			}

			return option;
		});
		
		//console.log(optionsList);

		list.appendChildren(optionsList);
		
		if (utils.isset(currentIndex) && currentIndex !== "" && currentIndex >= 0 && utils.isset(options[currentIndex]))
			selectInput.value = options[currentIndex].name;
		else
		{
			selectInput.value = '';
			enlighted = null;
			currentIndex = null;
		}
		
		if ((!utils.isset(currentValue) || currentValue === "") && options.length > 0)
			$this.select(0);
	};
	
	//// Surbrillance ////
	
	this.select = function($index)
	{
		currentIndex = $index;
		currentValue = options[currentIndex].value;
		
		if (currentValue === '{{[[*]]}}')
		{
			selectInput.removeAttribute('readonly');
			selectInput.value = '';
			selectInput.focus();
			$this.onChange('');
		}
		else
		{
			selectInput.setAttribute('readonly', 'readonly');
			selectInput.value = options[currentIndex].name;
			$this.onChange(currentValue);
		}
		
		$this.close();
	};
	
	this.enlight = function($index)
	{
		if (options.length > 0 && utils.isset($index) && $index >= 0)
		{
			var rows = list.getElementsByTagName('li');
			var row = null;
			
			for (var i = 0; i < rows.length; i++)
			{
				var index = parseInt(rows[i].get('index'));
				
				if (parseInt($index) === index)
				{
					rows[i].addClass('selected');
					enlighted = index;
					row = rows[i];
				}
				else
					rows[i].removeClass('selected');
			}
		}
	};
	
	///////////////////////////////////
	// Initialisation des événements //
	///////////////////////////////////
	
	this.onChange = function($value) {};
	//this.onSelect = function() { $this.onChange(value); };
	this.onOpen = function() {};
	this.onClose = function() {};
	
	component.onClick = function() {};
	
	component.getById('icon').onClick = function()
	{
		if (enable)
			toggle();
	};

	selectInput.onClick = function($event)
	{
		if (!freeOption || currentValue !== '{{[[*]]}}')
		{
			Events.preventDefault($event);
			selectInput.setAttribute('readonly', 'readonly');
		}

		if (enable)
			toggle();
	};
	
	var rerouteKeyCode = [13, 38, 40];

	selectInput.addEvent('keydown', function($event)
	{
		if (rerouteKeyCode.includes($event.keyCode))
		{
			Events.preventDefault($event);
			onKeyDown($event);
		}
	});

	selectInput.addEvent('keyup', function($event)
	{
		if (rerouteKeyCode.includes($event.keyCode))
			Events.preventDefault($event);

		Events.onTipText($event, function() { $this.onChange(selectInput.value); });
	});
	
	var onKeyDown = function($event)
	{
		if (open)
		{
			if ($event.keyCode === 13)
				$this.select(enlighted);
			else if ($event.keyCode === 27)
				$this.close();
			else if ($event.keyCode === 38)
			{
				if (enlighted !== null)
				{
					enlighted--;
				
					if (enlighted < 0)
						enlighted = options.length-1;
				}
				else
					enlighted = options.length-1;

				$this.enlight(enlighted);
			}
			else if ($event.keyCode === 40)
			{
				if (enlighted !== null)
				{
					enlighted++;
					
					if (enlighted >= options.length)
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
		if (open)
			resize();
	};
		
	invisibleFreezeScreen.onClick = function($event)
	{
		Events.preventDefault($event);
		$this.close();
	};

	////////////////
	// Accesseurs //
	////////////////

	// GET

	this.getName = function() { return name; };
	this.getOptions = function() { return options; };
	
	this.getCurrentValue = function()
	{
		var valueToReturn = currentValue;
		
		if (currentValue === '{{[[*]]}}')
			valueToReturn = selectInput.value;
		
		return valueToReturn;
	};
	
	this.getValue = this.getCurrentValue;
	
	this.getDisplayedValue = function() { return selectInput.value; };
	
	this.isOpen = function() { return open; };
	this.isEnable = function() { return enable; };

	// SET

	this.setName = function($name) 
	{
		name = $name;
		component.set("id", name);
		component.set("name", name);
	};

	this.setOptions = function($options) 
	{
		options = $options;
		list.empty();
		loadOptions();
	};

	this.setCurrentValue = function($currentValue)
	{
		currentValue = $currentValue;

		for (var i = 0; i < options.length; i++)
		{
			if (currentValue + "" === options[i].value + "")
			{
				list.childNodes[i].setSelected(true);
				selectInput.value = options[i].name;
				currentIndex = i;
			}
			else 
				list.childNodes[i].setSelected(false);
		}
	};
	
	this.setValue = this.setCurrentValue;
	
	this.setEnable = function($enable)
	{
		enable = $enable;

		if (enable)
			selectInput.removeAttribute('disabled');
		else
			selectInput.setAttribute('disabled', true);
	};

	//////////////
	// Héritage //
	//////////////

	var $this = utils.extend(component, this);

	loadOptions();
	
	return $this;
}