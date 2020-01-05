// See https://orgmode.org/worg/dev/org-syntax.html and org-element.el
// for org's syntax rules. It's not clear to me in the documentation,
// but to be explicit, in this grammar, a headline consists of text
// between the asterisks and newline as well as the optional section
// inside.

module.exports = grammar({
    name: 'org',

    extras: $ => [],

    // conflicts: $ => [
    //     [$._todo_title, $._non_todo_title],
    //     [$._todo_title_priority, $._todo_title_no_priority],
    //     [$._todo_title_priority_tags, $._todo_title_priority_no_tags],
    //     [$._todo_title_no_priority_tags, $._todo_title_no_priority_no_tags],
    //     [$._non_todo_title_tags, $._non_todo_title_no_tags],
    // ],

    externals: $ => [
        $._sibling_stars,
        $._child_stars,
        $._ancestor_stars,
    ],

    inline: $ => [
        $._decorated_title,
        $._todo_title,
        $._non_todo_title,
        $._todo_title_priority,
        $._todo_title_no_priority,
        $._todo_title_priority_no_tags,
        $._todo_title_priority_tags,
        $._todo_title_no_priority_no_tags,
        $._todo_title_no_priority_tags,
        $._non_todo_title_no_tags,
        $._non_todo_title_tags,
        $._common_headline,
    ],

    rules: {
        source_file: $ => seq(
            // TODO should include optional contents
            repeat(alias($.sibling_headline, $.headline))
        ),

        _common_headline: $ => seq(
            $._horiz_space,
            $._decorated_title,
            optional($._horiz_space),
            repeat($._newline),
            // TODO should include optional contents
            optional(choice(
                seq(
                    alias($.child_headline, $.headline),
                    repeat(alias($.sibling_headline, $.headline)),
                ),
                $._ancestor_stars,
            )),
        ),

        sibling_headline: $ => prec.left(seq(
            $._sibling_stars,
            $._common_headline,
        )),

        child_headline: $ => prec.left(seq(
            $._child_stars,
            $._common_headline,
        )),

        _decorated_title: $ => choice(
            $._todo_title,
            $._non_todo_title
        ),

        _todo_title: $ => choice(
            $._todo_title_priority,
            $._todo_title_no_priority,
        ),

        _todo_title_priority: $ => choice(
            $._todo_title_priority_no_tags,
            $._todo_title_priority_tags,
        ),

        _todo_title_no_priority: $ => choice(
            $._todo_title_no_priority_no_tags,
            $._todo_title_no_priority_tags,
        ),

        _non_todo_title: $ => choice(
            $._non_todo_title_no_tags,
            $._non_todo_title_tags,
        ),

        _todo_title_priority_no_tags: $ => seq(
            $.todo_keyword,
            $._horiz_space,
            $.priority,
            $._horiz_space,
            $.title
        ),

        _todo_title_priority_tags: $ => seq(
            $._todo_title_priority_no_tags,
            $.tags
        ),

        _todo_title_no_priority_no_tags: $ => seq(
            $.todo_keyword,
            $._horiz_space,
            $.title
        ),

        _todo_title_no_priority_tags: $ => seq(
            $._todo_title_no_priority_no_tags,
            $.tags
        ),

        _non_todo_title_no_tags: $ => seq(
            $.title
        ),

        _non_todo_title_tags: $ => seq(
            $._non_todo_title_no_tags,
            $.tags
        ),

        tags: $ => seq(
            ':',
            repeat1(seq(
                $.tag,
                ':'
            ))
        ),

        title: $ => /[^ \t\n]+/,
        todo_keyword: $ => /[a-zA-Z]+/,
        priority: $ => /\[#[A-Za-z]\]/,
        tag: $ => /[\w@#%]+/,
        _newline: $ => /\n/,
        _horiz_space: $ => /[ \t]+/
    }
})
