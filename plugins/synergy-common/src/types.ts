export type KeyValue = {
  [key: string]: string;
};

export type Contributors = {
  [name: string]: number;
};

export type Project = {
  id: string;
  name: string;
  fullPath: string;
  displayName: string;
  description: string;
  url: string;
  visibility: string;
  isPrivate: boolean;
  owner: string;
  primaryLanguage: string;
  languages: string[];
  topics: string[];
  starsCount: number;
  issuesCount: number;
  contributionsCount: number;
  contributors: Contributors;
  updatedAt: string;
};

export type Author = {
  login: string;
  url?: string;
  avatarUrl?: string;
};

export type ProjectIssue = {
  id: string;
  url: string;
  author: Author;
  title: string;
  body: string;
  createdAt: string;
  updatedAt: string;
  isPinned?: boolean;
  repository?: string;
  primaryLanguage?: string;
  isOpen: boolean;
};

export type ProjectPinnedIssue = {
  issue: ProjectIssue;
};

export type ProjectDetails = Project & {
  readme: string;
  issues: ProjectIssue[];
  pinnedIssues: ProjectIssue[];
  contributingGuidelines?: string;
};

export type ProjectContributor = Author & {
  contributionsCount: number;
};

export type ProjectStats = {
  projectsCount: number;
  openIssuesCount: number;
  closedIssuesCount: number;
  pinnedIssuesCount: number;
  standaloneIssuesCount: number;
};

export interface SynergyApi {
  getProjects(): Promise<Project[]>;
  getProject(name: string, owner: string): Promise<ProjectDetails>;
  getIssues(): Promise<ProjectIssue[]>;
  getMyIssues(): Promise<ProjectIssue[]>;
  getContributions(): Promise<ProjectContributor[]>;
  getStats(): Promise<ProjectStats>;
}
