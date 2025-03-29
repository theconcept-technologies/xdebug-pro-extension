# Contributing to xDebug Helper Pro

First off, thank you for considering contributing to xDebug Helper Pro! It's people like you that make this extension better for everyone.

## Code of Conduct

This project and everyone participating in it is governed by our Code of Conduct. By participating, you are expected to uphold this code.

## How Can I Contribute?

### Reporting Bugs

Before creating bug reports, please check the issue list as you might find out that you don't need to create one. When you are creating a bug report, please include as many details as possible:

* Use a clear and descriptive title
* Describe the exact steps which reproduce the problem
* Provide specific examples to demonstrate the steps
* Describe the behavior you observed after following the steps
* Explain which behavior you expected to see instead and why
* Include screenshots if possible

### Suggesting Enhancements

Enhancement suggestions are tracked as GitHub issues. When creating an enhancement suggestion, please include:

* Use a clear and descriptive title
* Provide a step-by-step description of the suggested enhancement
* Provide specific examples to demonstrate the steps
* Describe the current behavior and explain which behavior you expected to see instead
* Explain why this enhancement would be useful

### Pull Requests

* Fill in the required template
* Do not include issue numbers in the PR title
* Follow the TypeScript styleguide
* Include thoughtfully-worded, well-structured tests
* Document new code
* End all files with a newline

## Development Process

1. Fork the repo and create your branch from `main`
2. If you've added code that should be tested, add tests
3. If you've changed APIs, update the documentation
4. Ensure the test suite passes
5. Make sure your code lints
6. Issue that pull request!

## Styleguides

### Git Commit Messages

* Use the present tense ("Add feature" not "Added feature")
* Use the imperative mood ("Move cursor to..." not "Moves cursor to...")
* Limit the first line to 72 characters or less
* Reference issues and pull requests liberally after the first line

### TypeScript Styleguide

* Use 2 spaces for indentation
* Prefer `const` over `let`
* Use type annotations for function parameters and return types
* Use interfaces for object types
* Use PascalCase for type names
* Use camelCase for function names
* Use camelCase for property names and local variables
* Use PascalCase for enum values
* Use uppercase for global constants

### Documentation Styleguide

* Use [JSDoc](https://jsdoc.app/) for documentation
* Include types in documentation
* Document all functions, classes, and interfaces
* Include examples for complex functionality

## Project Structure

The project follows a modular structure:

```
src/
├── background.ts     # Service worker background script
├── popup.ts         # Popup UI logic
├── popup.html       # Popup UI markup
├── types.ts         # TypeScript type definitions
└── utils/           # Utility functions
    ├── cookie.ts    # Cookie management
    └── storage.ts   # Storage management
```

## Testing

* Write unit tests for utility functions
* Write integration tests for UI components
* Test edge cases and error conditions
* Run tests before submitting PR: `npm test`

## Additional Notes

### Issue and Pull Request Labels

* `bug` - Something isn't working
* `enhancement` - New feature or request
* `documentation` - Improvements or additions to documentation
* `good first issue` - Good for newcomers
* `help wanted` - Extra attention is needed

Thank you for contributing to xDebug Helper Pro! 