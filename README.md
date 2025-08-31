# Voice Cart Wizard

## Project info

**Developer**: Abhishek Dwivedi  
**Project**: Voice-Enabled Shopping Cart Assistant  
**Description**: A modern voice-controlled shopping list application with smart suggestions, natural language processing, and **multilingual support**

## About this project

Voice Cart Wizard is an innovative shopping list application that leverages advanced speech recognition technology to provide a seamless voice-controlled experience in **multiple languages**. Users can:

- Add items using natural voice commands in their preferred language
- Get smart product suggestions based on shopping history
- Search for products with voice-activated filters
- Manage quantities and categories automatically
- Enjoy a mobile-first, accessible interface
- **Switch between 10 supported languages seamlessly**

## 🌍 Multilingual Features

### Supported Languages
- **English** (en-US) - Default language
- **Spanish** (es-ES) - Español
- **French** (fr-FR) - Français  
- **German** (de-DE) - Deutsch
- **Italian** (it-IT) - Italiano
- **Portuguese** (pt-BR) - Português
- **Japanese** (ja-JP) - 日本語
- **Korean** (ko-KR) - 한국어
- **Chinese** (zh-CN) - 中文

### Language-Specific Voice Commands
Each language supports natural voice commands in the native language:

#### English
- "Add milk", "I need 2 apples", "Buy organic bread"

#### Spanish  
- "Añadir leche", "Necesito 2 manzanas", "Comprar pan orgánico"

#### French
- "Ajouter du lait", "J'ai besoin de 2 pommes", "Acheter du pain bio"

#### German
- "Milch hinzufügen", "Ich brauche 2 Äpfel", "Bio-Brot kaufen"

#### And more for each supported language...

## Features

- 🎤 **Voice Recognition**: Natural language processing for flexible voice commands
- 🌍 **Multilingual Support**: Voice commands in 10 different languages
- 🧠 **Smart Suggestions**: AI-powered recommendations based on shopping patterns
- 🔍 **Voice Search**: Find products with voice-activated search and filtering
- 📱 **Mobile-First**: Responsive design optimized for mobile devices
- ♿ **Accessible**: Screen reader friendly with ARIA labels
- 🎯 **Real-time Feedback**: Visual confirmation of voice commands
- 💾 **Language Persistence**: Remembers your language preference

## How to edit this code

You can edit this code using your preferred IDE. Follow these steps:

### Prerequisites

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

### Setup Instructions

```sh
# Step 1: Clone the repository
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory
cd vocal-cart-wizard-main

# Step 3: Install the necessary dependencies
npm install

# Step 4: Start the development server
npm run dev
```

### Alternative editing methods

**Edit a file directly in GitHub**

- Navigate to the desired file(s)
- Click the "Edit" button (pencil icon) at the top right of the file view
- Make your changes and commit the changes

**Use GitHub Codespaces**

- Navigate to the main page of your repository
- Click on the "Code" button (green button) near the top right
- Select the "Codespaces" tab
- Click on "New codespace" to launch a new Codespace environment
- Edit files directly within the Codespace and commit and push your changes once you're done

## Technologies Used

This project is built with modern web technologies:

- **Vite** - Fast build tool and development server
- **TypeScript** - Type-safe JavaScript development
- **React** - Component-based UI library
- **shadcn/ui** - Beautiful and accessible UI components
- **Tailwind CSS** - Utility-first CSS framework
- **Speech Recognition API** - Browser-native voice recognition with multilingual support
- **Lucide React** - Beautiful icon library

## Voice Commands

The application supports various voice commands in multiple languages:

### Adding Items
- **English**: "Add milk", "I need 2 apples", "Buy organic bread"
- **Spanish**: "Añadir leche", "Necesito 2 manzanas", "Comprar pan orgánico"
- **French**: "Ajouter du lait", "J'ai besoin de 2 pommes", "Acheter du pain bio"

### Searching & Filtering
- **English**: "Find organic apples", "Show toothpaste under $5", "Search for Dairy Best milk"
- **Spanish**: "Encontrar manzanas orgánicas", "Mostrar pasta dental bajo $5", "Buscar leche Dairy Best"
- **French**: "Trouver des pommes bio", "Montrer du dentifrice sous 5€", "Rechercher du lait Dairy Best"

### Managing List
- **English**: "Remove milk", "Mark bread as done", "Clear list"
- **Spanish**: "Quitar leche", "Marcar pan como hecho", "Limpiar lista"
- **French**: "Supprimer le lait", "Marquer le pain como fait", "Effacer la liste"

## Multilingual Implementation

### Language Configuration
Languages are configured in `src/types/languages.ts` with:
- Speech recognition codes
- Native language names
- Language-specific voice command patterns

### Translation System
UI text is localized using `src/utils/translations.ts`:
- All interface text in supported languages
- Dynamic language switching
- Persistent language preferences

### Speech Recognition
Updated `useSpeechRecognition` hook supports:
- Dynamic language switching
- Automatic speech recognition reconfiguration
- Language-specific voice processing

## Project Structure

```
src/
├── components/          # React components
│   ├── ui/             # Reusable UI components
│   ├── VoiceButton.tsx # Voice control interface
│   ├── VoiceShoppingAssistant.tsx # Main application component
│   ├── LanguageSelector.tsx # Language selection component
│   └── ...
├── hooks/              # Custom React hooks
│   ├── useSpeechRecognition.ts # Speech recognition with multilingual support
│   ├── useLanguage.ts # Language management and persistence
│   └── ...
├── utils/              # Utility functions
│   ├── voiceCommands.ts # Multilingual voice command parsing
│   ├── translations.ts # UI text translations
│   └── ...
├── types/              # TypeScript type definitions
│   ├── languages.ts # Language configuration types
│   └── ...
└── pages/              # Application pages
    └── MultilingualDemo.tsx # Demo page for multilingual features
```

## Using Multilingual Features

### 1. Language Selection
- Use the language selector in the top-right corner
- Choose from 10 supported languages
- Language preference is automatically saved

### 2. Voice Commands
- Speak commands in your selected language
- Use natural language patterns for your language
- Commands are automatically parsed and executed

### 3. Language Switching
- Switch languages at any time
- Voice recognition automatically updates
- UI text updates to selected language

### 4. Demo Mode
- Visit the Multilingual Demo page to test features
- Try voice commands in different languages
- See real-time command recognition results

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

### Adding New Languages
To add support for a new language:

1. Add language configuration to `src/types/languages.ts`
2. Add translations to `src/utils/translations.ts`
3. Update voice command patterns
4. Test with native speakers

## License

This project was created by Abhishek Dwivedi.