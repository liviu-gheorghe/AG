import 'bootstrap/dist/css/bootstrap.css';
import './index.css';
import React from 'react';
import ReactDOM from 'react-dom';
import { Route,BrowserRouter,Switch } from 'react-router-dom';
import  Login  from './Login';
import  HomePage  from './HomePage';
import ProblemPage from "./problems/ProblemPage";
import ProblemsList from './problems/ProblemsList';
import Signup from './Signup';
import UserPage from './UserPage';
import ProblemSolutionPage from './problems/ProblemSolutionPage';
import ProblemCategories from './problems/ProblemsCategories';
import TutorialsList from './presentational_components/tutorials/TutorialsList';
import TutorialPage from "./presentational_components/tutorials/TutorialPage";
import LabList from "./presentational_components/labs/LabsList";
import LabPage from './presentational_components/labs/LabPage';
import WebPlayground from "./presentational_components/labs/WebPlayground";
import TerminalPlayground from './components/TerminalPlayground';
import {store} from './redux/store';
import LanguageContextProvider from './LanguageContextProvider';

const Page_404 = () => {
    return <h1>Error 404 Page Not Found</h1>
}

export const LanguageContext = React.createContext();

const router = (
<LanguageContextProvider>
    <BrowserRouter forceRefresh={true}>
      <Switch>
        <Route exact path="/" component={HomePage} />
        <Route exact path="/logare" component={Login} />
        <Route exact path="/login" component={Login} />
        <Route exact path="/inregistrare" component={Signup} />
        <Route exact path="/signup" component={Signup} />
        <Route exact path="/probleme/" component={ProblemsList} />
        <Route exact path="/problems/" component={ProblemsList} />
        <Route exact path="/tutoriale/" component={TutorialsList} />
        <Route exact path="/tutorials/" component={TutorialsList} />
        <Route exact path="/antrenament/consola_web" component={WebPlayground} />
        <Route exact path="/training/web_console" component={WebPlayground} />
        <Route exact path="/antrenament/linux" component={TerminalPlayground} />
        <Route exact path="/training/linux" component={TerminalPlayground} />
        <Route exact path="/tutoriale/:tutorial_id/:tutorial_name" component={TutorialPage} />
        <Route exact path="/tutorials/:tutorial_id/:tutorial_name" component={TutorialPage} />
        <Route exact path="/laboratoare" component={LabList} />
        <Route exact path="/labs" component={LabList} />
        <Route exact path="/laboratoare/:lab_id/:lab_name" component={LabPage} />
        <Route exact path="/labs/:lab_id/:lab_name" component={LabPage} />
        <Route exact path="/probleme/categorii" component={ProblemCategories} />
        <Route exact path="/problems/categories" component={ProblemCategories} />
        <Route
          exact
          path="/probleme/categorii/:topic_name"
          component={ProblemsList}
        />
        <Route
          exact
          path="/problems/categories/:topic_name"
          component={ProblemsList}
        />
        <Route exact path="/probleme/:problem_id" component={ProblemPage} />
        <Route exact path="/problems/:problem_id" component={ProblemPage} />
        <Route exact path="/utilizatori/:username" component={UserPage} />
        <Route exact path="/users/:username" component={UserPage} />
        <Route
          exact
          path="/solutii_probleme/:solution_id"
          component={ProblemSolutionPage}
        />
        <Route
          exact
          path="/problems_solutions/:solution_id"
          component={ProblemSolutionPage}
        />
      </Switch>
    </BrowserRouter>
  </LanguageContextProvider>
);

ReactDOM.render(router, document.getElementById('root'));
// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
//serviceWorker.unregister();

//<Route component={Page_404} />