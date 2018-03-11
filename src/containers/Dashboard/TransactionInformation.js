import React from 'react'
import PropTypes from 'prop-types'
import Typography from 'material-ui-next/Typography'

const TransactionInformation = props => {
  return (
    <div>
      <Typography variant="headline" gutterBottom>
        Information
      </Typography>
      {Object.keys(props).map((prop, key) => (
        <Typography key={key} variant="body1">
          {prop
            .replace(/([A-Z])/g, match => ` ${match}`)
            .replace(/^./, match => match.toUpperCase())}: {props[prop]}
        </Typography>
      ))}
    </div>
  )
}

TransactionInformation.propTypes = {
  address: PropTypes.string.isRequired,
  availableBalance: PropTypes.number.isRequired,
  totalPending: PropTypes.number.isRequired,
  finalBalance: PropTypes.number.isRequired,
  numberOfTransactions: PropTypes.number.isRequired,
}

export default TransactionInformation
