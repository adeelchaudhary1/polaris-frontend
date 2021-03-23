import BigNumber from 'bignumber.js'
import erc20ABI from 'config/abi/erc20.json'
import masterchefABI from 'config/abi/masterchef.json'
import multicall from 'utils/multicall'
import sFarmsConfig from 'config/constants/sfarms'
import { getMasterChefAddress } from 'utils/addressHelpers'

const CHAIN_ID = process.env.REACT_APP_CHAIN_ID

export const fetchSFarmUserAllowances = async (account: string) => {
  const data = sFarmsConfig.map((farm) => {
    return { allowance:  new BigNumber(0).toJSON()}
  })
  return data
}

export const fetchSFarmUserTokenBalances = async (account: string) => {
  const data = sFarmsConfig.map((farm) => {
    return { allowance:  new BigNumber(0).toJSON()}
  })
  return data
}

export const fetchSFarmUserStakedBalances = async (account: string) => {
  const data = sFarmsConfig.map((farm) => {
    return { allowance:  new BigNumber(0).toJSON()}
  })
  return data
}

export const fetchSFarmUserEarnings = async (account: string) => {
  const data = sFarmsConfig.map((farm) => {
    return { allowance:  new BigNumber(0).toJSON()}
  })
  return data
}
