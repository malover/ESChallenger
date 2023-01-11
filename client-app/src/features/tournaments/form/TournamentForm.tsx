import React, { ChangeEvent, useState } from "react";
import { Button, Form, Segment } from "semantic-ui-react";
import { Tournament } from "../../../app/models/tournament";

interface Props
{
    tournament: Tournament | undefined;
    closeForm: () => void;
    createOrEdit: (tournament: Tournament) => void;
    submitting: boolean;
}

export default function TournamentForm({ tournament: selectedTournament, closeForm, createOrEdit, submitting }: Props)
{

    const initialState = selectedTournament ?? {
        id: '',
        title: '',
        category: '',
        description: '',
        date: '',
        country: '',
        city: '',
        venue: '',
        prizePool: 0
    }

    const [tournament, setTournament] = useState(initialState);

    function handleSubmit()
    {
        createOrEdit(tournament);
    }

    function handleInputChange(event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>)
    {
        const { name, value } = event.target;
        setTournament({ ...tournament, [name]: value })
    }

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
                <Button loading={submitting} floated="right" positive type='submit' content='Submit' />
                <Button onClick={closeForm} floated="right" type='button' content='Cancel' />
            </Form>
        </Segment>
    )
}