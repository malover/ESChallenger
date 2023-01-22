import { format } from "date-fns";
import { Link } from "react-router-dom";
import { Button, Icon, Item, Segment, SegmentGroup } from "semantic-ui-react";
import { Tournament } from "../../../app/models/tournament";

interface Props
{
    tournament: Tournament
}

export default function TournamentListItem({ tournament }: Props)
{
    return (
        <SegmentGroup>
            <Segment>
                <Item.Group>
                    <Item>
                        <Item.Image size="tiny" circular src='/assets/user.png ' />
                        <Item.Content>
                            <Item.Header as={Link} to={`/tournaments/${tournament.id}`}>
                                {tournament.title}
                            </Item.Header>
                            <Item.Description>Hosted by Bob</Item.Description>
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
                Teams go here
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