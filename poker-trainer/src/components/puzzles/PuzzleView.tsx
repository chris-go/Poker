import React, { useState } from 'react';
import styled from 'styled-components';
import PokerTable from '../poker/PokerTable';
import { PokerPuzzle, PlayerAction } from '../../types/poker';

interface PuzzleViewProps {
  puzzle: PokerPuzzle;
  onActionSelected: (action: PlayerAction) => void;
  onMenuClick?: () => void;
}

const PuzzleContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 100%;
  overflow: auto;
  padding: 0 5px;
`;

const ActionPanel = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 10px;
  width: 100%;
  max-width: 800px;
  padding: 0 20px;
`;

const SituationDescription = styled.div`
  background-color: rgba(51, 51, 51, 0.8);
  border-radius: 8px;
  padding: 12px;
  margin-bottom: 15px;
  text-align: center;
  font-size: 14px;
  line-height: 1.5;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.3);
  width: 100%;
  color: #e0e0e0;
`;

const ActionButtons = styled.div`
  display: flex;
  justify-content: center;
  gap: 15px;
  width: 100%;
  flex-wrap: wrap;
`;

const ActionButton = styled.button<{ action: PlayerAction }>`
  padding: 12px 25px;
  font-size: 16px;
  font-weight: bold;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: all 0.2s;
  flex: 1;
  min-width: 100px;
  
  ${props => {
    switch (props.action) {
      case 'FOLD':
        return `
          background-color: #e74c3c;
          color: white;
          &:hover { background-color: #c0392b; }
        `;
      case 'CALL':
        return `
          background-color: #3498db;
          color: white;
          &:hover { background-color: #2980b9; }
        `;
      case 'CHECK':
        return `
          background-color: #2ecc71;
          color: white;
          &:hover { background-color: #27ae60; }
        `;
      case 'RAISE':
        return `
          background-color: #f39c12;
          color: white;
          &:hover { background-color: #d35400; }
        `;
      default:
        return `
          background-color: #7f8c8d;
          color: white;
          &:hover { background-color: #2c3e50; }
        `;
    }
  }}
`;

const FeedbackContainer = styled.div<{ correct: boolean }>`
  background-color: ${props => props.correct ? '#2a4a2a' : '#4a2a2a'};
  color: ${props => props.correct ? '#90ee90' : '#ff9090'};
  padding: 15px;
  border-radius: 5px;
  margin-top: 20px;
  width: 100%;
  text-align: center;
  font-weight: bold;
`;

const PuzzleView: React.FC<PuzzleViewProps> = ({ puzzle, onActionSelected, onMenuClick }) => {
  const [selectedAction, setSelectedAction] = useState<PlayerAction | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  
  const userPlayer = puzzle.players.find(player => player.isUser);
  
  const handleActionClick = (action: PlayerAction) => {
    setSelectedAction(action);
    setShowFeedback(true);
    onActionSelected(action);
  };
  
  const isCorrect = selectedAction === puzzle.correctAction;
  
  return (
    <PuzzleContainer>
      <PokerTable 
        players={puzzle.players}
        communityCards={puzzle.communityCards}
        pot={puzzle.pot}
        activePosition={userPlayer?.position}
        bigBlindAmount={puzzle.blinds.big}
        onMenuClick={onMenuClick}
      />
      
      <ActionPanel>
        <SituationDescription>
          {puzzle.gameType === 'CASH' ? 'Cash Game' : 'Tournament'} - 
          Blinds: {puzzle.blinds.small/puzzle.blinds.big}/1 BB - 
          Pot: {puzzle.pot/puzzle.blinds.big} BB - 
          Your Stack: {userPlayer?.stack ? (userPlayer.stack/puzzle.blinds.big) : 0} BB
        </SituationDescription>
        
        <ActionButtons>
          <ActionButton action="FOLD" onClick={() => handleActionClick('FOLD')}>
            Fold
          </ActionButton>
          
          <ActionButton action="CHECK" onClick={() => handleActionClick('CHECK')}>
            Check
          </ActionButton>
          
          <ActionButton action="CALL" onClick={() => handleActionClick('CALL')}>
            Call
          </ActionButton>
          
          <ActionButton action="RAISE" onClick={() => handleActionClick('RAISE')}>
            Raise
          </ActionButton>
        </ActionButtons>
        
        {showFeedback && (
          <FeedbackContainer correct={isCorrect}>
            {isCorrect
              ? 'Correct! ' + puzzle.actionDescription
              : 'Not the best play. ' + puzzle.actionDescription}
          </FeedbackContainer>
        )}
      </ActionPanel>
    </PuzzleContainer>
  );
};

export default PuzzleView; 