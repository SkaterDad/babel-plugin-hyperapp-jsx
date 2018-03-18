var ListItem = function ListItem(props) {
  return {
    nodeName: "li",
    attributes: {},
    children: [props.text]
  };
};

var view = function view(_ref) {
  var data = _ref.data;

  return {
    nodeName: "ul",
    attributes: {},
    children: [].concat(
      { nodeName: "li", attributes: {}, children: ["Static item"]},
      data.map(function(d) {
        return ListItem({text: d});
      })
    )
  };
};