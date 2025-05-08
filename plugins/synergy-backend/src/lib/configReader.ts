import { Config } from '@backstage/config';

export type DataProviderConfig = {
  provider: string;
  org: string;
  host: string;
  apiBaseUrl: string;
  token: string;
  repoTag: string;
};

export function readConfig(config: Config): DataProviderConfig {
  const repoTag = config.getString('synergy.repoTag');
  const synergyConfig = config.getConfig('synergy.provider');

  // Get the provider from config, default to 'github' for backward compatibility
  const provider =
    config.getOptionalString('synergy.provider.type') || 'github';

  // Check if the provider exists in the config
  if (!synergyConfig.has(provider)) {
    throw new Error(
      `Provider '${provider}' not found in synergy.provider configuration`,
    );
  }

  const providerConfig = synergyConfig.getConfig(provider);

  const org = providerConfig.getString('org');
  const host = providerConfig.getString('host');
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
