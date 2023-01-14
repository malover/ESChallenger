import { observer } from "mobx-react-lite";
import { Fragment } from "react";
import { Header } from "semantic-ui-react";
import { useStore } from "../../../app/api/stores/store";
import TournamentListItem from "./TournamentListItem";


export default observer(function TournamentList()
{

    const { tournamentStore } = useStore();
    const { groupedTournaments } = tournamentStore;

    return (
        <>
            {groupedTournaments.map(([group, tournaments]) => (
                <Fragment key={group}>
                    <Header sub color='teal'>
                        {group}
                    </Header>
                    {tournaments.map(tournament => (
                        <TournamentListItem key={tournament.id} tournament={tournament} />
                    ))}
                </Fragment>
            ))}
        </>
    )
})