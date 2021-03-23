import BigNumber from 'bignumber.js'
import React, { useCallback, useMemo, useState } from 'react'
import { Button, Modal } from '@pancakeswap-libs/uikit'
import ModalActions from 'components/ModalActions'
import TokenInput from 'components/TokenInput'
import useI18n from 'hooks/useI18n'
import { getFullDisplayBalance } from 'utils/formatBalance'

interface HarvestModalProps {
  max: BigNumber
  maxPolar: BigNumber
  maxHarvest: BigNumber
  onConfirm: (amount: string) => void
  onDismiss?: () => void
  tokenName?: string
}

const HarvestModal: React.FC<HarvestModalProps> = ({ onConfirm, onDismiss, max, maxPolar, maxHarvest, tokenName = '' }) => {
  const [val, setVal] = useState('')
  const [valPolar, setValPolar] = useState('')
  const [estimatedHarvestAmount, setEstimatedHarvestAmount] = useState('')
  const [bonusMultiplier, setBonusMultiplier] = useState(1)
  const [pendingTx, setPendingTx] = useState(false)
  const TranslateString = useI18n()
  
  const fullBalance = useMemo(() => {
    return getFullDisplayBalance(max)
  }, [max])

  const fullPolarBalance = useMemo(() => {
    return getFullDisplayBalance(maxPolar)
  }, [maxPolar])

  const handleChange = useCallback(
    (e: React.FormEvent<HTMLInputElement>) => {
      setVal(e.currentTarget.value)
      setEstimatedHarvestAmount(maxHarvest.times(bonusMultiplier).times(new BigNumber(Number(e.currentTarget.value)).div(max)).toFormat(2)) 
    },
    [setVal, setEstimatedHarvestAmount, max, maxHarvest, bonusMultiplier],
  )

  const handlePolarChange = useCallback(
    (e: React.FormEvent<HTMLInputElement>) => {
      setValPolar(e.currentTarget.value)
      setBonusMultiplier(1 + Number(e.currentTarget.value) / 100)
      setEstimatedHarvestAmount(maxHarvest.times(1 + Number(e.currentTarget.value) / 100).times(new BigNumber(Number(val)).div(max)).toFormat(2)) 
    },
    [setValPolar, setBonusMultiplier, setEstimatedHarvestAmount, max, maxHarvest, val],
  )

  const handleSelectMax = useCallback(() => {
    setVal(fullBalance)
    setEstimatedHarvestAmount(maxHarvest.times(bonusMultiplier).div(10**18).toFormat(2)) 
  }, [fullBalance, setVal, setEstimatedHarvestAmount, maxHarvest, bonusMultiplier])

  const handleSelectPolarMax = useCallback(() => {
    setValPolar(fullPolarBalance)
    setBonusMultiplier(1 + Number(fullPolarBalance) / 100)
    setEstimatedHarvestAmount(maxHarvest.times(1 + Number(fullPolarBalance) / 100).div(10**18).toFormat(2)) 
  }, [fullPolarBalance, setValPolar, setBonusMultiplier, setEstimatedHarvestAmount, maxHarvest])

  return (
    <Modal title="Harvest With POLAR To Multiply Your Rewards" onDismiss={onDismiss}>
      <TokenInput
        onSelectMax={handleSelectMax}
        onChange={handleChange}
        value={val}
        max={fullBalance}
        symbol={tokenName}
      />

      <TokenInput
        onSelectMax={handleSelectPolarMax}
        onChange={handlePolarChange}
        value={valPolar}
        max={fullPolarBalance}
        symbol="POLAR"
      />

      <div style={{color: 'white', margin: 'auto', paddingTop: '10px'}}>Bonus POLAR Multiplier: {bonusMultiplier}X</div>
      <div style={{color: 'white', margin: 'auto', paddingTop: '10px'}}>Estimated Harvest: {estimatedHarvestAmount} WBNB</div>      

      <ModalActions>
        <Button variant="secondary" onClick={onDismiss}>
          {TranslateString(462, 'Cancel')}
        </Button>
        <Button
          disabled={pendingTx}
          onClick={async () => {
            setPendingTx(true)
            await onConfirm(val)
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
