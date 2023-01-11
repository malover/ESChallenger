import React from "react";
import { Grid, GridColumn } from "semantic-ui-react";
import { Tournament } from "../../../app/models/tournament";
import TournamentDetails from "../details/TournamentDetails";
import TournamentForm from "../form/TournamentForm";
import TournamentList from "./TournamentList";

interface Props
{
    tournaments: Tournament[];
    selectedTournament: Tournament | undefined;
    selectTournament: (id: string) => void;
    handleCancelSelectTournament: () => void;
    editMode: boolean;
    openForm: (id: string) => void;
    closeForm: () => void;
    createOrEdit: (tournament: Tournament) => void;
    deleteTournament: (id: string) => void;
    submitting: boolean;
}


export default function TournamentDashboard({ tournaments, selectedTournament, selectTournament, handleCancelSelectTournament,
    editMode, openForm, closeForm, createOrEdit, deleteTournament, submitting }: Props)
{
    return (
        <Grid>
            <Grid.Column width='10'>
                <TournamentList
                    tournaments={tournaments}
                    selectTournament={selectTournament}
                    deleteTournament={deleteTournament}
                    cancelSelectTournament={handleCancelSelectTournament}
                    submitting={submitting}
                />
            </Grid.Column>
            <GridColumn width='6'>
                {selectedTournament && !editMode &&
                    <TournamentDetails tournament={selectedTournament}
                    handleCancelSelectTournament={handleCancelSelectTournament}
                    openForm={openForm}
                    />}
                {editMode &&
                    <TournamentForm closeForm={closeForm}
                        tournament={selectedTournament}
                        createOrEdit={createOrEdit}
                        submitting={submitting}
                    />}
            </GridColumn>
        </Grid>
    )
}