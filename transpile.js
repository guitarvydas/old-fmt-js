function transpile (src, grammarName, grammars, fmt) {
    [matchsuccess, cst, errormessage] = patternmatch (src, grammarName, grammars);
    if (!matchsuccess) {
	return [false, "", "pattern matching error " + errormessage];
    } else {
	return [true, "NIY WIP", ""];
    }
}


function patternmatch (src, grammarName, grammars) {
    try {
	var grammarSpecs = ohm.grammars (grammars);
    } catch (err) {
	return [false, None, err.message];
    }
    try {
	var grammar = grammarSpecs [grammarName];
    } catch (err) {
	return [false, None, `grammar ${grammarName} not found in given grammars`];
    }
    try {
	var cst = grammar.match (src);
    } catch (err) {
	return [false, None, err.message];
    }
    return [true, cst, ""];
}
