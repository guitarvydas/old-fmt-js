function fmtjs (fmtsrc, fixup) {
    // expand the string fmtsrc into JavaScript suitable for
    // inclusion as a semantic object for Ohm.js
    //
    // fixup is a function which is applied to the generated code before
    // the code is evaled
    //
    var s = '';

    var generatedObject = {};
    

    // Step 1a. Create (internal) fmt transpiler. 
    var internalgrammar = ohm.grammar (fmtGrammar);
    var fmtcst = internalgrammar.match (fmtsrc);

    if (fmtcst.failed ()) {
	return [false, "FORMAT: syntax error\n(Use Ohm-Editor to debug format specification (grammar: fmt.ohm))\n\n" + internalgrammar.trace (fmtsrc)];
    }
    // Step 1b. Transpile User's FMT spec to a JS object (for use with Ohm-JS)
    try {
        var sem = internalgrammar.createSemantics ();
        sem.addOperation ('_glue', fmtSemantics);
        var generatedFmtWalker = sem (fmtcst);
        var generated = generatedFmtWalker._glue ();
        var generatedFmtCodeString = fixup (generated);
	return [true, generatedFmtCodeString];
    } catch (err) {
        throw "error generating code from FMT specification";
    }
}


var tracing = false;
var traceDepth;

const fmtGrammar =
      String.raw`
FMT {
top = rule+ spaces
rule = applySyntactic<RuleLHS> spaces "=" spaces rewriteString
RuleLHS = name "[" Param+ "]"
rewriteString =
  | stringBegin char* stringEnd
stringBegin = "‛" | "[["
stringEnd = "’" | "]]"
char =
  | "«" name "»" -- eval
  | "$" name     -- evalShorthand
  | ~"’" ~"]]" any     -- raw
name = letter nameRest*
nameRest = "_" | alnum
Param =
  | name "+" -- plus
  | name "*" -- star
  | name "?" -- opt
  | name     -- flat
}
`;


var varNameStack = [];


const fmtSemantics = {   
    top : function (_rule,_ws) { 
	_ruleEnter ("top");

	var rule = _rule._glue ().join ('');
	var ws = _ws._glue ();
	var _result = `${rule}${ws}`; 
	_ruleExit ("top");
	return _result; 
    },
    
    rule : function (_lhs,_ws1,_keq,_ws2,_rws) { 
	_ruleEnter ("rule");

	var lhs = _lhs._glue ();
	var ws1 = _ws1._glue ();
	var keq = _keq._glue ();
	var ws2 = _ws2._glue ();
	var rws = _rws._glue ();
	var _result = `${lhs}${ws1}${keq}${ws2}${rws}`; 
	_ruleExit ("rule");
	return _result; 
    },
    
    RuleLHS : function (_name,_lb,_Params,_rb) { 
	_ruleEnter ("RuleLHS");

	var name = _name._glue ();
	var lb = _lb._glue ();
	var Params = _Params._glue ().join ('');
	var rb = _rb._glue ();
	var _result = `${name}${lb}${Params}${rb}`; 
	_ruleExit ("RuleLHS");
	return _result; 
    },
    
    rewriteString : function (_sb,_cs,_se) { 
	_ruleEnter ("rewriteString");

	var sb = _sb._glue ();
	var cs = _cs._glue ().join ('');
	var se = _se._glue ();
	var _result = `${sb}${cs}${se}`; 
	_ruleExit ("rewriteString");
	return _result; 
    },
    
    stringBegin : function (_c) { 
	_ruleEnter ("stringBegin");

	var c = _c._glue ();
	var _result = `${c}`; 
	_ruleExit ("stringBegin");
	return _result; 
    },
    
    stringEnd : function (_c) { 
	_ruleEnter ("stringEnd");

	var c = _c._glue ();
	var _result = `${c}`; 
	_ruleExit ("stringEnd");
	return _result; 
    },
    
    char_eval : function (_lb,_name,_rb) { 
	_ruleEnter ("char_eval");

	var lb = _lb._glue ();
	var name = _name._glue ();
	var rb = _rb._glue ();
	var _result = `${lb}${name}${rb}`; 
	_ruleExit ("char_eval");
	return _result; 
    },
    
    char_evalShorthand : function (_k,_name) { 
	_ruleEnter ("char_evalShorthand");

	var k = _k._glue ();
	var name = _name._glue ();
	var _result = `${k}${name}`; 
	_ruleExit ("char_evalShorthand");
	return _result; 
    },
    
    char_raw : function (_c) { 
	_ruleEnter ("char_raw");

	var c = _c._glue ();
	var _result = `${c}`; 
	_ruleExit ("char_raw");
	return _result; 
    },
    
    name : function (_c,_cs) { 
	_ruleEnter ("name");

	var c = _c._glue ();
	var cs = _cs._glue ().join ('');
	var _result = `${c}${cs}`; 
	_ruleExit ("name");
	return _result; 
    },
    
    nameRest : function (_c) { 
	_ruleEnter ("nameRest");

	var c = _c._glue ();
	var _result = `${c}`; 
	_ruleExit ("nameRest");
	return _result; 
    },
    
    Param_plus : function (_name,_k) { 
	_ruleEnter ("Param_plus");

	var name = _name._glue ();
	var k = _k._glue ();
	var _result = `${name}${k}`; 
	_ruleExit ("Param_plus");
	return _result; 
    },
    
    Param_star : function (_name,_k) { 
	_ruleEnter ("Param_star");

	var name = _name._glue ();
	var k = _k._glue ();
	var _result = `${name}${k}`; 
	_ruleExit ("Param_star");
	return _result; 
    },
    
    Param_opt : function (_name,_k) { 
	_ruleEnter ("Param_opt");

	var name = _name._glue ();
	var k = _k._glue ();
	var _result = `${name}${k}`; 
	_ruleExit ("Param_opt");
	return _result; 
    },
    
    Param_flat : function (_name) { 
	_ruleEnter ("Param_flat");

	var name = _name._glue ();
	var _result = `${name}`; 
	_ruleExit ("Param_flat");
	return _result; 
    },
    
    _terminal: function () { return this.sourceString; },
    _iter: function (...children) { return children.map(c => c._glue ()); }
};

function _ruleInit () {
}

function traceSpaces () {
    var n = traceDepth;
    while (n > 0) {
        process.stderr.write (" ");
        n -= 1;
    }
    process.stderr.write ('[');
    process.stderr.write (traceDepth.toString ());
    process.stderr.write (']');
}

function _ruleEnter (ruleName) {
    if (tracing) {
        traceDepth += 1;
        traceSpaces ();
        process.stderr.write("enter: ");
        process.stderr.write (ruleName.toString ());
        process.stderr.write ("\n");
    }
}

function _ruleExit (ruleName) {
    if (tracing) {
        traceSpaces ();
        traceDepth -= 1;
        process.stderr.write("exit: "); 
        process.stderr.write (ruleName); 
        process.stderr.write ("\n");
    }
}

function getFmtGrammar () {
    return fmtGrammar;
}

