import { useEffect, useState } from 'react';
import './App.css';
import { HashRouter, Route, Routes } from 'react-router-dom';
import { Registration } from './components/Registration/Registration';
import { checkAuth } from './functions/checkAuth';

export const BASE_URL = 'http://localhost:3005';

function App() {
  const [isAuth, setIsAuth] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    checkAuth(setIsAuth, setLoading);
  }, []);

  if (loading) return <h1>Loading, please wait...</h1>;

  return (
    <HashRouter>
      <Routes>
        {!isAuth ? (
          <Route path="*" element={<Registration onLoading={setLoading} onSubmit={setIsAuth} />} />
        ) : (
          <Route path="/" element={<h1>CHATIK</h1>} />
        )}
      </Routes>
    </HashRouter>
  );
}

export default App;

// фундаменталка кода і аус повністю готові. На следующий раз треба зробить елемент типу Main в якому має бути от сили 2 кнопки
// тіпа CreateRoom i JoinRoom, можна добавить список комнат, або возможность підлкючення через айдішнік. Всю інфу просто берем аксіосом
// треба зробить окремий ентіті для комнат, не іспользуй сокет!!! тут нада обичний реквест. Сокет нада подключать вже коли зайдем на комнату
