import axios, { AxiosError, AxiosResponse } from 'axios';
import { toast } from "react-toastify";
import { PaginatedResult } from '../models/paginations';
import { Photo, Profile, UserTournament } from '../models/profile';
import { Tournament, TournamentFormValues } from "../models/tournament";
import { User, UserFormValues } from "../models/user";
import { router } from "../router/Routes";
import { store } from "./stores/store";

const sleep = (delay: number) =>
{
    return new Promise((resolve) =>
    {
        setTimeout(resolve, delay)
    })
}

axios.defaults.baseURL = process.env.REACT_APP_API_URL;

axios.interceptors.response.use(async response =>
{
    if(process.env.NODE_ENV === 'development') await sleep(1000);
    const pagination = response.headers['pagination'];
    if (pagination)
    {
        response.data = new PaginatedResult(response.data, JSON.parse(pagination));
        return response as AxiosResponse<PaginatedResult<any>>
    }
    return response;
}, (error: AxiosError) =>
{
    const { data, status, config } = error.response as AxiosResponse;
    switch (status)
    {
        case 400:
            if (config.method === 'get' && data.errors.hasOwnProperty('id'))
            {
                router.navigate('/not-found');
            }
            if (data.errors)
            {
                const modalStateErrors = [];
                for (const key in data.errors)
                {
                    if (data.errors[key])
                    {
                        modalStateErrors.push(data.errors[key])
                    }
                }
                throw modalStateErrors.flat();
            }
            else
            {
                toast.error(data);
            }
            break;
        case 401:
            toast.error('unauthorized')
            break;
        case 403:
            toast.error('forbidden')
            break;
        case 404:
            router.navigate('/not-found');
            break;
        case 500:
            store.commonStore.setServerError(data);
            router.navigate('/server-error')
            break;
    }
    return Promise.reject(error);
})

const responseBody = <T>(response: AxiosResponse<T>) => response.data;

axios.interceptors.request.use(config =>
{
    const token = store.commonStore.token;
    if (token && config.headers) config.headers.Authorization = `Bearer ${token}`;
    return config;
})

const request = {
    get: <T>(url: string) => axios.get<T>(url).then(responseBody),
    post: <T>(url: string, body: object) => axios.post<T>(url, body).then(responseBody),
    put: <T>(url: string, body: object) => axios.put<T>(url, body).then(responseBody),
    del: <T>(url: string) => axios.delete<T>(url).then(responseBody),
}

const Tournaments = {
    list: (params: URLSearchParams) => axios.get<PaginatedResult<Tournament[]>>('/tournaments', { params }).then(responseBody),
    details: (id: string) => request.get<Tournament>(`/tournaments/${id}`),
    create: (tournament: TournamentFormValues) => request.post<void>('/tournaments', tournament),
    update: (tournament: TournamentFormValues) => request.put<void>(`/tournaments/${tournament.id}`, tournament),
    delete: (id: string) => request.del<void>(`/tournaments/${id}`),
    participate: (id: string) => request.post<void>(`/tournaments/${id}/participate`, {})
}

const Account = {
    current: () => request.get<User>('/account'),
    login: (user: UserFormValues) => request.post<User>('/account/login', user),
    register: (user: UserFormValues) => request.post<User>('/account/register', user)
}

const Profiles = {
    get: (username: string) => request.get<Profile>(`/profiles/${username}`),
    uploadPhoto: (file: Blob) =>
    {
        let formData = new FormData();
        formData.append('File', file);
        return axios.post<Photo>('photos', formData, {
            headers: { 'Content-type': 'multipart/form-data' }
        })
    },
    setMainPhoto: (id: string) => request.post(`/photos/${id}/setMain`, {}),
    deletePhoto: (id: string) => request.del(`/photos/${id}`),
    updateProfile: (profile: Partial<Profile>) => request.put(`/profiles`, profile),
    updateFollowing: (username: string) => request.post(`/follow/${username}`, {}),
    listFollowings: (username: string, predicate: string) => request.get<Profile[]>(`/follow/${username}?predicate=${predicate}`),
    listTournaments: (username: string, predicate: string) =>
        request.get<UserTournament[]>(`/profiles/${username}/tournaments?predicate=${predicate}`)
}

const agent = {
    Tournaments,
    Account,
    Profiles
}

export default agent;