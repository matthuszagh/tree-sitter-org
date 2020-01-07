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
        $._gen1_stars,
        $._gen2_stars,
        $._gen3_stars,
        $._gen4_stars,
        $._gen5_stars,
        $._gen6_stars,
        $._gen7_stars,
        $._gen8_stars,
        $._gen9_stars,
        $._gen10_stars,
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
            repeat(alias($.gen1, $.headline)),
        ),

        gen1: $ => seq(
            $._gen1_stars,
            $._common_headline,
            repeat(alias($.gen2, $.headline)),
        ),

        gen2: $ => seq(
            $._gen2_stars,
            $._common_headline,
            repeat(alias($.gen3, $.headline)),
        ),

        gen3: $ => seq(
            $._gen3_stars,
            $._common_headline,
            repeat(alias($.gen4, $.headline)),
        ),

        gen4: $ => seq(
            $._gen4_stars,
            $._common_headline,
            repeat(alias($.gen5, $.headline)),
        ),

        gen5: $ => seq(
            $._gen5_stars,
            $._common_headline,
            repeat(alias($.gen6, $.headline)),
        ),

        gen6: $ => seq(
            $._gen6_stars,
            $._common_headline,
            repeat(alias($.gen7, $.headline)),
        ),

        gen7: $ => seq(
            $._gen7_stars,
            $._common_headline,
            repeat(alias($.gen8, $.headline)),
        ),

        gen8: $ => seq(
            $._gen8_stars,
            $._common_headline,
            repeat(alias($.gen9, $.headline)),
        ),

        gen9: $ => seq(
            $._gen9_stars,
            $._common_headline,
            repeat(alias($.gen10, $.headline)),
        ),

        gen10: $ => seq(
            $._gen10_stars,
            $._common_headline,
        ),

        _common_headline: $ => seq(
            $._horiz_space,
            $._decorated_title,
            optional($._horiz_space),
            repeat($._newline),
            // TODO should include optional contents
        ),

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
        _horiz_space: $ => /[ \t]+/,
    }
})
