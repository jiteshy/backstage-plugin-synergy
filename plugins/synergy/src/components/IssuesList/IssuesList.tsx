import React from 'react';
import { ProjectIssue } from '@jiteshy/backstage-plugin-synergy-common';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Grid,
  makeStyles,
  Theme,
  Typography,
} from '@material-ui/core';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { LinkButton, MarkdownContent } from '@backstage/core-components';
import OpenInNewIcon from '@material-ui/icons/OpenInNew';
import { useSynergyTranslation } from '../../hooks';

const useStyles = makeStyles<Theme>(theme => ({
  heading: {
    fontSize: theme.typography.pxToRem(15),
  },
  secondaryHeading: {
    fontSize: theme.typography.pxToRem(12),
    color: theme.palette.text.secondary,
  },
  link: {
    textDecoration: 'underline',
    color: theme.palette.primary.main,
  },
  navigateBtn: {
    marginLeft: 'auto',
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.secondary.contrastText,
  },
  navigateIcon: {
    paddingLeft: '4px',
  },
  accordionSummary: {
    backgroundColor: theme.palette.background.default,
    boxShadow: 'none',
  },
  accordionDetails: {
    marginTop: '0.5rem',
  },
}));

export const IssuesList = ({ issues }: { issues: ProjectIssue[] }) => {
  const { t } = useSynergyTranslation();
  const classes = useStyles();
  const [expanded, setExpanded] = React.useState('');

  const handleChange =
    (panel: string) => (_event: React.ChangeEvent<{}>, isExpanded: boolean) => {
      setExpanded(isExpanded ? panel : '');
    };

  return issues.map(issue => (
    <Accordion
      key={issue.id}
      expanded={expanded === issue.id}
      onChange={handleChange(issue.id)}
    >
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
        className={classes.accordionSummary}
      >
        <Typography className={classes.heading}>{issue.title}</Typography>
        {/* <Typography className={classes.secondaryHeading}>
          Updated On: {issue.updatedAt}
        </Typography> */}
      </AccordionSummary>
      <AccordionDetails className={classes.accordionDetails}>
        <Grid container>
          <Grid item xs={12} className={classes.infoHeader}>
            <Box
              sx={{
                width: '100%',
                display: 'flex',
                gridGap: '1rem',
                alignItems: 'center',
              }}
              className={classes.secondaryHeading}
            >
              {issue.author && (
                <div>
                  {t('issueCard.reporter')}
                  <a
                    href={issue.author?.url}
                    className={classes.link}
                    target="_blank"
                  >
                    {issue.author.login}
                  </a>
                </div>
              )}
              <span>
                {t('issueCard.updatedAt')}
                <span>{new Date(issue.updatedAt).toLocaleString()}</span>
              </span>
              <LinkButton
                to={issue.url}
                className={classes.navigateBtn}
                target="_blank"
                variant="contained"
                title={t('issueCard.githubLinkHoverText')}
              >
                {issue.isOpen
                  ? t('issueCard.contribute')
                  : t('issueCard.githubLink')}
                <OpenInNewIcon
                  fontSize="small"
                  className={classes.navigateIcon}
                />
              </LinkButton>
            </Box>
          </Grid>
          <Grid item>
            <MarkdownContent content={issue.body} dialect="gfm" />
          </Grid>
        </Grid>
      </AccordionDetails>
    </Accordion>
  ));
};
