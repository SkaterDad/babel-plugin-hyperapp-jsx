var UppercaseVariable = true;

// Include attribute named after the variables to ensure variables are only recognized for elements
var jsxA = <UppercaseVariable UppercaseVariable=""/>;
var jsxB = <UppercaseVariable UppercaseVariable="">Test</UppercaseVariable>;
var jsxC = <UppercaseVariable UppercaseVariable="">{UppercaseVariable}</UppercaseVariable>;
var jsxD = <UppercaseVariable />;
var jsxE = <UppercaseVariable>{UppercaseVariable}</UppercaseVariable>;
