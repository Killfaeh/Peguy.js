function JargonPanel()
{
	///////////////
	// Attributs //
	///////////////
	
	var outputCode = '';
	
	// Structure du composant

	var html = '<div class="jargonPanel" >'
					+ '<div id="sourceBlock" >'
						+ '<strong style="margin-right: 10px; " >Source </strong>'
						+ '<ComboBox id="sourceSelector" name="sourceSelector" ></ComboBox>'
					+ '</div>'
					+ '<div id="targetBlock" >'
						+ '<strong style="margin-right: 10px; " >Target </strong>'
						+ '<ComboBox id="targetSelector" name="targetSelector" ></ComboBox>'
					+ '</div>'
					+ '<textarea id="input-panel" class="input-panel" ></textarea>'
					+ '<pre id="output" class="output" ></pre>'
					+ '<div id="buttons" >'
						+ '<input type="button" id="convertButton" value="Convert" />'
						+ '<input type="button" id="copyButton" value="Copy" />'
						+ '<input type="button" id="insertButton" value="Insert into code" />'
					+ '</div>'
				+ '</div>';

	var component = new Component(html);

	var sourceSelector = component.getById('sourceSelector');
	var targetSelector = component.getById('targetSelector');

	sourceSelector.setOptions(Array.from(JARGON.sources));
	targetSelector.setOptions(Array.from(JARGON.targets));

	var convertButton = component.getById('convertButton');
	var copyButton = component.getById('copyButton');
	var insertButton = component.getById('insertButton');

	// Style

	component.addConfigStyle("formatList", function ()
	{
		return {
			common:
			{
				'this':
				{
					position: 'absolute',
					left: '0px',
					right: '0px',
					top: '0px',
					bottom: '0px',
					overflow: 'auto',
				},
				
				'sourceBlock':
				{
					position: 'absolute',
					left: '10px',
					right: 'calc(75% + 7px)',
					top: '10px',
					bottom: 'calc(100% - 100px)',
					resize: 'none',
				},
				
				'targetBlock':
				{
					position: 'absolute',
					left: 'calc(25% + 7px)',
					right: 'calc(50% + 7px)',
					top: '10px',
					bottom: 'calc(100% - 100px)',
					resize: 'none',
				},

				'input-panel':
				{
					position: 'absolute',
					left: '10px',
					right: 'calc(50% + 7px)',
					top: '50px',
					bottom: '70px',
					border: 'rgb(128,128,128) solid 1px',
					textAlign: 'left',
					overflow: 'auto',
					padding: '20px',
					resize: 'none',
				},

				'output':
				{
					position: 'absolute',
					right: '10px',
					left: 'calc(50% + 7px)',
					top: '10px',
					bottom: '70px',
					border: 'rgb(128,128,128) solid 1px',
					textAlign: 'left',
					overflow: 'auto',
					padding: '20px',
					background: 'rgb(40, 40, 40)',
				},

				'buttons':
				{
					position: 'absolute',
					left: '30px',
					right: '30px',
					bottom: '15px',
				},
			},
		};
	});

	component.applyConfigStyle();

	//////////////
	// Méthodes //
	//////////////

	this.update = function()
	{
		console.log(JARGON.comboSources);
		console.log(JARGON.comboTargets);
		sourceSelector.setOptions(JARGON.comboSources);
		targetSelector.setOptions(JARGON.comboTargets);
	};

	////////////////////////////
	// Gestion des événements //
	////////////////////////////

	convertButton.onClick = function()
	{
		outputCode = '';
		var inputCode = component.getById("input-panel").value;
		var source = JARGON.sources.get(sourceSelector.getCurrentValue());
		var target = JARGON.targets.get(targetSelector.getCurrentValue());

		if (source && target)
		{
			outputCode = JARGON.convert(inputCode, source.object, target.object);

			const highlightedCode = hljs.highlight(outputCode, { language: target.object.getType(), ignoreIllegals: true }).value;
			component.getById("output").innerHTML = highlightedCode;
		};
	};

	copyButton.onClick = function()
	{
		if (outputCode !== '')
		{
			dataManager.toClipboard(outputCode,
				function()
				{
					var message = '<p style="text-align: left; color: rgb(0, 255, 0); " >The code has been copied.</p>';
					viewManager.getNotifCenter().push(message, false);
				},
				function()
				{
					var message = '<p style="text-align: left; color: rgb(255, 0, 0); " >Failed to copy the code.</p>';
					viewManager.getNotifCenter().push(message, false);
				});
		}
		else
		{
			var infoPopup = new InfoPopup('<p>No code has been generated.</p>');
			PEGUY.main.appendChild(infoPopup);
		}
	};
	
	insertButton.onClick = function()
	{
		if (outputCode !== '')
			Events.emit('onInsertCode', [outputCode]);
		else
		{
			var infoPopup = new InfoPopup('<p>No text has been generated.</p>');
			PEGUY.main.appendChild(infoPopup);
		}
	};
	
	//////////////
	// Héritage //
	//////////////
	
	var $this = utils.extend(component, this);
	return $this; 
}