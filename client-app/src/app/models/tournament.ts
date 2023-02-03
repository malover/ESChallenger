import { Profile } from "./profile";

export interface Tournament
{
    id: string;
    title: string;
    date: Date | null;
    category: string;
    description: string;
    country: string;
    city: string;
    venue: string;
    prizePool: number | null;
    hostUsername?: string;
    isCancelled?: boolean;
    isGoing: boolean;
    isHost: boolean;
    host?: Profile;
    participators: Profile[]
}

export class Tournament implements Tournament
{
    constructor(init?: TournamentFormValues)
    {
        Object.assign(this, init);
    }
}

export class TournamentFormValues
{
    id?: string = undefined;
    title: string = '';
    category: string = '';
    description: string = '';
    date: Date | null = null;
    country: string = '';
    city: string = '';
    venue: string = '';
    prizePool: number | null = null;

    constructor(tournament?: TournamentFormValues)
    {
        if (tournament)
        {
            this.id = tournament.id;
            this.title = tournament.title;
            this.category = tournament.category;
            this.description = tournament.description;
            this.date = tournament.date;
            this.country = tournament.country;
            this.city = tournament.city;
            this.venue = tournament.venue;
            this.prizePool = tournament.prizePool;
        }
    }
}
