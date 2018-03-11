import 'normalize.css'
import React from 'react'
import ReactDOM from 'react-dom'
import registerServiceWorker from './registerServiceWorker'
import injectTapEventPlugin from 'react-tap-event-plugin'
import { AppContainer } from 'react-hot-loader'
import Root from './Root'

injectTapEventPlugin()

const render = Component => {
  ReactDOM.render(
    <AppContainer>
      <Root />
    </AppContainer>,
    document.getElementById('root')
  )
}

registerServiceWorker()

render(Root)

if (module.hot) {
  module.hot.accept('./Root', () => {
    render(Root)
  })
}
