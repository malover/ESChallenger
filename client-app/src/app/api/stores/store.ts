import TournamentStore from "./tournamentStore";
import { createContext, useContext } from 'react';

interface Store
{
    tournamentStore: TournamentStore
}

export const store: Store = {
    tournamentStore: new TournamentStore()
}

export const StoreContext = createContext(store);

export function useStore()
{
    return useContext(StoreContext);
}