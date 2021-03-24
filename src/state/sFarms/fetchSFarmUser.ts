import BigNumber from 'bignumber.js'
import erc20ABI from 'config/abi/erc20.json'
import multicall from 'utils/multicall'
import sFarmsConfig from 'config/constants/sfarms'

const CHAIN_ID = process.env.REACT_APP_CHAIN_ID

export const fetchSFarmUserAllowances = async (account: string) => {
  const calls = sFarmsConfig.map((farm) => {
    const lpContractAddress = farm.sLpAddresses[CHAIN_ID]
    return { address: lpContractAddress, name: 'allowance', params: [account, farm.poolAddress] }
  })

  const rawLpAllowances = await multicall(erc20ABI, calls)
  const parsedLpAllowances = rawLpAllowances.map((lpBalance) => {
    return new BigNumber(lpBalance).toJSON()
  })
  return parsedLpAllowances
  
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
