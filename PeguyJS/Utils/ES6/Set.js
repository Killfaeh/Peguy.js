(function(global)
{
	// On vérifie si Map existe déjà
	if (typeof global.Set !== 'undefined')
		return; // On s'arrête là, le travail est déjà fait par le moteur JS

	function SetPolyfill($iterable)
	{
		///////////////
		// Attributs //
		///////////////
	
		var values = [];
		this.size = 0;

		// Si on passe un tableau au constructeur : new Set([1, 2, 2])
		if ($iterable && $iterable.length)
		{
			for (var i = 0; i < $iterable.length; i++)
			{
				var item = $iterable[i];

				if (values.indexOf(item) < 0)
					values.push(item);
			}
		}

		//////////////
		// Méthodes //
		//////////////

		// Ajoute un élément s'il n'existe pas déjà
		this.add = function($value)
		{
			if (!$this.has($value))
			{
				values.push($value);
				$this.size++;
			}
			
			return $this; // Permet le chaînage : set.add(1).add(2)
		};

		// Vérifie l'existence d'une valeur
		this.has = function($value)
		{
			return values.indexOf($value) !== -1;
		};

		// Supprime un élément
		this.delete = function($value)
		{
			var index = values.indexOf($value);
			
			if (index !== -1)
			{
				values.splice(index, 1);
				$this.size--;
				return true;
			}
			
			return false;
		};

		// Vide le Set
		this.clear = function()
		{
			values = [];
			$this.size = 0;
		};

		// Itération
		$this.forEach = function($callback, $thisArg)
		{
			for (var i = 0; i < values.length; i++)
			{
				// Dans un Set, la clé et la valeur sont identiques pour le callback
				$callback.call($thisArg, values[i], values[i], $this);
			}
		};
	};

	// On expose notre classe sous le nom "Map" uniquement si elle manque
	global.Set = SetPolyfill;

})(typeof window !== 'undefined' ? window : global);