import React from 'react'
import propTypes from 'prop-types'
import { useSelector } from 'react-redux'
import { selectGroupOrder, selectTimezone } from '@open-tender/redux'
import { makeReadableDateStrFromIso } from '@open-tender/js'

const formatTime = (time) => {
  return time.replace('Today', 'today').replace('Tomorrow', 'tomorrow')
}

const GroupOrderInfo = ({ isJoin }) => {
  const tz = useSelector(selectTimezone)
  const groupOrder = useSelector(selectGroupOrder)
  const {
    cutoffAt,
    requestedAt,
    spendingLimit,
    guestLimit,
    guestCount,
  } = groupOrder
  const orderTime =
    requestedAt && tz ? makeReadableDateStrFromIso(requestedAt, tz, true) : null
  const cutoffTime =
    cutoffAt && tz ? makeReadableDateStrFromIso(cutoffAt, tz, true) : null
  const spotsRemaining = guestLimit ? guestLimit - guestCount : null
  return (
    <div className="join__info">
      <p>
        This order is current scheduled for {formatTime(orderTime)}, and{' '}
        {cutoffTime && (
          <span className="">
            orders must be submitted by {formatTime(cutoffTime)}
          </span>
        )}
        .
      </p>
      {spendingLimit && (
        <p>There is a spending limit of ${spendingLimit} for this order.</p>
      )}
      {isJoin && (
        <p>
          {spotsRemaining && (
            <span className="">Only {spotsRemaining} spots left! </span>
          )}{' '}
          Please enter a first and last name to get started.
        </p>
      )}
    </div>
  )
}

GroupOrderInfo.displayName = 'GroupOrderInfo'
GroupOrderInfo.propTypes = {
  isJoin: propTypes.bool,
}
export default GroupOrderInfo
