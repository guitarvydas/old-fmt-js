function fmtjs (fmtsrc) {
    // expand the string fmtsrc into JavaScript suitable for
    // inclusion as a semantic object for Ohm.js
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
        sem.addOperation ('_glue', semObject);
        var generatedFmtWalker = sem (fmtcst);
        var generated = generatedFmtWalker._glue ();
	return [true, generated];
    } catch (err) {
        throw "error generating code from FMT specification";
    }
}


var tracing = false;
var traceDepth;

const fmtGrammar =
      String.raw`
FMT {
top = rule+
rule = applySyntactic<RuleLHS> spaces "=" spaces rewriteString
RuleLHS = name "[" Param+ "]"
rewriteString = "‛" char* "’" spaces
char =
  | "«" name "»" -- eval
  | ~"’" ~"]]" any     -- raw
name = letter nameRest*
nameRest = "_" | alnum
Param =
  | name "+" -- plus
  | name "*" -- star
  | name "?" -- opt
  | name     -- flat
comment = "//" (~"\n" any)* "\n"
space += comment
}
`;

function extractFormals (s) {
    var s0 = s
	.replace (/\n/g,',')
	.replace (/var [A-Za-z0-9_]+ = /g,'')
	.replace (/\._[^;]+;/g,'')
	.replace (/,/,'')
    ;
    return s0;
}

var varNameStack = [];

// xxx

const semObject = {


//     top [@rule] = [[const semObject = {
// ${rule}{}
// };
// ]]

    top : function (_rule) { 
	_ruleEnter ("top");
	
	var rule = _rule._glue ().join ('');
	var _result = `const semObject = {
${rule}{}
};
`; 
	_ruleExit ("top");
	return _result; 
    },

    ////
    
// rule [lhs ws1 keq ws2 rws] = [[${lhs}${rws}
// _ruleExit ("${getRuleName ()}");
// }
// ]]


rule : function (_lhs,_ws1,_keq,_ws2,_rws) { 
_ruleEnter ("rule");

var lhs = _lhs._glue ();
var ws1 = _ws1._glue ();
var keq = _keq._glue ();
var ws2 = _ws2._glue ();
var rws = _rws._glue ();
var _result = `${lhs}${rws}
_ruleExit ("${getRuleName ()}");
}
`; 
_ruleExit ("rule");
return _result; 
},
    ////
    
// RuleLHS [name lb @Params rb] = [[${name}: function () {\n_ruleEnter ("${name}");${setRuleName (name)}${Params},
// ]]
RuleLHS : function (_name,_lb,_Params,_rb) { 
_ruleEnter ("RuleLHS");

var name = _name._glue ();
var lb = _lb._glue ();
var Params = _Params._glue ().join ('');
var rb = _rb._glue ();
var _result = `${name}: function () {\n_ruleEnter ("${name}");${setRuleName (name)}${Params},
`; 
_ruleExit ("RuleLHS");
return _result; 
},
            
    ////


    // rewriteString [sb @cs se ws] = [[return \`${cs}\`;]]
    rewriteString : function (_sb,_cs,_se,_ws) { 
_ruleEnter ("rewriteString");

var sb = _sb._glue ();
var cs = _cs._glue ().join ('');
var se = _se._glue ();
var ws = _ws._glue ();
var _result = `return \`${cs}\`;`; 
_ruleExit ("rewriteString");
return _result; 
},


    ////
char_eval : function (_lb,_name,_rb) { 
_ruleEnter ("char_eval");

var lb = _lb._glue ();
var name = _name._glue ();
var rb = _rb._glue ();
var _result = `\$\{${name}\}`; 
_ruleExit ("char_eval");
return _result; 
},
            
char_raw : function (_c) { 
_ruleEnter ("char_raw");

var c = _c._glue ();
var _result = `${c}`; 
_ruleExit ("char_raw");
return _result; 
},
    ////
            
// name [c @cs] = [[${c}${cs}]]
// nameRest [c] = [[${c}]]

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

    ////


// Param_plus [name k] = [[\nvar ${name} = _${name}._glue ().join ('');]]
// Param_star [name k] = [[\nvar ${name} = _${name}._glue ().join ('');]]
// Param_opt [name k] = [\nvar ${name} = _${name}._glue ().join ('');]]
// Param_flat [name] = [[\nvar ${name} = _${name}._glue ();]]

Param_plus : function (_name,_k) { 
_ruleEnter ("Param_plus");

var name = _name._glue ();
var k = _k._glue ();
var _result = `\nvar ${name} = _${name}._glue ().join ('');`; 
_ruleExit ("Param_plus");
return _result; 
},
            
Param_star : function (_name,_k) { 
_ruleEnter ("Param_star");

var name = _name._glue ();
var k = _k._glue ();
var _result = `\nvar ${name} = _${name}._glue ().join ('');`; 
_ruleExit ("Param_star");
return _result; 
},
            
Param_opt : function (_name,_k) { 
_ruleEnter ("Param_opt");

var name = _name._glue ();
var k = _k._glue ();
var _result = `[\nvar ${name} = _${name}._glue ().join ('');]]`; 
_ruleExit ("Param_opt");
return _result; 
},
            
Param_flat : function (_name) { 
_ruleEnter ("Param_flat");

var name = _name._glue ();
var _result = `\nvar ${name} = _${name}._glue ();`; 
_ruleExit ("Param_flat");
return _result; 
},
    ////

_terminal: function () { return this.sourceString; },
    _iter: function (...children) { return children.map(c => c._glue ()); },
spaces: function (x) { return this.sourceString; },
space: function (x) { return this.sourceString; }
};
// yyy

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

