const testArray = [1,2,3]

function TableRow(props) {
  const { data } = props;

  const cells = data.props;

  const children = [
      <TableCell text={'#' + data.id}></TableCell>
  ];
  for (let i = 0; i < cells.length; i++) {
    children.push(<TableCell key={i} text={cells[i]}></TableCell>);
  }

  return <tr key={props.key} data-id={data.id}>{children}</tr>;
}

function NumbersList() {
  return <div>{testArray}</div>
}

function NotInScope() {
  return <div>{children}</div>
}
