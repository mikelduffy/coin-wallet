import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { withStyles } from 'material-ui-next/styles'
import Dialog, { DialogContent, DialogTitle } from 'material-ui-next/Dialog'
import Button from 'material-ui-next/Button'
import NewWallet from './NewWallet'
import ExistingWallet from './ExistingWallet'

const styles = theme => ({
  button: {
    margin: theme.spacing.unit,
  },
})

class Setup extends Component {
  static propTypes = {
    open: PropTypes.bool.isRequired,
    wallet: PropTypes.object.isRequired,
    handleInitializeNewWallet: PropTypes.func.isRequired,
    handleCompleteSetup: PropTypes.func.isRequired,
  }

  initialState = {
    path: '', // new, existing
  }

  state = this.initialState

  handleReset = () => {
    this.setState(this.initialState)
  }

  render() {
    return (
      <Dialog open={this.props.open}>
        <DialogTitle>
          {!this.state.path && 'Welcome!'}
          {this.state.path === 'new' && 'Create New Wallet'}
          {this.state.path === 'existing' && 'Import Existing Wallet'}
        </DialogTitle>
        <DialogContent>
          {this.state.path === '' && (
            <div style={{ textAlign: 'center' }}>
              <Button
                variant="raised"
                color="primary"
                onClick={() => {
                  this.setState({ path: 'new' })
                }}
                className={this.props.classes.button}
              >
                Create New Wallet
              </Button>
              <Button
                variant="raised"
                color="primary"
                onClick={() => {
                  this.setState({ path: 'existing' })
                }}
                className={this.props.classes.button}
              >
                Import Existing Wallet
              </Button>
            </div>
          )}
          {this.state.path === 'new' && (
            <NewWallet
              wallet={this.props.wallet}
              handleCompleteSetup={() => {
                this.handleReset()
                this.props.handleCompleteSetup()
              }}
              handleInitializeNewWallet={this.props.handleInitializeNewWallet}
            />
          )}
          {this.state.path === 'existing' && (
            <ExistingWallet
              wallet={this.props.wallet}
              handleCompleteSetup={() => {
                this.handleReset()
                this.props.handleCompleteSetup()
              }}
            />
          )}
        </DialogContent>
      </Dialog>
    )
  }
}

export default withStyles(styles)(Setup)
