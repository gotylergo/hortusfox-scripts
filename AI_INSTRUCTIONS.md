# AI Instructions

When working in this repository:

1. Ensure you understand the purpose of this project: a lightweight sidecar serving scripts to enhance the HortusFox application.
2. Avoid modifying HortusFox core files directly; all enhancements should be injected via the `hortusfox-scripts` container.
3. Keep the Docker image minimal (`nginx:alpine` based).
4. Commits should be atomic and clearly describe the feature or fix being implemented.
5. Provide detailed comments if touching the DOM interactions in `hortusfox-logger.js`.
6. **NEVER automatically push to the remote repository.** You may suggest `git push` commands, but you MUST NEVER execute them with `SafeToAutoRun=true` or automatically run them in the background. The user must manually review and approve ALL pushes to GitHub.