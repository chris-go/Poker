import React from 'react';
import styled from 'styled-components';
import { Player, Card as CardType, Position } from '../../types/poker';
import PlayerSeat from './PlayerSeat';
import Card from './Card';

interface PokerTableProps {
  players: Player[];
  communityCards: CardType[];
  pot: number;
  activePosition?: string;
  bigBlindAmount?: number;
  stats?: {
    correct: number;
    incorrect: number;
    total: number;
  };
  accuracy?: number;
}

// Define props for the MenuIcon styled component
interface MenuIconProps {
  // No props needed anymore
}

const TableWrapper = styled.div`
  position: relative;
  width: 90%;
  height: 580px;
  margin: 30px auto 20px; /* Increased top margin to move table down slightly */
  background-color: #277714;
  border-radius: 200px;
  border: 15px solid #593a28;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.4);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  transition: all 0.3s ease;
  
  /* Add responsive styling for landscape orientation */
  @media (orientation: landscape) {
    height: min(500px, 80vh);
    margin: 20px auto 10px; /* Increased top margin in landscape mode as well */
  }
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
  margin-bottom: 8px;
`;

const AccuracyInfo = styled.div`
  background-color: rgba(0, 0, 0, 0.6);
  color: white;
  padding: 5px 15px;
  border-radius: 20px;
  font-weight: bold;
  font-size: 0.9em;
`;

// Calculate positions for each player seat evenly around an oval
// Position players slightly outside the table, with user at top
const getPlayerPosition = (index: number, total: number, userIndex: number): { top: string; left: string } => {
  // Calculate the rotation offset to put user at top center (90 degrees)
  const userAngle = Math.PI / 2; // 90 degrees - top center (12 o'clock position)
  const idealUserIndex = total * (userAngle / (2 * Math.PI));
  
  // Calculate how many positions to shift everyone
  let shiftAmount = (idealUserIndex - userIndex + total) % total;
  
  // Apply the shift to the current index
  const shiftedIndex = (index + shiftAmount) % total;
  
  // Calculate angle evenly distributed around the circle
  const angle = (shiftedIndex / total) * 2 * Math.PI;
  
  // Oval dimensions (% of container)
  const xRadius = 53; // Increased to move players outside the table
  const yRadius = 45; // Increased to move players outside the table
  
  // Calculate position
  const left = `${50 + xRadius * Math.cos(angle)}%`;
  const top = `${50 + yRadius * Math.sin(angle)}%`;
  
  return { top, left };
};

const PokerTable: React.FC<PokerTableProps> = ({ 
  players, 
  communityCards, 
  pot, 
  activePosition,
  bigBlindAmount = 1,
  stats,
  accuracy
}) => {
  // Find the user player
  const userPlayer = players.find(player => player.isUser);
  
  // Sort players by their position according to the correct order
  const sortedPlayers = [...players].sort((a, b) => {
    // Define the standard order of positions
    const positionOrder = ['UTG', 'UTG+1', 'UTG+2', 'MP', 'LJ', 'HJ', 'CO', 'BTN', 'SB', 'BB'];
    
    // Find the index of each position in the order
    const indexA = positionOrder.indexOf(a.position);
    const indexB = positionOrder.indexOf(b.position);
    
    // Handle positions that might appear multiple times
    if (indexA === indexB && a.position === b.position) {
      return a.id - b.id; // Use player ID as a tiebreaker
    }
    
    return indexA - indexB;
  });

  // Find the index of the user in the sorted players array
  const userIndex = sortedPlayers.findIndex(player => player.isUser);

  return (
    <TableWrapper>
      {sortedPlayers.map((player, index) => {
        const position = getPlayerPosition(index, sortedPlayers.length, userIndex);
        
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
            <Card key={index} rank={card.rank} suit={card.suit} faceDown={true} />
          ))}
        </CommunityCards>
        <PotInfo>{pot / bigBlindAmount} BB</PotInfo>
        {stats && (
          <AccuracyInfo>
            {stats.correct}/{stats.total} {accuracy}%
          </AccuracyInfo>
        )}
      </TableCenter>
    </TableWrapper>
  );
};

export default PokerTable; 