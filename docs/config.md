# Plugin configuration

The Synergy plugin supports two providers: GitHub and GitLab. You can configure either of them as below.

## GitHub Configuration

```yaml
synergy:
  provider:
    type: github
    github:
      org: your-org-name # Required for GitHub
      host: https://github.com # Required for GitHub
      apiBaseUrl: https://api.github.com
      token: ${GITHUB_TOKEN}
      hideIssues: <Optional true/false. Refer details below.>
  catalogBasePath: <Optional catalog entity base path>
  repoTag: inner-source
```

## GitLab Configuration

```yaml
synergy:
  provider:
    type: gitlab
    gitlab:
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
- provider.type
  - Type: string
  - Required: Yes
  - Details: Provider type to integrate - github or gitlab
- provider.github.org
  - Type: string
  - Required: Yes (GitHub only)
  - Details: GitHub Org name you want to fetch the Inner-Source projects and issues from.
- provider.github.host
  - Type: string
  - Required: Yes (GitHub only)
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
- provider.gitlab.apiBaseUrl
  - Type: string
  - Required: Yes
  - Details: Base url to call GitLab APIs e.g. https://gitlab.com/api
- provider.gitlab.token
  - Type: string
  - Required: Yes
  - Details: GitLab access token.
- provider.gitlab.hideIssues
  - Type: boolean
  - Required: No
  - Details: Boolean indicating whether to hide the issues tab (e.g., when Issues not used in GitLab projects). Default is false. If true, only the project list and details (README & Contributing Guidelines) will be available, as other views depend on issues.
- catalogBasePath
  - Type: string
  - Required: No
  - Details: Catalog entity base path. Will be used for creating catalog entity link.
- repoTag
  - Type: string
  - Required: Yes
  - Details: Topic or Label used for Inner-Source projects or issues e.g. "inner-source"
