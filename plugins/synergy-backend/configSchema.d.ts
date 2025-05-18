export interface Config {
  synergy: {
    /**
     * Synergy plugin providers
     */
    provider: {
      /**
       * Type of provider to use (github or gitlab)
       */
      type: 'github' | 'gitlab';
      /**
       * Github provider configuration
       */
      github?: {
        /**
         * GitHub Org name you want to fetch the Inner-Source projects and issues from
         */
        org: string;

        /**
         * GitHub host url e.g. https://github.com
         */
        host: string;

        /**
         * Base url to call GitHub APIs e.g. https://api.github.com
         */
        apiBaseUrl: string;

        /**
         * GitHub access token
         * @visibility secret
         */
        token: string;

        /**
         * Boolean indicating whether to hide the issues tab (e.g., when Issues not used in GitHub projects). Default is false. If true, only the project list and details (README & Contributing Guidelines) will be available, as other views depend on issues.
         */
        hideIssues?: boolean;
      };
      /**
       * GitLab provider configuration
       */
      gitlab?: {
        /**
         * Base url to call GitLab APIs e.g. https://gitlab.com/api
         */
        apiBaseUrl: string;

        /**
         * GitLab access token
         * @visibility secret
         */
        token: string;

        /**
         * Boolean indicating whether to hide the issues tab (e.g., when Issues not used in GitLab projects). Default is false. If true, only the project list and details (README & Contributing Guidelines) will be available, as other views depend on issues.
         */
        hideIssues?: boolean;
      };
    };

    /**
     * Topic or Label used for Inner-Source projects or issues e.g. "inner-source"
     */
    repoTag: string;
  };
}
