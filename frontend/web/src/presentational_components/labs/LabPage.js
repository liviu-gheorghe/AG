import React,{useState,useEffect} from 'react';
import {Container,Row,Col,Button,Tab,Table,Tabs,Badge} from 'react-bootstrap';
import Header from '../../components/Header';
import LoadingModal from '../../components/LoadingModal'; 
import '../../Main.css';
import FontAwesome from 'react-fontawesome';
import XTerminal from "../../components/XTerminal";
import { withCookies } from 'react-cookie';
import {areArraysEqual} from '../../utils/core';
import TasksPane from './TasksPane';
class LabPage extends React.Component {

  constructor(props) {
  
    window.onbeforeunload = function () {
      return "Reincarcarea paginii va provoca pierderea progresului";
    }
    
    super(props);
    this.handleSocketOpen = this.handlePtySocketOpen.bind(this);
    this.handleSocketClose = this.handlePtySocketClose.bind(this);
    this.handleSocketMessage = this.handlePtySocketMessage.bind(this);
    this.state = {
      tasks: [],
      activity_status : 0,
      obtained_score : 0,
      backend_connection_established:false,
    }
  }
  /**
   * activity status 
   * 0 -> idle
   * 1 -> ongoing
   * 2 -> finished
   */


  fetchTasks = () => {
    fetch(
      `${process.env.REACT_APP_API_URL}/api/lab_tasks_choices/?lab=${this.props.match.params.lab_id}`
    )
    .then(resp=>resp.json())
    .then(
      resp => {
        this.setState(
          {
            tasks:resp,
          }
        )
      }
    )
    .catch(error=>console.error(error))
  }


  handlePtySocketOpen() {
    this.setState({connection_alive:true});
  }
  handlePtySocketClose() {
    console.log("O eroare neasteptata a aparut si conexiunea s-a inchis")
    this.setState({connection_alive:false});
  }

  handlePtySocketMessage() {
    // If the connection is already established, do nothing
    if(this.state.backend_connection_established == true) return;
    // else update the state in order to render the TasksPane
    this.setState({backend_connection_established:true});
  }


  computeObtainedScore = (answers_list) => {
    // first,modify the activity status from ongoing to finished
    this.setState({activity_status:2})
    // close the socket connection 
    //this.websocket.close();

    this.setState({answers_list:answers_list});
    var obtained_score = 0;
    // for every task in the list check if the 
    // given response list is the same as the correct 
    // response list
    for (var i = 0;i<this.state.tasks.length;i++)
    {
      obtained_score += areArraysEqual(answers_list[i], this.state.tasks[i].correct_answers)
    }
    this.setState({obtained_score:obtained_score});
  }


  startActivity() {
    this.setState({ activity_status: 1})
  }


  componentDidMount() {
    this.fetchTasks();
  }
    render () {
      return (
        <>
          <Header logged_user={this.props.cookies.get('username')} />
          <Container>
            <Row className="my-4">
              {
                this.state.activity_status === 1 ? (
                  <>
                  <Col xs={12}>
                    <XTerminal 
                    activity_started = {this.state.activity_started} 
                    handleSocketOpen = {this.handleSocketOpen}
                    handleSocketClose = {this.handleSocketClose}
                    handleSocketMessage = {this.handleSocketMessage}
                    />
                  </Col>
                  {
                    this.state.backend_connection_established == true ? (
                        <TasksPane
                          tasks={this.state.tasks}
                          computeObtainedScore={this.computeObtainedScore}
                        />
                    ) : (
                          <LoadingModal />
                    )
                  }
                  </>
                ) : 
                (
                    <Col 
                    xs={12} 
                    style={{ height: '80vh', display: 'flex',flexWrap:'wrap' }} 
                    className="align-items-center justify-content-center">
                      {
                        this.state.activity_status == 0 ? (
                          <>
                            <h3 className="mx-4">{this.props.match.params.lab_name}</h3>
                            <Button
                              style={{
                                fontSize: '20px',
                                height: '60px',
                                width: '200px'
                              }}
                              onClick={
                                () => {
                                  this.startActivity();
                                }
                              }>
                              <span>Start</span>
                            </Button>
                            <div style={{ flexBasis: '100%', height: '0px' }}></div>
                            <h2><code>{"<code> </code>"}</code></h2>
                            <div style={{ flexBasis: '100%', height: '0px' }}></div>
                            <small>Numarul de task-uri : {this.state.tasks.length}</small>
                          </>
                        ): (
                          <>
                            <h3>Laborator finalizat</h3>
                            <div style={{ flexBasis: '100%', height: '0px' }}></div>
                            <Table className="text-center lab_score_table" bordered>
                              <thead>
                                <tr>
                                <td>Task</td>
                                <td>Raspunsul tau</td>
                                <td>Raspunsul corect</td>
                                <td>Ai raspuns corect</td>
                                </tr>
                              </thead>
                              <tbody>
                                {
                                  this.state.tasks.map((task, index) => {
                                    return (
                                      <tr key={index}>
                                        <td>{task.description}</td>
                                        <td>
                                          {this.state.answers_list[index].map(
                                            (ans, index) => (
                                              <Badge
                                                key={index}
                                                className="m-2 p-2"
                                                variant="danger"
                                              >
                                                {task.answer_choices[ans]}
                                              </Badge>
                                            )
                                          )}
                                        </td>
                                        <td>
                                          {task.correct_answers.map(
                                            (ans, index) => (
                                              <Badge
                                                key={index}
                                                className="m-2 p-2"
                                                variant="danger"
                                              >
                                                {task.answer_choices[ans]}
                                              </Badge>
                                            )
                                          )}
                                        </td>
                                        <td>
                                          {
                                          areArraysEqual(
                                            this.state.answers_list[index],
                                            task.correct_answers
                                          )
                                            ? "DA"
                                            : "NU"
                                          }
                                        </td>
                                      </tr>
                                    );
                                  })
                                }
                              </tbody>
                            </Table>
                            <div style={{ flexBasis: '100%', height: '0px' }}></div>
                              <p>Ai raspuns corect la {this.state.obtained_score} intrebari</p>
                          </>
                        )
                      }
                  </Col>
                )
              }
            </Row>
          </Container>
        </>
      );
    }
}

export default withCookies(LabPage);