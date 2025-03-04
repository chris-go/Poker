import React, { CSSProperties } from 'react';
import styled from 'styled-components';
import { Player } from '../../types/poker';
import Card from './Card';

interface PlayerSeatProps {
  player: Player;
  style?: CSSProperties;
  isActive?: boolean;
  bigBlindAmount?: number;
}

const SeatContainer = styled.div<{ isActive?: boolean; isUser?: boolean }>`
  background-color: ${props => props.isActive ? 'rgba(39, 39, 39, 0.85)' : 'rgba(39, 39, 39, 0.70)'};
  backdrop-filter: blur(5px);
  border-radius: 12px;
  padding: 10px;
  color: white;
  box-shadow: 
    0 4px 15px rgba(0, 0, 0, 0.3),
    inset 0 1px 2px rgba(255, 255, 255, 0.1);
  transition: all 0.3s ease;
  min-width: 110px;
  max-width: 130px;
  text-align: center;
  z-index: ${props => props.isUser ? 30 : 20};
  border: ${props => props.isUser 
    ? '2px solid rgba(255, 215, 0, 0.7)' 
    : '1px solid rgba(100, 100, 100, 0.15)'};
  
  ${props => props.isActive && `
    transform: scale(1.05);
    box-shadow: 
      0 0 20px rgba(255, 255, 0, 0.4),
      0 4px 15px rgba(0, 0, 0, 0.3),
      inset 0 1px 2px rgba(255, 255, 255, 0.1);
  `}

  /* User styling based on orientation */
  ${props => props.isUser && `
    background-color: rgba(39, 39, 39, 0.85);
    
    /* Landscape-specific styling */
    @media (orientation: landscape) {
      transform: translateY(0); /* Reset vertical translation - handled by positioning */
      min-width: 130px;
      max-width: 160px;
      padding: 12px;
    }
    
    /* Portrait mode - revert to original styling */
    @media (orientation: portrait) {
      transform: translateY(-5px); /* Original vertical offset */
    }
  `}
  
  /* Larger player seats for bigger screens */
  @media (orientation: landscape) and (min-width: 1024px) {
    min-width: 120px;
    max-width: 140px;
    padding: 12px;
    font-size: 1.05em;
    
    ${props => props.isActive && `
      transform: scale(1.08);
    `}
    
    ${props => props.isUser && `
      min-width: 150px;
      max-width: 180px;
      padding: 14px;
    `}
  }
  
  /* Adjust sizing for landscape mode */
  @media (orientation: landscape) {
    min-width: 105px;
    max-width: 120px;
    padding: 8px;
    
    ${props => props.isUser && `
      min-width: 130px;
      max-width: 160px;
      padding: 10px;
    `}
    
    /* Scale down on smaller screens */
    @media (max-height: 600px) {
      min-width: 95px;
      max-width: 110px;
      padding: 6px;
      font-size: 0.95em;
      
      ${props => props.isUser && `
        min-width: 120px;
        max-width: 150px;
        padding: 8px;
      `}
    }
  }
  
  /* Adjust for portrait/mobile */
  @media (orientation: portrait) and (max-width: 767px) {
    padding: 8px;
    min-width: 100px;
    max-width: 110px;
  }
  
  /* Extra scaling for very narrow portrait devices */
  @media (orientation: portrait) and (max-width: 380px) {
    min-width: 85px;
    max-width: 95px;
    padding: 6px;
    font-size: 0.9em;
    border-radius: 8px;
    
    ${props => props.isActive && `
      transform: scale(1.03);
    `}
  }
`;

const PositionBadge = styled.span`
  background: linear-gradient(135deg, #2c3e50, #34495e);
  padding: 3px 8px;
  border-radius: 4px;
  font-size: 0.8em;
  margin-right: 5px;
  color: #ffffff;
  font-weight: 600;
  border: 1px solid rgba(255, 255, 255, 0.1);
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
  
  /* Smaller badge for very narrow devices */
  @media (orientation: portrait) and (max-width: 380px) {
    padding: 2px 6px;
    font-size: 0.75em;
    margin-right: 3px;
  }
`;

const Stack = styled.div`
  font-weight: bold;
  margin: 8px 0;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
  letter-spacing: 0.5px;
  white-space: nowrap;
  
  /* Make sure it doesn't overflow on small screens */
  @media (max-height: 600px) and (orientation: landscape) {
    margin: 6px 0;
    font-size: 0.95em;
  }
  
  /* Smaller stack display for very narrow devices */
  @media (orientation: portrait) and (max-width: 380px) {
    margin: 5px 0;
    font-size: 0.9em;
  }
`;

const PlayerCards = styled.div<{ isUser?: boolean }>`
  display: flex;
  justify-content: center;
  gap: 5px;
  margin-top: 8px;
  
  ${props => props.isUser && `
    position: relative;
    top: 5px;
  `}
  
  /* Smaller gap for very narrow devices */
  @media (orientation: portrait) and (max-width: 380px) {
    gap: 3px;
    margin-top: 6px;
  }
`;

const FaceDownCard = styled.div`
  width: 25px;
  height: 35px;
  border-radius: 4px;
  background: linear-gradient(135deg, #273c75 0%, #192a56 100%);
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.3);
  position: relative;
  overflow: hidden;
  
  &:before {
    content: '';
    position: absolute;
    top: 2px;
    left: 2px;
    right: 2px;
    bottom: 2px;
    background-image: 
      repeating-linear-gradient(
        45deg,
        rgba(255, 255, 255, 0.05),
        rgba(255, 255, 255, 0.05) 3px,
        transparent 3px,
        transparent 6px
      );
    border-radius: 2px;
  }
  
  /* Slightly larger cards on bigger screens */
  @media (orientation: landscape) and (min-width: 1024px) {
    width: 28px;
    height: 38px;
  }
  
  /* Make cards more compact on mobile devices */
  @media (orientation: portrait) and (max-width: 767px) {
    width: 22px;
    height: 31px;
  }
  
  /* Even smaller cards for very narrow devices */
  @media (orientation: portrait) and (max-width: 380px) {
    width: 20px;
    height: 28px;
  }
`;

const UserName = styled.span`
  font-weight: bold;
  color: gold;
  margin-left: 4px;
  font-size: 0.9em;
  text-shadow: 0 0 10px rgba(255, 215, 0, 0.5);
  
  /* Smaller text for very narrow devices */
  @media (orientation: portrait) and (max-width: 380px) {
    font-size: 0.8em;
    margin-left: 2px;
  }
`;

// Custom styling for user cards to make them larger
const UserCards = styled.div`
  display: flex;
  justify-content: center;
  gap: 6px;
  margin-top: 8px;
  
  /* Scale up for different screen sizes */
  @media (orientation: landscape) and (min-width: 1024px) {
    gap: 8px;
  }
  
  /* Handle mobile spacing */
  @media (orientation: portrait) and (max-width: 380px) {
    gap: 4px;
  }
`;

const PlayerSeat: React.FC<PlayerSeatProps> = ({ player, style, isActive, bigBlindAmount = 1 }) => {
  return (
    <SeatContainer style={style} isActive={isActive} isUser={player.isUser}>
      <div>
        <PositionBadge>{player.position}</PositionBadge>
      </div>
      <Stack>{player.stack / bigBlindAmount} BB</Stack>
      
      {player.isUser && player.cards ? (
        <UserCards>
          {/* Larger user cards - approx double the area */}
          <Card 
            rank={player.cards[0].rank} 
            suit={player.cards[0].suit} 
            isUserCard={true} 
            size="large" 
          />
          <Card 
            rank={player.cards[1].rank} 
            suit={player.cards[1].suit} 
            isUserCard={true} 
            size="large" 
          />
        </UserCards>
      ) : (
        <PlayerCards>
          <FaceDownCard />
          <FaceDownCard />
        </PlayerCards>
      )}
    </SeatContainer>
  );
};

export default PlayerSeat; 