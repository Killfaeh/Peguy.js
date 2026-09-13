(function(global)
{
	// On vérifie si Map existe déjà
	if (typeof global.Map !== 'undefined')
		return; // On s'arrête là, le travail est déjà fait par le moteur JS

	function MapPolyfill()
	{
		///////////////
		// Attributs //
		///////////////
	
		var keys = [];
		var values = [];
		this.size = 0;

		//////////////
		// Méthodes //
		//////////////

		// Méthode pour ajouter ou mettre à jour
		this.set = function($key, $value)
		{
			var index = keys.indexOf($key);
			
			// Si la clé existe déjà, on met à jour la valeur
			if (index !== -1)
				values[index] = $value;
			else
			{
				// Sinon, on ajoute la nouvelle clé et la valeur
				keys.push($key);
				values.push($value);
				$this.size++;
			}
			
			return $this; // Permet le chaînage comme le vrai Map
		};

		// Méthode pour récupérer une valeur
		this.get = function($key)
		{
			var index = keys.indexOf($key);
			return index !== -1 ? values[index] : undefined;
		};

		// Méthode pour vérifier l'existence d'une clé
		this.has = function($key)
		{
			return keys.indexOf($key) !== -1;
		};

		// Méthode pour supprimer une entrée
		this.delete = function($key)
		{
			var index = keys.indexOf($key);
			
			if (index !== -1)
			{
				keys.splice(index, 1);
				values.splice(index, 1);
				$this.size--;
				return true;
			}
			
			return false;
		};

		// Méthode pour vider la Map
		this.clear = function()
		{
			keys = [];
			values = [];
			$this.size = 0;
		};

		// Méthode pour itérer (simulation de forEach)
		this.forEach = function($callback, $thisArg)
		{
			for (var i = 0; i < keys.length; i++)
				$callback.call($thisArg, values[i], keys[i], $this);
		};

		var $this = this;
	};

	// On expose notre classe sous le nom "Map" uniquement si elle manque
	global.Map = MapPolyfill;

})(typeof window !== 'undefined' ? window : global);

if (typeof Map.groupBy !== 'function')
{
	Map.groupBy = function($items, $callback)
	{
		if ($items == null) throw new TypeError('items is null or not defined');
		
		// On utilise la classe Map (native ou ton polyfill)
		var result = new Map();
		var o = Object($items);
		var len = o.length >>> 0;
		
		for (var i = 0; i < len; i++)
		{
			if (i in o)
			{
				var value = o[i];
				var key = $callback(value, i);
				
				var group = result.get(key);
				
				if (typeof group === 'undefined')
					result.set(key, [value]);
				else
					group.push(value);
			}
		}
		
		return result;
	};
}