import { Card, GameType, Position, PokerPuzzle, Player } from '../types/poker';

// Array of positions in order of first to act to last to act
// UTG, MP, LJ, HJ, CO, BTN, SB, BB
export const ALL_POSITIONS: Position[] = ['UTG', 'MP', 'LJ', 'HJ', 'CO', 'BTN', 'SB', 'BB'];

// Calculate positions based on number of players
export const getPositionsForPlayerCount = (count: number): Position[] => {
  if (count < 2 || count > 10) {
    throw new Error('Player count must be between 2 and 10');
  }

  // For heads-up (2 players)
  if (count === 2) {
    return ['BTN', 'BB']; // In heads-up, SB is BTN
  }
  
  // For 3 players
  if (count === 3) {
    return ['BTN', 'SB', 'BB'];
  }
  
  // For 4 players
  if (count === 4) {
    return ['UTG', 'BTN', 'SB', 'BB'];
  }
  
  // For 5 players
  if (count === 5) {
    return ['UTG', 'CO', 'BTN', 'SB', 'BB'];
  }
  
  // For 6 players
  if (count === 6) {
    return ['UTG', 'MP', 'CO', 'BTN', 'SB', 'BB'];
  }
  
  // For 7 players
  if (count === 7) {
    return ['UTG', 'MP', 'LJ', 'HJ', 'CO', 'BTN', 'SB', 'BB'].slice(count - 7) as Position[];
  }
  
  // For 8 players
  if (count === 8) {
    return ['UTG', 'UTG+1', 'MP', 'LJ', 'HJ', 'CO', 'BTN', 'SB', 'BB'].slice(count - 8) as Position[];
  }
  
  // For 9 players
  if (count === 9) {
    return ['UTG', 'UTG+1', 'MP+1', 'MP+2', 'LJ', 'HJ', 'CO', 'BTN', 'SB', 'BB'].slice(count - 9) as Position[];
  }
  
  // For 10 players
  return ['UTG', 'UTG+1', 'MP+1', 'MP+2', 'MP+3', 'LJ', 'HJ', 'CO', 'BTN', 'SB', 'BB'].slice(count - 10) as Position[];
};

// Generate a deck of cards
export const generateDeck = (): Card[] => {
  const suits = ['♥', '♦', '♣', '♠'];
  const ranks = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];
  
  const deck: Card[] = [];
  
  for (const suit of suits) {
    for (const rank of ranks) {
      deck.push({ rank, suit });
    }
  }
  
  return deck;
};

// Shuffle a deck of cards
export const shuffleDeck = (deck: Card[]): Card[] => {
  const shuffled = [...deck];
  
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  
  return shuffled;
};

// Generate players with positions and stacks
export const generatePlayers = (
  count: number, 
  userPosition: Position,
  bigBlinds: number,
  bigBlindAmount: number
): Player[] => {
  const positions = getPositionsForPlayerCount(count);
  
  return positions.map((position, index) => ({
    id: index + 1,
    position,
    stack: bigBlinds * bigBlindAmount,
    isUser: position === userPosition
  }));
};

// A simple function to create a sample puzzle based on user settings
export const createSamplePuzzle = (
  gameType: GameType,
  playerCount: number,
  userPosition: Position,
  bigBlinds: number
): PokerPuzzle => {
  const bigBlindAmount = 100; // $1 big blind
  const players = generatePlayers(playerCount, userPosition, bigBlinds, bigBlindAmount);
  
  // Deal cards to players
  const deck = shuffleDeck(generateDeck());
  let cardIndex = 0;
  
  const playersWithCards = players.map(player => ({
    ...player,
    cards: player.isUser ? [deck[cardIndex++], deck[cardIndex++]] as [Card, Card] : undefined
  }));
  
  // Sample community cards (flop)
  const communityCards = [
    deck[cardIndex++],
    deck[cardIndex++],
    deck[cardIndex++]
  ];
  
  return {
    id: 1,
    players: playersWithCards,
    blinds: {
      small: bigBlindAmount / 2,
      big: bigBlindAmount,
    },
    communityCards,
    pot: bigBlindAmount * 3, // Sample pot size
    correctAction: 'RAISE',
    actionDescription: 'Raise 3x because you have a strong hand and are in position',
    gameType,
    difficulty: 'MEDIUM',
  };
}; 