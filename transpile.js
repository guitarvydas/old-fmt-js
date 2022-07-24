function transpile (src, grammar, fmt) {
    [matchsuccess, cst, errormessage] = patternmatch (src, grammar);
    if (!matchsuccess) {
	return [false, "matching error " + errormessage];
    } else {
	[fmtsuccess, transpiledString, errorString] = rewrite (cst, fmt);
	if (!fmtsuccess) {
	    return [false, "rewriting error " + errorString];
	} else {
	    return [true, transpiledString];
	}
    }
}
