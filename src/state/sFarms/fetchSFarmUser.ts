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

export const fetchUnlockFundInSec = async (timestamp: number) => {
  const calls = sFarmsConfig.map((farm) => {
    return { address: farm.poolAddress, name: 'unlockFundInSec', params: [timestamp] }
  })

  const rawFundings = await multicall(novapool, calls)
  const parsedFundings = rawFundings.map((unlockFundInSec) => {
    return new BigNumber(unlockFundInSec).toJSON()
  })
  return parsedFundings
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



export const fetchSFarmUserEarnings = async (account: string) => {

  const callsForStaking = sFarmsConfig.map((farm) => {
    return {
      address: farm.poolAddress,
      name: 'totalStakedFor',
      params: [account],
    }
  })

  const rawTotalStakes = await multicall(novapool, callsForStaking)


  const calls = sFarmsConfig.map((farm) => {
    return {
      address: farm.poolAddress,
      name: 'preview',
      params: [account, rawTotalStakes[0][0], 0],

    }
  })
  const rawRewardEarning = await multicall(novapool, calls)
  const parsedRewardEaring = rawRewardEarning.map((rewardEarningPreview) => {
    return {
      earning : rewardEarningPreview[0].toString(),
      multiplier : rewardEarningPreview[1].toString(),
    }
  })
  return parsedRewardEaring
}


export const fetchTotalEarnings = async () => {
  const callsForTotalLocked = sFarmsConfig.map((farm) => {
    return {
      address: farm.poolAddress,
      name: 'totalLocked'
    }
  })

  const callsForTotalUnlocked = sFarmsConfig.map((farm) => {
    return {
      address: farm.poolAddress,
      name: 'totalUnlocked'
    }
  })

  const rawTotalLocked = await multicall(novapool, callsForTotalLocked)
  const rawTotalUnLocked = await multicall(novapool, callsForTotalUnlocked)

  const parsedRewardEaring = []
  for(let i = 0; i < rawTotalLocked.length; i++) {
    const bigNumberTotalLocked = new BigNumber(rawTotalLocked[i])
    const bigNumberTotalUnLocked = new BigNumber(rawTotalUnLocked[i])

    parsedRewardEaring.push(bigNumberTotalLocked.plus(bigNumberTotalUnLocked))
  }

  return parsedRewardEaring
}

export const fetchTotalLocked = async () => {
  const calls = sFarmsConfig.map((farm) => {
    return {
      address: farm.poolAddress,
      name: 'totalLocked'
    }
  })
  const rawTotalEarning = await multicall(novapool, calls)
  const parsedRewardEaring = rawTotalEarning.map((totalEarningObj) => {
    return new BigNumber(totalEarningObj).toJSON()
  })
  return parsedRewardEaring
}

export const fetchPolarBonusMultiplier = async () => {
  const calls = sFarmsConfig.map((farm) => {
    return {
      address: farm.poolAddress,
      name: 'polarBonus',
      params: ['1000000000000000000'],
    }
  })
  const rawGysrBonus = await multicall(novapool, calls)
  const parsedRewardEaring = rawGysrBonus.map((rawGysrBonusObj) => {
    return new BigNumber(rawGysrBonusObj).toJSON()
  })
  return parsedRewardEaring
}

export const fetchTimeExpire = async () => {
  const parsedTimeExpires = []
  for(let k =0; k< sFarmsConfig.length; k++)  {
    const  farm  = sFarmsConfig[k]
    const callsForFundingCount = [
      {
        address: farm.poolAddress,
        name: 'fundingCount'
      }
    ]
    // eslint-disable-next-line no-await-in-loop
    const totalFundingCount = await multicall(novapool, callsForFundingCount)

    const callsForFunding = [
      {
        address: farm.poolAddress,
        name: 'fundings',
        params: [totalFundingCount[0][0].toNumber() - 1],
      }
    ]

    // eslint-disable-next-line no-await-in-loop
    const allFundingsOfPool = await multicall(novapool, callsForFunding)
    const expiryTime: number = allFundingsOfPool[0][5].toNumber()
    parsedTimeExpires.push(expiryTime)

  } // end of for loop

  return parsedTimeExpires
}



export const fetchSFarmUserHarvestEarning = async (account: string, tokensForUnstake: string, polarAmount: string, poolAddress: string) => {


  const calls = [
    {
      address: poolAddress,
      name: 'preview',
      params: [account, tokensForUnstake, polarAmount],

    }
  ]
  const rawRewardEarning = await multicall(novapool, calls)
  const parsedRewardEaring = rawRewardEarning.map((rewardEarningPreview) => {
    return {
      earning : rewardEarningPreview[0].toString(),
      multiplier : rewardEarningPreview[1].toString(),
    }
  })
  return parsedRewardEaring
}