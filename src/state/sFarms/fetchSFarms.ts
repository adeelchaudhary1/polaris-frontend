import BigNumber from 'bignumber.js'
import erc20 from 'config/abi/erc20.json'
import masterchefABI from 'config/abi/masterchef.json'
import multicall from 'utils/multicall'
import { getMasterChefAddress } from 'utils/addressHelpers'
import sFarmsConfig from 'config/constants/sfarms'
import { QuoteToken } from '../../config/constants/types'

const CHAIN_ID = process.env.REACT_APP_CHAIN_ID

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

export default fetchSFarms
