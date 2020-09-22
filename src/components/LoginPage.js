import React, { useEffect } from 'react'
import { useHistory } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { selectCustomer } from '@open-tender/redux'
import { openModal } from '../slices'

export default () => {
  const history = useHistory()
  const dispatch = useDispatch()

  const { auth, profile } = useSelector(selectCustomer)
  const token = auth ? auth.access_token : null

  useEffect(() => {
    if (!token) dispatch(openModal({ type: 'login' }))
    else history.replace('/account')
    console.log('got the token ', token)
  }, [token, dispatch])

  return (
    <>
      <h3>login page</h3>
    </>
  )
}
