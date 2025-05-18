import { graphql } from '@octokit/graphql';
import { DataProviderConfig } from './configReader';
import {
  Project,
  ProjectDetails,
  Contributors,
  SynergyApi,
  ProjectIssue,
  ProjectContributor,
  ProjectStats,
  Author,
} from '@jiteshy/backstage-plugin-synergy-common';

// Custom error class for GitLab API errors
class GitLabApiError extends Error {
  constructor(message: string, public status?: number, public response?: any) {
    super(message);
    this.name = 'GitLabApiError';
  }
}

// GitLab GraphQL types
type GitLabProject = {
  id: string;
  name: string;
  description: string;
  webUrl: string;
  visibility: string;
  archived: boolean;
  namespace: {
    name: string;
    fullPath: string;
  };
  updatedAt: string;
  languages: {
    name: string;
    share: number;
  }[];
  topics: string[];
  starCount: number;
  mergeRequests: {
    nodes: {
      author: {
        username: string;
      };
      targetBranch: string;
    }[];
    count: number;
  };
  issues: {
    nodes: GitLabIssue[];
  };
  projectMembers: {
    nodes: {
      user: {
        username: string;
        webUrl: string;
        avatarUrl: string;
      };
    }[];
  };
  repository: {
    blobs: {
      nodes: {
        rawBlob: string;
        path: string;
      }[];
    };
  };
};

type GitLabIssue = {
  id: string;
  iid: string;
  webUrl: string;
  author: {
    username: string;
    webUrl?: string;
    avatarUrl?: string;
  };
  title: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  labels: {
    nodes: {
      title: string;
    }[];
  };
  state: string;
  project?: {
    name: string;
    namespace: {
      fullPath: string;
    };
    languages: {
      name: string;
    }[];
  };
  projectId?: string;
};

type GitLabResponse<T> = {
  group?: {
    projects: {
      nodes: T[];
    };
  };
  project?: T;
};

// Base GraphQL query fields for projects
const GITLAB_PROJECT_QUERY_BASE_FIELDS = `
  id
  name
  description
  webUrl
  visibility
  archived
  namespace {
    name
    fullPath
  }
  updatedAt
  languages {
    name
    share
  }
  topics
  starCount
  mergeRequests(state: merged, first: 100) {
    nodes {
      author {
        username
      }
      targetBranch
    }
    count
  }
  projectMembers(first: 100) {
    nodes {
      user {
        username
        webUrl
        avatarUrl
      }
    }
  }
  repository {
    blobs(ref: "main", paths: ["README.md", "CONTRIBUTING.md"]) {
      nodes {
        rawBlob
        path
      }
    }
  }
`;

export async function gitlabProviderImpl({
  apiBaseUrl,
  token,
  repoTag,
}: DataProviderConfig): Promise<SynergyApi> {
  const client = graphql.defaults({
    baseUrl: apiBaseUrl,
    headers: {
      'PRIVATE-TOKEN': token,
    },
  });

  // Helper function to handle GraphQL errors
  async function executeQuery<T>(query: string, variables?: any): Promise<T> {
    try {
      const response = await client(query, variables);
      if (!response) {
        throw new GitLabApiError('Empty response from GitLab API');
      }
      return response as T;
    } catch (error: any) {
      // Enhanced error logging
      console.error('GitLab API Error:', {
        message: error.message,
        status: error.status,
        response: error.response,
        query: query.split('\n')[0],
        variables,
      });

      if (error.status === 401) {
        throw new GitLabApiError(
          'Authentication failed. Please check your GitLab token. Make sure it has the correct scopes (api, read_api) and is not expired.',
          error.status,
          error.response,
        );
      }

      if (error.status === 404) {
        throw new GitLabApiError(
          'Resource not found. Please check your GitLab token permissions.',
          error.status,
          error.response,
        );
      }

      if (error.status === 403) {
        throw new GitLabApiError(
          'Access denied. Please check your GitLab permissions.',
          error.status,
          error.response,
        );
      }

      throw new GitLabApiError(
        `GitLab API error: ${error.message}`,
        error.status,
        error.response,
      );
    }
  }

  // Helper function to format project data
  function formatProject(project: GitLabProject): Project {
    const contributors: Contributors = {};
    project.projectMembers.nodes.forEach(member => {
      const username = member.user.username;
      contributors[username] = (contributors[username] || 0) + 1;
    });

    // Find primary language (language with highest share)
    const primaryLanguage = project.languages.reduce(
      (prev, current) => (current.share > prev.share ? current : prev),
      { name: '', share: 0 },
    );

    return {
      id: project.id,
      name: project.name,
      description: project.description || '',
      url: project.webUrl,
      visibility: project.visibility,
      isPrivate: project.visibility === 'private',
      owner: project.namespace.fullPath,
      primaryLanguage: primaryLanguage.name,
      languages: project.languages.map(lang => lang.name),
      topics: project.topics,
      starsCount: project.starCount,
      issuesCount: project.issues?.nodes.length || 0,
      contributionsCount: project.mergeRequests.count || 0,
      contributors,
      updatedAt: project.updatedAt,
    };
  }

  // Helper function to format issue data
  function formatIssue(issue: GitLabIssue): ProjectIssue {
    return {
      id: issue.id,
      url: issue.webUrl,
      author: {
        login: issue.author.username,
        url: issue.author.webUrl,
        avatarUrl: issue.author.avatarUrl,
      },
      title: issue.title,
      body: issue.description,
      createdAt: issue.createdAt,
      updatedAt: issue.updatedAt,
      isOpen: issue.state === 'opened',
      repository: issue.project?.namespace.fullPath || '',
      primaryLanguage: issue.project?.languages[0]?.name,
    };
  }

  return {
    async getProjects(): Promise<Project[]> {
      try {
        const query = `
          query GetProjects {
            projects(membership: true, topics: ["${repoTag}"], archived: EXCLUDE) {
              nodes {
                ${GITLAB_PROJECT_QUERY_BASE_FIELDS}
                issues(state: opened, first: 100) {
                  nodes {
                    state
                  }
                }
              }
              pageInfo {
                hasNextPage
                endCursor
              }
            }
          }`;

        const response = await executeQuery<{
          projects: { nodes: GitLabProject[] };
        }>(query);

        if (!response.projects) {
          throw new GitLabApiError('Failed to get projects');
        }

        return response.projects.nodes.map(formatProject);
      } catch (error: unknown) {
        if (error instanceof GitLabApiError) {
          throw error;
        }
        const errorMessage =
          error instanceof Error ? error.message : 'Unknown error occurred';
        throw new GitLabApiError(`Failed to fetch projects: ${errorMessage}`);
      }
    },

    async getProject(name: string, owner: string): Promise<ProjectDetails> {
      try {
        const fullPath = `${owner}/${name}`;
        const query = `
          query GetProject($fullPath: ID!) {
            project(fullPath: $fullPath) {
              ${GITLAB_PROJECT_QUERY_BASE_FIELDS}
              issues(first: 100) {
                nodes {
                  id
                  iid
                  webUrl
                  author {
                    username
                    webUrl
                    avatarUrl
                  }
                  title
                  description
                  createdAt
                  updatedAt
                  labels {
                    nodes {
                      title
                    }
                  }
                  state
                }
              }
            }
          }`;

        const response = await executeQuery<GitLabResponse<GitLabProject>>(
          query,
          { fullPath },
        );

        if (!response.project) {
          throw new GitLabApiError(
            `Project '${fullPath}' not found or not accessible`,
          );
        }

        const project = response.project;
        const readmeBlob = project.repository.blobs.nodes.find(
          blob => blob.path === 'README.md',
        );
        const contributingBlob = project.repository.blobs.nodes.find(
          blob => blob.path === 'CONTRIBUTING.md',
        );

        return {
          ...formatProject(project),
          readme: readmeBlob?.rawBlob || '',
          contributingGuidelines: contributingBlob?.rawBlob || '',
          issues: project.issues.nodes.map(formatIssue),
          pinnedIssues: [], // TODO: Get from GitLab API
        };
      } catch (error: unknown) {
        if (error instanceof GitLabApiError) {
          throw error;
        }
        const errorMessage =
          error instanceof Error ? error.message : 'Unknown error occurred';
        throw new GitLabApiError(
          `Failed to fetch project details: ${errorMessage}`,
        );
      }
    },

    async getIssues(): Promise<ProjectIssue[]> {
      const query = `
        query GetIssues() {
          innerSourceProjects: projects(membership: true, topics: ["${repoTag}"], archived: EXCLUDE) {
            nodes {
              name
              namespace { fullPath }
              languages { name }
              issues(first: 100, state: opened) {
                nodes {
                  id iid webUrl author { username webUrl avatarUrl } title description createdAt updatedAt labels { nodes { title } } state projectId
                }
              }
            }
          }
          allProjects: projects(membership: true, archived: EXCLUDE) {
            nodes {
              name
              namespace { fullPath }
              languages { name }
              issues(labelName: "${repoTag}", state: opened) {
                nodes {
                  id iid webUrl author { username webUrl avatarUrl } title description createdAt updatedAt labels { nodes { title } } state projectId
                }
              }
            }
          }
        }
      `;
      const response = await executeQuery<any>(query);

      // Collect all issues in inner-source projects
      const innerSourceProjectPaths = new Set(
        response.innerSourceProjects.nodes.map(
          (p: any) => `${p.namespace.fullPath}/${p.name}`,
        ),
      );
      const issuesMap = new Map<string, { issue: any; project: any }>();
      response.innerSourceProjects.nodes.forEach((project: any) => {
        project.issues.nodes.forEach((issue: any) => {
          issuesMap.set(issue.id, { issue, project });
        });
      });
      // Add issues with label repoTag from all projects not already in inner-source projects
      response.allProjects.nodes.forEach((project: any) => {
        const projectPath = `${project.namespace.fullPath}/${project.name}`;
        if (innerSourceProjectPaths.has(projectPath)) return;
        project.issues.nodes.forEach((issue: any) => {
          if (!issuesMap.has(issue.id)) {
            issuesMap.set(issue.id, { issue, project });
          }
        });
      });
      // Map to ProjectIssue[]
      return Array.from(issuesMap.values()).map(({ issue, project }) =>
        formatIssue({ ...issue, project }),
      );
    },

    async getMyIssues(): Promise<ProjectIssue[]> {
      const query = `
        query GetMyIssues {
          currentUser {
            username
          }
          projects(membership: true, first: 100, archived: EXCLUDE) {
            nodes {
              name
              namespace {
                fullPath
              }
              languages {
                name
              }
              issues(assigneeUsernames: ["$currentUser.username"], first: 100) {
                nodes {
                  id
                  iid
                  webUrl
                  author {
                    username
                    webUrl
                    avatarUrl
                  }
                  title
                  description
                  createdAt
                  updatedAt
                  labels {
                    nodes {
                      title
                    }
                  }
                  state
                  projectId
                }
              }
            }
          }
        }
      `;

      const response = await executeQuery<{
        currentUser: {
          username: string;
        };
        projects: {
          nodes: {
            name: string;
            namespace: {
              fullPath: string;
            };
            languages: { name: string }[];
            issues: { nodes: GitLabIssue[] };
          }[];
        };
      }>(query);

      const issues = response.projects.nodes.flatMap(project =>
        project.issues.nodes.map(issue => ({
          ...issue,
          project: {
            name: project.name,
            namespace: project.namespace,
            languages: project.languages,
          },
        })),
      );
      return issues.map(formatIssue);
    },

    async getContributions(): Promise<ProjectContributor[]> {
      const query = `
        query GetContributions {
          projects(membership: true, topics: ["${repoTag}"], archived: EXCLUDE) {
            nodes {
              mergeRequests(first: 100) {
                nodes {
                  author {
                    name
                    webUrl
                    avatarUrl
                  }
                }
              }
            }
          }
        }
      `;

      const response = await executeQuery<{
        projects: {
          nodes: {
            mergeRequests: {
              nodes: {
                author: { name: string; webUrl: string; avatarUrl: string };
              }[];
            };
          }[];
        };
      }>(query);

      // Count contributions per user
      const contributions = new Map<
        string,
        { author: Author; count: number }
      >();

      response.projects.nodes.forEach(project => {
        // Count merge requests
        project.mergeRequests.nodes.forEach(mr => {
          const username = mr.author.name;
          const existing = contributions.get(username);
          if (existing) {
            existing.count += 1;
          } else {
            contributions.set(username, {
              author: {
                login: username,
                url: mr.author.webUrl,
                avatarUrl: mr.author.avatarUrl,
              },
              count: 1,
            });
          }
        });
      });

      return Array.from(contributions.values()).map(({ author, count }) => ({
        ...author,
        contributionsCount: count,
      }));
    },

    async getStats(): Promise<ProjectStats> {
      // Single multiplexed query for efficiency
      const query = `
        query GetStats() {
          innerSourceProjects: projects(membership: true, topics: ["${repoTag}"], archived: EXCLUDE) {
            count
            nodes {
              fullPath
              openIssuesCount
              issueStatusCounts {
                closed
              }
            }
          }
          allProjects: projects(membership: true, archived: EXCLUDE) {
            nodes {
              fullPath
              openIssuesCount: issues(labelName: "${repoTag}", state: opened) {
                count
              }

              closedIssuesCount: issues(labelName: "${repoTag}", state: closed) {
                count
              }
            }
          }
        }
      `;
      const response = await executeQuery<any>(query);

      // Process inner-source projects
      const innerSourcePaths = new Set(
        response.innerSourceProjects.nodes.map((p: any) => p.fullPath),
      );
      let openIssuesCount = 0;
      let closedIssuesCount = 0;
      response.innerSourceProjects.nodes.forEach((p: any) => {
        openIssuesCount += p.openIssuesCount || 0;
        closedIssuesCount += p.issueStatusCounts?.closed || 0;
      });

      // Standalone issues: issues labelled inner-source but not in an inner-source project
      let standaloneIssuesCount = 0;
      response.allProjects.nodes.forEach((p: any) => {
        if (!innerSourcePaths.has(p.fullPath)) {
          standaloneIssuesCount += p.openIssuesCount.count || 0;
          closedIssuesCount += p.closedIssuesCount.count || 0;
        }
      });

      return {
        projectsCount: response.innerSourceProjects.count,
        openIssuesCount,
        closedIssuesCount,
        pinnedIssuesCount: 0, // Not available in GitLab GraphQL
        standaloneIssuesCount,
      };
    },
  };
}
