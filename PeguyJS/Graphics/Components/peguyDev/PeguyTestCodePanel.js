function PeguyTestCodePanel()
{
	////////////////
	// Attributes //
	////////////////
	
	var html = '<div class="testCodePanel" >'
                    + '<div id="leftPanel" class="leftPanel" >'
                        + '<div id="topPanel" class="panel topPanel" ></div>'
                        + '<div id="bottomPanel" class="panel bottomPanel" ></div>'
                        + '<div id="buttonsPanel" class="buttonsPanel" ><input type="button" id="testButton" value="Test code" /></div>'
                    + '</div>'
                    + '<div id="rightPanel" class="panel rightPanel" >'
                        + '<iframe id="testFrame" class="testFrame" src="Graphics/Components/peguyDev/testFrame.html" ></iframe>'
                    + '</div>'
				+ '</div>';
	
	var component = new Component(html);
	
	var slide1 = new HorizontalSlide(component.getById('leftPanel'), component.getById('rightPanel'), 400);
	var slide2 = new VerticalSlide(component.getById('topPanel'), component.getById('bottomPanel'), 200);

    component.appendChild(slide1);
	component.getById('leftPanel').appendChild(slide2);
	
    var codeEditor = new CodeEditor('javascript');
	var errorConsoleHTML = '<pre><code id="errorConsole" ></code></pre>';
	var errorConsole = new Component(errorConsoleHTML);

	component.getById('topPanel').appendChild(codeEditor);
	component.getById('bottomPanel').appendChild(errorConsole);
	
	// Style
	
	const panelStyle =
	{
		//border: 'rgb(120, 120, 120) solid 1px',
		textAlign: 'left',
		overflow: 'hidden',
		padding: '0px',
		//background: 'rgb(40, 40, 40)',
	};

	component.addConfigStyle("convertCSS", function ()
	{
		return {
			common:
			{
				'this': (new Style({ overflow: 'hidden' })).absolute('0px', '0px', '0px', '0px'),

				'leftPanel': (new Style(panelStyle)).absolute('10px', 'calc(50% + 7px)', '10px', '10px'),
				'topPanel': (new Style(panelStyle)).absolute('0px', '0px', '0px', '0px'),
				'rightPanel': (new Style(panelStyle)).absolute('calc(50% + 7px)', '10px', '10px', '10px'),
				'testFrame': (new Style({ border: 'none', width: '100%', height: '100%' })).absolute('0px', '0px', '0px', '0px'),
			},
		};
	});

	component.applyConfigStyle();
	
	/////////////
	// Methods //
	/////////////
	
    this.displayError = function($error)
	{
		console.log($error);
        //console.log("POUET ! Une Erreur ! ");
		errorConsole.getById('errorConsole').innerHTML = $error.stack;
	};

	this.emptyError = function()
	{
        //console.log("Je vide la console d'erreur.");
		errorConsole.getById('errorConsole').innerHTML = "";
	};

	/////////////////
	// Init events //
	/////////////////
	
	component.getById('testButton').onClick = function()
    {
        var code = codeEditor.getCode();
        console.log(code);
        component.getById('testFrame').contentWindow.execCode(code);
    };
	
	////////////
	// Extend //
	////////////

	var $this = utils.extend(component, this);
	return $this;
}