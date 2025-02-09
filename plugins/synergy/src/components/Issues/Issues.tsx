import React, { useEffect, useState } from 'react';
import {
  InfoCard,
  Progress,
  ResponseErrorPanel,
} from '@backstage/core-components';
import { ProjectIssue } from '@jiteshy/backstage-plugin-synergy-common';
import { useSynergyApi, useSynergyTranslation } from '../../hooks';
import { Box, Grid } from '@material-ui/core';
import { Dropdown } from '../UI';
import FilterListIcon from '@material-ui/icons/FilterList';
import { IssuesList } from '../IssuesList';
import { InfoBanner } from '../InfoBanner';

export const Issues = () => {
  const { t } = useSynergyTranslation();
  const {
    value: issuesList,
    loading,
    error,
  } = useSynergyApi(api => api.getIssues());

  const [issues, setIssues] = useState<ProjectIssue[]>([]);
  const [pinnedIssues, setPinnedIssues] = useState<ProjectIssue[]>([]);
  const [filteredIssues, setFilteredIssues] = useState<ProjectIssue[]>([]);
  const [filteredPinnedIssues, setFilteredPinnedIssues] = useState<
    ProjectIssue[]
  >([]);
  const [category, setCategory] = useState<string>('');

  useEffect(() => {
    if (issuesList) {
      const open: ProjectIssue[] = [];
      const pinned: ProjectIssue[] = [];
      issuesList.forEach((issue: ProjectIssue) => {
        if (issue.isPinned) {
          pinned.push(issue);
        } else {
          open.push(issue);
        }
      });
      setIssues(open);
      setPinnedIssues(pinned);
      setFilteredIssues(open);
      setFilteredPinnedIssues(pinned);
    }
  }, [issuesList]);

  const prepareCategories = (projectsIssues?: ProjectIssue[]) => {
    if (!projectsIssues) return [];

    const categories = new Set<string>();

    projectsIssues.forEach((issue: ProjectIssue) => {
      if (issue.primaryLanguage) {
        categories.add(issue.primaryLanguage);
      }
    });

    return [...categories];
  };

  const filterByCategory = (e: React.ChangeEvent<{ value: unknown }>) => {
    if (issuesList) {
      const currentCategory = e.target.value as string;
      if (currentCategory) {
        const filteredOpen = issues.filter(
          (issue: ProjectIssue) => issue.primaryLanguage === currentCategory,
        );
        const filteredPinned = pinnedIssues.filter(
          (issue: ProjectIssue) => issue.primaryLanguage === currentCategory,
        );
        setFilteredIssues(filteredOpen);
        setFilteredPinnedIssues(filteredPinned);
      } else {
        setFilteredIssues(issues);
        setFilteredPinnedIssues(pinnedIssues);
      }
      setCategory(currentCategory);
    }
  };

  if (loading) {
    return <Progress />;
  } else if (error) {
    return <ResponseErrorPanel error={error} />;
  }

  return (
    <Grid container>
      <Grid item xs={12}>
        <InfoBanner
          title={t('issueTab.infoTitle')}
          subtitle={t('issueTab.infoSubTitle')}
        />
      </Grid>
      <Grid item xs={12}>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gridGap: '8px',
            justifySelf: 'right',
            width: '200px',
            marginTop: '-10px',
          }}
        >
          <FilterListIcon fontSize="medium" style={{ marginTop: '20px' }} />
          <Dropdown
            label={t('homePage.filterPlaceholderText')}
            items={prepareCategories(issuesList)}
            current={category}
            handleSelect={filterByCategory}
          />
        </Box>
      </Grid>
      <Grid item xs={12} md={6}>
        <InfoCard
          title={t('issueTab.pinnedIssuesCard.title')}
          subheader={t('issueTab.pinnedIssuesCard.subTitle')}
        >
          {filteredPinnedIssues.length ? (
            <IssuesList issues={filteredPinnedIssues} />
          ) : (
            <p>{t('issueTab.pinnedIssuesCard.notFound')}</p>
          )}
        </InfoCard>
      </Grid>
      <Grid item xs={12} md={6}>
        <InfoCard
          title={t('issueTab.otherIssuesCard.title')}
          subheader={t('issueTab.otherIssuesCard.subTitle')}
        >
          {filteredIssues.length ? (
            <IssuesList issues={filteredIssues} />
          ) : (
            <p>{t('issueTab.otherIssuesCard.notFound')}</p>
          )}
        </InfoCard>
      </Grid>
    </Grid>
  );
};
