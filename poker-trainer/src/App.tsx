import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import GameSettings from './components/settings/GameSettings';
import PuzzleView from './components/puzzles/PuzzleView';
import { GameSettings as GameSettingsType, PokerPuzzle, PlayerAction } from './types/poker';
import { createSamplePuzzle } from './utils/pokerUtils';

const AppContainer = styled.div`
  font-family: 'Roboto', 'Segoe UI', Arial, sans-serif;
  width: 100%;
  height: 100vh;
  margin: 0;
  padding: 0;
  position: relative;
  background-color: #1a1a1a;
  overflow: hidden;
`;

const MainContent = styled.main`
  width: 100%;
  height: 100%;
  padding: 10px;
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.3);
`;

const Stats = styled.div`
  display: flex;
  justify-content: center;
  gap: 20px;
  padding: 15px;
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: rgba(42, 42, 42, 0.9);
`;

const StatBox = styled.div`
  background-color: #333333;
  border-radius: 5px;
  padding: 10px;
  text-align: center;
  min-width: 100px;
  color: #e0e0e0;
`;

const StatLabel = styled.div`
  color: #7f8c8d;
  font-size: 12px;
  margin-bottom: 3px;
`;

const StatValue = styled.div`
  color: #ecf0f1;
  font-size: 18px;
  font-weight: bold;
`;

const SettingsPanel = styled.div<{ isOpen: boolean }>`
  position: fixed;
  top: 0;
  right: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.7);
  z-index: 98;
  display: ${props => props.isOpen ? 'block' : 'none'};
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
      <Overlay isOpen={settingsPanelOpen} onClick={() => setSettingsPanelOpen(false)} />
      
      <SettingsPanel isOpen={settingsPanelOpen}>
        <GameSettings onSettingsChange={handleSettingsChange} initialSettings={settings} />
      </SettingsPanel>
      
      <MainContent>
        {puzzle ? (
          <>
            <PuzzleView 
              puzzle={puzzle} 
              onActionSelected={handleActionSelected} 
              onMenuClick={toggleSettingsPanel} 
            />
            
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
          </>
        ) : (
          <div style={{ textAlign: 'center', padding: '40px', color: 'white' }}>
            Loading puzzle...
          </div>
        )}
      </MainContent>
    </AppContainer>
  );
};

export default App;
