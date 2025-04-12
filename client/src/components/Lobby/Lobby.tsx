import React, { useEffect, useState } from 'react';
import styles from './Lobby.module.scss';
import { requestCreateRoom } from '../../functions/requestCreateRoom';
import { useNavigate } from 'react-router-dom';
import { requestJoinRoom } from '../../functions/requestJoinRoom';

type LobbyState = 'create' | 'join' | null;

export const Lobby: React.FC = () => {
  const [lobbyState, setLobbyState] = useState<LobbyState>(null);
  const [inputValue, setInputValue] = useState<string | null>(null);
  const [inputLimit, setInputLimit] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const userName = localStorage.getItem('name');

  const handleSubmit = async () => {
    const currentMethod = lobbyState;
    if (!inputValue || !currentMethod) {
      setError('inputValue or currentMethod is empty');
      return;
    }

    if (currentMethod === 'create') {
      const response = await requestCreateRoom(inputValue, inputLimit);
      if (response) {
        navigate(`/chat/${response.id}`);
        return;
      } else {
        setError('problem with creating room');
        return;
      }
    } else if (currentMethod === 'join') {
      const response = await requestJoinRoom(inputValue);

      if (response) {
        navigate(`/chat/${response.id}`);
        return;
      } else {
        setError('problem with joining to room');
        return;
      }
    }
  };

  useEffect(() => {
    if (error) {
      setTimeout(() => setError(null), 5000);
    }
  }, [error]);

  useEffect(() => {
    console.log('lobby changed' + lobbyState)
  }, [lobbyState])

  return (
    <div className={styles.lobby}>
      {error && <div className={styles.error}>{error}</div>}
      <div className={styles.lobby__user}>
        <img src='/images/user2.png' className={styles.lobby_userLogo} alt='User Avatar'/>
        <strong style={{ color: '#000' }} className={styles.lobby__userName}>{userName}</strong>
      </div>
      <div className={styles.lobby__buttons}>
        <button
          onClick={() => setLobbyState('create')}
          className={styles.button}
        >
          Create a new Room
        </button>
        <button
          onClick={() => setLobbyState('join')}
          className={styles.button}
        >
          Join to room
        </button>
      </div>
      {lobbyState && (
        <form
          className={styles.lobbyForm}
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit();
          }}
        >
          <h2 className={styles.formTitle}>
            {lobbyState === 'create' ? 'Create a new Room' : 'Join to room'}
          </h2>
          <label>
            <h3 className={styles.inputTitle}>
              {lobbyState === 'create'
                ? 'Enter your room name'
                : 'Enter room ID'}
            </h3>
            <input
              className={styles.formInput}
              placeholder={
                lobbyState === 'create' ? 'enter room name' : 'enter room id'
              }
              type="text"
              value={inputValue ?? ''}
              onChange={(e) => setInputValue(e.target.value)}
            />
          </label>
          {lobbyState === 'create' && (
            <label>
              <h3 className={styles.inputTitle}>Select count of users limit</h3>
              <select
                className={styles.select}
                onChange={(e) => setInputLimit(Number(e.target.value))}
              >
                <option value={2}>2</option>
                <option value={4}>4</option>
                <option value={6}>6</option>
                <option value={8}>8</option>
                <option value={10}>10</option>
              </select>
            </label>
          )}
          <button className={styles.button} type="submit">
            {lobbyState === 'create' ? 'Create room' : 'Join to room'}
          </button>
        </form>
      )}
    </div>
  );
};
