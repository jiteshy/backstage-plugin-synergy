import React from 'react';
import { Box, makeStyles, Theme } from '@material-ui/core';

const useStyles = makeStyles<Theme>(theme => ({
  wrapper: {
    backgroundColor: theme.palette.background.default,
    color: theme.palette.textContrast,
    padding: '0.5rem 1rem 0.15rem',
    boxShadow:
      '0px 2px 1px -1px rgba(0,0,0,0.2),0px 1px 1px 0px rgba(0,0,0,0.14),0px 1px 3px 0px rgba(0,0,0,0.12)',
  },
}));

export const InfoBanner = ({
  title,
  subtitle,
}: {
  title: string;
  subtitle: string;
}) => {
  const classes = useStyles();
  return (
    <div className={classes.wrapper}>
      <Box sx={{ marginTop: '-10px' }}>
        <h4>{title}</h4>
      </Box>
      <Box sx={{ fontSize: '.875rem', marginTop: '-10px' }}>
        <p>{subtitle}</p>
      </Box>
    </div>
  );
};
