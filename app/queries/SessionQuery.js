import Relay from 'react-relay'

export default {
  session: () => Relay.QL`query { session }`
}
