function Accordion($openOneCloseAll)
{
	///////////////
	// Attributs //
	///////////////
	
	var openOneCloseAll = $openOneCloseAll;
	
	var html = '<ul class="accordion" ></ul>';
				
	var component = new ListComponent(html);
	
	
	// Style
	
	component.addConfigStyle("accordion", function ()
	{
	    return {
	        common:
	        {
	        	"multi-tag":
	        	{
	        		".accordion .accordionHeader":
	        		[
	        			"background-color: " + (function() { return STYLE.accordionHeaderBackgroundColor; })(),
	        		]
	        	}
			},
	    };
	});

	component.applyConfigStyle();
	
	//////////////
	// Méthodes //
	//////////////
	
	this.closeAll = function() { component.execAll([ 'close' ]); };

	this.addElement = function($element) { return $this.addToList($element); };
	this.insertElementInto = function($element, $index) { return $this.insertIntoListAt($element, $index); };
	this.removeElement = function($element) { return $this.removeFromList($element); };
	this.removeAllElement = function() { return $this.removeAllFromList(); };
	
	////////////////
	// Accesseurs //
	////////////////

	// GET
	
	this.getOpenOneCloseAll = function() { return openOneCloseAll; };
	
	// SET
	
	this.setOpenOneCloseAll = function($openOneCloseAll) { openOneCloseAll = $openOneCloseAll; };
	
	//////////////
	// Héritage //
	//////////////
	
	var $this = utils.extend(component, this);
	return $this; 
}