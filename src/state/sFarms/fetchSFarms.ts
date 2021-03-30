import BigNumber from 'bignumber.js'
import erc20 from 'config/abi/erc20.json'
import sFarmsConfig from 'config/constants/sfarms'
import { getPolarContractAddress } from 'utils/addressHelpers'
import multicall from 'utils/multicall'

const CHAIN_ID = process.env.REACT_APP_CHAIN_ID

const fetchSFarms = async () => {
  const data = await Promise.all(
    sFarmsConfig.map(async (sFarmConfig) => {
      const calls = [
        // Balance of staking token in the LP contract
        {
          address: sFarmConfig.sTokenAddresses[CHAIN_ID],
          name: 'balanceOf',
          params: [sFarmConfig.sLpAddresses[CHAIN_ID]],
        },
        // Balance of rewarding token in the LP contract
        {
          address: sFarmConfig.rTokenAddresses[CHAIN_ID],
          name: 'balanceOf',
          params: [sFarmConfig.rLpAddresses[CHAIN_ID]],
        },
        // Staking Quote token decimals
        {
          address: sFarmConfig.sQuoteTokenAdresses[CHAIN_ID],
          name: 'decimals',
        },
        // Rewarding Quote token decimals
        {
          address: sFarmConfig.rQuoteTokenAdresses[CHAIN_ID],
          name: 'decimals',
        },
        // Total supply of Staking LP tokens
        {
          address: sFarmConfig.sLpAddresses[CHAIN_ID],
          name: 'totalSupply',
        },
        // Total supply of Rewarding LP tokens
        {
          address: sFarmConfig.rLpAddresses[CHAIN_ID],
          name: 'totalSupply',
        },
        // Balance of staking quote token on LP contract
        {
          address: sFarmConfig.sQuoteTokenAdresses[CHAIN_ID],
          name: 'balanceOf',
          params: [sFarmConfig.sLpAddresses[CHAIN_ID]],
        },
        // Balance of rewarding quote token on LP contract
        {
          address: sFarmConfig.rQuoteTokenAdresses[CHAIN_ID],
          name: 'balanceOf',
          params: [sFarmConfig.rLpAddresses[CHAIN_ID]],
        },
        // Staking Token decimals
        {
          address: sFarmConfig.sTokenAddresses[CHAIN_ID],
          name: 'decimals',
        },
        // Rewarding token decimals
        {
          address: sFarmConfig.rTokenAddresses[CHAIN_ID],
          name: 'decimals',
        },
      ]

      const [
        sTokenBalanceLP,
        rTokenBalanceLP,
        sQuoteTokenDecimals,
        rQuoteTokenDecimals,
        sLpTotalSupply,
        rLpTotalSupply,
        sQuoteTokenBlanceLP,
        rQuoteTokenBlanceLP,
        sTokenDecimals,
        rTokenDecimals,
      ] = await multicall(erc20, calls)


      return {
        ...sFarmConfig
      }
    }),
  )
  return data
}

export const fetchPolarBalance = async (account: string) => {
  const calls = [{
    address: getPolarContractAddress(),
    name: 'balanceOf',
    params: [account],
  }]

  const rawTokenBalances = await multicall(erc20, calls)
  const parsedTokenBalances = rawTokenBalances.map((tokenBalance) => {
    return new BigNumber(tokenBalance).toJSON()
  })
  return parsedTokenBalances[0]
}

export default fetchSFarms
