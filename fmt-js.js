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
        sem.addOperation ('_fmt', fmtSemantics);
        var generatedFmtWalker = sem (fmtcst);
        var generated = generatedFmtWalker._fmt ();
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
SemanticsSCL {
  semantics = ws* semanticsStatement+
  semanticsStatement = ruleName ws* "[" ws* parameters "]" ws* "=" ws* code? rewrites ws*

  ruleName = letter1 letterRest*
  
  parameters = parameter*
  parameter = treeparameter | flatparameter
  flatparameter = fpws | fpd
  fpws = pname ws+
  fpd = pname delimiter
  treeparameter = "@" tflatparameter
  tflatparameter = tfpws | tfpd
  tfpws = pname ws+
  tfpd = pname delimiter

  pname = letterRest letterRest*
  rewrites = rw1 | rw2
  rw1 = "[[" ws* code? rwstringWithNewlines "]]" ws*
  rw2 = rwstring

  letter1 = "_" | "a" .. "z" | "A" .. "Z"
  letterRest = "0" .. "9" | letter1

  comment = "%%" notEol* eol
  notEol = ~eol any
  
  eol = "\n"
  ws = comment | eol | " " | "\t" | "," 
  delimiter = &"]" | &"="

  rwstring = stringchar*
  stringchar = ~"\n" any

  rwstringWithNewlines = nlstringchar*
   nlstringchar = ~"]]" ~"}}" any
  code = "{{" ws* codeString "}}" ws* 
  codeString = rwstringWithNewlines

}
`;


var varNameStack = [];


var fmtSemantics = {   
    semantics: function (_1s, _2s) { 
        var __1s = _1s._fmt ().join (''); 
        var __2s = _2s._fmt ().join (''); 
        return `
const semObject = {
${__2s}
_terminal: function () { return this.sourceString; },
_iter: function (...children) { return children.map(c => c._fmt ()); }
}}`; 
    },
    semanticsStatement: function (_1, _2s, _3, _4s, _5, _6, _7s, _8, _9s, _10s, _11, _12s) {
        varNameStack = [];
        var __1 = _1._fmt ();
        var __2s = _2s._fmt ().join ('');
        var __3 = _3._fmt ();
        var __4s = _4s._fmt ().join ('');
        var __5 = _5._fmt ();
        var __6 = _6._fmt ();
        var __7s = _7s._fmt ().join ('');
        var __8 = _8._fmt ();
        var __9s = _9s._fmt ().join ('');
        var __10s = _10s._fmt ().join ('');
        var __11 = _11._fmt ();
        var __12s = _12s._fmt ().join ('');
        return `
${__1} : function (${__5}) { 
_ruleEnter ("${__1}");
${__10s}
${varNameStack.join ('\n')}
var _result = \`${__11}\`; 
_ruleExit ("${__1}");
return _result; 
},
            `;
    },
    ruleName: function (_1, _2s) { var __1 = _1._fmt (); var __2s = _2s._fmt ().join (''); return __1 + __2s; },
    parameters: function (_1s) {  var __1s = _1s._fmt ().join (','); return __1s; },
    
    parameter: function (_1) { 
        var __1 = _1._fmt ();
        return `${__1}`;
    },
    flatparameter: function (_1) { 
        var __1 = _1._fmt (); 
        varNameStack.push (`var ${__1} = _${__1}._fmt ();`);
        return `_${__1}`;
    },
    fpws: function (_1, _2s) { var __1 = _1._fmt (); var __2s = _2s._fmt ().join (''); return __1; },
    fpd: function (_1, _2) { var __1 = _1._fmt (); var __2 = _2._fmt (); return __1; },
    
    treeparameter: function (_1, _2) { 
        var __1 = _1._fmt (); 
        var __2 = _2._fmt (); 
        varNameStack.push (`var ${__2} = _${__2}._fmt ().join ('');`);
        return `_${__2}`; 
    },
    tflatparameter: function (_1) { 
        var __1 = _1._fmt (); 
        return `${__1}`;
    },
    tfpws: function (_1, _2s) { var __1 = _1._fmt (); var __2s = _2s._fmt ().join (''); return __1; },
    tfpd: function (_1, _2) { var __1 = _1._fmt (); var __2 = _2._fmt (); return __1; },

    pname: function (_1, _2s) { var __1 = _1._fmt (); var __2s = _2s._fmt ().join (''); return __1 + __2s;},
    rewrites: function (_1) { var __1 = _1._fmt (); return __1; },
    rw1: function (_1, _2s, codeQ, _3, _4, _5s) {
        var __2 = _2s._fmt ().join ('');
        var code = codeQ._fmt ();
        var __3 = _3._fmt ();
        if (0 === code.length) {
            return `${__2}${__3}`;
        } else {
            process.stderr.write ('code is NOT empty\n');
            throw "code in rw1 NIY";
            return `${code}${__3}`;
        }
    },
    rw2: function (_1) { var __1 = _1._fmt (); return __1; },
    letter1: function (_1) { var __1 = _1._fmt (); return __1; },
    letterRest: function (_1) { var __1 = _1._fmt (); return __1; },

    ws: function (_1) { var __1 = _1._fmt (); return __1; },
    delimiter: function (_1) { return ""; },

    rwstring: function (_1s) { var __1s = _1s._fmt ().join (''); return __1s; },
    stringchar: function (_1) { var __1 = _1._fmt (); return __1; },
    rwstringWithNewlines: function (_1s) { var __1s = _1s._fmt ().join (''); return __1s; },
    nlstringchar: function (_1) { var __1 = _1._fmt (); return __1; },

    code: function (_1, _2s, _3, _4, _5s) { return _3._fmt (); },
    codeString: function (_1) { return _1._fmt (); },

    // Ohm v16 requires ...children, previous versions require no ...
    _iter: function (...children) { return children.map(c => c._fmt ()); },
    _terminal: function () { return this.sourceString; }
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

