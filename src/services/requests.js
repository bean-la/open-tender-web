import { request, authRequest } from './request'

export const getConfig = () => {
  return request(`/config`)
}

export const getLocations = (revenue_center_type, lat, lng) => {
  let params = `revenue_center_type=${revenue_center_type}`
  if (lat && lng) params += `&lat=${lat}&lng=${lng}`
  return request(`/revenue-centers?${params}`)
}

export const getLocation = (revenue_center_type_id) => {
  return request(`/revenue-centers/${revenue_center_type_id}`)
}

export const getMenu = (locationId, serviceType, requestedAt) => {
  const params = `revenue_center_id=${locationId}&service_type=${serviceType}&requested_at=${requestedAt}`
  return request(`/menus?${params}`)
}

export const postOrderValidate = (order) => {
  return request(`/orders/validate`, 'POST', order)
}

export const postOrder = (order) => {
  return request(`/orders`, 'POST', order)
}

export const getCustomer = (token) => {
  return request(`/customer`, 'GET', null, null, token)
}

export const postLogin = (email, password) => {
  let auth
  const data = {
    grant_type: 'password',
    username: email,
    password: password,
  }
  return authRequest('/token', data)
    .then((resp) => {
      auth = resp
      return getCustomer(auth.access_token)
    })
    .then((customer) => ({ auth, customer }))
}

export const postLogout = (token) => {
  return authRequest('/revoke', { token })
}

export const getCustomerOrders = (token, timing, limit) => {
  let params = []
  if (limit) params.push(`limit=${limit}`)
  if (timing) params.push(`requested_type=${timing}`)
  params = params.length ? `?${params.join('&')}` : ''
  return request(`/customer/orders${params}`, 'GET', null, null, token)
}
