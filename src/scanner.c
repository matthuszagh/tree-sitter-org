#include "tree_sitter/parser.h"
#include <stdio.h>
#include <stdlib.h>
#include <string.h>

#define ANC_STACK_SIZE 256

enum TokenType { SIBLING_STARS, CHILD_STARS, ANCESTOR_STARS };

struct Scanner {
	/* The most recent number of stars matched by the scanner. */
	uint8_t num_stars;
	/* Each time a child headline is found, we push the previous
	 * number of stars to the stack to keep track of the last
	 * parent. */
	uint8_t *ancestor_stack;
	/* ancestor stack position. */
	uint8_t stack_pos;
	/* record number of stars when trying to match an ancestor to
	 * the correct sibling. */
	uint8_t ancestor_stars;
};

void *tree_sitter_org_external_scanner_create()
{
	struct Scanner *scanner = malloc(sizeof(struct Scanner));
	scanner->num_stars = 1;
	scanner->ancestor_stack = malloc(ANC_STACK_SIZE);
	scanner->stack_pos = 0;
	scanner->ancestor_stars = 0;
	return scanner;
}

void tree_sitter_org_external_scanner_destroy(void *payload)
{
	struct Scanner *scanner = payload;
	free(scanner->ancestor_stack);
	free(scanner);
}

unsigned tree_sitter_org_external_scanner_serialize(void *payload, char *buffer)
{
	unsigned sz;
	struct Scanner *scanner = payload;

	sz = sizeof(*scanner);
	memcpy(buffer, scanner, sz);

	return sz;
}

void tree_sitter_org_external_scanner_deserialize(void *payload, const char *buffer,
						  unsigned length)
{
	struct Scanner *scanner = payload;
	memcpy(scanner, buffer, length);
}

bool tree_sitter_org_external_scanner_scan(void *payload, TSLexer *lexer, const bool *valid_symbols)
{
	uint8_t prev_stars;
	uint8_t cur_stars;
	struct Scanner *scanner = payload;

	prev_stars = scanner->num_stars;
	cur_stars = 0;

	/* we only want to consume characters if we're not looking for
	 * the sibling of an ancestor, since it can take multiple
	 * calls to scan to find the right sibling. */
	if (!scanner->ancestor_stars) {
		if (lexer->get_column(lexer) == 0 && lexer->lookahead == '*') {
			++cur_stars;
			lexer->advance(lexer, false);
		} else {
			return false;
		}

		while (lexer->lookahead == '*') {
			++cur_stars;
			lexer->advance(lexer, false);
		}

		if (cur_stars == prev_stars) {
			lexer->result_symbol = SIBLING_STARS;
		} else if (cur_stars > prev_stars) {
			scanner->ancestor_stack[scanner->stack_pos++] = prev_stars;
			scanner->num_stars = cur_stars;
			lexer->result_symbol = CHILD_STARS;
		} else {
			scanner->num_stars = scanner->ancestor_stack[--scanner->stack_pos];
			scanner->ancestor_stars = cur_stars;
			lexer->result_symbol = ANCESTOR_STARS;
		}
	} else {
		if (scanner->ancestor_stars == prev_stars) {
			scanner->ancestor_stars = 0;
			lexer->result_symbol = SIBLING_STARS;
		} else if (cur_stars < prev_stars) {
			scanner->num_stars = scanner->ancestor_stack[--scanner->stack_pos];
			lexer->result_symbol = ANCESTOR_STARS;
		} else {
			fputs("Error: Reached unreachable branch. Fix scanner.c.\n", stderr);
			exit(EXIT_FAILURE);
		}
	}

	return true;
}
