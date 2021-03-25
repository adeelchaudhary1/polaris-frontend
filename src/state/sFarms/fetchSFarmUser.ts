import BigNumber from 'bignumber.js'
import erc20ABI from 'config/abi/erc20.json'
import novapool from 'config/abi/novapool.json'

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
  const calls = sFarmsConfig.map((farm) => {
    const lpContractAddress = farm.sLpAddresses[CHAIN_ID]
    return {
      address: lpContractAddress,
      name: 'balanceOf',
      params: [account],
    }
  })

  const rawTokenBalances = await multicall(erc20ABI, calls)
  const parsedTokenBalances = rawTokenBalances.map((tokenBalance) => {
    return new BigNumber(tokenBalance).toJSON()
  })
  return parsedTokenBalances
}

export const fetchSFarmUserStakedBalances = async (account: string) => {
  const calls = sFarmsConfig.map((farm) => {
    return {
      address: farm.poolAddress,
      name: 'totalStakedFor',
      params: [account],
    }
  })

  const rawLpAllowances = await multicall(novapool, calls)
  const parsedLpAllowances = rawLpAllowances.map((lpBalance) => {
    return new BigNumber(lpBalance).toJSON()
  })
  return parsedLpAllowances
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const fetchSFarmUserEarnings = async (account: string) => {
  const calls = sFarmsConfig.map((farm) => {
    return {
      address: farm.poolAddress,
      name: 'preview'
    }
  })
  const rawRewardEarning = await multicall(novapool, calls)
  const parsedRewardEaring = rawRewardEarning.map((rewardEarningPreview) => {
    return rewardEarningPreview[0].toString()
  })
  return parsedRewardEaring
}


export const fetchTotalEarnings = async () => {
  const calls = sFarmsConfig.map((farm) => {
    return {
      address: farm.poolAddress,
      name: 'totalRewards'
    }
  })
  const rawRewardEarning = await multicall(novapool, calls)
  const parsedRewardEaring = rawRewardEarning.map((rewardEarningPreview) => {
    return new BigNumber(rewardEarningPreview).toJSON()
  })
  return parsedRewardEaring
}