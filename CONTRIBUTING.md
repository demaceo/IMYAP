# Contributing to IMYAP

Thank you for your interest in contributing to IMYAP! This document provides guidelines for contributing to the project.

## Getting Started

1. Fork the repository
2. Clone your fork: `git clone https://github.com/YOUR_USERNAME/IMYAP.git`
3. Install dependencies: `npm install`
4. Create a branch: `git checkout -b feature/your-feature-name`

## Development Workflow

### Running the App
```bash
# iOS
npm run ios

# Android
npm run android

# Start Metro bundler
npm start
```

### Testing
```bash
# Run all tests
npm test

# Run tests in watch mode
npm test -- --watch

# Run tests with coverage
npm test -- --coverage
```

### Linting
```bash
# Run ESLint
npm run lint

# Auto-fix linting issues
npm run lint -- --fix
```

## Code Style

- We use TypeScript for type safety
- ESLint and Prettier are configured for code style
- Single quotes for strings
- 2 space indentation
- Trailing commas in arrays/objects
- Arrow functions without parentheses for single params

## Accessibility Guidelines

All UI contributions must follow these accessibility guidelines:

- Minimum touch target size: 56pt (WCAG AAA)
- All interactive elements must have accessibility labels
- Use semantic roles (button, header, etc.)
- Provide accessibility hints for complex interactions
- Test with VoiceOver (iOS) and TalkBack (Android)
- Ensure color contrast meets WCAG AA standards

## Pull Request Process

1. Update the README.md with details of changes if applicable
2. Update tests to cover your changes
3. Ensure all tests pass: `npm test`
4. Ensure linting passes: `npm run lint`
5. Update the DESIGN.md if UI changes are made
6. Create a Pull Request with a clear description of changes

## Commit Messages

Use clear, descriptive commit messages:

```
Add feature: Brief description

Detailed explanation of what changed and why.
```

## Testing Requirements

- All new features must include tests
- Maintain or improve test coverage
- Test both success and error cases
- Test accessibility features

## Bug Reports

When reporting bugs, please include:

- Device/OS version
- React Native version
- Steps to reproduce
- Expected vs actual behavior
- Screenshots if applicable

## Feature Requests

When requesting features, please include:

- Clear description of the feature
- Use case and benefits
- Mockups or examples if applicable

## Questions?

Feel free to open an issue with the "question" label if you have any questions about contributing.

## License

By contributing, you agree that your contributions will be licensed under the ISC License.
