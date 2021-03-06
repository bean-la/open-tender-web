import React from 'react'
import propTypes from 'prop-types'

const handleOrderError = (error) => {
  switch (error.status) {
    case 404:
      return "We couldn't find this order. Please double check your order ID and give it another try."
    default:
      return error.detail || error.message
  }
}

const OrderError = ({ error, backLink, backText }) => {
  if (!error) return null
  const errMsg = handleOrderError(error)
  return (
    <div className="order__header">
      <p className="ot-preface ot-color-error">Uh oh. Something went wrong.</p>
      <div className="order__error">
        <div className="order__error__message">
          <p className="ot-color-error ot-bold ot-font-size-big">{errMsg}</p>
          <p className="ot-font-size-small">
            <button type="button" className="ot-btn-link" onClick={backLink}>
              {backText}
            </button>
          </p>
        </div>
      </div>
    </div>
  )
}

OrderError.displayName = 'OrderError'
OrderError.propTypes = {
  error: propTypes.string,
  backLink: propTypes.func,
  backText: propTypes.string,
}

export default OrderError
