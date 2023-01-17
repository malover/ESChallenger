
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
}
