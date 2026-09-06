# pi-effort

A [Pi](https://pi.dev) extension that makes the active reasoning effort visible and adds an `/effort` command.

The extension:

- publishes `effort:<level>` in Pi's footer status
- updates the status when the model or thinking level changes
- provides an interactive `/effort` picker
- accepts direct commands such as `/effort high`
- rejects levels unsupported by the active model

## Install

Install with Pi 0.84.4 or later:

```sh
pi install git:github.com/elijah-rou/pi-effort
```

If upgrading from the old symlink setup, remove `~/.pi/agent/extensions/effort.ts` after installation succeeds. Keep your development checkout.

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

Changes use Pi's standard thinking-level API, which also updates its saved default.
