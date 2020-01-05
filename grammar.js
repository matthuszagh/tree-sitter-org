// See https://orgmode.org/worg/dev/org-syntax.html and org-element.el
// for org's syntax rules. It's not clear to me in the documentation,
// but to be explicit, in this grammar, a headline consists of text
// between the asterisks and newline as well as the optional section
// inside.

module.exports = grammar({
    name: 'org',

    conflicts: $ => [
        [ $._priority_title, $._non_priority_title ]
    ],

    externals: $ => [
        $._stars
        // $.contents
    ],

    rules: {
        // source_file: $ => $.section,

        source_file: $ => seq(
            // TODO should include optional contents
            prec.right(2, repeat($.section))
        ),

        section: $ => prec.left(seq(
            $.headline,
            // TODO should include optional contents
            repeat($.section)
        )),

        // section: $ => prec.right(
        //     seq(
        //         choice(
        //             // TODO other section contents
        //             prec.right(2, repeat1($.headline)),
        //             prec.right(seq(
        //                 prec.left($.contents),
        //                 prec(1, repeat($.headline))
        //             ))),
        //         repeat($._newline)
        //     )
        // ),

        // prec.left tries to match same level headings before section
        headline: $ => prec.left(seq(
            $._stars,
            $._horiz_space,
            $._non_priority_title,
            // choice(
            //     $._priority_title,
            //     $._non_priority_title
            // ),
            optional(seq(
                optional($._horiz_space),
                $.tags
            )),
            optional($._horiz_space),
            $._newline,
            // prec(0, optional($.section))
        )),

        _priority_title: $ => seq(
            $.keyword,
            $._horiz_space,
            $.priority,
            $._horiz_space,
            $.title
        ),

        _non_priority_title: $ => $.title,

        tags: $ => seq(
            ':',
            repeat1(seq(
                $.tag,
                ':'
            ))
        ),

        // ((^(?!\*).*$)+)
        contents: $ => /(.|\n)+/,
        // TODO this is a last, catch-all element. Should match everything but empty line.
        // paragraph: $ => /(.|\n)+/,
        keyword: $ => /[a-zA-Z]+/,
        priority: $ => /\[#[A-Za-z]\]/,
        title: $ => /.+/,
        tag: $ => /[\w@#%]+/,
        _newline: $ => /\n/,
        _horiz_space: $ => /[ \t]+/
    }
})
