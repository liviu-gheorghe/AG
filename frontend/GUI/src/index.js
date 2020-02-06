import 'bootstrap/dist/css/bootstrap.css';
import './index.css';
import React from 'react';
import ReactDOM from 'react-dom';
import { Route,BrowserRouter } from 'react-router-dom';
import  Login  from './Login';
import  HomePage  from './HomePage';
import ProblemPage from "./ProblemPage";

const router = (
    <BrowserRouter>
    <>
        <Route exact path="/login" component={Login}></Route>
        <Route exact path="/" component={HomePage}></Route>
            <Route exact path="/prima_problema" component={ProblemPage}></Route>
    </>
    </BrowserRouter>
)

ReactDOM.render(router, document.getElementById('root'));
// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
//serviceWorker.unregister();
