import React from "react";
import { Button, ButtonGroup, Card, Image } from "semantic-ui-react";
import { Tournament } from "../../../app/models/tournament";

interface Props
{
    tournament: Tournament;
    handleCancelSelectTournament: () => void;
    openForm: (id: string) => void;
}

export default function TournamentDetails({ tournament, handleCancelSelectTournament, openForm }: Props)
{
    return (
        <Card fluid>
            <Image src={`/assets/categories/${tournament.category}.jpg`} />
            <Card.Content>
                <Card.Header>{tournament.title}</Card.Header>
                <Card.Meta>
                    <span>{tournament.date}</span>
                </Card.Meta>
                <Card.Description>
                    {tournament.description}
                </Card.Description>
            </Card.Content>
            <Card.Content extra>
                <ButtonGroup widths='2'>
                    <Button onClick={() => openForm(tournament.id) } basic color="blue" content='Edit'/>
                    <Button onClick={handleCancelSelectTournament} basic color="grey" content='Cancel'/>
                </ButtonGroup>
            </Card.Content>
        </Card>
    )
}