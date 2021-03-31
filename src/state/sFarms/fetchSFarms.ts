import BigNumber from 'bignumber.js'
import erc20 from 'config/abi/erc20.json'
import sFarmsConfig from 'config/constants/sfarms'
import { getPolarContractAddress } from 'utils/addressHelpers'
import multicall from 'utils/multicall'
import { QuoteToken } from '../../config/constants/types'

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
        // Balance of staking quote token on LP contract
        {
          address: sFarmConfig.sQuoteTokenAdresses[CHAIN_ID],
          name: 'balanceOf',
          params: [sFarmConfig.sLpAddresses[CHAIN_ID]],
        },
        // Total supply of staking LP tokens
        {
          address: sFarmConfig.sLpAddresses[CHAIN_ID],
          name: 'totalSupply',
        },
        // staking Token decimals
        {
          address: sFarmConfig.sTokenAddresses[CHAIN_ID],
          name: 'decimals',
        },
        // staking Quote token decimals
        {
          address: sFarmConfig.sQuoteTokenAdresses[CHAIN_ID],
          name: 'decimals',
        },

        // Balance of reward token in the LP contract
        {
          address: sFarmConfig.rTokenAddresses[CHAIN_ID],
          name: 'balanceOf',
          params: [sFarmConfig.rLpAddresses[CHAIN_ID]],
        },
        // Balance of reward quote token on LP contract
        {
          address: sFarmConfig.rQuoteTokenAdresses[CHAIN_ID],
          name: 'balanceOf',
          params: [sFarmConfig.rLpAddresses[CHAIN_ID]],
        },
        // Total supply of reward LP tokens
        {
          address: sFarmConfig.rLpAddresses[CHAIN_ID],
          name: 'totalSupply',
        },
        // reward Token decimals
        {
          address: sFarmConfig.rTokenAddresses[CHAIN_ID],
          name: 'decimals',
        },
        // reward Quote token decimals
        {
          address: sFarmConfig.rQuoteTokenAdresses[CHAIN_ID],
          name: 'decimals',
        },
      ]

      const [
        sTokenBalanceLP,
        sQuoteTokenBlanceLP,
        sLpTotalSupply,
        sTokenDecimals,
        sQuoteTokenDecimals,
        rTokenBalanceLP,
        rQuoteTokenBlanceLP,
        rLpTotalSupply,
        rTokenDecimals,
        rQuoteTokenDecimals,
      ] = await multicall(erc20, calls)

      let sTokenPriceVsQuote;
      if (sFarmConfig.sTokenSymbol === QuoteToken.BUSD && sFarmConfig.sQuoteTokenSymbol === QuoteToken.BUSD) {
        sTokenPriceVsQuote = new BigNumber(1);
      } else {
        sTokenPriceVsQuote = new BigNumber(sQuoteTokenBlanceLP).div(new BigNumber(sTokenBalanceLP));
      }
      const sLpTokenPriceVsQuote = new BigNumber(sQuoteTokenBlanceLP).times(2).div(sLpTotalSupply)

      let rTokenPriceVsQuote;
      if (sFarmConfig.rTokenSymbol === QuoteToken.BUSD && sFarmConfig.rQuoteTokenSymbol === QuoteToken.BUSD) {
        rTokenPriceVsQuote = new BigNumber(1);
      } else {
        rTokenPriceVsQuote = new BigNumber(rQuoteTokenBlanceLP).div(new BigNumber(rTokenBalanceLP));
      }
      const rLpTokenPriceVsQuote = new BigNumber(rQuoteTokenBlanceLP).times(2).div(rLpTotalSupply)

      return {
        ...sFarmConfig,
        
        sTokenPriceVsQuote: sTokenPriceVsQuote.toJSON(),
        sLpTokenPriceVsQuote: sLpTokenPriceVsQuote.toJSON(),
        
        rTokenPriceVsQuote: rTokenPriceVsQuote.toJSON(),
        rLpTokenPriceVsQuote: rLpTokenPriceVsQuote.toJSON(),
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
