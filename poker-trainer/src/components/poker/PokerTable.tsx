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
  width: 85%;
  height: 580px;
  margin: 30px auto 20px;
  background: linear-gradient(135deg, #1e6321 0%, #2d8a22 50%, #277714 100%);
  border-radius: 200px;
  border: 15px solid #593a28;
  box-shadow: 
    0 20px 30px rgba(0, 0, 0, 0.5),
    inset 0 5px 20px rgba(255, 255, 255, 0.1),
    inset 0 -10px 20px rgba(0, 0, 0, 0.3);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  transition: all 0.3s ease;
  position: relative;
  
  /* Add responsive styling for landscape orientation */
  @media (orientation: landscape) {
    height: min(480px, 75vh); /* Reduced height slightly to create more space for buttons */
    margin: 20px auto 30px; /* Increased bottom margin */
    width: 80%;
  }
  
  /* Make portrait mode table a rounded rectangle like landscape mode */
  @media (orientation: portrait) and (max-width: 767px) {
    width: 95%;
    height: min(650px, 80vh); /* Reduced from 700px to prevent top player cutoff */
    border-radius: 200px; /* Same rounded rectangle shape as landscape mode */
    margin: 15px auto 30px; /* Adjusted margins to balance spacing */
  }
  
  /* Add subtle background pattern */
  &:before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-image: 
      radial-gradient(circle at 20% 30%, rgba(255, 255, 255, 0.08) 0%, transparent 10%),
      radial-gradient(circle at 70% 60%, rgba(255, 255, 255, 0.05) 0%, transparent 15%),
      radial-gradient(circle at 40% 80%, rgba(255, 255, 255, 0.06) 0%, transparent 12%);
    border-radius: inherit;
    pointer-events: none;
  }
`;

const TableCenter = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: relative;
  z-index: 5; /* Lower z-index than player seats but higher than table background */
`;

const CommunityCards = styled.div`
  display: flex;
  gap: 10px;
  margin-bottom: 15px;
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3));
`;

const PotInfo = styled.div`
  background-color: rgba(0, 0, 0, 0.6);
  color: white;
  padding: 5px 15px;
  border-radius: 20px;
  font-weight: bold;
  margin-bottom: 8px;
  backdrop-filter: blur(3px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
`;

const AccuracyInfo = styled.div`
  background-color: rgba(0, 0, 0, 0.6);
  color: white;
  padding: 5px 15px;
  border-radius: 20px;
  font-weight: bold;
  font-size: 0.9em;
  backdrop-filter: blur(3px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
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
  
  // Check if we're on a mobile device with portrait orientation
  const isPortrait = window.matchMedia("(orientation: portrait) and (max-width: 767px)").matches;
  
  // Adjust radius based on orientation
  let xRadius, yRadius;
  
  if (isPortrait) {
    // For portrait orientation, use rectangle layout similar to landscape
    // but with more vertical spacing
    xRadius = 40;
    yRadius = 42; // Reduced from 48 to prevent top player from being cut off
    
    // For portrait, adjust top and bottom player positions for better spacing
    // Bottom user player should be much higher to avoid overlapping with buttons
    if (Math.sin(angle) > 0.9) { // User player at bottom (BTN position)
      return {
        left: `${50 + xRadius * Math.cos(angle)}%`,
        top: `${48 + yRadius * Math.sin(angle)}%` // Move bottom player up significantly
      };
    }
    
    // Top players need to be moved down to avoid being cut off
    if (Math.sin(angle) < -0.8) {
      return {
        left: `${50 + xRadius * Math.cos(angle)}%`,
        top: `${50 + yRadius * Math.sin(angle)}%` // Move top players down slightly
      };
    }
  } else {
    // For landscape and larger screens, use oval positioning with spacing
    // for players on left and right sides
    xRadius = 42;
    yRadius = 38;
    
    // Add spacing by adjusting specific player positions based on their angle
    // Left side players (UTG & BB) need more right offset
    if (Math.cos(angle) < -0.7 && Math.cos(angle) > -0.95) {
      return {
        left: `${50 + (xRadius + 3) * Math.cos(angle)}%`,
        top: `${50 + yRadius * Math.sin(angle)}%`
      };
    }
    
    // Right side players (LJ & HJ) need more left offset
    if (Math.cos(angle) > 0.7 && Math.cos(angle) < 0.95) {
      return {
        left: `${50 + (xRadius + 3) * Math.cos(angle)}%`,
        top: `${50 + yRadius * Math.sin(angle)}%`
      };
    }
    
    // Bottom user player (BTN) needs to be moved up to avoid overlap with buttons
    if (Math.sin(angle) > 0.9) {
      return {
        left: `${50 + xRadius * Math.cos(angle)}%`,
        top: `${48 + yRadius * Math.sin(angle)}%` // Move up to avoid overlap with buttons
      };
    }
  }
  
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