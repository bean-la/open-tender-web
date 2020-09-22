import React, { useState, useContext } from 'react'
import { useSelector } from 'react-redux'
import { isMobile } from 'react-device-detect'

import { Switch, Route, useParams, useRouteMatch } from 'react-router-dom'

import { selectDisplaySettings } from '../slices'
import StickyNav from './StickyNav'
import { MenuContext } from './MenuPage'
// import MenuRevenueCenters from './MenuRevenueCenters'
import MenuRevenueCenter from './MenuRevenueCenter'

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

  // Backend Config Boolean Settings
  // menuHero: true
  // menuHeroChild: true
  // menuHeroChildMobile: false
  // menuHeroMobile: false
  const {
    menuHero,
    menuHeroMobile,
    menuHeroChild,
    menuHeroChildMobile,
  } = useSelector(selectDisplaySettings)

  // TODO: surely there's a better way no?
  const showHero =
    menuHero === undefined
      ? // Default to show menuHero
        true
      : isMobile
      ? // But if it's set, and it's mobile, use mobile setting instead
        menuHeroMobile
      : menuHero

  const showHeroChild =
    menuHeroChild === undefined
      ? // Default to show menuHeroChild, if unset
        true
      : isMobile
      ? // But if it's set, and it's mobile, use mobile setting instead
        menuHeroChildMobile
      : menuHeroChild

  // For scroll to top on change
  // Can be handled by React Router
  // const topRef = useRef()

  // TODO: refactor selected to be powered by Router
  // Selected Sub-RevenueCenter
  // const [selected, setSelected] = useState(null)
  // visible categories
  const [visible] = useState(categories)
  // combine categories for sub-nav
  const navItems = visible ? visible.map((i) => i.name) : []

  // TODO: router should handle this if possible
  // useEffect(() => {
  //   if (revenueCenters) {
  //     if (selected) {
  //       const id = selected.revenue_center_id
  //       setVisible(categories.filter((i) => i.revenue_center_id === id))
  //     } else {
  //       setVisible([])
  //     }
  //   } else {
  //     setVisible(categories)
  //   }
  // }, [revenueCenters, categories, selected])

  // Use Router
  // <Link to={`${url}/${revenueCenter.revenue_center_id}`}>
  // const change = (revenueCenter) => {
  //   setSelected(revenueCenter)
  //   window.scrollTo(0, topRef.current.offsetTop)
  // }
  const { path } = useRouteMatch()

  return (
    <>
      <Switch>
        <Route exact path={path}>
          {/* No Sub-RevenueCenter, show parent revenue center hero (not child) */}
          {revenueCenter && showHero && (
            <Hero
              imageUrl={menuConfig.background}
              classes="hero--right hero--top"
            >
              <RevenueCenter
                revenueCenter={revenueCenter}
                classes="rc--hero slide-up"
                isMenu={true}
              />
            </Hero>
          )}
        </Route>
        <Route path={`${path}/:revenueCenterId`}>
          <MenuHeroSelectedSubVendor
            showHeroChild={showHeroChild}
            revenueCenters={revenueCenters}
          />
        </Route>
      </Switch>

      {!error ? (
        <div className="menu__wrapper">
          <MenuLoading />
          <Switch>
            {/* Show list of sub-revenuecenters */}
            <Route exact path={path}>
              <>
                {revenueCenters && (
                  <div className="menu__rcs">
                    <div className="menu__rcs__header ot-dark">
                      <div className="container">
                        <p className="menu__rcs__title ot-preface">
                          Please select a vendor
                        </p>
                      </div>
                    </div>

                    <div className="menu__rcs__items slide-up">
                      {revenueCenters.map((i) => (
                        <MenuRevenueCenter
                          key={i.revenue_center_id}
                          revenueCenter={i}
                        />
                      ))}
                    </div>
                  </div>
                )}
                {visible.length > 0 && (
                  <>
                    <StickyNav items={navItems} offset={-90} />
                    <MenuCategories categories={visible} />
                  </>
                )}
              </>
            </Route>
            <Route path={`${path}/:revenueCenterId`}>
              <MenuSelectedSubVendor
                revenueCenters={revenueCenters}
                categories={categories}
              />
            </Route>
          </Switch>
        </div>
      ) : !isLoading ? (
        <MenuError />
      ) : null}
    </>
  )
}

Menu.displayName = 'Menu'

export default Menu

const MenuHeroSelectedSubVendor = ({ revenueCenters, showHeroChild }) => {
  // const { path } = useRouteMatch()
  const params = useParams()
  const selectedRevenueCenterId = parseInt(params.revenueCenterId)

  const selected = (revenueCenters || []).find(
    (i) => i.revenue_center_id === selectedRevenueCenterId
  )

  return (
    <>
      {/* Sub-RevenueCenter is selected and desktop */}
      {showHeroChild && (
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
    </>
  )
}

const MenuSelectedSubVendor = ({ revenueCenters, categories }) => {
  const params = useParams()
  const selectedRevenueCenterId = parseInt(params.revenueCenterId)

  const selected = (revenueCenters || []).find(
    (i) => i.revenue_center_id === selectedRevenueCenterId
  )
  const visible = categories.filter(
    (i) => i.revenue_center_id === selectedRevenueCenterId
  )
  const navItems = visible ? visible.map((i) => i.name) : []

  return (
    <>
      {/* show 'selected' categories or all categories */}
      {visible.length > 0 && (
        <>
          <StickyNav revenueCenter={selected} items={navItems} offset={-90} />
          <MenuCategories categories={visible} />
        </>
      )}
    </>
  )
}
