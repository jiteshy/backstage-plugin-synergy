import React from 'react';
import { makeStyles, Theme } from '@material-ui/core/styles';
import { Box, Card, CardContent, Chip, Grid } from '@material-ui/core';
import LockOpenIcon from '@material-ui/icons/LockOpen';
import LockIcon from '@material-ui/icons/Lock';
import StarIcon from '@material-ui/icons/Star';
import BugReportIcon from '@material-ui/icons/BugReport';
import CallMergeIcon from '@material-ui/icons/CallMerge';
import OpenInNewIcon from '@material-ui/icons/OpenInNew';
import { Project } from '@jiteshy/backstage-plugin-synergy-common';
import { configApiRef, useApi, useRouteRef } from '@backstage/core-plugin-api';
import { projectRouteRef } from '../../routes';
import { Link, LinkButton } from '@backstage/core-components';
import { useSynergyTranslation } from '../../hooks';

const useStyles = makeStyles<Theme>(theme => ({
  card: {
    borderRadius: '10px',
    boxShadow:
      'rgba(50, 50, 93, 0.25) 0px 2px 5px -1px, rgba(0, 0, 0, 0.3) 0px 1px 3px -1px;',
    transition: '0.3s',
    color:
      theme.palette.type === 'light'
        ? theme.palette.grey[400]
        : theme.palette.textSubtle,
    backgroundColor: theme.palette.background.default,
  },
  header: {
    display: 'flex',
    padding: '15px',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottom: `1px solid ${theme.palette.border}`,
    color:
      theme.palette.type === 'light'
        ? theme.palette.grey[700]
        : theme.palette.textSubtle,
  },
  title: {
    color:
      theme.palette.type === 'light'
        ? theme.palette.grey[900]
        : theme.palette.text.primary,
    fontSize: '24px',
    fontWeight: 'bolder',
    margin: '0px 0px 0.72em',
    lineHeight: '1.5',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  subtitle: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    color:
      theme.palette.type === 'light'
        ? theme.palette.primary.light
        : theme.palette.textSubtle,
    fontSize: '12px',
    marginBottom: '0.35em',
    lineHeight: '1.25rem',
    textTransform: 'uppercase',
    fontWeight: 'bold',
  },
  description: {
    color:
      theme.palette.type === 'light'
        ? theme.palette.grey[800]
        : theme.palette.textSubtle,
    height: '60px',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    display: '-webkit-box',
    '-webkit-line-clamp': 3,
    '-webkit-box-orient': 'vertical',
  },
  topics: {
    padding: '10px 0 0',
    minHeight: '50px',
  },
  footer: {
    display: 'flex',
    paddingTop: '15px',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTop: `1px solid ${theme.palette.border}`,
  },
  footerIcon: {
    display: 'flex',
    alignItems: 'center',
    fontSize: '20px',
    color:
      theme.palette.type === 'light'
        ? theme.palette.primary.light
        : theme.palette.textSubtle,
  },
  footerCounts: {
    fontSize: '20px',
    paddingLeft: '5px',
    paddingTop: '3px',
  },
}));

export const ProjectCard = ({
  project,
  hideMore,
}: {
  project: Project;
  hideMore?: boolean;
}) => {
  const { t } = useSynergyTranslation();
  const styles = useStyles();
  const projectRoute = useRouteRef(projectRouteRef);
  const config = useApi(configApiRef);
  const catalogBasePath = config.getOptionalString('synergy.catalogBasePath');

  return (
    <Card className={styles.card}>
      <div className={styles.header}>
        <div>
          {project.isPrivate ? (
            <LockIcon
              fontSize="small"
              titleAccess={t('projectCard.hoverText.lock')}
            />
          ) : (
            <LockOpenIcon
              fontSize="small"
              titleAccess={t('projectCard.hoverText.unlock')}
            />
          )}
        </div>
        <div>{`${t('projectCard.updatedAt')}${project.updatedAt}`}</div>
      </div>
      <CardContent>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Box>
              <div className={styles.subtitle}>
                <div title={t('projectCard.hoverText.language')}>
                  {project.primaryLanguage || t('projectCard.otherLanguage')}
                </div>
                <a
                  href={project.url}
                  target="_blank"
                  title={t('projectCard.hoverText.githubIconLink')}
                >
                  <OpenInNewIcon fontSize="small" />
                </a>
              </div>
              <div className={styles.title} title={project.name}>
                {project.name}
              </div>
              <div className={styles.description}>
                {project.description ?? t('projectCard.noDescription')}
              </div>
              <Box
                sx={{
                  py: 1,
                }}
              >
                {catalogBasePath && (
                  <Link to={`${catalogBasePath}/${project.name}`}>
                    {t('projectCard.entityLink')}
                  </Link>
                )}
              </Box>
              <div className={styles.topics}>
                {project.topics.map((topic: string) => (
                  <Chip key={topic} label={topic} />
                ))}
              </div>
              <div className={styles.footer}>
                <div
                  className={styles.footerIcon}
                  title={t('projectCard.hoverText.stars')}
                >
                  <StarIcon />
                  <span className={styles.footerCounts}>
                    {project.starsCount}
                  </span>
                </div>
                <div
                  className={styles.footerIcon}
                  title={t('projectCard.hoverText.issues')}
                >
                  <BugReportIcon />
                  <span className={styles.footerCounts}>
                    {project.issuesCount}
                  </span>
                </div>
                <div
                  className={styles.footerIcon}
                  title={t('projectCard.hoverText.pr')}
                >
                  <CallMergeIcon />
                  <span className={styles.footerCounts}>
                    {project.contributionsCount}
                  </span>
                </div>
                {!hideMore && (
                  <LinkButton
                    to={projectRoute({
                      owner: project.owner,
                      project: project.name,
                    })}
                    color="primary"
                    variant="outlined"
                  >
                    {t('projectCard.moreLink')}
                  </LinkButton>
                )}
              </div>
            </Box>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};
