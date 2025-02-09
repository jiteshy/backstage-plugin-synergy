import React from 'react';
import {
  Header,
  Page,
  Content,
  ContentHeader,
  SupportButton,
  ErrorPage,
} from '@backstage/core-components';
import { Route } from 'react-router-dom';
import { projectRouteRef } from '../../routes';
import { ProjectPage } from '../ProjectPage';
import { HomePage } from '../HomePage';
import { FlatRoutes } from '@backstage/core-app-api';
import { useSynergyTranslation } from '../../hooks';

export const SynergyPage = () => {
  const { t } = useSynergyTranslation();

  return (
    <Page themeId="tool">
      <Header
        title={t('synergyPage.title')}
        subtitle={t('synergyPage.subTitle')}
      />
      <Content>
        <ContentHeader title={t('homePage.title')}>
          <SupportButton>{t('homePage.helpText')}</SupportButton>
        </ContentHeader>
        <FlatRoutes>
          <Route index element={<HomePage />} />
          <Route path={projectRouteRef.path} element={<ProjectPage />} />
          <Route
            path="*"
            element={<ErrorPage statusMessage={t('homePage.notFoundError')} />}
          />
        </FlatRoutes>
      </Content>
    </Page>
  );
};
