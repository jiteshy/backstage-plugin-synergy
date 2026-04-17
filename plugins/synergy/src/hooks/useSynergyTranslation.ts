import { useTranslationRef } from '@backstage/core-plugin-api/alpha';
import { synergyTranslationRef } from '../translation';

export const useSynergyTranslation = (): {
  t: (key: string) => string;
} => {
  return useTranslationRef(synergyTranslationRef) as unknown as {
    t: (key: string) => string;
  };
};
