import BigNumber from 'bignumber.js'
import erc20 from 'config/abi/erc20.json'
import sFarmsConfig from 'config/constants/sfarms'
import { getPolarContractAddress } from 'utils/addressHelpers'
import multicall from 'utils/multicall'


const fetchSFarms = async () => {
  const data = await Promise.all(
    sFarmsConfig.map(async (sFarmConfig) => {
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
