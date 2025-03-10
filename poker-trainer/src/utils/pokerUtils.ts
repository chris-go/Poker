import { Card, GameType, Position, PokerPuzzle, Player, PlayerAction } from '../types/poker';

// Array of positions in order of first to act to last to act
// Order: UTG, UTG+1, UTG+2, MP, LJ, HJ, CO, BTN, SB, BB
export const ALL_POSITIONS: Position[] = ['UTG', 'UTG+1', 'UTG+2', 'MP', 'LJ', 'HJ', 'CO', 'BTN', 'SB', 'BB'];

// Calculate positions based on number of players
export const getPositionsForPlayerCount = (count: number): Position[] => {
  if (count < 2 || count > 10) {
    throw new Error('Player count must be between 2 and 10');
  }

  // For heads-up (2 players)
  if (count === 2) {
    return ['SB', 'BB'] as Position[]; // In heads-up, positions are SB and BB
  }
  
  // For 3 players
  if (count === 3) {
    return ['BTN', 'SB', 'BB'] as Position[];
  }
  
  // For 4 players
  if (count === 4) {
    return ['CO', 'BTN', 'SB', 'BB'] as Position[];
  }
  
  // For 5 players
  if (count === 5) {
    return ['HJ', 'CO', 'BTN', 'SB', 'BB'] as Position[];
  }
  
  // For 6 players
  if (count === 6) {
    return ['LJ', 'HJ', 'CO', 'BTN', 'SB', 'BB'] as Position[];
  }
  
  // For 7 players
  if (count === 7) {
    return ['MP', 'LJ', 'HJ', 'CO', 'BTN', 'SB', 'BB'] as Position[];
  }
  
  // For 8 players
  if (count === 8) {
    return ['UTG', 'MP', 'LJ', 'HJ', 'CO', 'BTN', 'SB', 'BB'] as Position[];
  }
  
  // For 9 players
  if (count === 9) {
    return ['UTG', 'UTG+1', 'MP', 'LJ', 'HJ', 'CO', 'BTN', 'SB', 'BB'] as Position[];
  }
  
  // For 10 players (full table)
  return ['UTG', 'UTG+1', 'UTG+2', 'MP', 'LJ', 'HJ', 'CO', 'BTN', 'SB', 'BB'] as Position[];
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
  // Set up the basic game parameters
  const smallBlind = 1;
  const bigBlind = 2;
  
  // Generate players with their positions and stacks
  const players = generatePlayers(playerCount, userPosition, bigBlinds, bigBlind);
  
  // Generate a shuffled deck
  const deck = shuffleDeck(generateDeck());
  
  // Deal cards to players - only show the actual cards for the user
  let cardIndex = 0;
  const playersWithCards = players.map(player => {
    // For all players, get cards from the deck
    const cards: [Card, Card] = [deck[cardIndex], deck[cardIndex + 1]];
    cardIndex += 2;
    
    // Only show the actual cards for the user
    if (player.isUser) {
      return { ...player, cards };
    } else {
      // For non-user players, set cards to null (will show as face-down)
      return { ...player, cards: null };
    }
  });
  
  // Deal community cards
  const communityCards: Card[] = [];
  for (let i = 0; i < 5; i++) {
    communityCards.push(deck[cardIndex + i]);
  }
  
  // Random pot size between 5 and 20 big blinds
  const potSize = bigBlind * (Math.floor(Math.random() * 15) + 5);
  
  // Generate a random correct action
  const actions: PlayerAction[] = ['FOLD', 'CALL', 'RAISE', 'CHECK'];
  const correctAction = actions[Math.floor(Math.random() * actions.length)];
  
  // Generate a simple action description
  let actionDescription = 'You should ';
  switch (correctAction) {
    case 'FOLD':
      actionDescription += 'fold this hand as it is weak and not worth continuing.';
      break;
    case 'CALL':
      actionDescription += 'call to see the next card as you have a drawing hand.';
      break;
    case 'RAISE':
      actionDescription += 'raise to build the pot with your strong hand.';
      break;
    case 'CHECK':
      actionDescription += 'check to see the next card for free.';
      break;
  }
  
  // Create the puzzle object
  return {
    id: Math.floor(Math.random() * 1000) + 1,
    players: playersWithCards,
    blinds: {
      small: smallBlind,
      big: bigBlind
    },
    communityCards,
    pot: potSize,
    correctAction,
    actionDescription,
    gameType,
    difficulty: 'MEDIUM'
  };
}; 