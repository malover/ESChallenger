import { makeAutoObservable, runInAction } from "mobx";
import { Tournament } from "../../models/tournament";
import agent from "../Agent";
import { v4 as uuid } from 'uuid';

export default class TournamentStore
{
    tournamentRegistry = new Map<string, Tournament>();
    selectedTournament: Tournament | undefined = undefined;
    editMode = false;
    loading = false;
    loadingInitial = false;

    constructor()
    {
        makeAutoObservable(this)
    }

    get tournamentsByDate()
    {
        return Array.from(this.tournamentRegistry.values()).sort((a, b) =>
            Date.parse(a.date) - Date.parse(b.date));
    }

    get groupedTournaments()
    {
        return Object.entries(
            this.tournamentsByDate.reduce((tournaments, tournament) =>
            {
                const date = tournament.date;
                tournaments[date] = tournaments[date] ? [...tournaments[date], tournament] : [tournament];
                return tournaments;
            }, {} as {[key: string] : Tournament[]})
        )
    }

    loadTournaments = async () =>
    {
        this.setLoadingInitial(true);
        try
        {
            const tournaments = await agent.Tournaments.list();
            tournaments.forEach(tournament =>
            {
                this.setTournament(tournament);
            })
            this.setLoadingInitial(false);

        } catch (error)
        {
            console.log(error);
            this.setLoadingInitial(false);
        }
    }

    loadTournament = async (id: string) =>
    {
        let tournament = this.getTournament(id);
        if (tournament)
        {
            this.selectedTournament = tournament;
            return tournament;
        }
        else
        {
            this.setLoadingInitial(true);
            try
            {
                tournament = await agent.Tournaments.details(id);
                this.setTournament(tournament);
                runInAction(() =>
                {
                    this.selectedTournament = tournament;
                });
                this.setLoadingInitial(false);
                return tournament;
            } catch (error)
            {
                console.log(error);
                this.setLoadingInitial(false);
            }
        }
    }

    setLoadingInitial = (state: boolean) =>
    {
        this.loadingInitial = state;
    }

    createTournament = async (tournament: Tournament) =>
    {
        this.loading = true;
        tournament.id = uuid();

        try
        {
            await agent.Tournaments.create(tournament);
            runInAction(() =>
            {
                this.tournamentRegistry.set(tournament.id, tournament);
                this.selectedTournament = tournament;
                this.editMode = false;
                this.loading = false;
            })
        } catch (error)
        {
            runInAction(() =>
            {
                this.loading = false;
            })
            console.log(error);
        }
    }

    updateTournament = async (tournament: Tournament) =>
    {
        this.loading = true;
        try
        {
            await agent.Tournaments.update(tournament);
            runInAction(() =>
            {
                this.tournamentRegistry.set(tournament.id, tournament);
                this.selectedTournament = tournament;
                this.editMode = false;
                this.loading = false;
            })
        } catch (error)
        {
            console.log(error);
            runInAction(() =>
            {
                this.loading = false;
            })
        }
    }

    deleteTournament = async (id: string) =>
    {
        this.loading = true;
        try
        {
            await agent.Tournaments.delete(id);
            runInAction(() =>
            {
                this.tournamentRegistry.delete(id);
                this.loading = false;
            })
        } catch (error)
        {
            console.log(error);
            runInAction(() =>
            {
                this.loading = false;
            })
        }
    }

    private getTournament = (id: string) =>
    {
        return this.tournamentRegistry.get(id);
    }

    private setTournament = (tournament: Tournament) =>
    {
        tournament.date = tournament.date.split('T')[0];
        this.tournamentRegistry.set(tournament.id, tournament);
    }
}