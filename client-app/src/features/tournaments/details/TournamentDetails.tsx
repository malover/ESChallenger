import { observer } from "mobx-react-lite";
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { Grid } from "semantic-ui-react";
import { useStore } from "../../../app/api/stores/store";
import LoadingComponent from "../../../app/layout/LoadingComponent";
import TournamentDetailedChat from "./TournamentDetailedChat";
import TournamentDetailedHeader from "./TournamentDetailedHeader";
import TournamentDetailedInfo from "./TournamentDetailedInfo";
import TournamentDetailedSidebar from "./TournamentDetailedSidebar";


export default observer(function TournamentDetails()
{
    const { tournamentStore } = useStore();
    const { selectedTournament: tournament, loadTournament, loadingInitial } = tournamentStore;
    const { id } = useParams();

    useEffect(() =>
    {
        if (id) loadTournament(id);
    }, [id, loadTournament])

    if (loadingInitial || !tournament) return <LoadingComponent />;

    return (
        <Grid>
            <Grid.Column width={10}>
                <TournamentDetailedHeader tournament={tournament} />
                <TournamentDetailedInfo tournament={tournament}/>
                <TournamentDetailedChat />
            </Grid.Column>
            <Grid.Column width={6}>
                <TournamentDetailedSidebar tournament={tournament} />
            </Grid.Column>
        </Grid>
    )
})