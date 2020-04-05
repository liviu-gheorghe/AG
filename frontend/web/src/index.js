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
import ProblemSolutionPage from './ProblemSolutionPage';
import ProblemCategories from './ProblemsCategories';
import TutorialsList from './presentational_components/tutorials/TutorialsList';
import LabsListContainer from './container_components/LabsListContainer';
import {store} from './redux/store';



export const StoreContext = React.createContext(store);

const Page_404 = () => {
    return <h1>Error 404 Page Not Found</h1>
}

const router = (
    <StoreContext.Provider value={store}>
    <BrowserRouter>
        <Switch>
            <Route exact path="/" component={HomePage} />
            <Route exact path="/logare" component={Login} />
            <Route exact path="/inregistrare" component={Signup} />
            <Route exact path="/probleme/" component={ProblemsList} />
            <Route exact path="/tutoriale/" component={TutorialsList} />
            <Route exact path="/laboratoare/" component={LabsListContainer} />
            <Route exact path="/probleme/categorii" component={ProblemCategories} />
            <Route exact path="/probleme/categorii/:topic_name" component={ProblemsList} />
            <Route exact path="/probleme/:problem_id" component={ProblemPage} />
            <Route exact path="/utilizatori/:username" component={UserPage} />
            <Route exact path="/solutii_probleme/:solution_id" component={ProblemSolutionPage} />
            <Route component={Page_404} />
        </Switch>
    </BrowserRouter>
    </StoreContext.Provider>
)

ReactDOM.render(router, document.getElementById('root'));
// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
//serviceWorker.unregister();
