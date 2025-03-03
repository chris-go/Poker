import React, { useState, useEffect, useCallback } from 'react';
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
  
  /* Add padding for horizontal orientation (landscape) */
  @media (orientation: landscape) {
    padding: 30px 5px;
    max-height: 100vh;
    justify-content: center;
  }
`;

const ActionPanel = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 10px;
  width: 100%;
  max-width: 800px;
  padding: 0 20px;
  
  @media (orientation: landscape) {
    margin-top: 5px;
    max-width: 600px;
  }
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
  position: relative;
  
  ${props => {
    switch (props.action) {
      case 'FOLD':
        return `
          background-color: #e74c3c;
          color: white;
          &:hover { background-color: #c0392b; }
        `;
      case 'CALL':
      case 'CHECK':
        return `
          background-color: #2ecc71;
          color: white;
          &:hover { background-color: #27ae60; }
        `;
      case 'RAISE':
        return `
          background-color: #2ecc71;
          color: white;
          &:hover { background-color: #27ae60; }
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

const HotkeyIndicator = styled.span`
  position: absolute;
  top: 5px;
  right: 5px;
  font-size: 10px;
  background-color: rgba(0, 0, 0, 0.3);
  padding: 2px 5px;
  border-radius: 3px;
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
  
  // Determine if the user is in the big blind position
  const isUserBigBlind = userPlayer?.position === 'BB';
  
  // Determine if there is a bet to call (if not, user can check)
  const hasBetToCall = puzzle.pot > (puzzle.blinds.big + puzzle.blinds.small);
  
  // Reset state when puzzle changes
  useEffect(() => {
    setSelectedAction(null);
    setShowFeedback(false);
  }, [puzzle]);
  
  // Use useCallback to memoize the handleActionClick function
  const handleActionClick = useCallback((action: PlayerAction) => {
    setSelectedAction(action);
    setShowFeedback(true);
    onActionSelected(action);
  }, [onActionSelected]);
  
  const isCorrect = selectedAction === puzzle.correctAction;
  
  // Add keyboard event listeners for hotkeys
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (showFeedback) return; // Don't process hotkeys while showing feedback
      
      switch (e.key.toLowerCase()) {
        case 'f':
          handleActionClick('FOLD');
          break;
        case 'c':
          if (hasBetToCall) {
            handleActionClick('CALL');
          } else if (isUserBigBlind) {
            handleActionClick('CHECK');
          }
          break;
        case 'r':
          handleActionClick('RAISE');
          break;
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [showFeedback, hasBetToCall, isUserBigBlind, handleActionClick]);
  
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
          Pot: {puzzle.pot/puzzle.blinds.big} BB - 
          Your Stack: {userPlayer?.stack ? (userPlayer.stack/puzzle.blinds.big) : 0} BB
        </SituationDescription>
        
        <ActionButtons>
          <ActionButton action="FOLD" onClick={() => handleActionClick('FOLD')}>
            Fold
            <HotkeyIndicator>F</HotkeyIndicator>
          </ActionButton>
          
          {isUserBigBlind && !hasBetToCall ? (
            <ActionButton action="CHECK" onClick={() => handleActionClick('CHECK')}>
              Check
              <HotkeyIndicator>C</HotkeyIndicator>
            </ActionButton>
          ) : hasBetToCall ? (
            <ActionButton action="CALL" onClick={() => handleActionClick('CALL')}>
              Call
              <HotkeyIndicator>C</HotkeyIndicator>
            </ActionButton>
          ) : null}
          
          <ActionButton action="RAISE" onClick={() => handleActionClick('RAISE')}>
            Raise
            <HotkeyIndicator>R</HotkeyIndicator>
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