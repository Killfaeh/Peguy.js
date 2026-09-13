function ButtonsMenu($buttonsList)
{
	////////////////
	// Attributes //
	////////////////

	var buttonsList = $buttonsList ? $buttonsList : [];

	var map = new Map();

	var html = '<div class="buttonsMenu" ></div>';

	var component = new Component(html);

	/*
// Style

component.addConfigStyle("buttonsMenu", function ()
{
	return {
		common:
		{
	"multi-tag": {}
},
		
		classic:
		{},
		
		mobile:
		{},
	};
});

component.applyConfigStyle();
	//*/

	/////////////
	// Methods //
	/////////////
	
	this.createButton = function($param)
	{
		var item = new Button($param.name);
		item.onAction = $param.action;
		component.appendChild(item);
		map.set($param.name, item);
	};

	this.init = function() { buttonsList.forEach(function($button) { $this.createButton($button); }); };

	this.addButton = function($param)
	{
		buttonsList.push($param);
		$this.createButton($param);
	};

	this.addButtons = function($buttonsList)
	{
		$buttonsList.forEach(function($button)
		{
			buttonsList.push($button);
			$this.createButton($button);
		});
	};

	this.hide = function($name)
	{
		if (map.has($name))
			map.get($name).style.display = 'none';
	};

	this.display = function($name)
	{
		if (map.has($name))
			map.get($name).style.display = 'inline-block';
	};

	////////////
	// Extend //
	////////////

	var $this = utils.extend(component, this);
	$this.init();
	return $this;
}