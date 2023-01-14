import { observer } from "mobx-react-lite";
import React, { ChangeEvent, useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Button, Form, Segment } from "semantic-ui-react";
import { useStore } from "../../../app/api/stores/store";
import LoadingComponent from "../../../app/layout/LoadingComponent";
import { Tournament } from "../../../app/models/tournament";
import { v4 as uuid } from 'uuid';

export default observer(function TournamentForm()
{
    const { tournamentStore } = useStore();
    const { selectedTournament, createTournament, updateTournament,
        loading, loadTournament, loadingInitial } = tournamentStore;

    const { id } = useParams();

    const navigate = useNavigate();

    const [tournament, setTournament] = useState<Tournament>(
        {
            id: '',
            title: '',
            category: '',
            description: '',
            date: '',
            country: '',
            city: '',
            venue: '',
            prizePool: 0
        });
    
    useEffect(() =>
    {
        if (id) loadTournament(id).then(tournament => setTournament(tournament!))
    }, [id, loadTournament]);

    function handleSubmit()
    {
        if (!tournament.id)
        {
            tournament.id = uuid();
            createTournament(tournament).then(() => navigate(`/tournaments/${tournament.id}`));
        }
        else
        {
            updateTournament(tournament).then(() => navigate(`/tournaments/${tournament.id}`));
        }
    }

    function handleInputChange(event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>)
    {
        const { name, value } = event.target;
        setTournament({ ...tournament, [name]: value })
    }

    if(loadingInitial) return <LoadingComponent content='Loading tournament...'/>

    return (
        <Segment clearing>
            <Form onSubmit={handleSubmit} autoComplete='off'>
                <Form.Input placeholder='Title' value={tournament.title} name='title' onChange={handleInputChange} />
                <Form.Input placeholder='Description' value={tournament.description} name='description' onChange={handleInputChange} />
                <Form.Input placeholder='Category' value={tournament.category} name='category' onChange={handleInputChange} />
                <Form.Input placeholder='Date' type="date" value={tournament.date} name='date' onChange={handleInputChange} />
                <Form.Input placeholder='Country' value={tournament.country} name='country' onChange={handleInputChange} />
                <Form.Input placeholder='City' value={tournament.city} name='city' onChange={handleInputChange} />
                <Form.Input placeholder='Venue' value={tournament.venue} name='venue' onChange={handleInputChange} />
                <Form.Input placeholder='Prize pool' value={tournament.prizePool} name='prizePool' onChange={handleInputChange} />
                <Button loading={loading} floated="right" positive type='submit' content='Submit' />
                <Button as={Link} to='/tournaments' floated="right" type='button' content='Cancel' />
            </Form>
        </Segment>
    )
})