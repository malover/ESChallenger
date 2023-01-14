import { createBrowserRouter, RouteObject } from "react-router-dom";
import App from "../layout/App";
import TournamentDashboard from "../../features/tournaments/dashboard/TournamentDashboard";
import TournamentForm from "../../features/tournaments/form/TournamentForm";
import HomePage from "../../features/home/HomePage";
import TournamentDetails from "../../features/tournaments/details/TournamentDetails";

export const routes: RouteObject[] = [
    {
        path: '/',
        element: <App />,
        children: [
            { path: 'tournaments', element: <TournamentDashboard /> },
            { path: 'tournaments/:id', element: <TournamentDetails /> },
            { path: 'createTournament', element: <TournamentForm key='create' /> },
            { path: 'manage/:id', element: <TournamentForm key='manage' /> },
        ]
    }
]

export const router = createBrowserRouter(routes);