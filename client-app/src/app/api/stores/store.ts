import TournamentStore from "./tournamentStore";
import { createContext, useContext } from 'react';
import CommonStore from "./CommandStore";
import UserStore from "./UserStore";
import ModalStore from "./modalStore";

interface Store
{
    tournamentStore: TournamentStore;
    commonStore: CommonStore;
    userStore: UserStore;
    modalStore: ModalStore;
}

export const store: Store = {
    tournamentStore: new TournamentStore(),
    commonStore: new CommonStore(),
    userStore: new UserStore(),
    modalStore: new ModalStore()
}

export const StoreContext = createContext(store);

export function useStore()
{
    return useContext(StoreContext);
}