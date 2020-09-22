import React from 'react'
import propTypes from 'prop-types'
import { Link, useRouteMatch } from 'react-router-dom'

const MenuRevenueCenter = ({ revenueCenter, change }) => {
  const logo = revenueCenter.small_image_url
  // const bgImage = revenueCenter.small_image_url || revenueCenter.large_image_url
  // const bgStyle = bgImage ? { backgroundImage: `url(${bgImage}` } : null
  const bgStyle = null

  // const handleClick = (evt) => {
  //   evt.preventDefault()
  //   change(revenueCenter)
  //   evt.target.blur()
  // }

  const { url } = useRouteMatch()

  return (
    <div className="menu__rcs__item">
      <div className="menu__item__container ot-border-color">
        <Link to={`${url}/${revenueCenter.revenue_center_id}`}>
          <button className="ot-font-size">
            <div
              className="menu__item__image bg-image ot-bg-color-secondary ot-border-radius"
              style={bgStyle}
            >
              <div className="menu__item__overlay">
                <div className="menu__item__overlay__container">
                  <img
                    className="menu__item__overlay__logo"
                    src={logo}
                    alt={revenueCenter.name}
                  />
                </div>
              </div>
            </div>
          </button>
        </Link>
      </div>
    </div>
  )
}

MenuRevenueCenter.displayName = 'MenuRevenueCenter'
MenuRevenueCenter.propTypes = {
  revenueCenter: propTypes.object,
  change: propTypes.func,
}

export default MenuRevenueCenter
