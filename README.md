# pi-effort

A [Pi](https://pi.dev) extension that makes the active reasoning effort visible and adds an `/effort` command.

The extension:

- publishes `effort:<level>` in Pi's footer status
- updates the status when the model or thinking level changes
- provides an interactive `/effort` picker
- accepts direct commands such as `/effort high`
- rejects levels unsupported by the active model

## Install

Link the extension into Pi's global extension directory:

```sh
mkdir -p ~/.pi/agent/extensions
ln -sfn "$HOME/Projects/pi-effort/effort.ts" ~/.pi/agent/extensions/effort.ts
```

Run `/reload` in an existing Pi session, or start a new session.

## Usage

```text
/effort
/effort off
/effort minimal
/effort low
/effort medium
/effort high
/effort xhigh
```

Changes apply to the current session and do not overwrite Pi's default thinking level.
