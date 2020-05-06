import React from 'react'
// import { useLocation } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { selectCartQuantity } from '../slices/orderSlice'
import { toggleSidebar } from '../slices/sidebarSlice'
import { iconMap } from '../utils/icons'
import Button from './Button'

const CartButton = () => {
  const dispatch = useDispatch()
  const cartquantity = useSelector(selectCartQuantity)

  const handleClick = (evt) => {
    evt.preventDefault()
    dispatch(toggleSidebar())
    evt.target.blur()
  }

  return (
    <div className="cart-button">
      <div className="cart-button__container">
        <div className="cart-button__count btn--cart-count">{cartquantity}</div>
        <Button onClick={handleClick} classes="cart-button__button btn--cart">
          <div className="cart-button__icon">{iconMap['ShoppingBag']}</div>
        </Button>
      </div>
    </div>
  )
}

CartButton.displayName = 'CartButton'

export default CartButton