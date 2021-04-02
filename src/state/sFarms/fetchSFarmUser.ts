import BigNumber from 'bignumber.js'
import erc20ABI from 'config/abi/erc20.json'
import novapool from 'config/abi/novapool.json'

import multicall from 'utils/multicall'
import sFarmsConfig from 'config/constants/sfarms'
import contracts from 'config/constants/contracts'

import moment from 'moment'

const CHAIN_ID = process.env.REACT_APP_CHAIN_ID

export const fetchSFarmUserAllowances = async (account: string) => {
  const calls = sFarmsConfig.map((farm) => {
    let contractAddress = farm.sLpAddresses[CHAIN_ID]
    if (farm.isStakeSingleToken)
      contractAddress = farm.sTokenAddresses[CHAIN_ID]

    return { address: contractAddress, name: 'allowance', params: [account, farm.poolAddress] }
  })

  const rawLpAllowances = await multicall(erc20ABI, calls)
  const parsedLpAllowances = rawLpAllowances.map((lpBalance) => {
    return new BigNumber(lpBalance).toJSON()
  })
  return parsedLpAllowances

}

export const fetchSFarmUserPolarAllowances = async (account: string) => {
  const calls = sFarmsConfig.map((farm) => {
    return { address: contracts.polar[CHAIN_ID], name: 'allowance', params: [account, farm.poolAddress] }
  })

  const rawPolarAllowances = await multicall(erc20ABI, calls)
  const parsedPolarAllowances = rawPolarAllowances.map((polarAllowance) => {
    return new BigNumber(polarAllowance).toJSON()
  })
  return parsedPolarAllowances

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
    let contractAddress = farm.sLpAddresses[CHAIN_ID]
    if (farm.isStakeSingleToken)
      contractAddress = farm.sTokenAddresses[CHAIN_ID]

    return {
      address: contractAddress,
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

export const fetchSFarmStakedBalances = async () => {
  const calls = sFarmsConfig.map((farm) => {
    return {
      address: farm.poolAddress,
      name: 'totalStaked',
    }
  })

  const rawStakedAmount = await multicall(novapool, calls)
  const parsedStakedAmount = rawStakedAmount.map((stakedAmount) => {
    return new BigNumber(stakedAmount).toJSON()
  })
  return parsedStakedAmount
}


export const fetchSFarmMaxBonusMultiplier = async () => {
  const bonusMaxCalls = sFarmsConfig.map((farm) => {
    return {
      address: farm.poolAddress,
      name: 'bonusMax',
    }
  })

  const bonusMinCalls = sFarmsConfig.map((farm) => {
    return {
      address: farm.poolAddress,
      name: 'bonusMin',
    }
  })

  const bonusMaxs = await multicall(novapool, bonusMaxCalls)
  const bonusMins = await multicall(novapool, bonusMinCalls)
  const maxBonusMultipliers = bonusMaxs.map((bonusMax, i) => {
    return new BigNumber(bonusMax).div(new BigNumber(bonusMins[i])).toJSON()
  })
  return maxBonusMultipliers
}


export const fetchSFarmUserCurrentBonusMultiplier = async (account: string) => {
  const bonusMaxCalls = sFarmsConfig.map((farm) => {
    return {
      address: farm.poolAddress,
      name: 'bonusMax',
    }
  })

  const bonusMinCalls = sFarmsConfig.map((farm) => {
    return {
      address: farm.poolAddress,
      name: 'bonusMin',
    }
  })

  const bonusPeriodCalls = sFarmsConfig.map((farm) => {
    return {
      address: farm.poolAddress,
      name: 'bonusPeriod',
    }
  })

  const stakeCountCalls = sFarmsConfig.map((farm) => {
    return {
      address: farm.poolAddress,
      name: 'stakeCount',
      params: [account],
    }
  })

  const bonusMaxs = await multicall(novapool, bonusMaxCalls)
  const bonusMins = await multicall(novapool, bonusMinCalls)
  const bonusPeriods = await multicall(novapool, bonusPeriodCalls)
  const stakeCounts = await multicall(novapool, stakeCountCalls)

  const currentTimeStamp = new BigNumber(moment().unix())

  const currentBonusMultipliers = await Promise.all(bonusMaxs.map( 
    async (bonusMax, i) => {
      let result = new BigNumber(0);

      const bonusDiff = new BigNumber(bonusMax).minus(new BigNumber(bonusMins[i]))
      const bonusPeriod = new BigNumber(bonusPeriods[i])
      const stakeCount = Number(stakeCounts[i])

      if (stakeCount >= 1) {
        const userFirstStakeInfoCalls = [{
          address: sFarmsConfig[i].poolAddress,
          name: 'userStakes',
          params: [account, 0],
        }]
        const userFirstStakeInfos = await multicall(novapool, userFirstStakeInfoCalls)

        const timePassed = currentTimeStamp.minus(new BigNumber(Number(userFirstStakeInfos[0][1])))
        if (timePassed.isGreaterThan(bonusPeriod))
          result = new BigNumber(bonusMax).div(new BigNumber(bonusMins[i]))
        else
          result = new BigNumber(1).plus(bonusDiff.times(timePassed).div(bonusPeriod))
      }
      return result.toJSON()
    }
  ))

  return currentBonusMultipliers
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
      earning: rewardEarningPreview[0].toString(),
      multiplier: rewardEarningPreview[1].toString(),
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

  const parsedRewardEaring = rawTotalLocked.map((totalLocked, i) => {
    return new BigNumber(totalLocked).plus(new BigNumber(rawTotalUnLocked[i])).toJSON()
  })

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
  for (let k = 0; k < sFarmsConfig.length; k++) {
    const farm = sFarmsConfig[k]
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
      earning: rewardEarningPreview[0].toString(),
      multiplier: rewardEarningPreview[1].toString(),
    }
  })
  return parsedRewardEaring
}