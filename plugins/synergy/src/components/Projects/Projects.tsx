import React, { useState } from 'react';
import {
  ItemCardGrid,
  Progress,
  ResponseErrorPanel,
} from '@backstage/core-components';
import { Project } from '@jiteshy/backstage-plugin-synergy-common';
import { useSynergyApi, useSynergyTranslation } from '../../hooks';
import { ProjectCard } from '../ProjectCard';
import { Box, Grid } from '@material-ui/core';
import { Dropdown } from '../UI';
import FilterListIcon from '@material-ui/icons/FilterList';
import { InfoBanner } from '../InfoBanner';

export const Projects = () => {
  const { t } = useSynergyTranslation();
  const {
    value: projects,
    loading,
    error,
  } = useSynergyApi(api => api.getProjects());

  const [filteredProjects, setFilteredProjects] = useState<Project[]>();
  const [category, setCategory] = useState<string>('');

  const prepareCategories = (projectsList?: Project[]) => {
    if (!projectsList) return [];

    const categories = new Set<string>();

    projectsList.forEach((project: Project) => {
      if (project.primaryLanguage) {
        categories.add(project.primaryLanguage);
      }

      project.topics.forEach((topic: string) => {
        categories.add(topic);
      });
    });

    return [...categories];
  };

  const filterByCategory = (e: React.ChangeEvent<{ value: unknown }>) => {
    if (projects) {
      const currentCategory = e.target.value as string;
      if (currentCategory) {
        const filteredProjectsList = projects.filter(
          (project: Project) =>
            project.topics.includes(currentCategory) ||
            project.primaryLanguage === currentCategory,
        );
        setFilteredProjects(filteredProjectsList);
      } else {
        setFilteredProjects(projects);
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
          title={t('projectTab.infoTitle')}
          subtitle={t('projectTab.infoSubTitle')}
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
            items={prepareCategories(projects)}
            current={category}
            handleSelect={filterByCategory}
          />
        </Box>
      </Grid>
      <Grid item xs={12}>
        {projects?.length ? (
          <ItemCardGrid>
            {(filteredProjects ? filteredProjects : projects).map(
              (project: Project) => (
                <ProjectCard key={project.id} project={project} />
              ),
            )}
          </ItemCardGrid>
        ) : (
          <p>{t('projectTab.notFound')}</p>
        )}
      </Grid>
    </Grid>
  );
};
