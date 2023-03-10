import { createBrowserRouter, Navigate, RouteObject } from "react-router-dom";
import App from "../layout/App";
import TournamentDashboard from "../../features/tournaments/dashboard/TournamentDashboard";
import TournamentForm from "../../features/tournaments/form/TournamentForm";
import HomePage from "../../features/home/HomePage";
import TournamentDetails from "../../features/tournaments/details/TournamentDetails";
import TestErrors from "../../features/Errors/TestError";
import NotFound from "../../features/Errors/NotFound";
import ServerError from "../../features/Errors/ServerError";
import LoginForm from "../../features/users/LoginForm";
import ProfilePage from "../../features/profiles/ProfilePage";
import RequireAuth from "./RequireAuth";

export const routes: RouteObject[] = [
    {
        path: '/',
        element: <App />,
        children: [
            {
                element: <RequireAuth />, children: [
                    { path: 'tournaments', element: <TournamentDashboard /> },
                    { path: 'tournaments/:id', element: <TournamentDetails /> },
                    { path: 'createTournament', element: <TournamentForm key='create' /> },
                    { path: 'manage/:id', element: <TournamentForm key='manage' /> },
                    { path: 'profiles/:username', element: <ProfilePage /> },
                    { path: 'errors', element: <TestErrors /> },
                ]
            },
            { path: 'not-found', element: <NotFound /> },
            { path: '/server-error', element: <ServerError /> },
            { path: '*', element: <Navigate replace to='/not-found' /> }
        ]
    }
]

export const router = createBrowserRouter(routes);