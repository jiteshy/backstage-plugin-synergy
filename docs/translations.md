# Translations (experimental)

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
