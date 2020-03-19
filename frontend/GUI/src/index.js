import 'bootstrap/dist/css/bootstrap.css';
import './index.css';
import React from 'react';
import ReactDOM from 'react-dom';
import { Route,BrowserRouter,Switch } from 'react-router-dom';
import  Login  from './Login';
import  HomePage  from './HomePage';
import ProblemPage from "./ProblemPage";
import ProblemsList from './ProblemsList';
import Signup from './Signup';
import UserPage from './UserPage';


const Page_404 = () => {
    return <h1>Error 404 Page Not Found</h1>
}

const router = (
    <BrowserRouter>
        <Switch>
            <Route exact path="/" component={HomePage} />
            <Route exact path="/login" component={Login} />
            <Route exact path="/inregistrare" component={Signup} />
            <Route exact path="/probleme/" component={ProblemsList} />
            <Route exact path="/probleme/:problem_id" component={ProblemPage} />
            <Route exact path="/utilizatori/:username" component={UserPage} />
            <Route component={Page_404} />
        </Switch>
    </BrowserRouter>
)

ReactDOM.render(router, document.getElementById('root'));
// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
//serviceWorker.unregister();
