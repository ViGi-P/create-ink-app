# create-ink-app 🎨

> ~~The quickest 😝~~ An interactive & opinionated way to bootstrap your next [Ink](https://github.com/vadimdemedes/ink) project.

![](https://github.com/ViGi-P/create-ink-app/blob/main/assets/demo.gif)

Scaffold a ready-to-go Ink application with zero friction. Whether you're building a full-blown CLI or a reusable terminal library, this tool handles the boilerplate so you can focus on building beautiful terminal interfaces.

## 🚀 Quick Start

Run this in your terminal to get started immediately:

```sh
pnpm dlx @vigi-p/create-ink-app my-new-app
# or
npx @vigi-p/create-ink-app my-new-app
```

## ✨ Features

- 🛠 **Multiple Templates:** Choose between a standalone CLI or a Library.
- 📘 **TypeScript or JavaScript:** Both first-class citizens.
- 📦 **Smart Dependency Management:** Supports `npm`, `yarn`, and `pnpm`.
- 🔗 **Git Integration:** Automatically initialize a repository.
- 🤖 **Automation-Friendly:** Fully scriptable via flags or piped input.

## ⚙️ Options

You can skip the interactive prompts by providing flags directly:

| Flag         | Description          | Values                                   |
| :----------- | :------------------- | :--------------------------------------- |
| `--type`     | Project architecture | `cli`, `library`                         |
| `--language` | Language choice      | `js`, `ts`                               |
| `--pm`       | Package manager      | `npm`, `yarn`, `pnpm`, `bun`             |
| `--install`  | Install dependencies | `true` (default), `--no-install` to skip |
| `--git`      | Init git repo        | `true` (default), `--no-git` to skip     |

### Examples

**Step-by-step setup:**

```sh
npx @vigi-p/create-ink-app
```

**Automated setup for a TypeScript CLI with pnpm:**

```sh
npx @vigi-p/create-ink-app my-cli --type cli --language ts --pm pnpm --install --git
```

**Minimalist setup for a JavaScript library with bun:**

```sh
npx @vigi-p/create-ink-app my-lib --type=library --language=js --pm=bun --no-git --no-install
```

## 🛠 Manual Installation

If you prefer to install it globally:

```sh
npm install -g @vigi-p/create-ink-app
create-ink-app my-project
```

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).

## 🤝 Contributing

Contributions are welcome! Please see [CONTRIBUTING.md](CONTRIBUTING.md) for details.

Built with ❤️ for the terminal community.
