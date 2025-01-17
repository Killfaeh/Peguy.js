function TestCodePanel()
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
                        + '<iframe id="testFrame" class="testFrame" src="testFrame.html" ></iframe>'
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

if (Loader !== undefined && Loader !== null)
	Loader.hasLoaded("testCodePanel");