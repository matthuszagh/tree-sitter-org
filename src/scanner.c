#include "tree_sitter/parser.h"
#include <stdio.h>
#include <stdlib.h>
#include <string.h>

#define ANC_STACK_SIZE 256

enum TokenType {
	GEN1_STARS,
	GEN2_STARS,
	GEN3_STARS,
	GEN4_STARS,
	GEN5_STARS,
	GEN6_STARS,
	GEN7_STARS,
	GEN8_STARS,
	GEN9_STARS,
	GEN10_STARS,
	NON_STAR,
};

void *tree_sitter_org_external_scanner_create() { return NULL; }

void tree_sitter_org_external_scanner_destroy(void *payload) {}

unsigned tree_sitter_org_external_scanner_serialize(void *payload, char *buffer) { return 0; }

void tree_sitter_org_external_scanner_deserialize(void *payload, const char *buffer,
						  unsigned length)
{
}

bool tree_sitter_org_external_scanner_scan(void *payload, TSLexer *lexer, const bool *valid_symbols)
{
	if (valid_symbols[NON_STAR] && lexer->get_column(lexer) == 0 && lexer->lookahead != '*' &&
	    lexer->lookahead != '\0') {
		lexer->result_symbol = NON_STAR;
	} else if (valid_symbols[0]) {
		uint8_t num_stars;

		num_stars = 0;
		if (lexer->get_column(lexer) == 0 && lexer->lookahead == '*') {
			lexer->advance(lexer, false);
		} else {
			return false;
		}

		while (lexer->lookahead == '*') {
			++num_stars;
			lexer->advance(lexer, false);
		}

		lexer->result_symbol = num_stars;
	}

	return true;
}
