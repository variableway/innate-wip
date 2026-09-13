# Project instructions

This repository (`workspace`) is a personal **docs and product-index hub**. It holds notes, ideas, plans, and pointers. Product, infra, and collector **implementations live in other directories or repos**.

When working in this repository:

- Read `README.md` and `product-center/catalog.md` before adding or moving domain files.
- Put unsorted captures in `docs/inbox/`. Domain-ready ideas go to that domain’s `idea/`. Cross-domain analysis goes to `docs/idea/`.
- Record implementation locations only in each product’s `links.md`. If the task is to write code, do it in the implementation project (or ask to open / attach that folder). Do not add application source, lockfiles, or `node_modules` here — except `tools/innate-registry-cli/` and `tools/innate-selfhost-cli/`.
- Add a product row to `product-center/catalog.md` before creating `product-center/products/<slug>/`.
- Do not add nested `AGENTS.md` files. Put domain differences in `.cursor/rules/*.mdc` with `globs`.
