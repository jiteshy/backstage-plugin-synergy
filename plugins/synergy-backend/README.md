# synergy

Welcome to the synergy backend plugin!

_This plugin was created through the Backstage CLI_

## Getting started

Your plugin has been added to the example app in this repository, meaning you'll be able to access it by running `yarn
start` in the root directory, and then navigating to [/synergyPlugin/health](http://localhost:7007/api/synergyPlugin/health).

You can also serve the plugin in isolation by running `yarn start` in the plugin directory.
This method of serving the plugin provides quicker iteration speed and a faster startup and hot reloads.
It is only meant for local development, and the setup for it can be found inside the [/dev](/dev) directory.

## Installation

Add the plugin to your backend app:

```bash
yarn workspace backend add  @jiteshy/backstage-plugin-synergy-backend
```

In your `packages/backend/src/index.ts` make the following changes:

```ts
import { createBackend } from '@backstage/backend-defaults';
const backend = createBackend();
// ... other plugins
backend.add(import('@jiteshy/backstage-plugin-synergy-backend'));
backend.start();
```

## Configuration

The following configuration options are available for your app-config.yaml:

```yaml
synergy:
  provider:
    # Specify either github OR gitlab, not both
    github:
      org: jiteshy-synergy
      host: https://github.com
      apiBaseUrl: https://api.github.com
      token: <GitHub_Token>
    # OR
    gitlab:
      org: jiteshy-synergy
      host: https://gitlab.com
      apiBaseUrl: https://gitlab.com
      token: <GitLab_Token>
  repoTag: inner-source
```

The configuration values are:

- provider
  - Type: Object
  - Required: Yes
  - Details: configurations required to integrate either GitHub OR GitLab as the source of truth for Inner-Source dashboard.
    - Note: Only one provider (GitHub or GitLab) should be specified at a time.
- provider.github.org
  - Type: string
  - Required: Yes
  - Details: GitHub Org name you want to fetch the Inner-Source projects and issues from.
- provider.github.host
  - Type: string
  - Required: Yes
  - Details: GitHub host url e.g. https://github.com
- provider.github.apiBaseUrl
  - Type: string
  - Required: Yes
  - Details: Base url to call GitHub APIs e.g. https://api.github.com
- provider.github.token
  - Type: string
  - Required: Yes
  - Details: GitHub access token.
- provider.gitlab.org
  - Type: string
  - Required: Yes
  - Details: GitLab group name you want to fetch the Inner-Source projects and issues from.
- provider.gitlab.host
  - Type: string
  - Required: Yes
  - Details: GitLab host url e.g. https://gitlab.com
- provider.gitlab.apiBaseUrl
  - Type: string
  - Required: Yes
  - Details: Base url to call GitLab APIs e.g. https://gitlab.com
- provider.gitlab.token
  - Type: string
  - Required: Yes
  - Details: GitLab access token.
- repoTag
  - Type: string
  - Required: Yes
  - Details: Topic or Label used for Inner-Source projects or issues e.g. "inner-source"
