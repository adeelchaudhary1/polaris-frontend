import { configureStore } from '@reduxjs/toolkit'
import farmsReducer from './farms'
import poolsReducer from './pools'
import sFarmsReducer from './sFarms'

export default configureStore({
  devTools: process.env.NODE_ENV !== 'production',
  reducer: {
    farms: farmsReducer,
    pools: poolsReducer,
    sFarms: sFarmsReducer,
  },
})
