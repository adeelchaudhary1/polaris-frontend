/* eslint-disable no-param-reassign */
import { createSlice } from '@reduxjs/toolkit'
import sFarmsConfig from 'config/constants/sfarms'
import fetchSFarms from './fetchSFarms'
import {
  fetchSFarmUserEarnings,
  fetchSFarmUserAllowances,
  fetchSFarmUserTokenBalances,
  fetchSFarmUserStakedBalances,
  fetchTotalEarnings,
} from './fetchSFarmUser'
import { SFarmsState, SFarm } from '../types'

const initialState: SFarmsState = { data: [...sFarmsConfig] }

export const farmsSlice = createSlice({
  name: 'SFarms',
  initialState,
  reducers: {
    setFarmsPublicData: (state, action) => {
      const liveFarmsData: SFarm[] = action.payload
      state.data = state.data.map((farm) => {
        const liveFarmData = liveFarmsData.find((f) => f.pid === farm.pid)
        return { ...farm, ...liveFarmData }
      })
    },
    setFarmUserData: (state, action) => {
      const { arrayOfUserDataObjects } = action.payload
      arrayOfUserDataObjects.forEach((userDataEl) => {
        const { index } = userDataEl
        state.data[index] = { ...state.data[index], userData: userDataEl }
      })
    },
  },
})

// Actions
export const { setFarmsPublicData, setFarmUserData } = farmsSlice.actions

// Thunks
export const fetchSFarmsPublicDataAsync = () => async (dispatch) => {
  const farms = await fetchSFarms()
  dispatch(setFarmsPublicData(farms))
}
export const fetchSFarmUserDataAsync = (account) => async (dispatch) => {

  const userFarmAllowances = await fetchSFarmUserAllowances(account)
  const userFarmTokenBalances = await fetchSFarmUserTokenBalances(account)
  const userStakedBalances = await fetchSFarmUserStakedBalances(account)
  const userFarmEarnings = await fetchSFarmUserEarnings(account)
  const totalEarnings = await fetchTotalEarnings()

  const arrayOfUserDataObjects = userFarmAllowances.map((farmAllowance, index) => {
    return {
      index,
      allowance: userFarmAllowances[index],
      totalReward: totalEarnings[index],
      tokenBalance: userFarmTokenBalances[index],
      stakedBalance: userStakedBalances[index],
      earnings: userFarmEarnings[index],
    }
  })

  dispatch(setFarmUserData({ arrayOfUserDataObjects }))
}

export default farmsSlice.reducer
