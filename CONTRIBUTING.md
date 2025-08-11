# Contributing to Advanced TTS

We love your input! We want to make contributing to Advanced TTS as easy and transparent as possible.

## Development Process

1. Fork the repo
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Add tests for your changes
5. Ensure all tests pass
6. Commit your changes (`git commit -m 'Add some amazing feature'`)
7. Push to the branch (`git push origin feature/amazing-feature`)
8. Open a Pull Request

## Development Setup

```bash
# Clone your fork
git clone https://github.com/yourusername/AdvancedTTS.git
cd AdvancedTTS

# Install dependencies and TTS engines
npm run setup

# Start development server
npm run dev
```

## Pull Request Process

1. Update the README.md with details of changes if applicable
2. Update the API documentation if you change endpoints
3. Increase version numbers in package.json files if appropriate
4. The PR will be merged once you have the sign-off of maintainers

## Code Style

- Use ESLint configuration provided
- Follow existing code patterns
- Add comments for complex logic
- Use meaningful variable and function names

## Testing

- Write tests for new features
- Ensure existing tests pass
- Test with multiple TTS engines
- Test with different languages

## Adding New TTS Engines

1. Add engine configuration to `server/config/engines.js`
2. Implement engine-specific logic in `server/services/ttsService.js`
3. Add tests for the new engine
4. Update documentation

## Adding New Languages

1. Update engine configurations with new language support
2. Add translations to `client/src/i18n.js`
3. Test with actual speakers of the language
4. Update language documentation

## Bug Reports

Great Bug Reports tend to have:

- A quick summary and/or background
- Steps to reproduce
- What you expected would happen
- What actually happens
- Notes (possibly including why you think this might be happening)

## Feature Requests

We're always looking for suggestions on how to improve Advanced TTS:

- Explain the feature and why it would be useful
- Keep the scope focused - one feature per request
- Remember this is volunteer-driven project

## License

By contributing, you agree that your contributions will be licensed under the MIT License.
