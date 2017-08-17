var utils = require("./utils");

test("simple \\def without arguments render correctly", done => {
  utils.expectBodyToMatchSnapshot("def/no_arg.tex", done);
});

test("\\def multiple simple arguments render correctly", done => {
  utils.expectBodyToMatchSnapshot("def/many_simple_args.tex", done);
});

test("\\def with control seq suffix renders correctly", done => {
  utils.expectBodyToMatchSnapshot("def/control_seq_suffixed.tex", done);
});
