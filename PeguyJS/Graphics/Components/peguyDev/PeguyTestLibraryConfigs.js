var PeguyTestLibraryConfigs =
{
	classic: 
	{
		ordered: false,
		elementsList:
		[
			{
				label: 'Common components',
				type: 'branch',
				ordered: false,
				deploy: false,
				elementsList: 
				[
					{
						label: 'Accordion',
						ordered: false,
						deploy: false,
						func: function()
						{
							PEGUY.emptyScreen();
	
							var accordion = new Accordion(true);
							
							var items = [];
						
							for (var i = 0; i < 5; i++)
							{
								var itemContent = new Component('<div>Content of item ' + i + '</div>');
								var accordionItem = new AccordionItem('<span>Item ' + i + '</span>', itemContent);
								items.push(accordionItem);
							}
							
							accordion.addElement(items);
								
							PEGUY.appendToScreen(accordion);
						}
					},
					{
						label: 'AutoComplete',
						ordered: false,
						deploy: false,
						func: function()
						{
							PEGUY.emptyScreen();
	
							var autoCompleteList = ['Amandine', 'Arthur', 'Dina', 'Myriam', 'Rivo', 'Vincent'];
							
							var autoComplete = new AutoComplete(autoCompleteList);
							
							autoComplete.onChange = function($value)
							{
								console.log('Value : ' + $value);
								var infoPopup = new InfoPopup("<p>Value : " + $value + "</p>");
								PEGUY.appendToScreen(infoPopup);
							};
							
							PEGUY.appendToScreen(autoComplete);
						}
					},
					{
						label: 'AutoCompleteKeyValue',
						ordered: false,
						deploy: false,
						func: function()
						{
							PEGUY.emptyScreen();
	
							var autoCompleteList = [ { key: 'amandine', value: 'Amandine' }, { key: 'arthur', value: 'Arthur' }, { key: 'dina', value: 'Dina' }, 
												{ key: 'myriam', value: 'Myriam' }, { key: 'rivo', value: 'Rivo' }, { key: 'vincent', value: 'Vincent'} ];
						
							var autoComplete = new AutoCompleteKeyValue(autoCompleteList);
						
							autoComplete.onChange = function($value)
							{
								console.log('Value : ' + $value);
								var infoPopup = new InfoPopup("<p>Value : " + $value + "</p>");
								PEGUY.appendToScreen(infoPopup);
							};
							
							PEGUY.appendToScreen(autoComplete);
						}
					},
					{
						label: 'Button',
						ordered: false,
						deploy: false,
						func: function()
						{
							PEGUY.emptyScreen();
	
							var button = new Button('My button');
	
							button.onAction = function()
							{
								console.log('You have clicked on "My button".');
								var infoPopup = new InfoPopup('<p>You have clicked on "My button".</p>');
								PEGUY.appendToScreen(infoPopup);
							};
							
							PEGUY.appendToScreen(button);
						}
					},
					{
						label: 'Calendar',
						ordered: false,
						deploy: false,
						func: function()
						{
							PEGUY.emptyScreen();
	
							var calendar = new Calendar();
	
							calendar.onChange = function($value)
							{
								console.log('Value : ' + $value);
								var infoPopup = new InfoPopup("<p>Value : " + $value + "</p>");
								PEGUY.appendToScreen(infoPopup);
							};
							
							PEGUY.appendToScreen(calendar);
						}
					},
					{
						label: 'ColorPalette',
						ordered: false,
						deploy: false,
						func: function()
						{
							PEGUY.emptyScreen();
							
							var colorsList = [ '#FF0000', '#FFFF00', '#00FF00', '#00FFFF', '#0000FF', '#FF00FF' ];
	
							var colorPalette = new ColorPalette(colorsList);
	
							colorPalette.onChange = function($value)
							{
								console.log('Value : ' + $value);
								var infoPopup = new InfoPopup("<p>Value : " + $value + "</p>");
								PEGUY.appendToScreen(infoPopup);
							};
							
							PEGUY.appendToScreen(colorPalette);
						}
					},
					{
						label: 'ComboBox',
						ordered: false,
						deploy: false,
						func: function()
						{
							PEGUY.emptyScreen();
	
							var options = [ { value: "1", name: "Option 1" }, { value: "2", name: "Option 2" }, { value: "3", name: "Option 3" } ];
						
							var comboBox = new ComboBox('My combo box', options, "2", true);
						
							comboBox.onChange = function($value)
							{
								console.log('Value : ' + $value);
								var infoPopup = new InfoPopup("<p>Value : " + $value + "</p>");
								PEGUY.appendToScreen(infoPopup);
							};
							
							PEGUY.appendToScreen(comboBox);
						}
					},
					{
						label: 'Frame',
						ordered: false,
						deploy: false,
						func: function()
						{
							PEGUY.emptyScreen();
	
							var frame = new Frame('', 'This is an empty frame');
							frame.setPosition(50, 20);
							frame.setDimensions(400, 300);
							frame.display();
						}
					},
					{
						label: 'InfoPopup',
						ordered: false,
						deploy: false,
						func: function()
						{
							PEGUY.emptyScreen();
	
							var infoPopup = new InfoPopup("<p>This is an information popup.</p>");
							
							PEGUY.appendToScreen(infoPopup);
						}
					},
					{
						label: 'ImagePopup',
						ordered: false,
						deploy: false,
						func: function()
						{
							PEGUY.emptyScreen();
	
							var imagePopup = new ImagePopup('../../../Demos/Mercator_projection_SW.jpg', "This is an image");
							
							PEGUY.appendToScreen(imagePopup);
						}
					},
					{
						label: 'Popup',
						ordered: false,
						deploy: false,
						func: function()
						{
							PEGUY.emptyScreen();
	
							var popup = new Popup('<div style="margin: 30px;" >Popup<br />content</div>');
							
							PEGUY.appendToScreen(popup);
						}
					},
					{
						label: 'Select',
						ordered: false,
						deploy: false,
						func: function()
						{
							PEGUY.emptyScreen();
	
							var selectOptions = [ { name: 'Amandine', value: 'amandine' }, { name: 'Arthur', value: 'arthur' }, { name: 'Dina', value: 'dina' }, 
												{ name: 'Myriam', value: 'myriam' }, { name: 'Rivo', value: 'rivo' }, { name: 'Vincent', value: 'vincent'} ];
							
							var select = new Select("firstnames", selectOptions, 'dina');
							
							select.onChange = function($value)
							{
								console.log('Value : ' + $value);
								var infoPopup = new InfoPopup("<p>Value : " + $value + "</p>");
								PEGUY.appendToScreen(infoPopup);
							};
							
							PEGUY.appendToScreen(select);
						}
					},
				]
			},
		]
	}
};