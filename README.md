# FMT-JS
A language to help in building languages.

Treat SCNs like bowls of candy.

Bolt Ohm-JS + Fmt-JS together --> transpile SCN-source-code to executable code.

(SCN == mini-DSL ; Solution Centric Notation).

# Usage
1. Load `fmt-js.html` into a browser (I use Chrome)
2. Click on one of the "Use ... test" buttons to populate the source text area, or, enter your own code.
3. Click "Generate JavaScript from FMT specification".
4. Cut/paste the generated code from the output window ("equivalent JavaScript code") into your Ohm-JS project.

# Documentation
to follow (second part of langjam)

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

# Ohm-JS and Ohm-Editor
I strongly recommend using Ohm-Editor and Ohm-JS for grammar development.
[ohm-js](https://ohmjs.org/)
[ohm-editor](https://ohmjs.org/editor/)
