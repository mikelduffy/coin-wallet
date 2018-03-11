import React from 'react'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import getMuiTheme from 'material-ui/styles/getMuiTheme'
import lightBaseTheme from 'material-ui/styles/baseThemes/lightBaseTheme'
// import darkBaseTheme from 'material-ui/styles/baseThemes/darkBaseTheme'
import App from './containers/App'

const theme = getMuiTheme(lightBaseTheme)

const Root = () => (
  <MuiThemeProvider muiTheme={theme}>
    <App />
  </MuiThemeProvider>
)

export default Root
