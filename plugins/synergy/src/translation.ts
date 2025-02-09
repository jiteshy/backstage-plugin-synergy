import { createTranslationRef } from '@backstage/core-plugin-api/alpha';

/** @alpha */
export const synergyTranslationRef = createTranslationRef({
  id: 'synergy',
  messages: {
    synergyPage: {
      title: 'Welcome to Synergy!',
      subTitle: 'Our Inner Source Hub',
    },
    homePage: {
      title: 'Inner-Source Projects & Issues',
      helpText:
        'This plugin creates an Inner Source dashboard showing all repositories needing contributions and more.',
      notFoundError: 'Page Not Found',
      tabs: {
        project: 'Projects',
        issues: 'Issues',
        contributions: 'My Contributions',
        leaderboard: 'Stats & Leaderboard',
      },
      filterPlaceholderText: 'Category',
    },
    projectPage: {
      title: 'Project Details',
      subTitle: "Explore the project's open issues and start contributing.",
      breadcrumb: 'Projects',
      backToProjectsBtnText: 'Back to all projects',
      tabs: {
        pinned: 'Pinned Issues',
        all: 'All Issues',
        readme: 'README',
        guidelines: 'Contributing Guidelines',
      },
      notFound: {
        pinned: 'No Pinned Issues found for this project.',
        all: 'No Open Issues found for this project.',
        readme: 'README file not found.',
        guidelines: 'No contribution guideline found.',
      },
    },
    projectTab: {
      infoTitle:
        'Explore inner-source projects, contribute, and rise on the leaderboard',
      infoSubTitle: 'Below projects are currently accepting contributions.',
      notFound: 'No Inner-Source projects found.',
    },
    projectCard: {
      updatedAt: 'Last update on ',
      entityLink: 'Go to Entity',
      moreLink: 'More',
      noDescription: 'No description',
      otherLanguage: 'Other',
      hoverText: {
        lock: 'Private Repository',
        unlock: 'Public Repository',
        githubIconLink: 'Go to GitHub repo',
        language: 'Primary language of the project',
        stars: 'Repository Stars',
        issues: 'Open Issues',
        pr: 'Overall Contributions so far',
      },
    },
    issueCard: {
      contribute: 'Contribute',
      githubLink: 'Open on GitHub',
      githubLinkHoverText: 'Go to GitHub',
      reporter: 'Reporter: ',
      updatedAt: 'Last Updated on: ',
    },
    issueTab: {
      infoTitle:
        'Explore inner-source issues from projects in your org which are not exclusively inner-source',
      infoSubTitle:
        'Issues below aren’t limited to inner-source projects—any project can request contributions from the inner-source community.',
      pinnedIssuesCard: {
        title: 'Pinned Issues',
        subTitle: 'Pinned issues across repos in your org.',
        notFound: 'No Pinned Inner-Source issues found.',
      },
      otherIssuesCard: {
        title: 'Other Issues',
        subTitle: 'Issues across repos in your org (excluding pinned).',
        notFound: 'No Inner-Source issues found.',
      },
    },
    contributionTab: {
      infoTitle: 'Review your contributions so far',
      infoSubTitle:
        'You can view the issues you have closed and those currently assigned to you.',
      closedIssuesCard: {
        title: 'Closed Issues',
        subTitle: 'Inner-Source Issues you have closed so far.',
        notFound: 'No Inner-Source contribution yet.',
      },
      openIssuesCard: {
        title: 'Open Issues',
        subTitle: 'Inner-Source Issues you are assigned to.',
        notFound: 'No Inner-Source issues assigned to you.',
      },
    },
    leaderboardTab: {
      infoTitle: 'Showcasing top contributors',
      infoSubTitle:
        'Recognizing those making an impact through inner-source contributions.',
      statsCard: {
        title: 'Inner-Source Stats',
        subTitle: 'Inner-Source projects and issues statistics.',
        stats: {
          projects: 'Inner-Source projects',
          priorityIssues: 'Priority (pinned) issues',
          openIssues: 'Open issues',
          closedIssues: 'Closed issues',
          nonInnerSourceProjectsIssues:
            'Issues not part of inner-source projects',
        },
        statsHover: {
          projects: 'Total no of inner-source projects in your org',
          priorityIssues: 'Total no of pinned issues in inner-source projects',
          openIssues: 'Total no of open issues in inner-source projects',
          closedIssues:
            'Total no of closed issues so far in inner-source projects',
          nonInnerSourceProjectsIssues:
            'Total no of inner-source issues in projects which are not exclusively inner-source',
        },
        notFound: 'No Inner-Source contributions yet.',
      },
      contributorsCard: {
        title: 'Top Contributors',
        subTitle: 'Inner-Source contributors rankings.',
      },
    },
  },
});
