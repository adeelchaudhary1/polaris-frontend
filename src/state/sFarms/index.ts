/* eslint-disable no-param-reassign */
import { createSlice } from '@reduxjs/toolkit'
import sFarmsConfig from 'config/constants/sfarms'
import fetchSFarms from './fetchSFarms'
import {
  fetchSFarmUserEarnings,
  fetchSFarmUserAllowances,
  fetchSFarmUserPolarAllowances,
  fetchSFarmUserTokenBalances,
  fetchSFarmUserStakedBalances,
  fetchSFarmStakedBalances,
  fetchTotalEarnings,
  fetchTimeExpire,
  fetchPolarBonusMultiplier,
  fetchTotalLocked,
  fetchUnlockFundInSec,
  fetchSFarmMaxBonusMultiplier,
  fetchSFarmUserCurrentBonusMultiplier,
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
  const userFarmPolarAllowances = await fetchSFarmUserPolarAllowances(account)
  const userFarmTokenBalances = await fetchSFarmUserTokenBalances(account)
  const userStakedBalances = await fetchSFarmUserStakedBalances(account)
  const totalStakedAmounts = await fetchSFarmStakedBalances()
  const userFarmEarnings = await fetchSFarmUserEarnings(account)
  const totalEarnings = await fetchTotalEarnings()
  const polarBonusMultiplier = await fetchPolarBonusMultiplier()
  const totalLocked = await fetchTotalLocked()
  const timeExpiry = await fetchTimeExpire()
  const unlockFundsInSec = await fetchUnlockFundInSec(0)
  const maxBonusMultiplier = await fetchSFarmMaxBonusMultiplier()
  const userCurrentBonusMultiplier = await fetchSFarmUserCurrentBonusMultiplier(account)

  const arrayOfUserDataObjects = userFarmAllowances.map((farmAllowance, index) => {
    return {
      index,
      allowance: userFarmAllowances[index],
      polarAllowance: userFarmPolarAllowances[index],
      totalReward: totalEarnings[index],
      tokenBalance: userFarmTokenBalances[index],
      stakedBalance: userStakedBalances[index],
      totalStakedAmount: totalStakedAmounts[index],
      earnings: userFarmEarnings[index].earning,
      earningMultiplier: userFarmEarnings[index].multiplier,
      timeExpiry: timeExpiry[index],
      polarBonusMultiplier: polarBonusMultiplier[index],
      totalLocked: totalLocked[index],
      unlockFundsInSec: unlockFundsInSec[index],      
      maxBonusMultiplier: maxBonusMultiplier[index],
      currentBonusMultiplier: userCurrentBonusMultiplier[index]
    }
  })

  dispatch(setFarmUserData({ arrayOfUserDataObjects }))
}

export default farmsSlice.reducer
