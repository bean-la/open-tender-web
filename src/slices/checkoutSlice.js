import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { postOrderValidate, postOrder } from '../services/requests'
import { handleCheckoutErrors } from '../packages/utils/errors'
import { openModal, closeModal } from './modalSlice'
import { getDefaultTip, prepareOrder } from '../packages/utils/cart'
import { isEmpty, contains } from '../packages/utils/helpers'
import { refreshRevenueCenter } from './orderSlice'
import { fetchMenu } from './menuSlice'
// import { getDefaultTip } from '../packages/utils/cart'

const initialState = {
  check: null,
  form: {
    details: {},
    customer: {},
    address: {},
    surcharges: [],
    discounts: [],
    promoCodes: [],
    tenders: [],
    tip: null,
  },
  submitting: false,
  completedOrder: null,
  errors: {},
  loading: 'idle',
}

const refreshKeys = ['revenue_center_id', 'service_type', 'requested_at']

const makeRefreshArgs = (order) => ({
  revenueCenterId: order.revenue_center_id,
  serviceType: order.service_type,
  requestedAt: order.requested_at,
})

export const validateOrder = createAsyncThunk(
  'checkout/validateOrder',
  async (order, thunkAPI) => {
    try {
      // console.log(JSON.stringify(order, null, 2))
      const check = await postOrderValidate(order)
      // console.log(JSON.stringify(check, null, 2))
      const errMessages = handleCheckoutErrors({ params: check.errors })
      // console.log(errMessages)
      let errors = {}
      const keys = Object.keys(errMessages)
      const args = makeRefreshArgs(order)
      if (contains(keys, refreshKeys)) {
        thunkAPI.dispatch(refreshRevenueCenter(args))
      } else if (contains(keys, ['cart'])) {
        thunkAPI.dispatch(fetchMenu(args))
      } else if (contains(keys, ['promo_codes'])) {
        errors['promo_codes'] = errMessages.promo_codes
      }
      return { check, errors }
    } catch (err) {
      // console.log(JSON.stringify(err, null, 2))
      return thunkAPI.rejectWithValue(err)
    }
  }
)

export const submitOrder = createAsyncThunk(
  'checkout/submitOrder',
  async (_, thunkAPI) => {
    const args = { text: 'Submitting your order...' }
    thunkAPI.dispatch(openModal({ type: 'working', args }))
    // start order assembly
    const { order, checkout } = thunkAPI.getState()
    const { revenueCenter, serviceType, requestedAt, cart } = order
    const { revenue_center_id: revenueCenterId } = revenueCenter || {}
    const { check, form } = checkout
    const {
      customer,
      address,
      details,
      surcharges,
      discounts,
      promoCodes,
      tenders,
      tip,
    } = form
    const defaultTip = check ? getDefaultTip(check.config) : null
    const fullAddress = { ...order.address, ...address }
    const data = {
      revenueCenterId,
      serviceType,
      requestedAt,
      cart,
      customer,
      address: isEmpty(fullAddress) ? null : fullAddress,
      details,
      surcharges,
      discounts,
      promoCodes,
      tip: tip === null ? defaultTip : tip,
      tenders,
    }
    const preparedOrder = prepareOrder(data)
    // end order assembly
    try {
      // console.log(JSON.stringify(order, null, 2))
      const response = await postOrder(preparedOrder)
      thunkAPI.dispatch(closeModal())
      return response
    } catch (err) {
      // console.log(JSON.stringify(err, null, 2))
      // const response = thunkAPI.rejectWithValue(err)
      thunkAPI.dispatch(closeModal())
      const errors = handleCheckoutErrors(err)
      // console.log(JSON.stringify(errors, null, 2))
      const keys = Object.keys(errors)
      const args = makeRefreshArgs(preparedOrder)
      if (contains(keys, refreshKeys)) {
        thunkAPI.dispatch(refreshRevenueCenter(args))
        return thunkAPI.rejectWithValue(null)
      } else if (contains(keys, ['cart'])) {
        thunkAPI.dispatch(fetchMenu(args))
        return thunkAPI.rejectWithValue(null)
      } else {
        return thunkAPI.rejectWithValue(errors)
      }
    }
  }
)

const checkoutSlice = createSlice({
  name: 'checkout',
  initialState: initialState,
  reducers: {
    resetCheckout: () => initialState,
    resetTip: (state) => {
      state.form.tip = null
    },
    resetErrors: (state) => {
      state.errors = {}
    },
    resetCompletedOrder: (state) => {
      state.completedOrder = null
    },
    updateForm: (state, action) => {
      if (action.payload.tenders) {
        const currentErrors = { ...state.errors }
        delete currentErrors.tenders
        state.errors = currentErrors
      }
      state.form = { ...state.form, ...action.payload }
    },
    updateCustomer: (state, action) => {
      const account = action.payload
      const customer = state.form.customer
      const customerId = customer ? customer.customer_id : null
      if (!account) {
        state.form.discounts = []
        state.form.tenders = []
        if (customerId) {
          state.form.customer = {}
          state.form.promoCodes = []
        }
      } else if (customerId && account.customer_id !== customerId) {
        state.form.customer = customer
        state.form.discounts = []
        state.form.tenders = []
      } else if (account && !customerId) {
        state.form.customer = account
        state.form.discounts = []
        state.form.tenders = []
      }
    },
    setSubmitting: (state, action) => {
      state.submitting = action.payload
    },
  },
  extraReducers: {
    // validateOrder

    [validateOrder.fulfilled]: (state, action) => {
      const { check, errors } = action.payload
      state.check = check
      state.errors = errors
      state.loading = 'idle'
    },
    [validateOrder.pending]: (state) => {
      state.loading = 'pending'
    },
    [validateOrder.rejected]: (state, action) => {
      state.errors = handleCheckoutErrors(action.payload)
      state.loading = 'idle'
      window.scroll(0, 0)
    },

    // submitOrder

    [submitOrder.fulfilled]: (state, action) => {
      state.completedOrder = action.payload
      state.check = null
      state.form = initialState.form
      state.errors = initialState.errors
      state.loading = 'idle'
      state.submitting = false
    },
    [submitOrder.pending]: (state) => {
      state.loading = 'pending'
    },
    [submitOrder.rejected]: (state, action) => {
      if (action.payload) {
        state.errors = action.payload
        window.scroll(0, 0)
      } else {
        state.errors = {}
      }
      state.loading = 'idle'
      state.submitting = false
    },
  },
})

export const {
  resetCheckout,
  resetErrors,
  resetCompletedOrder,
  resetTip,
  updateForm,
  updateCustomer,
  setSubmitting,
} = checkoutSlice.actions

export const selectCheckout = (state) => state.checkout
export const selectCheck = (state) => state.checkout.check
export const selectCompletedOrder = (state) => state.checkout.completedOrder
export const selectDiscounts = (state) => state.checkout.discounts

export default checkoutSlice.reducer
