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
  background-color: ${props => props.isActive ? 'rgba(39, 39, 39, 0.95)' : 'rgba(39, 39, 39, 0.8)'};
  border-radius: 8px;
  padding: 8px;
  color: white;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.3);
  transition: all 0.3s ease;
  min-width: 120px;
  text-align: center;
  z-index: 10;
  border: ${props => props.isUser ? '2px solid rgba(255, 255, 0, 0.7)' : '1px solid rgba(120, 120, 120, 0.3)'};
  
  ${props => props.isActive && `
    transform: scale(1.03);
    box-shadow: 0 0 12px rgba(255, 255, 0, 0.5);
  `}

  ${props => props.isUser && `
    transform: translateY(-20px);
    background-color: rgba(39, 39, 39, 0.95);
  `}
`;

const PositionBadge = styled.span`
  background-color: #222;
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 0.8em;
  margin-right: 5px;
  color: #ffffff;
`;

const Stack = styled.div`
  font-weight: bold;
  margin: 5px 0;
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
  border-radius: 3px;
  background-color: #1f5ebf;
  background-image: repeating-linear-gradient(
    45deg,
    transparent,
    transparent 5px,
    rgba(0, 0, 0, 0.1) 5px,
    rgba(0, 0, 0, 0.1) 10px
  );
  border: 1px solid #0d3177;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.4);
`;

const UserName = styled.span`
  font-weight: bold;
  color: yellow;
  margin-left: 4px;
  font-size: 0.9em;
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