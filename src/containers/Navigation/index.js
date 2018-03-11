import React from 'react'
import PropTypes from 'prop-types'
import AppBar from 'material-ui-next/AppBar'
import Toolbar from 'material-ui-next/Toolbar'
import Typography from 'material-ui-next/Typography'
import IconButton from 'material-ui-next/IconButton'
import SettingsIcon from 'material-ui-icons/Settings'
import { withStyles } from 'material-ui-next/styles'

const styles = theme => ({
  title: {
    flex: 1,
  },
  button: {
    margin: theme.spacing.unit,
  },
})

const Navigation = ({ handleToggleSettings, classes, coin }) => (
  <AppBar position="absolute">
    <Toolbar>
      <Typography
        variant="title"
        color="inherit"
        noWrap
        className={classes.title}
      >
        {coin.toUpperCase()} Wallet
      </Typography>
      <IconButton className={classes.button} onClick={handleToggleSettings}>
        <SettingsIcon color="white" />
      </IconButton>
    </Toolbar>
  </AppBar>
)

Navigation.propTypes = {
  coin: PropTypes.string.isRequired,
  handleToggleSettings: PropTypes.func.isRequired,
}

export default withStyles(styles)(Navigation)
