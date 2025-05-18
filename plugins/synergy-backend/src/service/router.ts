import express from 'express';
import Router from 'express-promise-router';
import {
  LoggerService,
  RootConfigService,
} from '@backstage/backend-plugin-api';
import { Request } from 'express';
import { githubProviderImpl } from '../lib/github';
import { gitlabProviderImpl } from '../lib/gitlab';
import { DataProviderConfig, readConfig } from '../lib/configReader';
import {
  Project,
  ProjectContributor,
  ProjectDetails,
  ProjectIssue,
  ProjectStats,
  SynergyApi,
} from '@jiteshy/backstage-plugin-synergy-common';
import { MiddlewareFactory } from '@backstage/backend-defaults/rootHttpRouter';

export interface RouterOptions {
  logger: LoggerService;
  config: RootConfigService;
}

type ProjectReq = {
  name: string;
  owner: string;
};

export async function createRouter(
  options: RouterOptions,
): Promise<express.Router> {
  const { logger, config } = options;

  const providerConfig: DataProviderConfig = readConfig(config);
  const provider = providerConfig.provider;

  let providerImpl: SynergyApi;
  if (provider.toLowerCase() === 'github') {
    providerImpl = await githubProviderImpl(providerConfig);
  } else if (provider.toLowerCase() === 'gitlab') {
    providerImpl = await gitlabProviderImpl(providerConfig);
  } else {
    throw new Error(`Provider implementation not found for: ${provider}`);
  }

  const router = Router();
  router.use(express.json());

  router.get('/health', (_, response) => {
    logger.info('PONG!');
    response.json({ status: 'ok' });
  });

  router.get('/projects', async (_, response) => {
    logger.info(`Fetching inner source projects from ${provider}`);
    const projects: Project[] = await providerImpl.getProjects();
    response.json(projects);
  });

  router.get(
    '/project',
    async (req: Request<{}, {}, {}, ProjectReq>, response) => {
      const { name, owner } = req.query;
      if (name && owner) {
        logger.info(`Fetching inner source project: ${name}`);
        const project: ProjectDetails = await providerImpl.getProject(
          name,
          owner,
        );
        response.json(project);
      } else {
        response
          .status(400)
          .json('Bad request. Please pass name and owner for the project.');
      }
    },
  );

  router.get('/issues', async (_, response) => {
    logger.info(`Fetching inner source issues from ${provider}`);
    const issues: ProjectIssue[] = await providerImpl.getIssues();
    response.json(issues);
  });

  router.get('/myissues', async (_, response) => {
    logger.info(`Fetching user's issues from ${provider}`);
    const issues: ProjectIssue[] = await providerImpl.getMyIssues();
    response.json(issues);
  });

  router.get('/contributions', async (_, response) => {
    logger.info(`Fetching user's contributions from ${provider}`);
    const issues: ProjectContributor[] = await providerImpl.getContributions();
    response.json(issues);
  });

  router.get('/stats', async (_, response) => {
    logger.info(`Fetching inner source stats from ${provider}`);
    const issues: ProjectStats = await providerImpl.getStats();
    response.json(issues);
  });

  router.use(MiddlewareFactory.create({ config, logger }).error());
  return router;
}
