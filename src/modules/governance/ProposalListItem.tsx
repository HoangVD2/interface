import { Box, Typography } from '@mui/material';
import { GovernancePageProps } from 'pages/governance';
import { Link, ROUTES } from 'src/components/primitives/Link';
import { StateBadge } from './StateBadge';
import { formatProposal } from './utils/formatProposal';
import { VoteBar } from './VoteBar';
import { FormattedProposalTime } from './FormattedProposalTime';

export function ProposalListItem({
  proposal,
  prerendered,
  ipfs,
}: GovernancePageProps['proposals'][0]) {
  const { nayPercent, yaePercent, nayVotes, yaeVotes } = formatProposal(proposal);
  return (
    <Box
      sx={{
        px: 6,
        py: 8,
        display: 'flex',
        flexWrap: 'wrap',
        borderBottom: (theme) => `1px solid ${theme.palette.divider}`,
      }}
      component={Link}
      href={
        prerendered
          ? ROUTES.prerenderedProposal(proposal.id)
          : ROUTES.dynamicRenderedProposal(proposal.id)
      }
    >
      <Box
        sx={{
          width: {
            xs: '100%',
            sm: '50%',
          },
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
        }}
      >
        <Typography variant="h3" gutterBottom sx={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>
          {ipfs.title}
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <StateBadge state={proposal.state} />
          <FormattedProposalTime
            state={proposal.state}
            executionTime={proposal.executionTime}
            startBlock={proposal.startBlock}
            endBlock={proposal.endBlock}
            // proposalCreated={proposal.proposalCreated}
          />
        </Box>
      </Box>
      <Box
        sx={{
          flexGrow: 1,
          pl: { xs: 0, sm: 2 },
        }}
      >
        <VoteBar yae percent={yaePercent} votes={yaeVotes} sx={{ mb: 4 }} />
        <VoteBar percent={nayPercent} votes={nayVotes} />
      </Box>
    </Box>
  );
}
