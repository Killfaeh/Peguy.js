/////////////////////////
// Utilitaires de test //
/////////////////////////

var Tests = 
{
	assertStrict: function($actual, $expected, $message)
	{
		if ($actual !== $expected)
			throw new Error($message || "Expected: " + $expected + ", actual: " + $actual);
	},

	assertDeep: function($actual, $expected, $message)
	{
		var aStr = JSON.stringify($actual);
		var eStr = JSON.stringify($expected);
		
		if (aStr !== eStr)
			throw new Error($message || "Expected: " + eStr + ", actual: " + aStr);
	},

	run: function($description, $callback)
	{
		var success = true;

		try
		{
			$callback();
			console.log("  ✅ " + $description);
		}
		catch ($error)
		{
			console.error("  ❌ " + $description);
			console.error("     " + $error.message);
			Debug.callstack();
			success = false;
		}

		return success;
	},

	runBatch: function($name, $testArray)
	{
		console.log("\n\n📦 Test batch: " + $name);

		var countSuccess = $testArray.reduce(function ($countSuccess, $item)
		{
			return $countSuccess + (Tests.run($item.description, $item.test) ? 1 : 0);
		}, 0);

		console.log("\n✅ Success: " + countSuccess + "/" + $testArray.length + ", ❌ Fails: " + ($testArray.length-countSuccess) + "/" + $testArray.length);
	}
};