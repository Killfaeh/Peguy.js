function Grid5()
{
	////////////////
	// Attributes //
	////////////////
	
	var html = '<div class="grid grid5" >'
				+ '<div id="leftPanel" class="leftPanel" >'
					+ '<div id="topPanel" class="topPanel" ><div class="panel" ></div></div>'
					+ '<div id="bottomPanel" class="bottomPanel" ><div class="panel" ></div></div>'
				+ '</div>'
				+ '<div id="rightPanel" class="rightPanel" ><div class="panel" ></div></div>'
			+ '</div>';
	
	var component = new Component(html);
	
	var slide1 = new HorizontalSlide(component.getById('leftPanel'), component.getById('rightPanel'), 500);
	var slide2 = new VerticalSlide(component.getById('topPanel'), component.getById('bottomPanel'), 300);
	
	component.appendChild(slide1);
	component.getById('leftPanel').appendChild(slide2);
	
	/////////////////
	// Init events //
	/////////////////
	
	slide1.onDrag = function() { Events.resize(); };
	slide2.onDrag = function() { Events.resize(); };
	
	////////////
	// Extend //
	////////////

	var $this = utils.extend(component, this);
	return $this;
}

if (Loader !== undefined && Loader !== null)
	Loader.hasLoaded("grid5");