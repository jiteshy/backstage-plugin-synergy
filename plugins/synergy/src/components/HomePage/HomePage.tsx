import React from 'react';
import { CardTab, TabbedCard } from '@backstage/core-components';
import ListAltIcon from '@material-ui/icons/ListAlt';
import BugReportIcon from '@material-ui/icons/BugReport';
import EqualizerIcon from '@material-ui/icons/Equalizer';
import CategoryIcon from '@material-ui/icons/Category';
import { Projects } from '../Projects';
import { Issues } from '../Issues';
import { UserContributions } from '../UserContributions';
import { Stats } from '../Stats';
import { configApiRef, useApi } from '@backstage/core-plugin-api';
import { TabContent } from '../../utils';
import { useSynergyTranslation } from '../../hooks';

export const HomePage = () => {
  const { t } = useSynergyTranslation();
  const tabStyles = { fontSize: '16px', padding: '1rem 1.5rem' };
  const config = useApi(configApiRef);
  const hideIssues = config.getOptionalBoolean(
    'synergy.provider.github.hideIssues',
  );

  const issuesDependentTabs: TabContent[] = [
    {
      label: t('homePage.tabs.issues'),
      style: tabStyles,
      icon: <BugReportIcon fontSize="medium" />,
      children: <Issues />,
    },
    {
      label: t('homePage.tabs.contributions'),
      style: tabStyles,
      icon: <CategoryIcon fontSize="medium" />,
      children: <UserContributions />,
    },
    {
      label: t('homePage.tabs.leaderboard'),
      style: tabStyles,
      icon: <EqualizerIcon fontSize="medium" />,
      children: <Stats />,
    },
  ];

  const projectTab: TabContent = {
    label: t('homePage.tabs.project'),
    style: tabStyles,
    icon: <ListAltIcon fontSize="medium" />,
    children: <Projects />,
  };

  const allTabs = [projectTab].concat(hideIssues ? [] : issuesDependentTabs);

  return (
    <TabbedCard>
      {allTabs.map(tab => (
        <CardTab label={tab.label} style={tab.style} icon={tab.icon}>
          {tab.children}
        </CardTab>
      ))}
    </TabbedCard>
  );
};
