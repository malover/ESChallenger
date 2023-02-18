import TournamentStore from "./tournamentStore";
import { createContext, useContext } from 'react';
import CommonStore from "./CommandStore";
import UserStore from "./UserStore";
import ModalStore from "./modalStore";
import ProfileStore from "./profileStore";
import CommentStore from "./CommentStore";

interface Store
{
    tournamentStore: TournamentStore;
    commonStore: CommonStore;
    userStore: UserStore;
    modalStore: ModalStore;
    profileStore: ProfileStore;
    commentStore: CommentStore;
}

export const store: Store = {
    tournamentStore: new TournamentStore(),
    commonStore: new CommonStore(),
    userStore: new UserStore(),
    modalStore: new ModalStore(),
    profileStore: new ProfileStore(),
    commentStore: new CommentStore()
}

export const StoreContext = createContext(store);

export function useStore()
{
    return useContext(StoreContext);
}