import { format } from 'date-fns';
import { observer } from 'mobx-react-lite';
import React from 'react'
import { Link } from 'react-router-dom';
import { Button, Header, Item, Segment, Image } from 'semantic-ui-react'
import { Tournament } from "../../../app/models/tournament";

const tournamentImageStyle = {
    filter: 'brightness(30%)'
};

const tournamentImageTextStyle = {
    position: 'absolute',
    bottom: '5%',
    left: '5%',
    width: '100%',
    height: 'auto',
    color: 'white'
};

interface Props
{
    tournament: Tournament
}

export default observer(function TournamentDetailedHeader({ tournament }: Props)
{
    return (
        <Segment.Group>
            <Segment basic attached='top' style={{ padding: '0' }}>
                <Image src={`/assets/categories/${tournament.category}.jpg`} fluid style={tournamentImageStyle} />
                <Segment style={tournamentImageTextStyle} basic>
                    <Item.Group>
                        <Item>
                            <Item.Content>
                                <Header
                                    size='huge'
                                    content={tournament.title}
                                    style={{ color: 'white' }}
                                />
                                <p>{format(tournament.date!, 'dd MMM yyyy')}</p>
                                <p>
                                    Hosted by <strong>Bob</strong>
                                </p>
                            </Item.Content>
                        </Item>
                    </Item.Group>
                </Segment>
            </Segment>
            <Segment clearing attached='bottom'>
                <Button color='teal'>Join Activity</Button>
                <Button>Cancel attendance</Button>
                <Button color='orange' floated='right' as={Link} to={`/manage/${tournament.id}`}>
                    Manage Event
                </Button>
            </Segment>
        </Segment.Group>
    )
})

