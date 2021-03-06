import React, { useEffect, useState, useCallback } from 'react'
import propTypes from 'prop-types'
import { useSelector, useDispatch } from 'react-redux'
import { useHistory } from 'react-router-dom'
import {
  setAddress,
  selectOrder,
  setRevenueCenter,
  selectAutoSelect,
  resetOrderType,
  fetchRevenueCenters,
  selectRevenueCenters,
  resetCheckout,
} from '@open-tender/redux'
import { makeDisplayedRevenueCenters, renameLocation } from '@open-tender/js'
import { Button, GoogleMapsAutocomplete } from '@open-tender/components'

import { selectConfig, selectSettings, selectGeoLatLng } from '../slices'
import iconMap from './iconMap'
import RevenueCenter from './RevenueCenter'
import PageTitle from './PageTitle'
import Loader from './Loader'

const RevenueCentersSelect = ({
  setCenter,
  center,
  maps,
  map,
  sessionToken,
  autocomplete,
}) => {
  const dispatch = useDispatch()
  const history = useHistory()
  const { revenueCenters: rcConfig } = useSelector(selectConfig)
  const { maxDistance, locationName } = useSelector(selectSettings)
  const geoLatLng = useSelector(selectGeoLatLng)
  const { revenueCenters, loading } = useSelector(selectRevenueCenters)
  const { serviceType, orderType, isOutpost, address } = useSelector(
    selectOrder
  )
  const coords = address || geoLatLng
  const formattedAddress = address ? address.formatted_address : ''
  const autoSelect = useSelector(selectAutoSelect)
  const [title, setTitle] = useState(rcConfig.title)
  const [msg, setMsg] = useState(rcConfig.subtitle)
  const [error, setError] = useState(null)
  const [displayedRevenueCenters, setDisplayedRevenueCenters] = useState([])
  const isLoading = loading === 'pending'
  const missingAddress = serviceType === 'DELIVERY' && !address
  const count = displayedRevenueCenters && displayedRevenueCenters.length > 0
  const showRevenueCenters = !isLoading && !error && count && !missingAddress

  useEffect(() => {
    if (orderType) {
      let params = { type: orderType }
      if (isOutpost) params = { ...params, is_outpost: true }
      if (coords) params = { ...params, lat: coords.lat, lng: coords.lng }
      dispatch(fetchRevenueCenters(params))
    }
  }, [orderType, isOutpost, coords, dispatch])

  const autoRouteCallack = useCallback(
    (revenueCenter) => {
      dispatch(setRevenueCenter(revenueCenter))
      return history.push(`/menu/${revenueCenter.slug}`)
    },
    [dispatch, history]
  )

  useEffect(() => {
    const { title, msg, error, displayed } = makeDisplayedRevenueCenters(
      revenueCenters,
      serviceType,
      address,
      geoLatLng,
      maxDistance
    )
    const count = displayed ? displayed.length : 0
    if (count && autoSelect && !error && !missingAddress) {
      autoRouteCallack(displayed[0])
    } else {
      setTitle(title)
      setMsg(msg)
      setError(error)
      setDisplayedRevenueCenters(displayed)
    }
  }, [
    revenueCenters,
    serviceType,
    address,
    geoLatLng,
    maxDistance,
    autoSelect,
    autoRouteCallack,
    missingAddress,
  ])

  const names = locationName[isOutpost ? 'OUTPOST' : serviceType]
  const renamedTitle = renameLocation(title, names)
  const renamedError = renameLocation(error, names)
  const renamedMsg = renameLocation(msg, names)

  const handleStartOver = (evt) => {
    evt.preventDefault()
    dispatch(resetOrderType())
    dispatch(resetCheckout())
    history.push(`/`)
    evt.target.blur()
  }

  return (
    <div className="map__content ot-bg-color-primary">
      {isLoading ? (
        <Loader
          text="Retrieving nearest locations..."
          className="loading--left"
        />
      ) : (
        <PageTitle
          title={renamedTitle}
          subtitle={!error ? renamedMsg : null}
          error={error ? renamedError : null}
        />
      )}
      <div className="content__body ot-bg-color-primary">
        <div className="container">
          {!isLoading && (
            <div className="">
              <GoogleMapsAutocomplete
                maps={maps}
                map={map}
                sessionToken={sessionToken}
                autocomplete={autocomplete}
                formattedAddress={formattedAddress}
                setAddress={(address) => dispatch(setAddress(address))}
                setCenter={setCenter}
                icon={iconMap['Navigation']}
              />
            </div>
          )}
          {showRevenueCenters && (
            <div className="rcs">
              <ul>
                {displayedRevenueCenters.map((revenueCenter) => (
                  <li key={revenueCenter.revenue_center_id}>
                    <RevenueCenter
                      revenueCenter={revenueCenter}
                      classes="rc--card"
                      showImage={true}
                    />
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
      {!isLoading && !showRevenueCenters && (
        <div className="content__footer">
          <div className="container">
            <Button
              text="Choose a different order type"
              classes="ot-btn-link"
              onClick={handleStartOver}
            ></Button>
          </div>
        </div>
      )}
    </div>
  )
}

RevenueCentersSelect.displayName = 'RevenueCentersSelect'
RevenueCentersSelect.propTypes = {
  revenueCenters: propTypes.array,
  setCenter: propTypes.func,
  maps: propTypes.object,
  map: propTypes.object,
  sessionToken: propTypes.object,
  autocomplete: propTypes.object,
}
export default RevenueCentersSelect
