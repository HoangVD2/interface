import { BigNumber } from 'bignumber.js';
import { CollateralType } from 'src/helpers/types';
import { ExtendedFormattedUser } from 'src/hooks/pool/useExtendedUserSummaryAndIncentives';
import { FormattedUserReserves } from 'src/hooks/pool/useUserSummaryAndIncentives';

export enum ErrorType {
  SUPPLY_CAP_REACHED,
  HF_BELOW_ONE,
  NOT_ENOUGH_COLLATERAL_TO_REPAY_WITH,
  ZERO_LTV_WITHDRAW_BLOCKED,
}

export const useFlashloan = (healthFactor: string, hfEffectOfFromAmount: string) => {
  return (
    healthFactor !== '-1' &&
    new BigNumber(healthFactor).minus(new BigNumber(hfEffectOfFromAmount)).lt('1.05')
  );
};

export const APPROVAL_GAS_LIMIT = 65000;
export const APPROVE_DELEGATION_GAS_LIMIT = 55000;

export const checkRequiresApproval = ({
  approvedAmount,
  signedAmount,
  amount,
}: {
  approvedAmount: string;
  signedAmount: string;
  amount: string;
}) => {
  // Returns false if the user has a max approval, an approval > amountToSupply, or a valid signature for amountToSupply
  if (
    approvedAmount === '-1' ||
    (approvedAmount !== '0' && Number(approvedAmount) >= Number(amount)) ||
    Number(signedAmount) >= Number(amount)
  ) {
    return false;
  } else {
    return true;
  }
};

export const zeroLTVBlockingWithdraw = (user: ExtendedFormattedUser): string[] => {
  const zeroLTVBlockingWithdraw: string[] = [];
  user.userReservesData.forEach((userReserve) => {
    if (
      Number(userReserve.scaledATokenBalance) > 0 &&
      userReserve.reserve.baseLTVasCollateral === '0' &&
      userReserve.usageAsCollateralEnabledOnUser &&
      userReserve.reserve.reserveLiquidationThreshold !== '0'
    ) {
      zeroLTVBlockingWithdraw.push(userReserve.reserve.symbol);
    }
  });
  return zeroLTVBlockingWithdraw;
};

export const getAssetCollateralType = (
  userReserve: FormattedUserReserves,
  userTotalCollateralUSD: string,
  userIsInIsolationMode: boolean,
  debtCeilingIsMaxed: boolean
) => {
  const poolReserve = userReserve.reserve;

  if (!poolReserve.usageAsCollateralEnabled) {
    return CollateralType.UNAVAILABLE;
  }

  let collateralType: CollateralType = CollateralType.ENABLED;
  const userHasSuppliedReserve = userReserve && userReserve.scaledATokenBalance !== '0';
  const userHasCollateral = userTotalCollateralUSD !== '0';

  if (poolReserve.isIsolated) {
    if (debtCeilingIsMaxed) {
      collateralType = CollateralType.UNAVAILABLE;
    } else if (userIsInIsolationMode) {
      if (userHasSuppliedReserve) {
        collateralType = userReserve.usageAsCollateralEnabledOnUser
          ? CollateralType.ISOLATED_ENABLED
          : CollateralType.DISABLED;
      } else {
        if (userHasCollateral) {
          collateralType = CollateralType.UNAVAILABLE_DUE_TO_ISOLATION;
        }
      }
    } else {
      if (userHasCollateral) {
        collateralType = CollateralType.ISOLATED_DISABLED;
      } else {
        collateralType = CollateralType.ISOLATED_ENABLED;
      }
    }
  } else {
    if (userIsInIsolationMode) {
      collateralType = CollateralType.UNAVAILABLE_DUE_TO_ISOLATION;
    } else {
      if (userHasSuppliedReserve) {
        collateralType = userReserve.usageAsCollateralEnabledOnUser
          ? CollateralType.ENABLED
          : CollateralType.DISABLED;
      } else {
        collateralType = CollateralType.ENABLED;
      }
    }
  }

  return collateralType;
};
