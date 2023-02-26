import { observer } from "mobx-react-lite";
import { useEffect, useState } from "react";
import InfiniteScroll from "react-infinite-scroller";
import { Grid, GridColumn, Loader } from "semantic-ui-react";
import { useStore } from "../../../app/api/stores/store";
import { PagingParams } from "../../../app/models/paginations";
import TournamentFilters from "./TournamentFilters";
import TournamentList from "./TournamentList";
import TournamentListItemPlaceholder from "./TournamentListItemPlaceholder";

export default observer(function TournamentDashboard()
{

    const { tournamentStore } = useStore();
    const { loadTournaments, tournamentRegistry, setPagingParams, pagination } = tournamentStore;
    const [loadingNext, setLoadingNext] = useState(false);

    function handleGetNext()
    {
        setLoadingNext(true);
        setPagingParams(new PagingParams(pagination!.currentPage + 1));
        loadTournaments().then(() => setLoadingNext(false));
    }

    useEffect(() =>
    {
        if (tournamentRegistry.size <= 1) loadTournaments();
    }, [loadTournaments, tournamentRegistry.size])

    return (
        <Grid>
            <Grid.Column width='10'>
                {tournamentStore.loadingInitial && !loadingNext ? (
                    <>
                        <TournamentListItemPlaceholder />
                        <TournamentListItemPlaceholder />
                    </>
                ) : (
                    <InfiniteScroll
                        pageStart={0}
                        loadMore={handleGetNext}
                        hasMore={!loadingNext && !!pagination && pagination.currentPage < pagination.totalPages}
                        initialLoad={false}
                    >
                        <TournamentList />
                    </InfiniteScroll>
                )}
            </Grid.Column>
            <GridColumn width='6'>
                <TournamentFilters />
            </GridColumn>
            <Grid.Column width={10}>
                <Loader active={loadingNext} />
            </Grid.Column>
        </Grid>
    )
})