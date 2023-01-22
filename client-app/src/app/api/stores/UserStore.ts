import { makeAutoObservable, runInAction } from "mobx";
import { User, UserFormValues } from "../../models/user";
import { router } from "../../router/Routes";
import agent from "../Agent";
import { store } from "./store";

export default class UserStore
{
    user: User | null = null;

    constructor()
    {
        makeAutoObservable(this)
    }

    get isLoggedIn()
    {
        return !!this.user;
    }

    register = async (creds: UserFormValues) =>
    {
        try
        {
            const user = await agent.Account.register(creds);
            store.commonStore.setToken(user.token);
            runInAction(() => this.user = user);
            router.navigate('/tournaments');
            store.modalStore.closeModal();
        }
        catch (error)
        {
            throw error;
        }
    }

    login = async (creds: UserFormValues) =>
    {
        try
        {
            const user = await agent.Account.login(creds);
            store.commonStore.setToken(user.token);
            runInAction(() => this.user = user);
            router.navigate('/tournaments');
            store.modalStore.closeModal();
        }
        catch (error)
        {
            throw error;
        }
    }

    logout = () =>
    {
        store.commonStore.setToken(null);
        this.user = null;
        router.navigate('/');
    }

    getUser = async () =>
    {
        try
        {
            const user = await agent.Account.current();
            runInAction(() => this.user = user);
        }
        catch (error)
        {
            console.log(error);
        }
    }
} 