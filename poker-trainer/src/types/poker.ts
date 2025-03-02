export type Position = 'SB' | 'BB' | 'UTG' | 'MP' | 'HJ' | 'CO' | 'BTN';

export type GameType = 'CASH' | 'MTT';

export type Card = {
  rank: string;
  suit: string;
};

export type PlayerAction = 'FOLD' | 'CALL' | 'RAISE' | 'CHECK';

export type Player = {
  id: number;
  position: Position;
  stack: number;
  cards?: [Card, Card];
  isUser: boolean;
};

export type PokerPuzzle = {
  id: number;
  players: Player[];
  blinds: {
    small: number;
    big: number;
  };
  communityCards: Card[];
  pot: number;
  correctAction: PlayerAction;
  actionDescription: string;
  gameType: GameType;
  difficulty: 'EASY' | 'MEDIUM' | 'HARD';
};

export type GameSettings = {
  gameType: GameType;
  playerCount: number;
  userPosition: Position;
  bigBlinds: number;
}; 