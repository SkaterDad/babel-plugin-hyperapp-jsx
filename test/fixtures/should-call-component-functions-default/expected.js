var UppercaseVariable = true;
var lowercaseVariable = true;

// Include attribute named after the variables to ensure variables are only recognized for elements
var jsxA = UppercaseVariable(
  { UppercaseVariable: "" }
);

var jsxB = UppercaseVariable(
  { UppercaseVariable: "" }
);

var jsxC = UppercaseVariable(
  {
    UppercaseVariable: ""
  },
  [UppercaseVariable]
);

var jsxD = {
  nodeName: "lowercaseVariable",
  attributes: {
    lowercaseVariable: ""
  },
  children: []
};
var jsxE = {
  nodeName: "lowercaseVariable",
  attributes: {
    lowercaseVariable: ""
  },
  children: []
};
var jsxF = {
  nodeName: "lowercaseVariable",
  attributes: {
    lowercaseVariable: ""
  },
  children: [lowercaseVariable]
};
