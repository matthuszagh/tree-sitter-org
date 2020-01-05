#include "tree_sitter/parser.h"
#include <stdlib.h>

enum TokenType { STARS };

/* struct Scanner { */
/* 	bool in_match; */
/* }; */

void *tree_sitter_org_external_scanner_create() { return NULL; }

void tree_sitter_org_external_scanner_destroy(void *payload) {}

unsigned tree_sitter_org_external_scanner_serialize(void *payload, char *buffer) { return 0; }

void tree_sitter_org_external_scanner_deserialize(void *payload, const char *buffer,
						  unsigned length)
{
}

bool tree_sitter_org_external_scanner_scan(void *payload, TSLexer *lexer, const bool *valid_symbols)
{
	bool in_match = false;

	if (lexer->get_column(lexer) == 0 && lexer->lookahead == '*') {
		in_match = true;
		lexer->advance(lexer, false);
	} else {
		return false;
	}

	while (lexer->lookahead == '*') {
		lexer->advance(lexer, false);
	}
	lexer->result_symbol = STARS;
	return true;
}
