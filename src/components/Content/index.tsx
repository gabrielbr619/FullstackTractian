import {
    BrowserRouter as Router,
    Switch,
    Route,
} from "react-router-dom";

import Home from "./Home";

import Branch from './Branch/show';
import BranchCreate from './Branch/create';

import Companies from './Companies/show';
import CompanyCreate from './Companies/create';

import Active from "./Active/show";
import ActiveCreate from "./Active/create";

import User from "./User/show";
import UserCreate from "./User/create";



export default function Content() {
    return (
            <Switch>

                <Route exact path="/"><Home/></Route>

                {/* Company Routes */}
                <Route exact path="/companies"><Companies/></Route>
                <Route exact path="/company/create"><CompanyCreate/></Route>

                {/* Branch Routes */}
                <Route exact path="/branch"><Branch/></Route>
                <Route exact path="/branch/create"><BranchCreate/></Route>

                {/* Active Routes */}
                <Route exact path="/active"><Active/></Route>
                <Route exact path="/active/create"><ActiveCreate/></Route>

                {/* User Routes */}
                <Route exact path="/users"><User/></Route>
                <Route exact path="/user/create"><UserCreate/></Route>
            </Switch>
    )
}