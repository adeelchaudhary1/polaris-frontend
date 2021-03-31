import BigNumber from 'bignumber.js'
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { provider } from 'web3-core'
import { Button, Modal } from '@pancakeswap-libs/uikit'
import ModalActions from 'components/ModalActions'
import TokenInput from 'components/TokenInput'
import useI18n from 'hooks/useI18n'
import { getFullDisplayBalance, getPercentNumber } from 'utils/formatBalance'
import { useSFarmUser } from 'state/hooks'
import { SFarm } from 'state/types'
import { useWallet } from '@binance-chain/bsc-use-wallet'
import { fetchSFarmUserHarvestEarning } from 'state/sFarms/fetchSFarmUser'
import contracts from 'config/constants/contracts'
import { useNovaApprove } from 'hooks/useApprove'
import { getContract } from 'utils/erc20'

interface HarvestModalProps {
  max: BigNumber
  maxPolar: BigNumber
  onConfirm: (amount: string, polar: string) => void
  onDismiss?: () => void
  tokenName?: string,
  sFarm: SFarm,
  ethereum?: provider
}

const HarvestModal: React.FC<HarvestModalProps> = ({ sFarm, onConfirm, onDismiss, max, maxPolar, tokenName = '', ethereum }) => {

  const { polarAllowance, earningMultiplier } = useSFarmUser(sFarm.pid)
  const { account } = useWallet()
  const [val, setVal] = useState('')
  const [valPolar, setValPolar] = useState('0')
  const [estimatedHarvestAmount, setEstimatedHarvestAmount] = useState('')
  const [bonusMultiplier, setBonusMultiplier] = useState('')
  const [pendingTx, setPendingTx] = useState(false)
  const TranslateString = useI18n()


  const calculateEstimatedHarvest = useCallback(async (unStakingAmount: number, polarAmount = 0) => {
    try {
      const unStakingAmountInBigNumber = Math.floor(unStakingAmount * 10 ** 18).toString()
      const polarAmountInBigNumber = Math.floor(polarAmount * 10 ** 18).toString()

      const harvestResult = await fetchSFarmUserHarvestEarning(account, unStakingAmountInBigNumber, polarAmountInBigNumber, sFarm.poolAddress)

      const maxHarvestCalculated = (Number(harvestResult[0].earning) / 10 ** 18)
      const maxMultiplier = (Number(harvestResult[0].multiplier) / 10 ** 18)

      setEstimatedHarvestAmount(maxHarvestCalculated.toFixed(4))
      setBonusMultiplier(maxMultiplier.toFixed(4))

    } catch (Error) {
      // eslint-disable-next-line no-console
      console.log(Error)
      setEstimatedHarvestAmount(unStakingAmount.toFixed(4))
    }
  }, [account, sFarm.poolAddress])


  useEffect(() => {
    const tempBonusMultiplier = getPercentNumber(earningMultiplier)
    setBonusMultiplier(Number(tempBonusMultiplier).toFixed(4))
  }, [earningMultiplier])


  const fullBalance = useMemo(() => {
    return getFullDisplayBalance(max)
  }, [max])

  const fullPolarBalance = useMemo(() => {
    return getFullDisplayBalance(maxPolar)
  }, [maxPolar])

  const handleChange = useCallback(
    (e: React.FormEvent<HTMLInputElement>) => {
      setVal(e.currentTarget.value)
      calculateEstimatedHarvest(Number(e.currentTarget.value), Number(valPolar))
      // setEstimatedHarvestAmount(maxHarvest.times(bonusMultiplier).times(new BigNumber(Number(e.currentTarget.value)).div(max)).toFormat(2)) 
    },
    [calculateEstimatedHarvest, valPolar],
  )

  const handlePolarChange = useCallback(
    (e: React.FormEvent<HTMLInputElement>) => {
      setValPolar(e.currentTarget.value)
      calculateEstimatedHarvest(Number(val), Number(e.currentTarget.value))

      // setEstimatedHarvestAmount(maxHarvest.times(1 + Number(e.currentTarget.value) / 100).times(new BigNumber(Number(val)).div(max)).toFormat(2)) 
    },
    [calculateEstimatedHarvest, val],
  )

  const handleSelectMax = useCallback(() => {
    setVal(fullBalance)
    calculateEstimatedHarvest(Number(fullBalance), Number(valPolar))
    // setEstimatedHarvestAmount(maxHarvest.times(bonusMultiplier).div(10**18).toFormat(2)) 
  }, [fullBalance, calculateEstimatedHarvest, valPolar])

  const handleSelectPolarMax = useCallback(() => {
    setValPolar(fullPolarBalance)
    calculateEstimatedHarvest(Number(val), Number(fullPolarBalance))

    // setEstimatedHarvestAmount(maxHarvest.times(1 + Number(fullPolarBalance) / 100).div(10**18).toFormat(2)) 
  }, [fullPolarBalance, calculateEstimatedHarvest, val])


  const polarContract = useMemo(() => {
    return getContract(ethereum as provider, contracts.polar[process.env.REACT_APP_CHAIN_ID])
  }, [ethereum])



  const { onApprove } = useNovaApprove(polarContract, sFarm.poolAddress)
  const [requestedApproval, setRequestedApproval] = useState(false)
  const handleApprove = useCallback(async () => {
    try {
      setRequestedApproval(true)
      await onApprove()
      setRequestedApproval(false)
    } catch (e) {
      console.error(e)
    }
  }, [onApprove])

  return (
    <Modal title="Harvest With POLAR To Multiply Your Rewards" onDismiss={onDismiss}>
      <TokenInput
        onSelectMax={handleSelectMax}
        onChange={handleChange}
        value={val}
        max={fullBalance}
        symbol={tokenName}
      />

      {polarAllowance.isGreaterThan(0) ?
        <TokenInput
          onSelectMax={handleSelectPolarMax}
          onChange={handlePolarChange}
          value={valPolar}
          max={fullPolarBalance}
          symbol="POLAR"
        /> :
        <Button mt="8px" fullWidth disabled={requestedApproval} onClick={handleApprove}>
          {TranslateString(999, 'Approve Polar')}
        </Button>
      }

      <div style={{ color: 'white', margin: 'auto', paddingTop: '10px' }}>Bonus POLAR Multiplier: {bonusMultiplier}X</div>
      <div style={{ color: 'white', margin: 'auto', paddingTop: '10px' }}>Estimated Harvest: {estimatedHarvestAmount} WBNB</div>

      <ModalActions>
        <Button variant="secondary" onClick={onDismiss}>
          {TranslateString(462, 'Cancel')}
        </Button>
        <Button
          disabled={pendingTx}
          onClick={async () => {
            setPendingTx(true)
            await onConfirm(val, valPolar)
            setPendingTx(false)
            onDismiss()
          }}
        >
          {pendingTx ? TranslateString(488, 'Pending Confirmation') : TranslateString(464, 'Confirm')}
        </Button>
      </ModalActions>
    </Modal>
  )
}

export default HarvestModal
