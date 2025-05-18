# backstage-plugin-synergy

<p align="center">
<img src="./docs/images/logo.png"/>
</p>

Backstage.io plugin for **Inner-Source** dashboard. This plugin is both frontend and backend that manages and displays **Inner-Source projects and issues** from your GitHub or Gitlab org within Backstage. This plugin allows users to:

- Browse all the Inner-Source projects
- View details of an Inner-Source project including Pinned Issues, Open Issues, Readme & Contributing guidelines.
- Browse all the Inner-Source issues which are created in other projects (not exclusively Inner-Source).
- View details of an issue
- Check their own contributions so far
- Check the Inner-Source stats and leaderboard

Plugin currently supports integration with Github and Gitlab.

See more information from our [documentation](./docs/index.md).

## Setup

Find [installation instructions](./docs/index.md#installation) in our documentation.

**IMPORTANT**: This plugin only works with the new backend system. If you are still
using the old backend system, please migrate to the new backend system first.

## Examples

Home page (Projects List):

![Projects List](./docs/images/projects.png)

Project page (Pinned Issues):

![Project Details - Pinned Issues](./docs/images/projectDetails.png)

Project page (Open Issues):

![Project Details - Open Issues](./docs/images/projectDetailsOpenIssues.png)

Project page (Readme):

![Project Details - Readme](./docs/images/projectDetailsReadme.png)

Project page (Contribution Guidelines):

![Project Details - Contribution Guidelines](./docs/images/projectDetailsContribution.png)

Issues List:

![Issues List](./docs/images/issues.png)

User Contributions:

![User Contributions](./docs/images/contributions.png)

Statistics & Leaderboard:

![Statistics & Leaderboard](./docs/images/stats.png)

## Contributing

All contributions are very welcome. See [CONTRIBUTING](CONTRIBUTING.md) for more information.

If your organization uses this plugin, we'd love to have you listed in our [ADOPTERS](ADOPTERS.md) list! ❤️

## Attribution

This plugin's CI/CD pipelines, documentation & guideline styles are inspired by the amazing [Backstage.io plugin for Q&A](https://github.com/drodil/backstage-plugin-qeta) written by [Heikki Hellgren](https://github.com/drodil). 🙏

## License

This library is under the [MIT](LICENSE) license.
