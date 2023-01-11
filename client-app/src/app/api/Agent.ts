import axios, { AxiosResponse } from "axios";
import { Tournament } from "../models/tournament";

const sleep = (delay: number) =>
{
    return new Promise((resolve) =>
    {
        setTimeout(resolve, delay)
    })
}

axios.defaults.baseURL = 'http://localhost:5000/api';

axios.interceptors.response.use(async response =>
{
    try
    {
        await sleep(1000);
        return response;
    } catch (error)
    {
        console.log(error);
        return await Promise.reject(error);
    }
})

const responseBody = <T>(response: AxiosResponse<T>) => response.data;

const request = {
    get: <T>(url: string) => axios.get<T>(url).then(responseBody),
    post: <T>(url: string, body: object) => axios.post<T>(url, body).then(responseBody),
    put: <T>(url: string, body: object) => axios.put<T>(url, body).then(responseBody),
    del: <T>(url: string) => axios.delete<T>(url).then(responseBody),
}

const Tournaments = {
    list: () => request.get<Tournament[]>('/tournaments'),
    details: (id: string) => request.get<Tournament>(`/tournaments/${id}`),
    create: (tournament: Tournament) => axios.post<void>('/tournaments', tournament),
    update: (tournament: Tournament) => axios.put<void>(`/tournaments/${tournament.id}`, tournament),
    delete: (id: string) => axios.delete<void>(`/tournaments/${id}`)
}

const agent = {
    Tournaments
}

export default agent;