function PeguyTestLibrary($config)
{
	///////////////
	// Attributs //
	///////////////
	
	// Ajouter un bouton pour générer un éventuel prompt de documentation
	// Ajouter un bouton pour générer une bibliothèque de code CSV
	// Ajouter un bouton pour générer les templates (en tout cas dégrossir) pour le menu cntextuel de génération
	
	var config = $config ? $config : {};
	
	var html = '<div class="peguyTestLibrary" >'
						+ '<div id="leftPanel" class="leftPanel" >'
							+ '<Tree id="tree" ></Tree>'
						+'</div>'
						+ '<div id="rightPanel" class="rightPanel" >'
							+ '<TestCodePanel id="testPanel" ordered="false" ></TestCodePanel>'
						+ '</div>'
				+ '</div>';
	
	var component = new Component(html);
	
	var tree = component.getById('tree');
	var testPanel = component.getById('testPanel');
	
	var slide1 = new HorizontalSlide(component.getById('leftPanel'), component.getById('rightPanel'), 250, 'left');
	component.appendChild(slide1);
	
	// Style
	
	const panelStyle =
	{
		border: 'rgb(120, 120, 120) solid 1px',
		textAlign: 'left',
		overflow: 'auto',
		background: 'rgb(40, 40, 40)',
	};

	component.addConfigStyle("convertCSS", function ()
	{
		return {
			common:
			{
				'this': (new Style({ overflow: 'hidden' })).absolute('0px', '0px', '0px', '0px'),

				'leftPanel': (new Style(panelStyle)).absolute('10px', 'calc(100% - 293px)', '10px', '10px'),
				'rightPanel': (new Style({ overflow: 'hidden' })).absolute('307px', '0px', '0px', '0px'),
			},
		};
	});

	component.applyConfigStyle();

	testPanel.getById('leftPanel').style.left = '0px';
	
	//////////////
	// Méthodes //
	//////////////
	
	var createBranch = function($element)
	{
		var item = new TreeBranch($element.label, $element.ordered);
		return item;
	};
	
	var createLeaf = function($element)
	{
		var item = new TreeLeaf($element.label);
		item.func = $element.func;
		
		item.onClick = function()
		{
			if (this.func && this.func.toString() !== '')
			{
				var codeToExec = this.func.toString().remove('function()\n').remove(/^[ 	]*{\n/);
				var tabs = codeToExec.split('\n')[0].replace(/^([ 	]*)[^	]*/, '$1');
				codeToExec = codeToExec.remove(/[ 	]*}$/).removeAll(tabs);
				testPanel.setCode(codeToExec);
				requestAnimationFrame(function() { testPanel.exec(); });
			}
		};
		
		return item;
	};
	
	
	tree.loadFromJSON(config, function($element)
	{
		if ($element.type === "branch")
			return createBranch($element);
		else
			return createLeaf($element);
	});
	
	///////////////////////////////////
	// Initialisation des événements //
	///////////////////////////////////
	
	slide1.onDrag = function() { $this.resize(); };
	
	//////////////
	// Héritage //
	//////////////

	var $this = utils.extend(component, this);
	return $this; 
}