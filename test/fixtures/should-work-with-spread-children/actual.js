const ListItem = props => <li>{props.text}</li>

const view = ({ data }) => (
  <ul>
    <li>Static item</li>
    {...data.map(d => <ListItem text={d} />)}
  </ul>
)