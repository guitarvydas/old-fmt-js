# FMT-JS
A language to help in building languages.

Treat SCNs like bowls of candy.

Bolt Ohm-JS + Fmt-JS together --> transpile SCN-source-code to executable code.

(SCN == mini-DSL ; Solution Centric Notation).

# Usage
Load `fmt-js.html` into a browser (I use Chrome) and click "Generate JavaScript from FMT specification".

Cut/paste generated code into your Ohm-JS project.

# Documentation
to follow (second part of langjam)

# Example Tests
change the line
```
var src = smallsrc;
```

to
```
var src = smallsrc2;
```

or to
```
var src = smallsrc3;
```

or to
```
var src = bigsrc;
```

in `fmt-js.html`, then re-load and re-run.

# N.B.

The output is Javascript, meant to be bolted into an Ohm-JS project.

The output Javascript is not neatly formatted.  I emphasize machine-readability-writability over human-readability.

Human readability can be achieved by grinding the output through a pretty-printer (I currently use emacs' "indent-region" command).

# Other Languages, C++, Python, Rust, JSON, Etc
Ohm-JS and Fmt-JS happen to be written in Javascript, but, they implement an new DSL (an SCN for parsing).

It should be possible to generate code for any other textual language using Ohm-JS and Fmt-JS.

(In fact, I have generated Python and JSON and Common Lisp code using Ohm-JS).

# Contrib
I would enjoy handing this off to anyone who wants to understand it and clean it up.
