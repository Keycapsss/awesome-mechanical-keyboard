
# Keebfolio

The goal of this repository is to collect mechanical keyboard related projects (preferably Open Source).

View the pages on [Keebfolio.netlify.app](https://keebfolio.netlify.app/) or GitHub:

- [Staggered](src/pages/en/staggered.md)
- [Ortho](src/pages/en/ortholinear.md)
- [Split](src/pages/en/split.md)
- [Other](src/pages/en/other.md)
- [Firmware](src/pages/en/firmware.md)
- [Miscellaneous](src/pages/en/miscellaneous.md)
- [Tools](src/pages/en/tools.md)
- [Tutorials](src/pages/en/tutorials.md)

## Contributing

Contributions are welcome!  
To add content, edit the Markdown file in the [src/pages/en](src/pages/en/) folder and open a [Pull Request](https://help.github.com/en/articles/about-pull-requests). You can also open a new [Issue](https://github.com/BenRoe/awesome-mechanical-keyboard/issues).  
Please use this [commit message conventions](https://gist.github.com/qoomon/5dfcdf8eec66a051ecd85625518cfd13).

The project uses [Astro](https://astro.build) as a Static Site Generator.
[![Netlify Status](https://api.netlify.com/api/v1/badges/06821f1d-3e33-4bd4-92b2-4e44f3583060/deploy-status)](https://app.netlify.com/sites/keebfolio/deploys)

#### Creating local development environment

##### Creating Github Auth Token

1. ~~Go to `https://github.com/settings/tokens`~~
2. ~~Click "Generate new token"~~
3. ~~Set note and expiration, then click "Generate token"~~
4. ~~Copy generated token, you will need it in another step~~

##### Installation and running local version

1. ~~Create environment variables:~~
   - ~~`GITHUB_AUTH_TOKEN` with generated token as its value.~~
   - ~~`GITHUB_API_V4_URL` with value `https://api.github.com/graphql`~~
2. ~~Clone repository~~
3. ~~`npm install`~~
5. ~~`npm run develop`~~

### License

[![CC4](https://mirrors.creativecommons.org/presskit/buttons/88x31/svg/by-nc-sa.svg)](http://creativecommons.org/licenses/by-nc-sa/4.0/)
