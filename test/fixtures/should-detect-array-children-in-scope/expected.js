var testArray = [1,2,3];

function TableRow(props) {
  var data = props.data;

  var cells = data.props;

  var children = [
      TableCell({text:'#' + data.id})
  ];
  for (var i = 0; i < cells.length; i++) {
    children.push(TableCell({ key:i, text: cells[i]}));
  }
  return {
    nodeName: 'tr',
    attributes: {
      key: props.key,
      'data-id': data.id
    },
    children: children,
    key: props.key
  };
}

function NumbersList() {
  return {
    nodeName: 'div',
    attributes: {},
    children: testArray
  };
}

function NotInScope() {
  return {
    nodeName: 'div',
    attributes: {},
    children: [children]
  };
}