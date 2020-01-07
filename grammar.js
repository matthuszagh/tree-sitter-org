// See https://orgmode.org/worg/dev/org-syntax.html and org-element.el
// for org's syntax rules. It's not clear to me in the documentation,
// but to be explicit, in this grammar, a headline consists of text
// between the asterisks and newline as well as the optional section
// inside.

module.exports = grammar({
    name: 'org',

    extras: $ => [],

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

        _decorated_title: $ => seq(
            optional(seq(
                $.todo_keyword,
                $._horiz_space,
            )),
            optional(seq(
                $.priority,
                $._horiz_space,
            )),
            $.title,
            optional(seq(
                $._horiz_space,
                $.tags,
            )),
        ),

        tags: $ => seq(
            ':',
            repeat1(seq(
                $.tag,
                ':'
            )),
        ),

        title: $ => /[^\n]+/,
        todo_keyword: $ => token(prec(1, choice(
            "TODO",
            "DONE",
            "HOLD",
            "CANCELLED",
        ))),
        priority: $ => token(prec(1, /\[#[A-Za-z]\]/)),
        tag: $ => token(prec(1, /[\w@#%]+/)),
        _newline: $ => /\n/,
        _horiz_space: $ => /[ \t]+/,
    }
})
