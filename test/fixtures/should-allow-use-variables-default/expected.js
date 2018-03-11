var UppercaseVariable = true;
var lowercaseVariable = true;

// Include attribute named after the variables to ensure variables are only recognized for elements
var jsxA = {
  nodeName: UppercaseVariable,
  attributes: {
    UppercaseVariable: ""
  },
  children: null
};
var jsxB = {
  nodeName: UppercaseVariable,
  attributes: {
    UppercaseVariable: ""
  },
  children: []
};
var jsxC = {
  nodeName: UppercaseVariable,
  attributes: {
    UppercaseVariable: ""
  },
  children: [UppercaseVariable]
};
var jsxD = {
  nodeName: "lowercaseVariable",
  attributes: {
    lowercaseVariable: ""
  },
  children: null
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
