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
  const rawTotalEarning = await multicall(novapool, calls)
  const parsedRewardEaring = rawTotalEarning.map((totalEarningObj) => {
    return new BigNumber(totalEarningObj).toJSON()
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

    const callsForFunding = []
    for(let i = 0; i <Number(totalFundingCount[0]); i++) {
      callsForFunding.push({
        address: farm.poolAddress,
        name: 'fundings',
        params: [i],
      })  
    }  // end of for loop

    if(callsForFunding.length > 0) {
      // eslint-disable-next-line no-await-in-loop
      const allFundingsOfPool = await multicall(novapool, callsForFunding)
      let expiryTime: number = allFundingsOfPool[0][5].toNumber()
      for(let j = 0; j < allFundingsOfPool.length; j++) {
        if(Number(expiryTime) < Number(allFundingsOfPool[j][5].toNumber())) {
          expiryTime = allFundingsOfPool[j][5].toNumber()
        }
      }
      parsedTimeExpires.push(expiryTime)
    }  else {
      parsedTimeExpires.push(0)
    }
  } // end of for loop

  return parsedTimeExpires
}