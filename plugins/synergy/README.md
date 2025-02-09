# synergy

Welcome to the synergy plugin!

_This plugin was created through the Backstage CLI_

## Getting started

Your plugin has been added to the example app in this repository, meaning you'll be able to access it by running `yarn start` in the root directory, and then navigating to [/synergy](http://localhost:3000/synergy).

You can also serve the plugin in isolation by running `yarn start` in the plugin directory.
This method of serving the plugin provides quicker iteration speed and a faster startup and hot reloads.
It is only meant for local development, and the setup for it can be found inside the [/dev](./dev) directory.

## Installation

Add the plugin to your frontend app:

```bash
yarn workspace app add @jiteshy/backstage-plugin-synergy
```

Expose the Synergy page:

```ts
// packages/app/src/App.tsx
import { SynergyPage } from '@jiteshy/backstage-plugin-synergy';

// ...

const AppRoutes = () => (
  <FlatRoutes>
    // ...
    <Route path="/synergy" element={<SynergyPage />} />
    // ...
  </FlatRoutes>
);
```

Add the navigation in the frontend:

```ts
// packages/app/src/components/Root/Root.tsx
import DeviceHubOutlined from '@material-ui/icons/DeviceHubOutlined';
// ...
export const Root = ({ children }: PropsWithChildren<{}>) => (
  <SidebarPage>
    // ...
    <SidebarItem icon={DeviceHubOutlined} to="synergy" text="Synergy" />
    // ...
  </SidebarPage>
);
```

## Configuration

The following configuration options are available for your app-config.yaml:

```yaml
synergy:
  provider:
    github:
      hideIssues: <Optional true/false. Refer details below.>
  catalogBasePath: <Optional catalog entity base path>
```

The configuration values are:

- provider.github.hideIssues
  - Type: boolean
  - Required: No
  - Details: Boolean indicating whether to hide the issues tab (e.g., when Issues not used in GitHub projects). Default is false. If true, only the project list and details (README & Contributing Guidelines) will be available, as other views depend on issues.
- catalogBasePath
  - Type: string
  - Required: No
  - Details: Catalog entity base path. Will be used for creating catalog entity link.

## Translations (experimental)

Synergy plugin has integration with Backstage's experimental translation support. Refer official documentation on how to override the default plugin language - [Overwrite plugin messages](https://backstage.io/docs/plugins/internationalization/#for-an-application-developer-overwrite-plugin-messages)

To add a new language, please do the below:

1. Create a new translation file in `packages/app/src/translations` with language code e.g. `synergy-fi.ts`.

```ts
// packages/app/src/translations/synergy-fi.ts
import { synergyTranslationRef } from '@jiteshy/backstage-plugin-synergy';
import { createTranslationMessages } from '@backstage/core-plugin-api/alpha';

const fi = createTranslationMessages({
  ref: synergyTranslationRef,
  full: false,
  messages: {
    synergyPage: {
      title: 'Tervetuloa Synergiaan!',
      subTitle: 'Sisäisen lähdekeskuksemme',
    },
    ...
  },
});

export default fi;
```

You can create translation files for other languages in a similar manner.

2. Create a new translation resource in `packages/app/src/translations` for the plugin e.g. synergy.ts

```ts
// packages/app/src/translations/synergy.ts
import { synergyTranslationRef } from '@jiteshy/backstage-plugin-synergy';
import { createTranslationResource } from '@backstage/core-plugin-api/alpha';

export const synergyTranslationsResource = createTranslationResource({
  ref: synergyTranslationRef,
  translations: {
    fi: () => import('./synergy-fi'),
    // include other languages, if needed
  },
});
```

3. Then add the translation to your `packages/app/src/App.tsx`:

```tsx
import { synergyTranslationsResource } from './translations/synergy';

const app = createApp({
  //...
  __experimentalTranslations: {
    availableLanguages: ['en', 'fi'],
    resources: [synergyTranslationsResource],
  },
});
```
