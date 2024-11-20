import { graphql } from '@octokit/graphql';
import { DataProviderConfig } from './configReader';
import { SingleInstanceGithubCredentialsProvider } from '@backstage/integration';
import {
  Project,
  ProjectDetails,
  Contributors,
  SynergyApi,
  ProjectIssue,
} from '@jiteshy/backstage-plugin-synergy-common';

type TopicNode = {
  topic: {
    name: string;
  };
};

type RepositoryTopics = {
  nodes: TopicNode[];
};

type LanguageNode = {
  name: string;
};

type RepositoryLanguages = {
  nodes: LanguageNode[];
};

type RepositoryIssuesState = {
  state: string;
};

type RepositoryOwner = {
  login: string;
};

type RepositoryBranchRef = {
  name: string;
};

type RepositoryPullRequestAuthor = {
  login: string;
};

type RepositoryPullRequestNode = {
  author: RepositoryPullRequestAuthor;
  baseRef: RepositoryBranchRef;
};

type RepositoryPullRequest = {
  totalCount: number;
  nodes: RepositoryPullRequestNode[];
};

type RepositoryPrimaryLanguage = {
  name: string;
};

type Repository = {
  id: string;
  name: string;
  description: string;
  url: string;
  visibility: string;
  isPrivate: boolean;
  owner: RepositoryOwner;
  updatedAt: string;
  defaultBranchRef: RepositoryBranchRef;
  primaryLanguage: RepositoryPrimaryLanguage;
  languages: RepositoryLanguages;
  repositoryTopics: RepositoryTopics;
  stargazerCount: number;
  issues: {
    nodes: RepositoryIssuesState[];
  };
  pullRequests: RepositoryPullRequest;
};

type RepositoryReadme = {
  text: string;
};

type RepositoryIssueAuthor = {
  login: string;
  url: string;
};

type RepositoryIssueLabelNode = {
  name: string;
};

type RepositoryIssue = {
  id: string;
  url: string;
  author: RepositoryIssueAuthor;
  title: string;
  body: string;
  createdAt: string;
  updatedAt: string;
  isPinned?: boolean;
  labels?: {
    nodes: RepositoryIssueLabelNode[];
  };
  repository?: {
    name: string;
    primaryLanguage?: {
      name: string;
    };
    repositoryTopics?: {
      nodes: TopicNode[];
    };
  };
  state: string;
};

type RepositoryIssues = {
  nodes: RepositoryIssue[];
};

type RepositoryPinnedIssue = {
  issue: RepositoryIssue;
};

type RepositoryPinnedIssues = {
  nodes: RepositoryPinnedIssue[];
};

type RepositoryDetails = Repository & {
  readme: RepositoryReadme;
  issues: RepositoryIssues;
  pinnedIssues: RepositoryPinnedIssues;
};

type ProjectsQueryResponse = {
  search: {
    nodes: Repository[];
  };
};

type IssuesQueryResponse = {
  search: {
    nodes: RepositoryIssue[];
  };
};

type ProjectQueryResponse = {
  repository: RepositoryDetails;
};

const GITHUB_REPO_QUERY_BASE_FIELDS = `
  id
  name
  description
  url
  visibility
  isPrivate
  updatedAt
  owner {
    login
  }
  primaryLanguage {
    name
  }
  defaultBranchRef {
    name
  }
  languages (first: 100) {
    nodes {
      ... on Language {
        name
      }
    }
  }
  stargazerCount
  repositoryTopics(first: 100) {
    nodes {
      ... on RepositoryTopic {
        topic {
          name
        }
      }
    }
  }
  pullRequests (
    states: MERGED,
    first: 100,
    orderBy: {field: UPDATED_AT, direction: DESC}
  ) {
    totalCount
    nodes {
      author {
        login
      }
      baseRef {
        name
      }
    }
  }
`;

export async function githubProviderImpl({
  org,
  host,
  apiBaseUrl,
  token,
  repoTag,
}: DataProviderConfig): Promise<SynergyApi> {
  const githubCredentialsProvider =
    SingleInstanceGithubCredentialsProvider.create({ host, token });
  const orgUrl = `https://${host}/${org}`;
  const { headers } = await githubCredentialsProvider.getCredentials({
    url: orgUrl,
  });
  const client = graphql.defaults({
    baseUrl: apiBaseUrl,
    headers,
  });

  return {
    getProjects: async (): Promise<Project[]> => {
      const query = `
        query repositories {
          search(type: REPOSITORY, query: "org:${org} topic:${repoTag} fork:true archived:false", first: 100) {
            nodes {
              ... on Repository {
                ${GITHUB_REPO_QUERY_BASE_FIELDS}
                issues (states: OPEN, first: 100) {
                  nodes {
                    state
                  }
                }
              }
            }
            pageInfo {
              hasNextPage
              endCursor
            }
          }
        }`;

      const response: ProjectsQueryResponse = await client(query);

      return response.search.nodes
        .map((repo: Repository) => formatProject(repo, repoTag))
        .sort((p1: Project, p2: Project) => {
          return (
            new Date(p2.updatedAt).getTime() - new Date(p1.updatedAt).getTime()
          );
        });
    },
    getProject: async (
      name: string,
      owner: string,
    ): Promise<ProjectDetails> => {
      const query = `
        query repository($name: String!, $owner: String!) {
          repository(name: $name, owner: $owner) {
            ${GITHUB_REPO_QUERY_BASE_FIELDS}
            issues (states: OPEN, first: 100, orderBy: {field: UPDATED_AT, direction: DESC}) {
              nodes {
                ... on Issue {
                  id
                  url
                  author {
                    login
                    url
                  }
                  title
                  body
                  createdAt
                  state
                  updatedAt
                }
              }
              totalCount
            }
            pinnedIssues(first: 100) {
              nodes {
                ... on PinnedIssue {
                  issue {
                    id
                    url
                    author {
                      login
                      url
                    }
                    title
                    body
                    createdAt
                    state
                    updatedAt
                  }
                }
              }
            }
            readme: object(expression: "HEAD:README.md") {
              ... on Blob {
                text
              }
            }     
          } 
        }`;

      const response: ProjectQueryResponse = await client(query, {
        name,
        owner,
      });

      const repo = response.repository;
      return {
        ...formatProject(repo, repoTag),
        readme: repo.readme.text,
        issues: repo.issues.nodes.map(convertToProjectIssue),
        pinnedIssues: repo.pinnedIssues.nodes
          .map(pinned => pinned.issue)
          .filter(keepOpenOnly)
          .map(convertToProjectIssue),
      };
    },
    getIssues: async (): Promise<ProjectIssue[]> => {
      const query = `
        query {
          search(type: ISSUE, query: "org:${org} state:open label:${repoTag} archived:false", first: 100) {
            nodes {
              ... on Issue {
                author {
                  login
                  url
                }
                body
                createdAt
                id
                isPinned
                repository {
                  name
                  primaryLanguage {
                    name
                  }
                }
                state
                title
                updatedAt
                url
              }
            }
            pageInfo {
              hasNextPage
              endCursor
            }
          }
        }`;

      const response: IssuesQueryResponse = await client(query);

      return response.search.nodes
        .map(convertToProjectIssue)
        .sort((p1: ProjectIssue, p2: ProjectIssue) => {
          return (
            new Date(p2.updatedAt).getTime() - new Date(p1.updatedAt).getTime()
          );
        });
    },
    getMyIssues: async (): Promise<ProjectIssue[]> => {
      const query = `
        query {
          search(type: ISSUE, query: "org:${org} is:issue assignee:@me", first: 100) {
            nodes {
              ... on Issue {
                author {
                  login
                  url
                }
                body
                createdAt
                id
                isPinned
                labels (first: 50) {
                  nodes {
                    name
                  }
                }
                repository {
                  name
                  repositoryTopics (first: 50) {
                    nodes {
                      topic {
                        name
                      }
                    }
                  }
                  primaryLanguage {
                    name
                  }
                }
                state
                title
                updatedAt
                url
              }
            }
            pageInfo {
              hasNextPage
              endCursor
            }
          }
        }`;

      const response: IssuesQueryResponse = await client(query);

      return (
        response.search.nodes
          .filter(keepInnerSourceOnly)
          .map(convertToProjectIssue)
          .sort((p1: ProjectIssue, p2: ProjectIssue) => {
            return (
              new Date(p2.updatedAt).getTime() -
              new Date(p1.updatedAt).getTime()
            );
          })
      );
    },
  };
}

function formatProject(repo: Repository, repoTag: string): Project {
  const topics: string[] = [];
  repo.repositoryTopics?.nodes.forEach((topicNode: TopicNode) => {
    if (topicNode.topic && topicNode.topic.name !== repoTag) {
      topics.push(topicNode.topic.name.toLowerCase());
    }
  });
  return {
    id: repo.id,
    name: repo.name,
    description: repo.description,
    url: repo.url,
    visibility: repo.visibility,
    isPrivate: repo.isPrivate,
    owner: repo.owner?.login,
    updatedAt: new Date(repo.updatedAt).toDateString(),
    primaryLanguage: repo.primaryLanguage?.name?.toLowerCase(),
    languages: repo.languages?.nodes.map(
      (languageNode: LanguageNode) => languageNode.name,
    ),
    topics: topics,
    starsCount: repo.stargazerCount,
    issuesCount: repo.issues.nodes.length,
    contributionsCount: repo.pullRequests.totalCount,
    contributors: parseContributors(repo),
  };
}

function parseContributors(repo: Repository) {
  const pullRequests = repo.pullRequests.nodes.filter(
    (prNode: RepositoryPullRequestNode) =>
      prNode.baseRef.name === repo.defaultBranchRef.name,
  );
  const contributors = pullRequests.reduce(
    (contributors: Contributors, prNode: RepositoryPullRequestNode) => {
      const author = prNode.author.login;
      if (!contributors[author]) {
        contributors[author] = 0;
      }
      contributors[author]++;
      return contributors;
    },
    {},
  );
  return contributors;
}

function keepOpenOnly(issue: RepositoryIssue) {
  return issue.state === 'OPEN';
}

function keepInnerSourceOnly(issue: RepositoryIssue) {
  if (issue.labels) {
    for (const node of issue.labels.nodes) {
      if (node.name.toLowerCase() === 'inner-source') return true;
    }
  }

  if (issue.repository?.repositoryTopics) {
    for (const node of issue.repository.repositoryTopics.nodes) {
      if (node.topic.name.toLowerCase() === 'inner-source') return true;
    }
  }

  return false;
}

function convertToProjectIssue(issue: RepositoryIssue) {
  return {
    ...issue,
    isOpen: issue.state.toLowerCase() === 'open',
    repository: issue.repository?.name,
    primaryLanguage: issue.repository?.primaryLanguage?.name,
  };
}
