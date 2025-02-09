import React from 'react';
import {
  InfoCard,
  Link,
  Progress,
  ResponseErrorPanel,
} from '@backstage/core-components';
import { useSynergyApi, useSynergyTranslation } from '../../hooks';
import { Box, Grid, makeStyles, Theme } from '@material-ui/core';
import { InfoBanner } from '../InfoBanner';
import { ProjectContributor } from '@jiteshy/backstage-plugin-synergy-common';

const useStyles = makeStyles<Theme>(theme => ({
  row: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    padding: '0.5rem',
    paddingBottom: '0.5rem',
    borderBottom: '1px solid',
    borderBottomColor: theme.palette.border,
  },
  card: {
    backgroundColor: theme.palette.background.default,
  },
}));

export const Stats = () => {
  const { t } = useSynergyTranslation();
  const classes = useStyles();
  const {
    value: contributors,
    loading: contributorsLoading,
    error: contributorsError,
  } = useSynergyApi(api => api.getContributions());

  const {
    value: stats,
    loading: statsLoading,
    error: statsError,
  } = useSynergyApi(api => api.getStats());

  if (contributorsLoading || statsLoading) {
    return <Progress />;
  } else if (contributorsError) {
    return <ResponseErrorPanel error={contributorsError} />;
  } else if (statsError) {
    return <ResponseErrorPanel error={statsError} />;
  }

  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <InfoBanner
          title={t('leaderboardTab.infoTitle')}
          subtitle={t('leaderboardTab.infoSubTitle')}
        />
      </Grid>
      <Grid item xs={12} md={6}>
        <InfoCard
          className={classes.card}
          title={t('leaderboardTab.statsCard.title')}
          subheader={t('leaderboardTab.statsCard.subTitle')}
        >
          <Box className={classes.row}>
            <div title={t('leaderboardTab.statsCard.statsHover.projects')}>
              {t('leaderboardTab.statsCard.stats.projects')}
            </div>
            <div>{stats?.projectsCount}</div>
          </Box>
          <Box className={classes.row}>
            <div
              title={t('leaderboardTab.statsCard.statsHover.priorityIssues')}
            >
              {t('leaderboardTab.statsCard.stats.priorityIssues')}
            </div>
            <div>{stats?.pinnedIssuesCount}</div>
          </Box>
          <Box className={classes.row}>
            <div title={t('leaderboardTab.statsCard.statsHover.openIssues')}>
              {t('leaderboardTab.statsCard.stats.openIssues')}
            </div>
            <div>{stats?.openIssuesCount}</div>
          </Box>
          <Box className={classes.row}>
            <div title={t('leaderboardTab.statsCard.statsHover.closedIssues')}>
              {t('leaderboardTab.statsCard.stats.closedIssues')}
            </div>
            <div>{stats?.closedIssuesCount}</div>
          </Box>
          <Box className={classes.row}>
            <div
              title={t(
                'leaderboardTab.statsCard.statsHover.nonInnerSourceProjectsIssues',
              )}
            >
              {t('leaderboardTab.statsCard.stats.nonInnerSourceProjectsIssues')}
            </div>
            <div>{stats?.standaloneIssuesCount}</div>
          </Box>
        </InfoCard>
      </Grid>
      <Grid item xs={12} md={6}>
        <InfoCard
          className={classes.card}
          title={t('leaderboardTab.contributorsCard.title')}
          subheader={t('leaderboardTab.contributorsCard.subTitle')}
        >
          {contributors?.length ? (
            contributors.map((contributor: ProjectContributor) => (
              <Box className={classes.row}>
                <div>
                  {contributor.url ? (
                    <Link to={contributor.url}>{contributor.login}</Link>
                  ) : (
                    contributor.url
                  )}
                </div>
                <div>{contributor.contributionsCount}</div>
              </Box>
            ))
          ) : (
            <p>{t('leaderboardTab.statsCard.notFound')}</p>
          )}
        </InfoCard>
      </Grid>
    </Grid>
  );
};
