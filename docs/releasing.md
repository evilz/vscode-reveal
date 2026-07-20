# Releasing vscode-reveal

The release workflow publishes one VSIX artifact to GitHub Releases, the Visual Studio Marketplace, and Open VSX. It defaults to a dry run so maintainers can inspect the exact artifact before any registry is changed.

## 1. Prepare the release

1. Triage or explicitly defer open security and compatibility pull requests.
2. Move the relevant entries under `Unreleased` in `CHANGELOG.md` to a section matching the intended semantic version.
3. Run `npm version <version> --no-git-tag-version` to update the version in both `package.json` and `package-lock.json` consistently.
4. Run:

   ```bash
   npm ci
   npm run coverage
   npx @vscode/vsce package --no-dependencies
   ```

5. Install the VSIX in a clean supported VS Code profile and verify preview, browser launch, HTML export, and the PDF flow with `sample.md`.

## 2. Run the safe dry run

Dispatch the **Release** workflow with `dryRun` enabled. The workflow builds the production bundle, creates the VSIX, verifies that it contains the extension manifest, bundle, and changelog, and uploads it as an artifact. It does not contact a registry.

Download and inspect that artifact before continuing. The version must not already have a `release/<version>` tag.

## 3. Publish the verified artifact

Dispatch the workflow again with `dryRun` disabled. Keep all three publish targets enabled unless a registry is intentionally being recovered independently:

- Visual Studio Marketplace
- Open VSX
- GitHub Releases

The protected GitHub environments should require a maintainer approval and hold their own publishing token.

## 4. Verify publication

Confirm that the same version is visible in all three locations and that a fresh installation works:

- `https://marketplace.visualstudio.com/items?itemName=evilz.vscode-reveal`
- `https://open-vsx.org/extension/evilz/vscode-reveal`
- `https://github.com/evilz/vscode-reveal/releases`

If one registry fails, rerun only that target with the others disabled. Never rebuild or modify the VSIX between registry publications for the same version.
