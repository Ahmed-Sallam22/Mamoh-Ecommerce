// routes
import { paths } from 'src/routes/paths';

// API
// ----------------------------------------------------------------------

export const HOST_API = 'https://tapis.ma-moh.com'
export const HOST_API2 = 'https://delivery.ma-moh.com'
export const ASSETS_API = process.env.REACT_APP_ASSETS_API;

export const MAPBOX_API = process.env.REACT_APP_MAPBOX_API;

// ROOT PATH AFTER LOGIN SUCCESSFUL
export const PATH_AFTER_LOGIN = paths.dashboard.root; // as '/dashboard'
