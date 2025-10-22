# AskGuru

AskGuru is a React component for embedding an AI-powered chat widget into your web application. It provides a simple interface for interacting with your website or webapp in a conversational manner.

## Installation

Install via npm:

```bash
npm install askguru
```

## Usage

Import the `ChatWidget` component in your React app:

```tsx
import ChatWidget from 'askguru';
```

Add the widget to your component tree:

[Api key can be generated here : ](https://askguru.dryink.space/)

```tsx
<ChatWidget
  config={{
    apiKey: 'YOUR_API_KEY',
    welcomeMessage: 'Hello! How can I help you today?',
    botName: 'AskGuru',
    theme: '#007bff', // Primary color for the widget
    logoImage: 'https://example.com/logo.png', // Optional logo
    apiEndpoint: 'https://askguru.dryink.space/api/chat' // API endpoint
  }}
/>

```

## Configuration

The `config` prop accepts the following options:

| Option         | Type     | Description                                         |
|----------------|----------|-----------------------------------------------------|
| apiKey         | string   | **Required.** Your API key for authentication.      |
| welcomeMessage | string   | Initial message shown to the user.                  |
| botName        | string   | Name displayed for the bot.                         |
| theme          | object   | Customize primary/secondary colors.                 |
| logoImage      | string   | customize the icon image                             |
| apiEndpoint          | string   | api end point for chat                 |

Example:

```tsx
config={{
    apiKey: 'YOUR_API_KEY',
    welcomeMessage: 'Hello! How can I help you today?',
    botName: 'AskGuru',
    theme: '#007bff', // Primary color for the widget
    logoImage: 'https://example.com/logo.png', // Optional logo
    apiEndpoint: 'https://askguru.dryink.space/api/chat' // API endpoint
  }}
```

## License

MIT
