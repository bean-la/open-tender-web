import React, { useState, useRef, useEffect } from 'react'
import propTypes from 'prop-types'
import { isMobile } from 'react-device-detect'
import { Link } from 'react-scroll'
import { slugify } from '@open-tender/js'
import { Button } from '@open-tender/components'
import { Link as DOMLink } from 'react-router-dom'

import iconMap from './iconMap'

const StickyNav = ({
  items,
  revenueCenter,
  // change,
  offset = -100,
  duration = 500,
}) => {
  const [isSticky, setSticky] = useState(false)
  const stickyRef = useRef(null)
  const topOffset = isMobile ? 60 : 60
  const showNav = !(isMobile && revenueCenter)
  const stickyClass = `sticky ${isSticky ? 'ot-stuck' : ''}`
  const stickyInnerClass = `sticky__inner ot-dark ${
    isSticky ? 'ot-border-color ot-box-shadow' : ''
  }`

  useEffect(() => {
    const handleScroll = () => {
      if (stickyRef.current) {
        setSticky(stickyRef.current.getBoundingClientRect().top < topOffset)
      }
    }
    window.addEventListener('scroll', handleScroll)
    return () => {
      window.removeEventListener('scroll', () => handleScroll)
    }
  }, [topOffset])

  // const handleChange = (evt) => {
  //   evt.preventDefault()
  //   change(null)
  //   evt.target.blur()
  // }

  return (
    <div className={stickyClass} ref={stickyRef}>
      <div className={stickyInnerClass}>
        <div className="sticky__container">
          {revenueCenter && (
            <div className="sticky__filter">
              <div className="sticky__filter__logo ot-font-size-x-small">
                <img
                  src={revenueCenter.app_image_url}
                  alt={revenueCenter.name}
                />
              </div>
              <div className="sticky__filter__content">
                <DOMLink to="/locations">
                  <Button
                    text="Switch"
                    icon={iconMap['RefreshCw']}
                    classes="ot-btn--small ot-btn--secondary ot-font-size-small"
                  />
                </DOMLink>
              </div>
            </div>
          )}
          {showNav && (
            <div className="sticky__items">
              <ul>
                {items.map((item, index) => {
                  const sectionId = slugify(item)
                  return (
                    <li key={`${sectionId}-${index}`} className="ot-preface">
                      <Link
                        activeClass="active"
                        className="ot-link-light"
                        to={sectionId}
                        spy={true}
                        smooth={true}
                        offset={offset}
                        duration={duration}
                      >
                        {item}
                      </Link>
                    </li>
                  )
                })}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

StickyNav.displayName = 'StickyNav'
StickyNav.propTypes = {
  items: propTypes.array,
  offset: propTypes.number,
}

export default StickyNav
