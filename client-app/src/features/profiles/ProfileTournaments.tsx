import { format } from "date-fns";
import { observer } from "mobx-react-lite";
import { useEffect } from "react";
import { Link } from "react-router-dom";
import { SyntheticEvent } from "react-toastify/dist/utils";
import { Card, Grid, Header, Image, Tab, TabProps } from "semantic-ui-react";
import { useStore } from "../../app/api/stores/store";
import { UserTournament } from "../../app/models/profile";

const panes = [
    { menuItem: 'Future events', pane: { key: 'future' } },
    { menuItem: 'Past events', pane: { key: 'past' } },
    { menuItem: 'Hosting', pane: { key: 'hosting' } },
]

export default observer(function ProfileTournaments()
{
    const { profileStore } = useStore();
    const { loadUserTournaments, profile, loadingTournaments, userTournaments } = profileStore;

    useEffect(() =>
    {
        loadUserTournaments(profile!.userName);
    }, [loadUserTournaments, profile])

    const handleTabChange = (e: SyntheticEvent, data: TabProps) =>
    {
        loadUserTournaments(profile!.userName, panes[data.activeIndex as number].pane.key)
    }

    return (
        <Tab.Pane loading={loadingTournaments}>
            <Grid>
                <Grid.Column width={16}>
                    <Header floated='left' icon='calendar'
                        content={'Tournaments'} />
                </Grid.Column>
                <Grid.Column width={16}>
                    <Tab
                        panes={panes}
                        menu={{ secondary: true, pointing: true }}
                        onTabChange={(e, data) => handleTabChange(e as unknown as SyntheticEvent, data)}
                    />
                    <br />
                    <Card.Group itemsPerRow={4}>
                        {userTournaments.map((tournament: UserTournament) => (
                            <Card
                                as={Link}
                                to={`/tournaments/${tournament.id}`}
                                key={tournament.id}
                            >
                                <Image
                                    src={`/assets/categories/${tournament.category}.jpg`}
                                    style={{
                                        minHeight: 100, objectFit:
                                            'cover'
                                    }}
                                />
                                <Card.Content>
                                    <Card.Header
                                        textAlign='center'>{tournament.title}</Card.Header>
                                    <Card.Meta textAlign='center'>
                                        <div>{format(new Date(tournament.date),
                                            'do LLL')}</div>
                                        <div>{format(new Date(tournament.date),
                                            'h:mm a')}</div>
                                    </Card.Meta>
                                </Card.Content>
                            </Card>
                        ))}
                    </Card.Group>
                </Grid.Column>
            </Grid>
        </Tab.Pane>
    );
});