.PHONY: test
test: generate
	tree-sitter test -D

.PHONY: generate
generate: src/parser.c

src/parser.c: grammar.js src/scanner.c
	tree-sitter generate
