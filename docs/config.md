# Plugin configuration

The following configuration options are available for your app-config.yaml:

```yaml
synergy:
  provider:
    type: github # Specify the provider type - github or gitlab
    github:
      org: jiteshy-synergy
      host: https://github.com
      apiBaseUrl: https://api.github.com
      token: <GitHub_Token>
      hideIssues: <Optional true/false. Refer details below.>
    gitlab:
      org: your-group-name
      host: https://gitlab.com
      apiBaseUrl: https://gitlab.com/api
      token: <GitLab_Token>
      hideIssues: <Optional true/false. Refer details below.>
  catalogBasePath: <Optional catalog entity base path>
  repoTag: inner-source
```

The configuration values are:

- provider
  - Type: Object
  - Required: Yes
  - Details: configurations required to integrate GitHub or GitLab as the source of truth for Inner-Source dashboard.
    - Note: As of now, the plugin supports GitHub and GitLab.
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
- provider.github.hideIssues
  - Type: boolean
  - Required: No
  - Details: Boolean indicating whether to hide the issues tab (e.g., when Issues not used in GitHub projects). Default is false. If true, only the project list and details (README & Contributing Guidelines) will be available, as other views depend on issues.
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
- catalogBasePath
  - Type: string
  - Required: No
  - Details: Catalog entity base path. Will be used for creating catalog entity link.
- repoTag
  - Type: string
  - Required: Yes
  - Details: Topic or Label used for Inner-Source projects or issues e.g. "inner-source"
