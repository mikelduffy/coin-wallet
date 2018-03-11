import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { withStyles } from 'material-ui-next/styles'
import Button from 'material-ui-next/Button'
import Stepper, { Step, StepLabel, StepContent } from 'material-ui-next/Stepper'
import Typography from 'material-ui-next/Typography'
import TextField from 'material-ui-next/TextField'
// [Todo]: Refactor these components to use material ui 1.0
import SelectField from 'material-ui/SelectField'
import MenuItem from 'material-ui/MenuItem'

const styles = theme => ({
  button: {
    marginTop: theme.spacing.unit,
  },
})

class NewWallet extends Component {
  static propTypes = {
    classes: PropTypes.object.isRequired,
    wallet: PropTypes.object.isRequired,
    handleInitializeNewWallet: PropTypes.func.isRequired,
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

  handleInputChange = ({ target: { id, value } }) => {
    this.setState({
      [id]: value,
    })
  }

  render() {
    const coinOptions = {
      bcy: ['test'],
      btc: ['main', 'test3'],
      ltc: ['main'],
      doge: ['main'],
    }
    return (
      <div style={{ maxWidth: 380, maxHeight: 400, margin: 'auto' }}>
        <Stepper activeStep={this.state.currentStep - 1} orientation="vertical">
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
              <Button
                variant="raised"
                color="primary"
                className={this.props.classes.button}
                disabled={!this.state.coin || !this.state.network}
                onClick={this.handleNext}
              >
                Next
              </Button>
            </StepContent>
          </Step>
          <Step>
            <StepLabel>Create Wallet Password</StepLabel>
            <StepContent>
              <Typography variant="body1">
                To get started we need to create a password for your wallet.
                Please note that you should keep this password safe and secure.
                <b>
                  If you lose this password it is not possible to recover any
                  coins stored in your wallet!
                </b>
              </Typography>
              <TextField
                id="password"
                label="Enter Password"
                type="password"
                margin="dense"
                fullWidth
                value={this.state.password}
                onChange={this.handleInputChange}
              />
              <TextField
                id="confirmPassword"
                label="Confirm Password"
                type="password"
                margin="dense"
                fullWidth
                value={this.state.confirmPassword}
                onChange={this.handleInputChange}
              />
              <Button
                variant="raised"
                color="primary"
                className={this.props.classes.button}
                disabled={
                  !this.state.password ||
                  !this.state.confirmPassword ||
                  this.state.password !== this.state.confirmPassword
                }
                onClick={async () => {
                  try {
                    await this.props.handleInitializeNewWallet({
                      coin: this.state.coin,
                      network: this.state.network,
                      password: this.state.password,
                    })
                    this.handleNext()
                  } catch (error) {
                    this.setState({ status: 'error' })
                  }
                }}
              >
                Next
              </Button>
            </StepContent>
          </Step>
          <Step>
            <StepLabel>Backup Wallet</StepLabel>
            <StepContent>
              <Typography variant="body1">
                While we store your wallet in the browser, it is a good idea to
                download an encrypted backup and keep it in a safe place. Please
                enter your password again to download your backup. You can
                always download another backup from the settings page.
              </Typography>
              <TextField
                id="backupPassword"
                label="Enter Password"
                type="password"
                margin="dense"
                fullWidth
                value={this.state.backupPassword}
                onChange={this.handleInputChange}
              />
              <Button
                variant="raised"
                color="primary"
                className={this.props.classes.button}
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
              >
                Download Backup
              </Button>
            </StepContent>
          </Step>
          <Step>
            <StepLabel>Finished!</StepLabel>
            <StepContent>
              <Typography variant="body1">
                Great! You're all set. Let's take look at your new wallet!
              </Typography>
              <Button
                variant="raised"
                color="primary"
                className={this.props.classes.button}
                onClick={() => {
                  this.handleReset()
                  this.props.handleCompleteSetup()
                }}
              >
                Finish
              </Button>
            </StepContent>
          </Step>
        </Stepper>
      </div>
    )
  }
}

export default withStyles(styles)(NewWallet)
