import React, { useEffect, useState } from 'react';
import logo from './logo.svg';
import './App.css';
import axios from 'axios';
import { Header } from 'semantic-ui-react';
import List from 'semantic-ui-react/dist/commonjs/elements/List';

function App()
{
  const [tournaments, setTournament] = useState([]);

  useEffect(() =>
  {
    axios.get('http://localhost:5000/api/tournaments')
      .then(response =>
      {
        console.log(response);
        setTournament(response.data);
      })
  }, [])

  return (
    <div>
      <Header as='h2' icon='fire' content='ESChallenger'/>   
        <List>
          {tournaments.map((tournament: any) => (
            <List.Item key={tournament.id}>
                {tournament.title}
            </List.Item>
          ))}
        </List>
    </div>
  );
}

export default App;
