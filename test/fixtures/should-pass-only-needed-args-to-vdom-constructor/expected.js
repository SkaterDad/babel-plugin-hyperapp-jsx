var UppercaseVariable = true;

// Include attribute named after the variables to ensure variables are only recognized for elements
var jsxA = h(UppercaseVariable,
  { UppercaseVariable: "" }
);

var jsxB = h(UppercaseVariable,
  { UppercaseVariable: "" },
  "Test"
);

var jsxC = h(UppercaseVariable,
  { UppercaseVariable: "" },
  UppercaseVariable
);

var jsxD = h(UppercaseVariable, {});

var jsxE = h(UppercaseVariable, {}, UppercaseVariable);
