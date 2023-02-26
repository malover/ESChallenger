import { makeAutoObservable, reaction, runInAction } from "mobx";
import { Tournament, TournamentFormValues } from "../../models/tournament";
import agent from "../Agent";
import { format } from "date-fns";
import { store } from "./store";
import { Profile } from "../../models/profile";
import { Pagination, PagingParams } from "../../models/paginations";


export default class TournamentStore
{
    tournamentRegistry = new Map<string, Tournament>();
    selectedTournament: Tournament | undefined = undefined;
    editMode = false;
    loading = false;
    loadingInitial = false;
    pagination: Pagination | null = null;
    pagingParams = new PagingParams();
    predicate = new Map().set('all', true);

    constructor()
    {
        makeAutoObservable(this);

        reaction(
            () => this.predicate.keys(),
            () =>
            {
                this.pagingParams = new PagingParams();
                this.tournamentRegistry.clear();
                this.loadTournaments();
            }
        )
    }

    setPagingParams = (pagingParams: PagingParams) =>
    {
        this.pagingParams = pagingParams;
    }

    setPredicate = (predicate: string, value: string | Date) =>
    {
        const resetPredicate = () =>
        {
            this.predicate.forEach((value, key) =>
            {
                if (key !== 'startDay') this.predicate.delete(key);
            })
        }

        switch (predicate)
        {
            case 'all':
                resetPredicate();
                this.predicate.set('all', true);
                break;
            case 'isGoing':
                resetPredicate();
                this.predicate.set('isGoing', true);
                break;
            case 'isHosting':
                resetPredicate();
                this.predicate.set('isHosting', true);
                break;
            case 'startDate':
                this.predicate.delete('startDate');
                this.predicate.set('startDate', value);
        }
    }

    get axiosParams()
    {
        const params = new URLSearchParams();
        params.append('pageNumber', this.pagingParams.pageNumber.toString());
        params.append('pageSize', this.pagingParams.pageSize.toString());
        this.predicate.forEach((value, key) =>
        {
            if (key === 'startDate')
            {
                params.append(key, (value as Date).toISOString())
            } else
            {
                params.append(key, value);
            }
        })
        return params;
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
            const result = await agent.Tournaments.list(this.axiosParams);
            result.data.forEach(tournament =>
            {
                this.setTournament(tournament);
            })
            this.setPagination(result.pagination);
            this.setLoadingInitial(false);

        } catch (error)
        {
            console.log(error);
            this.setLoadingInitial(false);
        }
    }

    setPagination = (pagination: Pagination) =>
    {
        this.pagination = pagination;
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

    clearSelectedTournament = () =>
    {
        this.selectedTournament = undefined;
    }

    updateParticipatorFollowing = (username: string) =>
    {
        this.tournamentRegistry.forEach(tournament =>
        {
            tournament.participators.forEach(participator =>
            {
                if (participator.userName === username)
                {
                    participator.following ? participator.followersCount-- : participator.followersCount++;
                    participator.following = !participator.following;
                }
            })
        })
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