import React, { useEffect, useState } from 'react';
import { Container } from 'semantic-ui-react';
import { Tournament } from '../models/tournament';
import NavBar from './NavBar';
import TournamentDashboard from '../../features/tournaments/dashboard/TournamentDashboard';
import { v4 as uuid } from 'uuid';
import agent from '../api/Agent';
import LoadingComponent from './LoadingComponent';

function App()
{
  const [tournaments, setTournament] = useState<Tournament[]>([]);
  const [selectedTournament, setSelectedTournament] = useState<Tournament | undefined>(undefined);
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() =>
  {
    agent.Tournaments.list().then(response =>
    {
      let tournaments: Tournament[] = [];
      response.forEach(tournament =>
      {
        tournament.date = tournament.date.split('T')[0];
        tournaments.push(tournament);
      })
      setTournament(tournaments);
      setLoading(false);
    })
  }, [])

  function handleSelectTournament(id: string)
  {
    setSelectedTournament(tournaments.find(x => x.id === id))
  }

  function handleCancelSelectTournament()
  {
    setSelectedTournament(undefined);
  }

  function handleFormOpen(id?: string)
  {
    id ? handleSelectTournament(id) : handleCancelSelectTournament();
    setEditMode(true);
  }

  function handleFormClose()
  {
    setEditMode(false);
  }

  function handleCreateOrEditTournament(tournament: Tournament)
  {
    setSubmitting(true);
    if (tournament.id)
    {
      agent.Tournaments.update(tournament).then(() =>
      {
        setTournament([...tournaments.filter(x => x.id !== tournament.id), tournament]);
        setSelectedTournament(tournament);
        setEditMode(false);
        setSubmitting(false);
      })
    } else
    {
      tournament.id = uuid();
      agent.Tournaments.create(tournament).then(() =>
      {
        setTournament([...tournaments, tournament])
        setSelectedTournament(tournament);
        setEditMode(false);
        setSubmitting(false);
      });
    }
  }

  function handleDeleteTournament(id: string)
  {
    setSubmitting(true);
    agent.Tournaments.delete(id).then(() =>
    {
      setTournament([...tournaments.filter(x => x.id !== id)]);
      setSubmitting(false);
    })
  }

  if(loading) return <LoadingComponent content='Loading app'/>

  return (
    <>
      <NavBar openForm={handleFormOpen} />
      <Container style={{ margin: '7em' }}>
        <TournamentDashboard tournaments={tournaments}
          selectedTournament={selectedTournament}
          selectTournament={handleSelectTournament}
          handleCancelSelectTournament={handleCancelSelectTournament}
          editMode={editMode}
          openForm={handleFormOpen}
          closeForm={handleFormClose}
          createOrEdit={handleCreateOrEditTournament}
          deleteTournament={handleDeleteTournament}
          submitting={submitting}
        />
      </Container>
    </>
  );
}

export default App;
