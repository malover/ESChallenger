import { observer } from "mobx-react-lite";
import { useEffect } from "react";
import { Grid, GridColumn } from "semantic-ui-react";
import { useStore } from "../../../app/api/stores/store";
import LoadingComponent from "../../../app/layout/LoadingComponent";
import TournamentFilters from "./TournamentFilters";
import TournamentList from "./TournamentList";

export default observer(function TournamentDashboard()
{

    const { tournamentStore } = useStore();
    const { loadTournaments, tournamentRegistry } = tournamentStore;

    useEffect(() =>
    {
        if (tournamentRegistry.size <= 1) loadTournaments();
    }, [loadTournaments, tournamentRegistry.size])

    if (tournamentStore.loadingInitial) return <LoadingComponent content='Loading app' />

    return (
        <Grid>
            <Grid.Column width='10'>
                <TournamentList />
            </Grid.Column>
            <GridColumn width='6'>
                <TournamentFilters />
            </GridColumn>
        </Grid>
    )
})