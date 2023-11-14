import { Trans } from '@lingui/macro';
import { Box, Paper, Typography, useMediaQuery, useTheme } from '@mui/material';
import dynamic from 'next/dynamic';
import { FormattedReservesAndIncentives } from 'src/hooks/pool/usePoolFormattedReserves';
import { useProtocolDataContext } from 'src/hooks/useProtocolDataContext';
import { displayGho } from 'src/utils/ghoUtilities';

type ReserveConfigurationProps = {
  reserve: FormattedReservesAndIncentives;
};

const GhoReserveConfiguration = dynamic(() =>
  import('./Gho/GhoReserveConfiguration').then((module) => module.GhoReserveConfiguration)
);

const ReserveConfiguration = dynamic(() =>
  import('./ReserveConfiguration').then((module) => module.ReserveConfiguration)
);

export const ReserveConfigurationWrapper: React.FC<ReserveConfigurationProps> = ({ reserve }) => {
  const { currentMarket } = useProtocolDataContext();
  const { breakpoints } = useTheme();
  const downToXsm = useMediaQuery(breakpoints.down('xsm'));
  const isGho = displayGho({ symbol: reserve.symbol, currentMarket });

  return (
    <Paper sx={{ pt: 4, pb: 20, px: downToXsm ? 4 : 6 }}>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 6,
          flexWrap: 'wrap',
          mb:
            reserve.isFrozen || reserve.symbol == 'AMPL' || reserve.symbol === 'stETH'
              ? '0px'
              : '36px',
        }}
      >
        <Typography variant="h3">
          <Trans>Reserve status &#38; configuration</Trans>
        </Typography>
      </Box>
      {isGho ? (
        <GhoReserveConfiguration reserve={reserve} />
      ) : (
        <ReserveConfiguration reserve={reserve} />
      )}
    </Paper>
  );
};
