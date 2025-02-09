export interface Config {
  synergy: {
    /**
     * Synergy plugin providers
     */
    provider: {
      /**
       * Github provider configuration
       */
      github: {
        /**
         * Boolean indicating whether to hide the issues tab (e.g., when Issues
         * not used in GitHub projects). Default is false.
         * If true, only the project list and details (README & Contributing Guidelines)
         * will be available, as other views depend on issues.
         * @visibility frontend
         */
        hideIssues?: boolean;
      };
    };
    /**
     * Catalog base path - will be used for creating catalog entity link
     * @visibility frontend
     */
    catalogBasePath?: string;
  };
}
