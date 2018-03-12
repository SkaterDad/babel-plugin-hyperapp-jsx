const Component = (props) => {
  return (
    <div>This is a component.</div>
  )
}
const LazyComp = (props) => (state, actions) => (
  <Component {...props} lazy={true} />
)

const view = (state, actions) => (
  <div class="container">
    <Component />
    <LazyComp />
  </div>
)
