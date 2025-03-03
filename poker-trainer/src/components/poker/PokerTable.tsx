import React from 'react';
import styled from 'styled-components';
import { Player, Card as CardType } from '../../types/poker';
import PlayerSeat from './PlayerSeat';
import Card from './Card';

interface PokerTableProps {
  players: Player[];
  communityCards: CardType[];
  pot: number;
  activePosition?: string;
  bigBlindAmount?: number;
}

const TableWrapper = styled.div`
  position: relative;
  width: 800px;
  height: 400px;
  margin: 50px auto;
  background-color: #277714;
  border-radius: 200px;
  border: 15px solid #593a28;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.4);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const TableCenter = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const CommunityCards = styled.div`
  display: flex;
  gap: 10px;
  margin-bottom: 15px;
`;

const PotInfo = styled.div`
  background-color: rgba(0, 0, 0, 0.6);
  color: white;
  padding: 5px 15px;
  border-radius: 20px;
  font-weight: bold;
`;

// Calculate positions for each player seat around an oval
const getPlayerPosition = (index: number, total: number): { top: string; left: string } => {
  if (total <= 1) {
    return { top: '50%', left: '50%' };
  }

  // Calculate angle based on index and total players
  // Start at the bottom center and move clockwise
  const angleOffset = Math.PI; // start at bottom
  const angle = angleOffset + (index / total) * 2 * Math.PI;
  
  // Oval dimensions (% of container)
  const xRadius = 48;
  const yRadius = 40;
  
  // Calculate position
  const left = `${50 + xRadius * Math.sin(angle)}%`;
  const top = `${50 + yRadius * Math.cos(angle)}%`;
  
  return { top, left };
};

const PokerTable: React.FC<PokerTableProps> = ({ 
  players, 
  communityCards, 
  pot, 
  activePosition,
  bigBlindAmount = 1 
}) => {
  // Find the user player
  const userPlayer = players.find(player => player.isUser);
  
  // Sort players to ensure they are in the right order
  // For display purposes, put the user at the bottom (6 o'clock position)
  const sortedPlayers = [...players].sort((a, b) => {
    // If one of the players is the user, place them last (bottom of the table)
    if (a.isUser) return 1;
    if (b.isUser) return -1;
    
    // Define the clockwise order of positions - order of action with SB and BB last
    const positionOrder = ['UTG', 'UTG+1', 'MP', 'MP+1', 'MP+2', 'MP+3', 'LJ', 'HJ', 'CO', 'BTN', 'SB', 'BB'];
    
    // Find the index of each position in the order
    const indexA = positionOrder.indexOf(a.position);
    const indexB = positionOrder.indexOf(b.position);
    
    // Handle positions that might appear multiple times
    if (indexA === indexB && a.position === b.position) {
      return a.id - b.id; // Use player ID as a tiebreaker
    }
    
    return indexA - indexB;
  });

  return (
    <TableWrapper>
      {sortedPlayers.map((player, index) => {
        // Calculate position - the user should always be at the bottom
        const calculatedIndex = player.isUser 
          ? sortedPlayers.length - 1 // Always put user at the bottom
          : index;
        const position = getPlayerPosition(calculatedIndex, sortedPlayers.length);
        
        return (
          <PlayerSeat
            key={player.id}
            player={player}
            style={{ 
              position: 'absolute',
              top: position.top,
              left: position.left,
              transform: 'translate(-50%, -50%)'
            }}
            isActive={player.position === activePosition}
            bigBlindAmount={bigBlindAmount}
          />
        );
      })}
      
      <TableCenter>
        <CommunityCards>
          {communityCards.map((card, index) => (
            <Card key={index} rank={card.rank} suit={card.suit} />
          ))}
        </CommunityCards>
        <PotInfo>{pot / bigBlindAmount} BB</PotInfo>
      </TableCenter>
    </TableWrapper>
  );
};

export default PokerTable; 