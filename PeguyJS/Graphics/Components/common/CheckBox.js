function CheckBox($checked, $size)
{
	///////////////
	// Attributs //
	///////////////
	
	var checked = DataFilter.boolean($checked);
	var size = DataFilter.integer($size);
	var readonly = false;
	
	if (!utils.isset(size))
		size = 25.0;

	var iconSize = 20.0*size/25.0;
	var maginSize = (size-iconSize)/2.0;

	var html = '<div class="checkBox" >'
					+ '<div id="inner" class="inner" style="min-width: ' + size + 'px; width: ' + size + 'px; height: ' + size + 'px; text-align: center;" >'
						+ '<Icon id="checkIcon" fileName="icons" name="check-icon" width="' + iconSize + '" height="' + iconSize + '" ></Icon>'
						+ '<div class="wall" ></div>'
					+ '</div>'
				+ '</div>';

	var component = new Component(html);

	var checkIcon = component.getById('checkIcon');

	// Style

	component.addConfigStyle("checkBox", function ()
	{
		return {
			common:
			{
				'inner':
				{
					border: (function() { return STYLE.checkBoxBorder; })(),
					minWidth: size + "px",
					width: size + "px",
					height: size + "px",
					backgroundColor: (function() { return STYLE.checkBoxBackGroundColor; })(),
				},
			}
		};
	});

	component.applyConfigStyle();
	
	//////////////
	// Méthodes //
	//////////////
	
	var updateCheckIcon = function()
	{
		checkIcon.style.verticalAlign = 'middle';
		
		if (checked === true)
			checkIcon.style.display = 'inline-block';
		else
			checkIcon.style.display = 'none'; 
	};
	
	///////////////////////////////////
	// Initialisation des événements //
	///////////////////////////////////
	
	this.onChange = function($checked) {};
	
	component.onClick = function($event)
	{
		if (readonly === false)
		{
			Events.preventDefault($event);
			
			if (checked === true)
				checked = false;
			else
				checked = true;
			
			updateCheckIcon();
			$this.onChange(checked);
		}
	};
	
	component.onMouseDown = function() {};
	component.onMouseUp = function() {};
	
	////////////////
	// Accesseurs //
	////////////////
	
	// GET
	
	this.isChecked = function() { return checked; };

	// SET
	
	this.setChecked = function($checked)
	{
		checked = $checked;
		updateCheckIcon();
	};
	
	this.setReadonly = function($readonly)
	{
		readonly = $readonly;
		
		if (readonly === true)
		{
			component.getById('inner').style.border = 'none';
			component.getById('inner').style.backgroundColor = 'none';
		}
		else
		{
			component.getById('inner').style.border = (function() { return STYLE.checkBoxBorder; })();
			component.getById('inner').style.backgroundColor = (function() { return STYLE.checkBoxBackGroundColor; })();
		}
	};
	
	//////////////
	// Héritage //
	//////////////
	
	var $this = utils.extend(component, this);
	updateCheckIcon();
	//Components.addInputText($this);
	return $this;
}