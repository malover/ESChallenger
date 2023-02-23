import { HubConnection } from "@microsoft/signalr";
import { HubConnectionBuilder } from "@microsoft/signalr/dist/esm/HubConnectionBuilder";
import { LogLevel } from "@microsoft/signalr/dist/esm/ILogger";
import { makeAutoObservable, runInAction } from "mobx";
import { ChatComment } from "../../models/comment";
import { store } from "./store";

export default class CommentStore
{
    comments: ChatComment[] = [];
    hubConnection: HubConnection | null = null;

    constructor()
    {
        makeAutoObservable(this);
    }

    createHubConnection = (tournamentId: string) =>
    {
        if (store.tournamentStore.selectedTournament)
        {
            this.hubConnection = new HubConnectionBuilder()
                .withUrl('http://localhost:5000/chat?tournamentId=' + tournamentId, {
                    accessTokenFactory: () => store.userStore.user?.token!
                })
                .withAutomaticReconnect()
                .configureLogging(LogLevel.Information)
                .build();
            this.hubConnection.start().catch(error => console.log('Error establishing the connection: ', error));

            this.hubConnection.on("LoadComments", (comments: ChatComment[]) =>
            {
                runInAction(() =>
                {
                    comments.forEach(comment =>
                    {
                        comment.createdAt = new Date(comment.createdAt + 'Z');
                    })
                    this.comments = comments;
                });
            });

            this.hubConnection.on('ReceiveComment', (comment: ChatComment) =>
            {
                runInAction(() =>
                {
                    comment.createdAt = new Date(comment.createdAt);
                    this.comments.unshift(comment);
                });
            })
        }
    }

    stopHubConnection = () =>
    {
        this.hubConnection?.stop().catch(error => console.log('Error stopping connection', error))
    }

    clearComments = () =>
    {
        this.comments = [];
        this.stopHubConnection();
    }

    addComment = async (values: any) =>
    {
        values.tournamentId = store.tournamentStore.selectedTournament?.id;

        console.log('Current user:' + store.userStore.user?.username + 'Values:' + values)

        try
        {
            await this.hubConnection?.invoke('SendComment', values);
        }
        catch (error)
        {
            console.log(error);
        }
    }
}