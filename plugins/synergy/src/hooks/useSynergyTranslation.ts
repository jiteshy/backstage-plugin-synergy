import { useTranslationRef } from '@backstage/core-plugin-api/alpha';
import { synergyTranslationRef } from '../translation';

export const useSynergyTranslation = () => {
  return useTranslationRef(synergyTranslationRef);
};
