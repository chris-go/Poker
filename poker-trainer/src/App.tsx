import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import GameSettings from './components/settings/GameSettings';
import PuzzleView from './components/puzzles/PuzzleView';
import { GameSettings as GameSettingsType, PokerPuzzle, PlayerAction } from './types/poker';
import { createSamplePuzzle } from './utils/pokerUtils';

const AppContainer = styled.div`
  font-family: 'Roboto', 'Segoe UI', Arial, sans-serif;
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  position: relative;
`;

const Header = styled.header`
  text-align: center;
  margin-bottom: 20px;
`;

const Title = styled.h1`
  color: #ffffff;
  margin-bottom: 10px;
`;

const Subtitle = styled.p`
  color: #b0b0b0;
  font-size: 18px;
`;

const MainContent = styled.main`
  background-color: #2a2a2a;
  border-radius: 10px;
  padding: 20px;
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.3);
`;

const Stats = styled.div`
  display: flex;
  justify-content: center;
  gap: 20px;
  margin-top: 20px;
`;

const StatBox = styled.div`
  background-color: #333333;
  border-radius: 5px;
  padding: 15px;
  text-align: center;
  min-width: 120px;
  color: #e0e0e0;
`;

const StatLabel = styled.div`
  color: #7f8c8d;
  font-size: 14px;
  margin-bottom: 5px;
`;

const StatValue = styled.div`
  color: #2c3e50;
  font-size: 20px;
  font-weight: bold;
`;

const HamburgerButton = styled.button`
  position: absolute;
  top: 20px;
  left: 20px;
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  z-index: 100;
  width: 40px;
  height: 40px;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  padding: 5px;
  border-radius: 5px;
  background-color: #f8f9fa;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  
  &:hover {
    background-color: #e9ecef;
  }
  
  span {
    display: block;
    height: 3px;
    width: 100%;
    background-color: #2c3e50;
    border-radius: 3px;
    transition: all 0.3s ease;
  }
`;

const SettingsPanel = styled.div<{ isOpen: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  width: 350px;
  height: 100vh;
  background-color: white;
  box-shadow: 2px 0 10px rgba(0, 0, 0, 0.1);
  transform: translateX(${props => props.isOpen ? '0' : '-100%'});
  transition: transform 0.3s ease;
  z-index: 99;
  overflow-y: auto;
  padding: 60px 20px 20px;
`;

const Overlay = styled.div<{ isOpen: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 98;
  display: ${props => props.isOpen ? 'block' : 'none'};
`;

const App: React.FC = () => {
  const [settingsPanelOpen, setSettingsPanelOpen] = useState(false);
  const [settings, setSettings] = useState<GameSettingsType>({
    gameType: 'CASH',
    playerCount: 6,
    userPosition: 'BTN',
    bigBlinds: 100,
  });
  
  const [puzzle, setPuzzle] = useState<PokerPuzzle | null>(null);
  const [stats, setStats] = useState({
    correct: 0,
    incorrect: 0,
    total: 0,
  });
  
  // Generate a puzzle when the component mounts
  useEffect(() => {
    generateNewPuzzle();
  }, []);
  
  const handleSettingsChange = (newSettings: GameSettingsType) => {
    setSettings(newSettings);
    generateNewPuzzle(newSettings);
    setSettingsPanelOpen(false); // Close the settings panel after applying
  };
  
  const generateNewPuzzle = (settingsToUse: GameSettingsType = settings) => {
    const newPuzzle = createSamplePuzzle(
      settingsToUse.gameType,
      settingsToUse.playerCount,
      settingsToUse.userPosition,
      settingsToUse.bigBlinds
    );
    setPuzzle(newPuzzle);
  };
  
  const handleActionSelected = (action: PlayerAction) => {
    if (!puzzle) return;
    
    // Update stats
    const isCorrect = action === puzzle.correctAction;
    setStats(prev => ({
      correct: prev.correct + (isCorrect ? 1 : 0),
      incorrect: prev.incorrect + (isCorrect ? 0 : 1),
      total: prev.total + 1,
    }));
    
    // Generate a new puzzle after a delay
    setTimeout(() => {
      generateNewPuzzle();
    }, 2000);
  };
  
  const accuracy = stats.total > 0 
    ? Math.round((stats.correct / stats.total) * 100) 
    : 0;
  
  const toggleSettingsPanel = () => {
    setSettingsPanelOpen(!settingsPanelOpen);
  };
  
  return (
    <AppContainer>
      <HamburgerButton onClick={toggleSettingsPanel}>
        <span></span>
        <span></span>
        <span></span>
      </HamburgerButton>
      
      <Overlay isOpen={settingsPanelOpen} onClick={() => setSettingsPanelOpen(false)} />
      
      <SettingsPanel isOpen={settingsPanelOpen}>
        <GameSettings onSettingsChange={handleSettingsChange} initialSettings={settings} />
      </SettingsPanel>
      
      <Header>
        <Title>Poker Trainer</Title>
        <Subtitle>Practice your decision-making skills in different poker scenarios</Subtitle>
      </Header>
      
      <MainContent>
        {puzzle ? (
          <PuzzleView puzzle={puzzle} onActionSelected={handleActionSelected} />
        ) : (
          <div style={{ textAlign: 'center', padding: '40px' }}>
            Loading puzzle...
          </div>
        )}
      </MainContent>
      
      {stats.total > 0 && (
        <Stats>
          <StatBox>
            <StatLabel>Correct</StatLabel>
            <StatValue>{stats.correct}</StatValue>
          </StatBox>
          <StatBox>
            <StatLabel>Incorrect</StatLabel>
            <StatValue>{stats.incorrect}</StatValue>
          </StatBox>
          <StatBox>
            <StatLabel>Total</StatLabel>
            <StatValue>{stats.total}</StatValue>
          </StatBox>
          <StatBox>
            <StatLabel>Accuracy</StatLabel>
            <StatValue>{accuracy}%</StatValue>
          </StatBox>
        </Stats>
      )}
    </AppContainer>
  );
};

export default App;
