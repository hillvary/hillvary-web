# Licensed fonts go here

Hillvary's typography uses two commercial fonts that can't be bundled or auto-downloaded:

- **Helvetica Now Display** — body copy + most headings
- **Moldin Demo** — large display/hero text (e.g. the "HILLVARY" wordmark)

Drop the licensed `.woff2` files in this folder with these exact names and they'll be picked
up automatically via `src/app/globals.css` (`@font-face` blocks):

```
public/fonts/HelveticaNowDisplay-Regular.woff2
public/fonts/HelveticaNowDisplay-Medium.woff2
public/fonts/HelveticaNowDisplay-Bold.woff2
public/fonts/MoldinDemo-Bold.woff2
```

Until those files are added, the site falls back to close free alternatives (`Archivo`
for body text, `Archivo Black` for display) so the build never breaks on a missing font.
