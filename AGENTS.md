# Agent notes

## Showing the user changes

Never open a new cloud browser tab to show the user a change. Do not call
`preview_open` with `mode: "browser"` for presentation.

To let the user see the site, either:

- call `preview_open` with the default preview mode (the lightweight embed), or
- start the dev server and call `cloud_show_dev_server` with its port.

Use a full cloud browser tab only when browser automation or inspection is
strictly required, and close it afterwards.
