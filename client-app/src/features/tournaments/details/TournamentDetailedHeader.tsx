import { format } from 'date-fns';
import { observer } from 'mobx-react-lite';
import React from 'react'
import { Link } from 'react-router-dom';
import { Button, Header, Item, Segment, Image, Label } from 'semantic-ui-react'
import { useStore } from '../../../app/api/stores/store';
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

    const { tournamentStore: { updateParticipation, loading, cancelTournamentToggle } } = useStore();

    return (
        <Segment.Group>
            <Segment basic attached='top' style={{ padding: '0' }}>
                {tournament.isCancelled &&
                    <Label style={{ position: 'absolute', zIndex: 1000, left: -14, top: 20 }}
                        ribbon color='red' content='Cancelled'>
                    </Label>
                }
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
                                    Hosted by <strong><Link to={`/profiles/${tournament.host?.userName}`}>{tournament.host?.displayName}</Link></strong>
                                </p>
                            </Item.Content>
                        </Item>
                    </Item.Group>
                </Segment>
            </Segment>
            <Segment clearing attached='bottom'>
                {
                    tournament.isHost ? (
                        <>
                            <Button
                                color={tournament.isCancelled ? 'green' : 'red'}
                                floate='left'
                                basic
                                content={tournament.isCancelled ? 'Re-activate tournament' : 'Cancel tournament'}
                                onClick={cancelTournamentToggle}
                                loading={loading}
                            />
                            <Button
                                disabled={tournament.isCancelled}
                                as={Link}
                                to={`/manage/${tournament.id}`}
                                color="orange"
                                floated='right'
                            >
                                Manage tournament
                            </Button>
                        </>
                    ) : tournament.isGoing ? (
                        <Button
                            loading={loading}
                            onClick={updateParticipation}
                        >
                            Cancel participation
                        </Button>
                    ) : (
                        <Button
                            disabled={tournament.isCancelled}
                            loading={loading}
                            onClick={updateParticipation}
                            color="teal"
                        >
                            Join tournament
                        </Button>
                    )
                }
            </Segment>
        </Segment.Group>
    )
})

