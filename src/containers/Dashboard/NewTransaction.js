import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { withStyles } from 'material-ui-next/styles'
import Button from 'material-ui-next/Button'
import TextField from 'material-ui-next/TextField'
import Dialog, {
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from 'material-ui-next/Dialog'
import Loader from '../Loader'

const styles = theme => ({
  button: {
    margin: '20px 10px 20px 0px',
  },
})

class NewTransaction extends Component {
  static propTypes = {
    wallet: PropTypes.object.isRequired,
    availableBalance: PropTypes.number.isRequired,
    handleRefresh: PropTypes.func.isRequired,
  }

  initialState = {
    open: false,
    status: 'init', // init, loading, error
    toAddress: '',
    toAddressError: '',
    amount: '',
    amountError: '',
    password: '',
    passwordError: '',
  }

  state = this.initialState

  handleClickOpen = () => {
    this.setState({ open: true })
  }

  handleClose = () => {
    this.setState(this.initialState)
  }

  handleInput = ({ target: { id, value } }) => {
    if (id === 'amount' && value && !value.match(/^\d+\.?\d{0,5}$/i)) return

    this.setState({
      [id]: value,
      [`${id}Error`]: '',
    })
  }

  handleSend = async () => {
    try {
      // Use the first available wallet address. This should be made dynamic to support multiple addresses within a single wallet.
      const walletAddressId = Object.keys(this.props.wallet.addresses)[0]

      await this.props.wallet.sendPayment({
        fromAddressId: walletAddressId,
        toAddress: this.state.toAddress,
        amount: parseFloat(this.state.amount),
        password: this.state.password,
      })
      await this.props.handleRefresh()
      this.handleClose()
    } catch (error) {
      error.message === 'Invalid password.' &&
        this.setState({ passwordError: error.message })

      this.setState({ status: error })
    }
  }

  render() {
    return (
      <div>
        <Button
          variant="raised"
          color="primary"
          className={this.props.classes.button}
          onClick={this.props.handleRefresh}
        >
          Refresh
        </Button>
        <Button
          variant="raised"
          color="secondary"
          className={this.props.classes.button}
          onClick={this.handleClickOpen}
        >
          Send {this.props.wallet.coin.toUpperCase()}
        </Button>

        <Dialog open={this.state.open} onClose={this.handleClose}>
          <DialogTitle>Send {this.props.wallet.coin.toUpperCase()}</DialogTitle>
          {this.state.status === 'loading' && <Loader />}
          <DialogContent>
            <DialogContentText>
              Please ensure that you enter the correct address below. Funds are
              unrecoverable if you accidently send them to the wrong address.
            </DialogContentText>
            <TextField
              id="toAddress"
              autoFocus
              margin="dense"
              label="To Address"
              type="text"
              fullWidth
              error={!!this.state.toAddressError}
              helperText={this.state.toAddressError}
              value={this.state.toAddress}
              onChange={this.handleInput}
            />
            <TextField
              id="amount"
              margin="dense"
              label="Amount"
              type="text"
              fullWidth
              error={!!this.state.amountError}
              helperText={this.state.amountError}
              value={this.state.amount}
              onChange={this.handleInput}
            />
            <TextField
              id="password"
              margin="dense"
              label="Password"
              type="password"
              fullWidth
              error={!!this.state.passwordError}
              helperText={this.state.passwordError}
              value={this.state.password}
              onChange={this.handleInput}
            />
          </DialogContent>
          <DialogActions>
            <Button
              onClick={this.handleClose}
              color="primary"
              disabled={this.state.status === 'loading'}
            >
              Cancel
            </Button>
            <Button
              onClick={this.handleSend}
              color="secondary"
              disabled={
                !this.state.toAddress ||
                !this.state.amount ||
                !this.state.password ||
                this.state.status === 'loading' ||
                this.state.amount > this.props.availableBalance
              }
            >
              Send
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    )
  }
}

export default withStyles(styles)(NewTransaction)
