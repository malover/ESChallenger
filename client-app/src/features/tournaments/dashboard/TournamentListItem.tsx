import { format } from "date-fns";
import { Link } from "react-router-dom";
import { Button, Icon, Item, Label, Segment, SegmentGroup } from "semantic-ui-react";
import { Tournament } from "../../../app/models/tournament";
import TournamentListItemParticipator from "./TournamentListItemParticipator";

interface Props
{
    tournament: Tournament
}

export default function TournamentListItem({ tournament }: Props)
{
    return (
        <SegmentGroup>
            <Segment>
                {tournament.isCancelled && <Label attached="top" color="red" content="Cancelled" style={{ textAlign: "center" }} />}
                <Item.Group>
                    <Item>
                        <Item.Image style={{marginBottom: 5}} size="tiny" circular src='/assets/user.png ' />
                        <Item.Content>
                            <Item.Header as={Link} to={`/tournaments/${tournament.id}`}>
                                {tournament.title}
                            </Item.Header>
                            <Item.Description>Hosted by {tournament.host?.displayName}</Item.Description>
                            {tournament.isHost && (
                                <Item.Description>
                                    <Label basic color="orange">
                                        You are hosting this tournament
                                    </Label>
                                </Item.Description>
                            )}
                            {tournament.isGoing && !tournament.isHost && (
                                <Item.Description>
                                    <Label basic color="green">
                                        You are going to this tournament
                                    </Label>
                                </Item.Description>
                            )}
                        </Item.Content>
                    </Item>
                </Item.Group>
            </Segment>
            <Segment>
                <span>
                    <Icon name='clock' /> {format(tournament.date!, 'dd MMMM yyyy h:mm aa')}
                    <Icon name='marker' /> {tournament.venue}
                </span>
            </Segment>
            <Segment secondary>
                <TournamentListItemParticipator participators={tournament.participators!} />
            </Segment>
            <Segment clearing>
                <span>
                    {tournament.description}
                </span>
                <Button
                    as={Link}
                    to={`/tournaments/${tournament.id}`}
                    color='teal'
                    floated='right'
                    content='View'
                />
            </Segment>
        </SegmentGroup>
    )
}