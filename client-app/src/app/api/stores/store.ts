import TournamentStore from "./tournamentStore";
import { createContext, useContext } from 'react';
import CommonStore from "./CommandStore";

interface Store
{
    tournamentStore: TournamentStore;
    commonStore: CommonStore;
}

export const store: Store = {
    tournamentStore: new TournamentStore(),
    commonStore: new CommonStore()
}

export const StoreContext = createContext(store);

export function useStore()
{
    return useContext(StoreContext);
}