function Icon($fileName, $name, $width, $height)
{
	var width = DataFilter.integer($width ? $width : 20);
	var height = DataFilter.integer($height ? $height : 20);

	var icon = Loader.getSVG($fileName ? $fileName : 'icons', $name, width, height);

	var $this = utils.extend(icon, this);
	return $this; 
}
