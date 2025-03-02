# Poker Trainer App

A React-based poker training application that helps players practice decision-making in different poker scenarios.

## Features

- Interactive poker table visualization
- Customizable game settings:
  - Game type (Cash game or Tournament)
  - Number of players (2-10)
  - Player position (SB, BB, UTG, MP, HJ, CO, BTN)
  - Stack size in big blinds
- Practice with poker puzzles based on your settings
- Track your performance statistics
- Immediate feedback on your decisions

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Clone the repository or download the source code
2. Navigate to the project directory:
   ```
   cd poker-trainer
   ```
3. Install the dependencies:
   ```
   npm install
   ```
   or
   ```
   yarn install
   ```

### Running the App

Start the development server:
```
npm start
```
or
```
yarn start
```

The application will open in your default browser at `http://localhost:3000`.

## How to Use

1. **Settings Tab**: Configure your preferred poker game settings:
   - Select game type (Cash or Tournament)
   - Choose the number of players
   - Select your position at the table
   - Set your stack size in big blinds

2. **Puzzles Tab**: After configuring settings, switch to the puzzles tab to practice:
   - You'll see the poker table with your hole cards
   - Choose from available actions (Fold, Check, Call, Raise)
   - Get immediate feedback on your decision
   - Track your statistics over time

## Technologies Used

- React
- TypeScript
- Styled Components

## Future Enhancements

- More realistic poker puzzles based on actual hand histories
- Additional poker variants (Omaha, Short Deck, etc.)
- Advanced statistics and hand analysis
- Multi-street decision making
- Custom hand input for analyzing specific scenarios

## License

This project is licensed under the MIT License - see the LICENSE file for details.
