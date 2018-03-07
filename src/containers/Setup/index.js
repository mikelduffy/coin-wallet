import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Dialog from 'material-ui/Dialog'
import RaisedButton from 'material-ui/RaisedButton'
import TextField from 'material-ui/TextField'
import { Step, Stepper, StepLabel, StepContent } from 'material-ui/Stepper'
import SelectField from 'material-ui/SelectField'
import MenuItem from 'material-ui/MenuItem'

class Setup extends Component {
  static propTypes = {
    open: PropTypes.bool.isRequired,
    wallet: PropTypes.object.isRequired,
    handleInitializeWallet: PropTypes.func.isRequired,
    handleCompleteSetup: PropTypes.func.isRequired,
  }

  initialState = {
    currentStep: 1,
    totalSteps: 4,
    coin: '',
    coinIndex: null,
    network: '',
    networkIndex: null,
    password: '',
    confirmPassword: '',
    backupPassword: '',
  }

  state = this.initialState

  handleNext = () => {
    this.setState({
      currentStep: this.state.currentStep + 1,
    })
  }

  handleReset = () => {
    this.setState(this.initialState)
  }

  render() {
    const coinOptions = {
      bcy: ['test'],
      btc: ['main', 'test3'],
      ltc: ['main'],
      doge: ['main'],
    }

    return (
      <Dialog
        title="Welcome!"
        modal={true}
        open={this.props.open}
        autoScrollBodyContent={true}
      >
        <div style={{ maxWidth: 380, maxHeight: 400, margin: 'auto' }}>
          <Stepper
            activeStep={this.state.currentStep - 1}
            orientation="vertical"
          >
            <Step>
              <StepLabel>Select a Coin and Network</StepLabel>
              <StepContent>
                <SelectField
                  floatingLabelText="Coin"
                  value={this.state.coinIndex}
                  onChange={(e, i, v) => {
                    this.setState({
                      coin: Object.keys(coinOptions)[v],
                      coinIndex: v,
                      network: '',
                      networkIndex: null,
                    })
                  }}
                >
                  {Object.keys(coinOptions).map((coin, key) => (
                    <MenuItem
                      key={key}
                      value={key}
                      primaryText={coin.toUpperCase()}
                    />
                  ))}
                </SelectField>
                {this.state.coinIndex !== null && (
                  <SelectField
                    floatingLabelText="Network"
                    value={this.state.networkIndex}
                    onChange={(e, i, v) => {
                      this.setState({
                        network:
                          coinOptions[
                            Object.keys(coinOptions)[this.state.coinIndex]
                          ][v],
                        networkIndex: v,
                      })
                    }}
                  >
                    {coinOptions[
                      Object.keys(coinOptions)[this.state.coinIndex]
                    ].map((network, key) => (
                      <MenuItem key={key} value={key} primaryText={network} />
                    ))}
                  </SelectField>
                )}
                <RaisedButton
                  label="Next"
                  primary
                  disabled={!this.state.coin || !this.state.network}
                  disableTouchRipple={true}
                  disableFocusRipple={true}
                  onClick={this.handleNext}
                  style={{ margin: '12px 0' }}
                />
              </StepContent>
            </Step>
            <Step>
              <StepLabel>Create Wallet Password</StepLabel>
              <StepContent>
                To get started we need to create a password for your wallet.
                Please note that you should keep this password safe and secure.
                <b>
                  If you lose this password it is not possible to recover any
                  coins stored in your wallet!
                </b>
                <TextField
                  floatingLabelText="Enter Password"
                  type="password"
                  value={this.state.password}
                  onChange={(e, v) => {
                    this.setState({
                      password: v,
                    })
                  }}
                />
                <br />
                <TextField
                  floatingLabelText="Confirm Password"
                  type="password"
                  value={this.state.confirmPassword}
                  onChange={(e, v) => {
                    this.setState({
                      confirmPassword: v,
                    })
                  }}
                />
                <RaisedButton
                  label="Next"
                  primary
                  disableTouchRipple={true}
                  disableFocusRipple={true}
                  disabled={
                    !this.state.password ||
                    !this.state.confirmPassword ||
                    this.state.password !== this.state.confirmPassword
                  }
                  onClick={() => {
                    this.props.handleInitializeWallet({
                      coin: this.state.coin,
                      network: this.state.network,
                      password: this.state.password,
                    })
                    this.handleNext()
                  }}
                  style={{ margin: '12px 0' }}
                />
              </StepContent>
            </Step>
            <Step>
              <StepLabel>Backup Wallet</StepLabel>
              <StepContent>
                While we store your wallet in the browser, it is a good idea to
                download an encrypted backup and keep it in a safe place. Please
                enter your password again to download your backup. You can
                always download another backup from the settings page.
                <TextField
                  floatingLabelText="Enter Password"
                  type="password"
                  value={this.state.backupPassword}
                  onChange={(e, v) => {
                    this.setState({
                      backupPassword: v,
                    })
                  }}
                />
                <RaisedButton
                  label="Download Backup"
                  primary
                  disableTouchRipple={true}
                  disableFocusRipple={true}
                  disabled={
                    !this.state.backupPassword ||
                    this.state.password !== this.state.backupPassword
                  }
                  onClick={() => {
                    this.props.wallet.downloadWallet({
                      password: this.state.backupPassword,
                    })
                    this.handleNext()
                  }}
                  style={{ margin: '12px 0' }}
                />
              </StepContent>
            </Step>
            <Step>
              <StepLabel>Finished!</StepLabel>
              <StepContent>
                Great! You're all set. Let's take look at your new wallet!
                <br />
                <RaisedButton
                  label="Finish"
                  primary
                  disableTouchRipple={true}
                  disableFocusRipple={true}
                  onClick={() => {
                    this.handleReset()
                    this.props.handleCompleteSetup()
                  }}
                  style={{ margin: '12px 0' }}
                />
              </StepContent>
            </Step>
          </Stepper>
        </div>
      </Dialog>
    )
  }
}

export default Setup

// {
//   /* Getting Started */
// }
// {
//   this.state.status === 'init' && (
//     <div style={{ textAlign: 'center' }}>
//       <RaisedButton
//         label="Create a New Wallet"
//         primary
//         onClick={this.handleSelectPath}
//         disableTouchRipple={true}
//         disableFocusRipple={true}
//         style={{
//           margin: 12,
//         }}
//       />
//       <RaisedButton
//         label="Import an Existing Wallet"
//         primary
//         onClick={this.handleSelectPath}
//         disableTouchRipple={true}
//         disableFocusRipple={true}
//         style={{
//           margin: 12,
//         }}
//       />
//     </div>
//   )
// }
