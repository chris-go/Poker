import { Card } from '../types/poker';

// Helper function to check if a hand is a pocket pair
const isPocketPair = (cards: [Card, Card]): boolean => {
  return cards[0].rank === cards[1].rank;
};

// Helper function to check if a hand contains an ace
const hasAce = (cards: [Card, Card]): boolean => {
  return cards[0].rank === 'A' || cards[1].rank === 'A';
};

// Helper function to check if a hand contains a king
const hasKing = (cards: [Card, Card]): boolean => {
  return cards[0].rank === 'K' || cards[1].rank === 'K';
};

// Helper function to check if a hand contains a queen
const hasQueen = (cards: [Card, Card]): boolean => {
  return cards[0].rank === 'Q' || cards[1].rank === 'Q';
};

// Helper function to check if a hand contains a jack
const hasJack = (cards: [Card, Card]): boolean => {
  return cards[0].rank === 'J' || cards[1].rank === 'J';
};

// Helper function to check if a hand contains a ten
const hasTen = (cards: [Card, Card]): boolean => {
  return cards[0].rank === 'T' || cards[1].rank === 'T';
};

// Helper function to check if a hand is suited
const isSuited = (cards: [Card, Card]): boolean => {
  return cards[0].suit === cards[1].suit;
};

// Helper function to get the rank value (2-10, J, Q, K, A)
const getRankValue = (rank: string): number => {
  const values: { [key: string]: number } = {
    '2': 2, '3': 3, '4': 4, '5': 5, '6': 6, '7': 7, '8': 8, '9': 9, 'T': 10,
    'J': 11, 'Q': 12, 'K': 13, 'A': 14
  };
  return values[rank];
};

// Helper function to get the higher and lower card ranks
const getHigherAndLowerRanks = (cards: [Card, Card]): [string, string] => {
  const rank1 = getRankValue(cards[0].rank);
  const rank2 = getRankValue(cards[1].rank);
  return rank1 >= rank2 ? [cards[0].rank, cards[1].rank] : [cards[1].rank, cards[0].rank];
};

// Helper function to check if a hand is a suited connector or gapper
const isSuitedConnectorOrGapper = (cards: [Card, Card]): boolean => {
  if (!isSuited(cards)) return false;
  const [high, low] = getHigherAndLowerRanks(cards);
  const gap = getRankValue(high) - getRankValue(low);
  return gap <= 3 && getRankValue(low) >= 3; // Allow up to 2 gaps, minimum rank 3
};

// Helper function to check if a hand is a broadway hand
const isBroadwayHand = (cards: [Card, Card]): boolean => {
  const [high, low] = getHigherAndLowerRanks(cards);
  return getRankValue(high) >= 10 && getRankValue(low) >= 10;
};

// Helper function to check if a hand is in the bottom 4% of hands
const isBottomHand = (cards: [Card, Card]): boolean => {
  const [high, low] = getHigherAndLowerRanks(cards);
  const highValue = getRankValue(high);
  const lowValue = getRankValue(low);
  
  // If not suited, these are the worst hands
  if (!isSuited(cards)) {
    // Hands like 72o, 83o, 94o, 105o and similar very weak offsuit hands
    if (highValue <= 10 && lowValue <= 5 && (highValue - lowValue) <= 3) {
      return true;
    }
  }
  return false;
};

// Function to check if a hand is in the heads-up small blind 10bb pushing range
export const isInHeadsUpSB10bbRange = (cards: [Card, Card]): boolean => {
  // Get the higher and lower cards first
  const [high, low] = getHigherAndLowerRanks(cards);
  const highValue = getRankValue(high);
  const lowValue = getRankValue(low);

  // All pocket pairs
  if (isPocketPair(cards)) {
    return true;
  }

  // All ace-high hands
  if (hasAce(cards)) {
    return true;
  }

  // All king-high hands
  if (hasKing(cards)) {
    return true;
  }

  // Queen-high hands from Q5 to QK
  if (highValue === getRankValue('Q') && lowValue >= getRankValue('5')) {
    return true;
  }

  // Jack-high hands from J7 to JK
  if (highValue === getRankValue('J') && lowValue >= getRankValue('7')) {
    return true;
  }

  // Ten-high hands from T8 to TA
  if (highValue === getRankValue('T') && lowValue >= getRankValue('8')) {
    return true;
  }

  // Specific suited hand: 53s
  if (isSuited(cards)) {
    if (high === '5' && low === '3') {
      return true;
    }
  }

  return false;
};

// Function to check if a hand is in the heads-up small blind 20bb pushing range
export const isInHeadsUpSB20bbRange = (cards: [Card, Card]): boolean => {
  // Get the higher and lower cards first
  const [high, low] = getHigherAndLowerRanks(cards);
  const highValue = getRankValue(high);
  const lowValue = getRankValue(low);

  // All pocket pairs
  if (isPocketPair(cards)) {
    return true;
  }

  // All ace-high hands
  if (hasAce(cards)) {
    return true;
  }

  // All king-high hands
  if (hasKing(cards)) {
    return true;
  }

  // All queen-high hands
  if (hasQueen(cards)) {
    return true;
  }

  // All jack-high hands
  if (hasJack(cards)) {
    return true;
  }

  // All ten-high hands
  if (hasTen(cards)) {
    return true;
  }

  // Nine-high hands
  if (highValue === getRankValue('9')) {
    // All suited nine-high hands
    if (isSuited(cards)) {
      return lowValue >= getRankValue('2'); // 92s to 98s
    }
    // Specific offsuit hands: 98o and 97o
    return lowValue >= getRankValue('7'); // 97o and 98o
  }

  return false;
};

// Function to check if a hand is in the heads-up small blind 30bb raising range
export const isInHeadsUpSB30bbRange = (cards: [Card, Card]): boolean => {
  // Get the higher and lower cards first
  const [high, low] = getHigherAndLowerRanks(cards);
  const highValue = getRankValue(high);
  const lowValue = getRankValue(low);

  // All pocket pairs
  if (isPocketPair(cards)) {
    return true;
  }

  // All ace-high hands
  if (hasAce(cards)) {
    return true;
  }

  // All king-high hands
  if (hasKing(cards)) {
    return true;
  }

  // Queen-high hands where the other card is from 5 to J (including T)
  if (highValue === getRankValue('Q')) {
    return lowValue >= getRankValue('5');
  }

  // Jack-high hands where the other card is from 7 to T
  if (highValue === getRankValue('J')) {
    return lowValue >= getRankValue('7') && lowValue <= getRankValue('T');
  }

  // Ten-high hands where the other card is from 8 to 9
  if (highValue === getRankValue('T')) {
    return lowValue >= getRankValue('8') && lowValue <= getRankValue('9');
  }

  // Nine-high hands
  if (highValue === getRankValue('9')) {
    // All suited nine-high hands
    if (isSuited(cards)) {
      return lowValue >= getRankValue('2'); // 92s to 98s
    }
    // Specific offsuit hands: 98o and 97o
    return lowValue >= getRankValue('7'); // 97o and 98o
  }

  return false;
};

// Function to check if a hand should be raised in the heads-up small blind 50bb range
export const shouldRaiseInHeadsUpSB50bbRange = (cards: [Card, Card]): boolean => {
  // If it's in the bottom 4% of hands, we don't raise
  if (isBottomHand(cards)) {
    return false;
  }

  // All pocket pairs
  if (isPocketPair(cards)) {
    return true;
  }

  // All hands with an ace
  if (hasAce(cards)) {
    return true;
  }

  // All hands with a king, queen, jack, or ten
  if (hasKing(cards) || hasQueen(cards) || hasJack(cards) || hasTen(cards)) {
    return true;
  }

  // Suited connectors and gappers
  if (isSuitedConnectorOrGapper(cards)) {
    return true;
  }

  // Broadway hands (even offsuit)
  if (isBroadwayHand(cards)) {
    return true;
  }

  // Most other hands should be raised due to the extremely wide range
  // Only exclude the bottom 4% of hands
  return !isBottomHand(cards);
};

// Function to check if a hand should be called (limped) in the heads-up small blind 50bb range
export const shouldCallInHeadsUpSB50bbRange = (cards: [Card, Card]): boolean => {
  // We only call with a very small range of hands (0-4%)
  
  // Weak suited aces (A2s-A5s)
  if (hasAce(cards) && isSuited(cards)) {
    const [high, low] = getHigherAndLowerRanks(cards);
    if (high === 'A' && getRankValue(low) <= 5) {
      return true;
    }
  }

  // Low suited connectors (65s, 54s)
  if (isSuited(cards)) {
    const [high, low] = getHigherAndLowerRanks(cards);
    const highValue = getRankValue(high);
    const lowValue = getRankValue(low);
    if (highValue <= 6 && lowValue >= 4 && (highValue - lowValue) === 1) {
      return true;
    }
  }

  return false;
};

// Function to check if a hand should be raised in the heads-up small blind 100bb range
export const shouldRaiseInHeadsUpSB100bbRange = (cards: [Card, Card]): boolean => {
  // Get the higher and lower cards first
  const [high, low] = getHigherAndLowerRanks(cards);
  const highValue = getRankValue(high);
  const lowValue = getRankValue(low);

  // All pocket pairs (22 to AA)
  if (isPocketPair(cards)) {
    return true;
  }

  // All ace-high hands (A2s/o to AKs/o)
  if (hasAce(cards)) {
    return true;
  }

  // All king-high hands (K2s/o to KQs/o)
  if (hasKing(cards)) {
    return true;
  }

  // All queen-high hands (Q2s/o to QJs/o)
  if (hasQueen(cards)) {
    return true;
  }

  // All jack-high hands (J2s/o to JTs/o)
  if (hasJack(cards)) {
    return true;
  }

  // All ten-high hands (T2s/o to T9s/o)
  if (hasTen(cards)) {
    return true;
  }

  // All nine-high suited hands (92s to 98s)
  if (highValue === getRankValue('9') && isSuited(cards)) {
    return true;
  }

  return false;
}; 