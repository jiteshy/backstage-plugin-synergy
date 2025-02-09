import React, { useEffect, useState } from 'react';
import {
  InfoCard,
  Progress,
  ResponseErrorPanel,
} from '@backstage/core-components';
import { ProjectIssue } from '@jiteshy/backstage-plugin-synergy-common';
import { useSynergyApi, useSynergyTranslation } from '../../hooks';
import { Grid } from '@material-ui/core';
import { IssuesList } from '../IssuesList';
import { InfoBanner } from '../InfoBanner';

export const UserContributions = () => {
  const { t } = useSynergyTranslation();
  const {
    value: issuesList,
    loading,
    error,
  } = useSynergyApi(api => api.getMyIssues());

  const [openIssues, setOpenIssues] = useState<ProjectIssue[]>([]);
  const [closedIssues, setClosedIssues] = useState<ProjectIssue[]>([]);

  useEffect(() => {
    if (issuesList) {
      const open: ProjectIssue[] = [];
      const closed: ProjectIssue[] = [];
      issuesList.forEach((issue: ProjectIssue) => {
        if (issue.isOpen) {
          open.push(issue);
        } else {
          closed.push(issue);
        }
      });
      setOpenIssues(open);
      setClosedIssues(closed);
    }
  }, [issuesList]);

  if (loading) {
    return <Progress />;
  } else if (error) {
    return <ResponseErrorPanel error={error} />;
  }

  return (
    <Grid container>
      <Grid item xs={12}>
        <InfoBanner
          title={t('contributionTab.infoTitle')}
          subtitle={t('contributionTab.infoSubTitle')}
        />
      </Grid>
      <Grid item xs={12} md={6}>
        <InfoCard
          title={t('contributionTab.closedIssuesCard.title')}
          subheader={t('contributionTab.closedIssuesCard.subTitle')}
        >
          {closedIssues.length ? (
            <IssuesList issues={closedIssues} />
          ) : (
            <p>{t('contributionTab.closedIssuesCard.notFound')}</p>
          )}
        </InfoCard>
      </Grid>
      <Grid item xs={12} md={6}>
        <InfoCard
          title={t('contributionTab.openIssuesCard.title')}
          subheader={t('contributionTab.openIssuesCard.subTitle')}
        >
          {openIssues.length ? (
            <IssuesList issues={openIssues} />
          ) : (
            <p>{t('contributionTab.openIssuesCard.notFound')}</p>
          )}
        </InfoCard>
      </Grid>
    </Grid>
  );
};
