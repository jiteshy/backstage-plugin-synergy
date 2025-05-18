import { Config } from '@backstage/config';

export type DataProviderConfig = {
  provider: string;
  org?: string;
  host?: string;
  apiBaseUrl: string;
  token: string;
  repoTag: string;
};

export function readConfig(config: Config): DataProviderConfig {
  const repoTag = config.getString('synergy.repoTag');
  const synergyConfig = config.getConfig('synergy.provider');

  // Get the provider from config, default to 'github' for backward compatibility
  const provider = config.getString('synergy.provider.type');

  // Check if the provider exists in the config
  if (!synergyConfig.has(provider)) {
    throw new Error(
      `Provider '${provider}' not found in synergy.provider configuration`,
    );
  }

  const providerConfig = synergyConfig.getConfig(provider);

  // Only get org and host for GitHub provider
  const org =
    provider === 'github' ? providerConfig.getString('org') : undefined;
  const host =
    provider === 'github' ? providerConfig.getString('host') : undefined;
  const token = providerConfig.getString('token');
  const apiBaseUrl = providerConfig.getString('apiBaseUrl');

  return {
    provider,
    org,
    host,
    apiBaseUrl,
    token,
    repoTag,
  };
}
