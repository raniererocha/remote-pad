import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Home from "./pages/Home";
import HostRoom from "./pages/HostRoom";
import ClientRoom from "./pages/ClientRoom";
export default function RouterComponent() {
    const routes = createBrowserRouter([
        {
            path: "/",
            element: <Home />,
        },
        {
            path: "/host/",
            element: <HostRoom />,
        },
        {
            path: "/connect/:room",
            element: <ClientRoom />,
        },
    ]);
    return <RouterProvider router={routes} />;
}
