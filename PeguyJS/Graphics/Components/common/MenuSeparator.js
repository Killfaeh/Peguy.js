function MenuSeparator()
{
	///////////////
	// Attributs //
	///////////////
	

	var html = '<li class="menuSeparator" ><div></div></li>';
				
	var component = new Component(html);
	
	/*
{{INSERT CODE}}
	//*/

	////////////////
	// Accesseurs //
	////////////////

	// GET
	
	this.getName = function() { return ''; };
	this.getByName = function() { return null; };

	// SET
	
	//////////////
	// Héritage //
	//////////////
	
	var $this = utils.extend(component, this);
	return $this; 
}