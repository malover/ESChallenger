import React, { SyntheticEvent, useState } from "react";
import { Button, Item, Label, Segment } from "semantic-ui-react";
import { Tournament } from "../../../app/models/tournament";

interface Props
{
    tournaments: Tournament[];
    selectTournament: (id: string) => void;
    deleteTournament: (id: string) => void;
    cancelSelectTournament: () => void;
    submitting: boolean;
}

export default function TournamentList({ tournaments, selectTournament, deleteTournament, cancelSelectTournament, submitting }: Props)
{
    const [target, setTarget] = useState('');

    function handleTournamentDelete(e: SyntheticEvent<HTMLButtonElement>, id: string)
    {
        setTarget(e.currentTarget.name);
        deleteTournament(id);
    }

    return (
        <Segment>
            <Item.Group divided>
                {tournaments.map(tournament => (
                    <Item key={tournament.id}>
                        <Item.Content>
                            <Item.Header as='a'>{tournament.title}</Item.Header>
                            <Item.Meta>{tournament.date}</Item.Meta>
                            <Item.Description>
                                <div>{tournament.description}</div>
                                <div>{tournament.country}, {tournament.city}</div>
                                <div>{tournament.venue}</div>
                                <div>Prize pool: {tournament.prizePool}$</div>
                            </Item.Description>
                            <Item.Extra>
                                <Button onClick={() => selectTournament(tournament.id)} floated='right' content='View' color='blue' />
                                <Button name={tournament.id}
                                    loading={submitting && target === tournament.id}
                                    onClick={function (e)
                                    {
                                        handleTournamentDelete(e, tournament.id);
                                    }}
                                    floated='right'
                                    content='Delete'
                                    color='red' />
                                <Label basic content={tournament.category} />
                            </Item.Extra>
                        </Item.Content>
                    </Item>
                ))}
            </Item.Group>
        </Segment>
    )
}