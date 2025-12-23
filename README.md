
# Keebfolio

The goal of this repository is to collect mechanical keyboard related projects (preferably Open Source).

[![Netlify Status](https://api.netlify.com/api/v1/badges/06821f1d-3e33-4bd4-92b2-4e44f3583060/deploy-status)](https://app.netlify.com/projects/keebfolio/deploys)

View the pages on [Keebfolio.netlify.app](https://keebfolio.netlify.app/)

## Contributing

Contributions are welcome!

### Adding Content

To add content, create a new Markdown file in `src/content/keyboards/[category]/`.
You can copy an existing file as a template.

**New Image Policy:**
- You **should use** remote URLs (e.g. `https://github.com/.../image.jpg`).
- The build process will **automatically download and optimize** them for you.

### Development Environment

1.  Clone the repository.
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Start the development server:
    ```bash
    npm run dev
    ```
    Open [http://localhost:4321](http://localhost:4321) to view the site.

### Adding a Theme

Themes are defined in `src/data/themes.json`. To add a new theme, add an entry:

```json
"theme-id": {
  "name": "Display Name",
  "background": "#hexcolor",
  "foreground": "#hexcolor",
  "accent": "#hexcolor"
}
```

The theme will automatically appear in the header dropdown.

### Housekeeping

- **Cleanup Unused Images**:
    ```bash
    npm run cleanup
    ```
    This deletes any downloaded images that are no longer referenced in your Markdown files.


### License

[![CC4](https://mirrors.creativecommons.org/presskit/buttons/88x31/svg/by-nc-sa.svg)](http://creativecommons.org/licenses/by-nc-sa/4.0/)

