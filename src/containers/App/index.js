import React, { Component } from 'react'
import { withStyles } from 'material-ui-next/styles'
import Navigation from '../Navigation'
import Setup from '../Setup'
import Settings from '../Settings'
import Dashboard from '../Dashboard'
import Wallet from '../../services/Wallet'
import { validateWalletOptions, isRequired } from '../../helpers/validation'

const styles = theme => ({
  root: {
    flexGrow: 1,
    zIndex: 1,
    overflow: 'hidden',
    position: 'relative',
    display: 'flex',
  },
})

class App extends Component {
  componentWillMount() {
    const localWallet = JSON.parse(this.wallet.getWallet())
    if (localWallet) {
      this.wallet.id = localWallet.id
      this.wallet.passwordHash = localWallet.passwordHash
      this.wallet.addresses = localWallet.addresses
      this.wallet.coin = localWallet.coin
      this.wallet.network = localWallet.network
      this.setState({
        setupComplete: true,
      })
    }
  }

  initialState = {
    setupComplete: false,
    settingsOpen: false,
  }

  state = this.initialState

  wallet = new Wallet({ password: 'temp' })

  handleInitializeNewWallet = async ({
    coin = isRequired('coin'),
    network = isRequired('network'),
    password = isRequired('password'),
  }) => {
    validateWalletOptions({ coin, network })
    this.wallet.coin = coin
    this.wallet.network = network
    this.wallet.changePassword({ oldPassword: 'temp', newPassword: password })
    await this.wallet.generateNewAddress({ password })
  }

  handleCompleteSetup = () => {
    this.setState({ setupComplete: true })
    this.wallet.setWallet()
  }

  handleReset = () => {
    this.wallet.removeWallet()
    this.wallet = new Wallet({ password: 'temp' })
    this.setState(this.initialState)
  }

  handleToggleSettings = () => {
    this.setState({ settingsOpen: !this.state.settingsOpen })
  }

  render() {
    return (
      <div className={this.props.classes.root}>
        <Navigation
          coin={this.wallet.coin || 'Coin'}
          handleToggleSettings={this.handleToggleSettings}
        />

        <Setup
          wallet={this.wallet}
          open={!this.state.setupComplete}
          handleInitializeNewWallet={this.handleInitializeNewWallet}
          handleCompleteSetup={this.handleCompleteSetup}
        />

        <Settings
          wallet={this.wallet}
          open={this.state.settingsOpen}
          handleClose={this.handleToggleSettings}
          handleReset={this.handleReset}
        />

        {this.state.setupComplete && <Dashboard wallet={this.wallet} />}
      </div>
    )
  }
}

export default withStyles(styles)(App)
