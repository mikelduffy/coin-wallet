import React from 'react'
import PropTypes from 'prop-types'
import AppBar from 'material-ui/AppBar'
import IconButton from 'material-ui/IconButton'
import SettingsIcon from 'material-ui/svg-icons/action/settings'

const Navigation = ({ handleToggleSettings }) => (
  <nav>
    <AppBar
      title="Coin Wallet"
      showMenuIconButton={false}
      iconElementRight={
        <IconButton onClick={handleToggleSettings}>
          <SettingsIcon />
        </IconButton>
      }
    />
  </nav>
)

Navigation.propTypes = {
  handleToggleSettings: PropTypes.func.isRequired,
}

export default Navigation
