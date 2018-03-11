import React from 'react'
import PropTypes from 'prop-types'
import {
  Table,
  TableBody,
  TableHeader,
  TableHeaderColumn,
  TableRow,
  TableRowColumn,
} from 'material-ui/Table'
import Typography from 'material-ui-next/Typography'
import moment from 'moment'

const TransactionListing = ({ title, transactions }) => (
  <div>
    <Typography variant="headline" gutterBottom>
      {title}
    </Typography>
    <Table selectable={false}>
      <TableHeader displaySelectAll={false} adjustForCheckbox={false}>
        <TableRow>
          <TableHeaderColumn>Date</TableHeaderColumn>
          <TableHeaderColumn>Amount</TableHeaderColumn>
          <TableHeaderColumn>Confirmations</TableHeaderColumn>
          <TableHeaderColumn>Tx Hash</TableHeaderColumn>
        </TableRow>
      </TableHeader>
      <TableBody displayRowCheckbox={false}>
        {transactions.map((tx, key) => {
          return (
            <TableRow key={key}>
              <TableRowColumn>{moment(tx.confirmed).fromNow()}</TableRowColumn>
              <TableRowColumn>{tx.value}</TableRowColumn>
              <TableRowColumn>{tx.confirmations}</TableRowColumn>
              <TableRowColumn>{tx.tx_hash}</TableRowColumn>
            </TableRow>
          )
        })}
      </TableBody>
    </Table>
  </div>
)

TransactionListing.propTypes = {
  transactions: PropTypes.array.isRequired,
}

export default TransactionListing
