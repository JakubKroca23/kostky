import { useState } from 'react';
import { Lobby } from './components/Lobby';
import { Game } from './components/Game';
import './index.css';

function App() {
  const [isInGame, setIsInGame] = useState(false);
  const [room, setRoom] = useState('');
  const [user, setUser] = useState('');

  const joinGame = (roomId: string, username: string) => {
    setRoom(roomId);
    setUser(username);
    setIsInGame(true);
  };

  return (
    <div className="w-full h-full">
      {!isInGame ? (
        <Lobby onJoin={joinGame} />
      ) : (
        <Game roomId={room} username={user} />
      )}
    </div>
  );
}

export default App;
