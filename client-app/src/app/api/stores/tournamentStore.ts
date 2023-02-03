import { makeAutoObservable, runInAction } from "mobx";
import { Tournament, TournamentFormValues } from "../../models/tournament";
import agent from "../Agent";
import { v4 as uuid } from 'uuid';
import { format } from "date-fns";
import { store } from "./store";
import { Profile } from "../../models/profile";

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
            a.date!.getTime() - b.date!.getTime());
    }

    get groupedTournaments()
    {
        return Object.entries(
            this.tournamentsByDate.reduce((tournaments, tournament) =>
            {
                const date = format(tournament.date!, 'dd MMM yyyy');
                tournaments[date] = tournaments[date] ? [...tournaments[date], tournament] : [tournament];
                return tournaments;
            }, {} as { [key: string]: Tournament[] })
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

    createTournament = async (tournament: TournamentFormValues) =>
    {
        const user = store.userStore.user;
        const participator = new Profile(user!);
        try
        {
            await agent.Tournaments.create(tournament);
            const newTournament = new Tournament(tournament);
            newTournament.hostUsername = user!.username;
            newTournament.participators = [participator];
            this.setTournament(newTournament);

            runInAction(() =>
            {
                this.selectedTournament = newTournament;
            })
        } catch (error)
        {
            console.log(error);
        }
    }

    updateTournament = async (tournament: TournamentFormValues) =>
    {
        try
        {
            await agent.Tournaments.update(tournament);
            runInAction(() =>
            {
                if (tournament.id)
                {
                    let updatedTournament = { ...this.getTournament(tournament.id), ...tournament }
                    this.tournamentRegistry.set(tournament.id, updatedTournament as Tournament);
                    this.selectedTournament = updatedTournament as Tournament;
                }
            })
        } catch (error)
        {
            console.log(error);
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

    updateParticipation = async () =>
    {
        const user = store.userStore.user;
        this.loading = true;

        try
        {
            await agent.Tournaments.participate(this.selectedTournament!.id);
            runInAction(() =>
            {
                if (this.selectedTournament?.isGoing)
                {
                    this.selectedTournament.participators = this.selectedTournament.participators?.filter(a => a.userName !== user?.username);
                    this.selectedTournament.isGoing = false;
                } else
                {
                    const participator = new Profile(user!);
                    this.selectedTournament?.participators?.push(participator);
                    this.selectedTournament!.isGoing = true;
                }
                this.tournamentRegistry.set(this.selectedTournament!.id, this.selectedTournament!)
            })
        } catch (error)
        {
            console.log(error);
        }
        finally
        {
            runInAction(() => this.loading = false);
        }
    }

    cancelTournamentToggle = async () =>
    {
        this.loading = true;
        try
        {
            await agent.Tournaments.participate(this.selectedTournament!.id);
            runInAction(() =>
            {
                this.selectedTournament!.isCancelled = !this.selectedTournament!.isCancelled;
                this.tournamentRegistry.set(this.selectedTournament!.id, this.selectedTournament!);
            });
        } catch (error)
        {
            console.log(error);
        } finally
        {
            runInAction(() =>
                this.loading = false
            );
        }
    }

    private getTournament = (id: string) =>
    {
        return this.tournamentRegistry.get(id);
    }

    private setTournament = (tournament: Tournament) =>
    {
        const user = store.userStore.user;
        if (user)
        {
            tournament.isGoing = tournament.participators!.some(
                a => a.userName === user.username
            )
            tournament.isHost = tournament.hostUsername === user.username;
            tournament.host = tournament.participators?.find(x => x.userName === tournament.hostUsername);
        }
        tournament.date = new Date(tournament.date!);
        this.tournamentRegistry.set(tournament.id, tournament);
    }
}