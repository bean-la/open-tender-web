import React, { useState, useEffect, useRef, useContext } from 'react'
import { useSelector } from 'react-redux'
import { isMobile } from 'react-device-detect'

import { Switch, Route, useParams, useRouteMatch } from 'react-router-dom'

import { selectDisplaySettings } from '../slices'
import StickyNav from './StickyNav'
import { MenuContext } from './MenuPage'
import MenuRevenueCenters from './MenuRevenueCenters'
import MenuCategories from './MenuCategories'
import MenuLoading from './MenuLoading'
import RevenueCenter from './RevenueCenter'
import Hero from './Hero'
import RevenueCenterChild from './RevenueCenterChild'
import MenuError from './MenuError'

const Menu = () => {
  const {
    revenueCenter,
    categories,
    revenueCenters,
    isLoading,
    error,
    menuConfig,
  } = useContext(MenuContext)

  // These are bool switches configured by backend
  const {
    menuHero,
    menuHeroMobile,
    menuHeroChild,
    menuHeroChildMobile,
  } = useSelector(selectDisplaySettings)

  // convert backend switches to frontend logic
  // this could probably be media queried?  
  const showHero =
    menuHero === undefined ? true : isMobile ? menuHeroMobile : menuHero
  const showHeroChild =
    menuHeroChild === undefined
      ? true
      : isMobile
        ? menuHeroChildMobile
        : menuHeroChild

  const { path } = useRouteMatch();
  const params = useParams();
  const revenueCenterId = parseInt(params.revenueCenterId);

  // ref to this dom        
  const topRef = useRef()
  // initial selected revenue center state null
  const [selected, setSelected] = useState(revenueCenters.find((i) => i.revenue_center_id === revenueCenterId))
  // initially visible empty
  const [visible, setVisible] = useState([])
  // subnav items
  const navItems = visible ? visible.map((i) => i.name) : []

  // TODO: refactor into a sub-route
  // Filter the menu's Categories by the vendor (revenue_center_id) if it changes
  useEffect(() => {
    // if any rev centers
    if (revenueCenters) {

      // and only one (sub-center) is celected
      if (selected) {
        const id = selected.revenue_center_id
        // filter categories by that id
        setVisible(categories.filter((i) => i.revenue_center_id === id))
      } else {
        setVisible([])
      }
    } else {
      setVisible(categories)
    }
  }, [revenueCenters, categories, selected])

  // select specific vendor (sub-revenue-center)
  const change = (revenueCenter) => {
    setSelected(revenueCenter)
    window.scrollTo(0, topRef.current.offsetTop)
  }



  return (
    <>
      {/* Show selected sub-revenue center */}
      {selected && showHeroChild && (
        <Hero
          imageUrl={selected.large_image_url}
          classes="hero--right hero--top"
        >
          <RevenueCenterChild
            revenueCenter={selected}
            classes="rc--hero slide-up"
          />
        </Hero>
      )}
      {/* show 'parent' revenue center hero */}
      {!selected && revenueCenter && showHero && (
        <Hero imageUrl={menuConfig.background} classes="hero--right hero--top">
          <RevenueCenter
            revenueCenter={revenueCenter}
            classes="rc--hero slide-up"
            isMenu={true}
          />
        </Hero>
      )}
      {!error ? (
        <div className="menu__wrapper">
          <MenuLoading />
          <div ref={topRef}>
            {/* // TODO: Add sub-vendor-routes here */}


            <MenuRevenueCenters
              revenueCenters={revenueCenters}
              selected={selected}
              change={change}
            />

            {visible.length > 0 && (
              <>
                <StickyNav
                  revenueCenter={selected}
                  change={change}
                  items={navItems}
                  offset={-90}
                />
                <MenuCategories categories={visible} />
              </>
            )}


            {/* // Show list of vendors (only if none selected) */}

            {/* // Show categories for selected revenue center */}

          </div>
        </div>
      ) : !isLoading ? (
        <MenuError />
      ) : null}
    </>
  )
}

Menu.displayName = 'Menu'

export default Menu
