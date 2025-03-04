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
  background: linear-gradient(180deg, #2d8a22 0%, #1e6321 60%, #277714 100%);
  border-radius: 200px;
  border: 15px solid #593a28;
  box-shadow: 
    0 20px 30px rgba(0, 0, 0, 0.5),
    inset 0 5px 20px rgba(255, 255, 255, 0.2),
    inset 0 -10px 20px rgba(0, 0, 0, 0.3);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  transition: all 0.3s ease;
  position: relative;
  
  /* Add responsive styling for landscape orientation */
  @media (orientation: landscape) {
    height: min(500px, 75vh); /* Increased from 450px to make table bigger */
    margin: 20px auto 30px; /* Increased bottom margin */
    width: 85%; /* Increased from 75% to make table wider */
    max-width: 1100px; /* Increased max width for larger screens */
    
    /* For smaller landscape screens, keep the table more compact */
    @media (max-width: 1024px) {
      width: 80%;
      height: min(480px, 72vh);
      max-width: 950px;
    }
    
    /* For very small landscape screens, maintain the more compact layout */
    @media (max-width: 768px) {
      width: 75%;
      height: min(450px, 70vh);
      max-width: 850px;
    }
  }
  
  /* Make portrait mode table a rounded rectangle like landscape mode */
  @media (orientation: portrait) and (max-width: 767px) {
    width: 90%; /* Reduced from 95% to prevent player cutoff */
    height: min(600px, 75vh); /* Further reduced from 650px to prevent player cutoff */
    border-radius: 200px; /* Same rounded rectangle shape as landscape mode */
    margin: 15px auto 30px; /* Adjusted margins to balance spacing */
    max-width: 90vw; /* Ensure table doesn't extend beyond screen width */
  }
  
  /* Extra handling for very narrow portrait devices */
  @media (orientation: portrait) and (max-width: 380px) {
    width: 85%; /* Even smaller on very narrow screens */
    height: min(550px, 70vh); /* Further reduced height */
    border-radius: 150px; /* Smaller radius for smaller table */
    border-width: 12px; /* Thinner border */
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
      radial-gradient(ellipse at 50% 15%, rgba(255, 255, 255, 0.1) 0%, transparent 50%),
      radial-gradient(circle at 50% 30%, rgba(255, 255, 255, 0.08) 0%, transparent 40%),
      radial-gradient(circle at 50% 10%, rgba(255, 255, 255, 0.05) 0%, transparent 30%);
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
  
  /* Scale down for narrow portrait devices */
  @media (orientation: portrait) and (max-width: 380px) {
    transform: scale(0.9);
  }
  
  /* Add subtle top lighting effect for the center area */
  &:before {
    content: '';
    position: absolute;
    top: -40px;
    left: -100px;
    right: -100px;
    height: 80px;
    background: radial-gradient(ellipse at center, rgba(255, 255, 255, 0.08) 0%, transparent 70%);
    pointer-events: none;
  }
`;

const CommunityCards = styled.div`
  display: flex;
  gap: 10px;
  margin-bottom: 15px;
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3));
  
  /* Tighter spacing for narrow portrait devices */
  @media (orientation: portrait) and (max-width: 380px) {
    gap: 8px;
    margin-bottom: 12px;
  }
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
  
  /* Smaller for narrow portrait devices */
  @media (orientation: portrait) and (max-width: 380px) {
    padding: 4px 12px;
    border-radius: 16px;
    font-size: 0.9em;
    margin-bottom: 6px;
  }
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
  
  /* Smaller for narrow portrait devices */
  @media (orientation: portrait) and (max-width: 380px) {
    padding: 4px 12px;
    border-radius: 16px;
    font-size: 0.85em;
  }
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
  
  // Check if this is the user's position (placed at the bottom of the table)
  const isUserPosition = shiftedIndex === idealUserIndex;
  
  // Check device orientation and width
  const isPortrait = window.matchMedia("(orientation: portrait)").matches;
  const isNarrowPortrait = window.matchMedia("(orientation: portrait) and (max-width: 380px)").matches;
  const isLargeScreen = window.matchMedia("(orientation: landscape) and (min-width: 1024px)").matches;
  
  // Adjust radius based on orientation and device width
  let xRadius, yRadius;
  
  // Special positioning for the user's seat (BTN position) - Only in landscape mode
  if (isUserPosition && !isPortrait) {
    if (isLargeScreen) {
      return {
        left: `${50 + 49 * Math.cos(angle)}%`,
        top: `${56 + 46 * Math.sin(angle)}%` // Moved further down
      };
    } else {
      return {
        left: `${50 + 47 * Math.cos(angle)}%`,
        top: `${56 + 43 * Math.sin(angle)}%` // Moved further down
      };
    }
  }
  
  // Continue with existing positioning for all other positions and portrait mode
  if (isNarrowPortrait) {
    // For very narrow portrait devices, bring players much closer to center
    xRadius = 44;
    yRadius = 42;
    
    // Bottom player (BTN - user) in portrait mode
    if (isUserPosition) {
      return {
        left: `${50 + xRadius * Math.cos(angle)}%`,
        top: `${48 + (yRadius - 3) * Math.sin(angle)}%` // Original positioning
      };
    }
    
    // Top players
    if (Math.sin(angle) < -0.8) {
      return {
        left: `${50 + xRadius * Math.cos(angle)}%`,
        top: `${52 + (yRadius - 3) * Math.sin(angle)}%` // Move down more
      };
    }
    
    // Left side players
    if (Math.cos(angle) < -0.7) {
      return {
        left: `${50 + (xRadius - 2) * Math.cos(angle)}%`, // Pull in more
        top: `${50 + yRadius * Math.sin(angle)}%`
      };
    }
    
    // Right side players
    if (Math.cos(angle) > 0.7) {
      return {
        left: `${50 + (xRadius - 2) * Math.cos(angle)}%`, // Pull in more
        top: `${50 + yRadius * Math.sin(angle)}%`
      };
    }
  } else if (isPortrait) {
    // For standard portrait orientation, use consistent spacing but pulled in more
    xRadius = 46; // Reduced from 50 to prevent cutoff
    yRadius = 45; // Reduced from 49 to prevent cutoff
    
    // Bottom player (BTN - user) in portrait mode
    if (isUserPosition) {
      return {
        left: `${50 + xRadius * Math.cos(angle)}%`,
        top: `${48 + yRadius * Math.sin(angle)}%` // Original positioning
      };
    }
    
    // Top players need a slight adjustment to avoid being cut off
    if (Math.sin(angle) < -0.8) {
      return {
        left: `${50 + xRadius * Math.cos(angle)}%`,
        top: `${52 + yRadius * Math.sin(angle)}%` // Move top players down slightly
      };
    }
    
    // Adjust left side players to be more consistently positioned
    if (Math.cos(angle) < -0.7) {
      return {
        left: `${50 + xRadius * Math.cos(angle)}%`,
        top: `${50 + yRadius * Math.sin(angle)}%`
      };
    }
    
    // Adjust right side players to be more consistently positioned
    if (Math.cos(angle) > 0.7) {
      return {
        left: `${50 + xRadius * Math.cos(angle)}%`,
        top: `${50 + yRadius * Math.sin(angle)}%`
      };
    }
  } else if (isLargeScreen) {
    // For large landscape screens, we can spread players out more
    xRadius = 49; // Increased for larger table
    yRadius = 46; // Increased for larger table
    
    // Create more consistent positioning for all players around the table
    
    // Left side players (UTG & BB)
    if (Math.cos(angle) < -0.5) {
      return {
        left: `${50 + xRadius * Math.cos(angle)}%`,
        top: `${50 + yRadius * Math.sin(angle)}%`
      };
    }
    
    // Right side players (LJ & HJ)
    if (Math.cos(angle) > 0.5) {
      return {
        left: `${50 + xRadius * Math.cos(angle)}%`,
        top: `${50 + yRadius * Math.sin(angle)}%`
      };
    }
    
    // Top players
    if (Math.sin(angle) < -0.5) {
      return {
        left: `${50 + xRadius * Math.cos(angle)}%`,
        top: `${50 + yRadius * Math.sin(angle)}%`
      };
    }
  } else {
    // For standard landscape screens, position players appropriately
    xRadius = 47; // Reduced from 52 to pull players in from edges
    yRadius = 43; // Reduced from 48 to pull players in from edges
    
    // Create more consistent positioning for all players around the table
    
    // Left side players (UTG & BB) - adjust positioning to prevent cutoff
    if (Math.cos(angle) < -0.5) {
      return {
        left: `${50 + xRadius * Math.cos(angle)}%`,
        top: `${50 + yRadius * Math.sin(angle)}%`
      };
    }
    
    // Right side players (LJ & HJ) - adjust positioning to prevent cutoff
    if (Math.cos(angle) > 0.5) {
      return {
        left: `${50 + xRadius * Math.cos(angle)}%`,
        top: `${50 + yRadius * Math.sin(angle)}%`
      };
    }
    
    // Top players need space to avoid being cut off
    if (Math.sin(angle) < -0.5) {
      return {
        left: `${50 + xRadius * Math.cos(angle)}%`,
        top: `${50 + yRadius * Math.sin(angle)}%`
      };
    }
  }
  
  // Default positioning for all other players - more consistent distance from edge
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