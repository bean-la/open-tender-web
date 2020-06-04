import React, { useEffect } from 'react'
import propTypes from 'prop-types'
import { useHistory } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import {
  fetchCustomerAddresses,
  updateCustomerAddress,
} from '../slices/customerSlice'
import { openModal } from '../slices/modalSlice'
import { setCurrentAddress } from '../slices/accountSlice'
import SectionRow from './SectionRow'
import OrderAddress from './OrderAddress'
import { Button } from '../packages'
import { setAddress } from '../slices/orderSlice'

const Addresses = ({ addresses, token, isLoading }) => {
  const dispatch = useDispatch()
  const history = useHistory()

  useEffect(() => {
    dispatch(fetchCustomerAddresses({ token, limit: 5 }))
  }, [dispatch, token])

  const handleEdit = (evt, address) => {
    evt.preventDefault()
    dispatch(setCurrentAddress(address))
    dispatch(openModal('address'))
    evt.target.blur()
  }

  const handleDefault = (evt, address) => {
    evt.preventDefault()
    const data = { ...address, is_default: true }
    const addressId = address.customer_address_id
    delete data.customer_address_id
    delete data.created_at
    delete data.last_used_at
    dispatch(updateCustomerAddress({ token, addressId, data }))
    evt.target.blur()
  }

  const handleDelete = (evt, address) => {
    evt.preventDefault()
    const data = { ...address, is_active: false }
    const addressId = address.customer_address_id
    delete data.customer_address_id
    delete data.created_at
    delete data.last_used_at
    dispatch(updateCustomerAddress({ token, addressId, data }))
    evt.target.blur()
  }

  const handleReorder = (evt, address) => {
    evt.preventDefault()
    dispatch(setAddress(address))
    history.push('/')
    evt.target.blur()
  }

  return (
    <div className="section__content bg-color border-radius">
      <div className="section__rows">
        {addresses.map((address) => (
          <SectionRow
            key={address.customer_address_id}
            title={address.description || 'Address'}
          >
            <div className="section__row__container">
              <div className="section__row__container__content">
                <OrderAddress address={address}>
                  <p className="font-size-small secondary-color">
                    <Button
                      text="edit"
                      classes="btn-link"
                      onClick={(evt) => handleEdit(evt, address)}
                      disabled={isLoading}
                    />
                    <span className="btn-link-separator">|</span>
                    <Button
                      text="make default"
                      classes="btn-link"
                      onClick={(evt) => handleDefault(evt, address)}
                      disabled={address.is_default || isLoading}
                    />
                    <span className="btn-link-separator">|</span>
                    <Button
                      text="delete"
                      classes="btn-link"
                      onClick={(evt) => handleDelete(evt, address)}
                      disabled={!address.is_active || isLoading}
                    />
                  </p>
                </OrderAddress>
              </div>
              <div className="section__row__container__buttons">
                <Button
                  text="Reorder from here"
                  icon="RefreshCw"
                  onClick={(evt) => handleReorder(evt, address)}
                  classes="btn--small font-size-small"
                  disabled={isLoading}
                />
              </div>
            </div>
          </SectionRow>
        ))}
      </div>
    </div>
  )
}

Addresses.displayName = 'Addresses'
Addresses.prototypes = {
  addresses: propTypes.array,
  token: propTypes.string,
  isLoading: propTypes.boolean,
}
export default Addresses
