var ZVariable = true;
var NotZVariable = true;

// Include attribute named after the variables to ensure variables are only recognized for elements
var jsxA = ZVariable(
  { ZVariable: "" }
);
var jsxB = ZVariable(
  { ZVariable: "" }
);
var jsxC = ZVariable(
  { ZVariable: "" },
  [ZVariable]
);

var jsxD = {
  nodeName: "NotZVariable",
  attributes: {
    NotZVariable: ""
  },
  children: []
};
var jsxE = {
  nodeName: "NotZVariable",
  attributes: {
    NotZVariable: ""
  },
  children: []
};
var jsxF = {
  nodeName: "NotZVariable",
  attributes: {
    NotZVariable: ""
  },
  children: [NotZVariable]
};
