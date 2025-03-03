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

  ${props => props.isUser && `
    transform: translateY(-25px);
    background-color: rgba(39, 39, 39, 0.85);
  `}
  
  @media (orientation: portrait) and (max-width: 767px) {
    padding: 8px;
    min-width: 100px;
    max-width: 110px;
    
    ${props => props.isUser && `
      transform: translateY(-20px);
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
`;

const Stack = styled.div`
  font-weight: bold;
  margin: 8px 0;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
  letter-spacing: 0.5px;
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
  
  /* Make cards more compact on mobile devices */
  @media (orientation: portrait) and (max-width: 767px) {
    width: 22px;
    height: 31px;
  }
`;

const UserName = styled.span`
  font-weight: bold;
  color: gold;
  margin-left: 4px;
  font-size: 0.9em;
  text-shadow: 0 0 10px rgba(255, 215, 0, 0.5);
`;

const PlayerSeat: React.FC<PlayerSeatProps> = ({ player, style, isActive, bigBlindAmount = 1 }) => {
  return (
    <SeatContainer style={style} isActive={isActive} isUser={player.isUser}>
      <div>
        <PositionBadge>{player.position}</PositionBadge>
        {player.isUser && <UserName>👤 YOU</UserName>}
      </div>
      <Stack>{player.stack / bigBlindAmount} BB</Stack>
      
      <PlayerCards isUser={player.isUser}>
        {player.isUser && player.cards ? (
          <>
            <Card rank={player.cards[0].rank} suit={player.cards[0].suit} isUserCard={true} />
            <Card rank={player.cards[1].rank} suit={player.cards[1].suit} isUserCard={true} />
          </>
        ) : (
          <>
            <FaceDownCard />
            <FaceDownCard />
          </>
        )}
      </PlayerCards>
    </SeatContainer>
  );
};

export default PlayerSeat; 