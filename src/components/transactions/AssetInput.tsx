import { ChevronDownIcon } from '@heroicons/react/outline';
import { Trans } from '@lingui/macro';
import {
  Box,
  Button,
  FormControl,
  InputBase,
  ListItemText,
  MenuItem,
  Select,
  SelectChangeEvent,
  SvgIcon,
  Typography,
} from '@mui/material';
import React from 'react';
import NumberFormat, { NumberFormatProps } from 'react-number-format';

import { CapType } from '../caps/helper';
import { AvailableTooltip } from '../infoTooltips/AvailableTooltip';
import { FormattedNumber } from '../primitives/FormattedNumber';
import { TokenIcon } from '../primitives/TokenIcon';

interface CustomProps {
  onChange: (event: { target: { name: string; value: string } }) => void;
  name: string;
  value: string;
}

const NumberFormatCustom = React.forwardRef<NumberFormatProps, CustomProps>(
  function NumberFormatCustom(props, ref) {
    const { onChange, ...other } = props;

    return (
      <NumberFormat
        {...other}
        getInputRef={ref}
        onValueChange={(values) => {
          if (values.value !== props.value)
            onChange({
              target: {
                name: props.name,
                value: values.value || '',
              },
            });
        }}
        thousandSeparator
        isNumericString
        allowNegative={false}
      />
    );
  }
);

export interface Asset {
  balance: string;
  symbol: string;
  iconSymbol?: string;
  address?: string;
  aToken?: boolean;
}

export interface AssetInputProps<T extends Asset = Asset> {
  value: string;
  usdValue: string;
  symbol: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  onSelect?: (asset: T) => void;
  assets: T[];
  capType?: CapType;
  maxValue: string;
  isMaxSelected: boolean;
}

export const AssetInput: React.FC<AssetInputProps> = ({
  value,
  usdValue,
  symbol,
  onChange,
  disabled,
  onSelect,
  assets,
  capType,
  maxValue,
  isMaxSelected,
}) => {
  const handleSelect = (event: SelectChangeEvent) => {
    const newAsset = assets.find((asset) => asset.symbol === event.target.value) as Asset;
    onSelect && onSelect(newAsset);
  };

  const asset =
    assets.length === 1
      ? assets[0]
      : assets && (assets.find((asset) => asset.symbol === symbol) as Asset);

  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
        <Typography color="text.secondary">
          <Trans>Amount</Trans>
        </Typography>
        {capType && <AvailableTooltip capType={capType} />}
      </Box>

      <Box
        sx={(theme) => ({
          p: '8px 12px',
          border: `1px solid ${theme.palette.divider}`,
          borderRadius: '6px',
          mb: 1,
        })}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
          <InputBase
            sx={{ flex: 1 }}
            placeholder="0.00"
            disabled={disabled}
            value={value}
            autoFocus
            onChange={(e) => {
              if (Number(e.target.value) > Number(maxValue)) {
                onChange('-1');
              } else {
                onChange(e.target.value);
              }
            }}
            inputProps={{
              'aria-label': 'amount input',
              style: {
                fontSize: '21px',
                lineHeight: '28,01px',
                padding: 0,
                height: '28px',
              },
            }}
            // eslint-disable-next-line
            inputComponent={NumberFormatCustom as any}
          />

          {!onSelect ? (
            <Box sx={{ display: 'inline-flex', alignItems: 'center' }}>
              <TokenIcon
                aToken={asset.aToken}
                symbol={asset.iconSymbol || asset.symbol}
                sx={{ mr: 2, ml: 4 }}
              />
              <Typography variant="h3" sx={{ lineHeight: '28px' }}>
                {symbol}
              </Typography>
            </Box>
          ) : (
            <FormControl>
              <Select
                disabled={disabled}
                value={asset.symbol}
                onChange={handleSelect}
                variant="outlined"
                className="AssetInput__select"
                sx={{
                  p: 0,
                  '&.AssetInput__select .MuiOutlinedInput-input': {
                    p: 0,
                    backgroundColor: 'transparent',
                    pr: '16px !important',
                  },
                  '&.AssetInput__select .MuiOutlinedInput-notchedOutline': { display: 'none' },
                  '&.AssetInput__select .MuiSelect-icon': {
                    color: 'text.primary',
                  },
                }}
                IconComponent={(props) => (
                  <SvgIcon sx={{ fontSize: '16px', right: '-3px !important' }} {...props}>
                    <ChevronDownIcon />
                  </SvgIcon>
                )}
                renderValue={(symbol) => {
                  const asset =
                    assets.length === 1
                      ? assets[0]
                      : assets && (assets.find((asset) => asset.symbol === symbol) as Asset);
                  return (
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <TokenIcon
                        symbol={asset.iconSymbol || asset.symbol}
                        aToken={asset.aToken}
                        sx={{ mr: 2, ml: 4 }}
                      />
                      <Typography variant="main16" color="text.primary">
                        {symbol}
                      </Typography>
                    </Box>
                  );
                }}
              >
                {assets.map((asset) => (
                  <MenuItem key={asset.symbol} value={asset.symbol}>
                    <TokenIcon
                      aToken={asset.aToken}
                      symbol={asset.iconSymbol || asset.symbol}
                      sx={{ fontSize: '22px', mr: 1 }}
                    />
                    <ListItemText sx={{ mr: 6 }}>{asset.symbol}</ListItemText>
                    <FormattedNumber value={asset.balance} compact />
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          )}
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', height: '16px' }}>
          <FormattedNumber
            value={isNaN(Number(usdValue)) ? 0 : Number(usdValue)}
            compact
            symbol="USD"
            variant="secondary12"
            color="text.disabled"
            symbolsColor="text.disabled"
            flexGrow={1}
          />

          <Typography component="div" variant="secondary12" color="text.secondary">
            Balance{' '}
            <FormattedNumber
              value={asset.balance}
              compact
              variant="secondary12"
              color="text.secondary"
              symbolsColor="text.disabled"
            />
          </Typography>

          <Button
            size="small"
            sx={{ minWidth: 0, ml: '7px', p: 0 }}
            onClick={() => onChange('-1')}
            disabled={disabled || isMaxSelected}
          >
            <Trans>Max</Trans>
          </Button>
        </Box>
      </Box>
    </Box>
  );
};
