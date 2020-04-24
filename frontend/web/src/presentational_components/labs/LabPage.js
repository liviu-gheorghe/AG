import React,{useState,useEffect} from 'react';
import {Container,Row,Col,Button,Tab,Table,Tabs,Badge} from 'react-bootstrap';
import Header from '../../components/Header';
import '../../Main.css';
import FontAwesome from 'react-fontawesome';
import XTerminal from "../../components/XTerminal";
import { withCookies } from 'react-cookie';
import {Queue,areArraysEqual} from '../../utils/core';

class LabPage extends React.Component {

  constructor(props) {
    /** 
    window.onbeforeunload = function () {
      return "Reincarcarea paginii va provoca pierderea progresului";
    }
    **/
    super(props);
    this.handleSocketOpen = this.handlePtySocketOpen.bind(this);
    this.handleSocketClose = this.handlePtySocketClose.bind(this);
    this.handleTaskManagementWebSocketOpen = this.handleTaskManagementWebSocketOpen.bind(this);
    this.handleTaskManagementWebSocketClose = this.handleTaskManagementWebSocketClose.bind(this);
    this.handleTaskManagementWebSocketError = this.handleTaskManagementWebSocketError.bind(this);
    this.state = {
      tasks: [],
      activity_status : 0,
      active_task: null,
      answers_list : [],
      obtained_score : 0,
      websocket_connection_error:null,
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
            answers_list : [...Array(resp.length).fill([])]
          }
        )
      }
    )
    .catch(error=>console.error(error))
  }


  // send task management data through the websocket
  sendTaskManagementData(data) {
    //console.log(this);
    //console.log(this.websocket);
    this.websocket.send(data);
  }

  handleTaskManagementWebSocketOpen() {
    console.log("Task Management WebSocket connection opened")
  }

  handleTaskManagementWebSocketClose() {
    console.log("Task Management WebSocket connection closed")
     console.log(this);
  }

  handleTaskManagementWebSocketError() {
    //this.setState({websocket_connection_error:true});
   
  }

  handlePtySocketOpen() {
    this.setState({connection_alive:true});
  }
  handlePtySocketClose() {
    //alert("O eroare neasteptata a aparut si conexiunea s-a inchis")
    this.setState({connection_alive:false});
  }

  handleAnswerChoice(answer) {
    // The current answers list for the current active task
    // Avoid mutating the state by concatenating the current task answers list with 
    // an empty array 
    var current_task_answers_list = this.state.answers_list[this.state.active_task].concat([]);

    // If the task has only one correct response then just replace the existing response(if any)
    // with the new response
    if(this.state.tasks[this.state.active_task].single_response == true)
    {
      // if the answer already exists and it is equal to the current answer 
      // it means that the users wants to toggle the response --> delete 
      // the response
      if (current_task_answers_list[0] == answer)
      {
        current_task_answers_list.pop();
      }
      // otherwise change the response with the new response
      else
      {
        current_task_answers_list[0]=answer;
      }
    }
    else
    {
      // If the task has multiple choices, then add the answer to the current answers list 
      // if the answer is not already in the list
      // If the answer is already in the list it means that the user wants to toogle 
      // the response --> delete the response
      if (current_task_answers_list.indexOf(answer) != -1)
      {
        current_task_answers_list.splice(current_task_answers_list.indexOf(answer),1);
      }
      else
      {
        current_task_answers_list.push(answer);
        // Sort the list such that the answers 
        // are ordered and is easy to compare 
        // it with the correct response
        current_task_answers_list.sort();
      }
    }
    // update the state
    let answers_list = this.state.answers_list;
    answers_list[this.state.active_task] = current_task_answers_list;
    
    this.setState({
      answers_list : answers_list
    })
  }

  handleCurrentTaskModification(next) {
    console.log("Handling nodification");

    // if the users selects the same task again don't do anything 
    if(this.state.active_task == next) {console.log("Selected same task");return;}


    // if this is not the first selected task(the activity started earlier and this
    // is not the first task selected by the user), then run the post_task_command in the 
    // container for the previous task(if any)
    if(this.state.active_task != null) {
      var post_task_command = this.state.tasks[this.state.active_task].post_task_command;
      //console.log(`post task for ${this.state.active_task} is --> ${post_task_command} `)
      if (post_task_command) //this.sendTaskManagementData(pre_task_command);
      {
        console.log(`Sending post task for ${next} --> ${post_task_command} `)
        this.websocket.send(post_task_command);
      }
    }
    this.setState({active_task:next})
    // After moving to the new task , run the pre_task_command in the container 
    // for the task(if any)
    var pre_task_command = this.state.tasks[next].pre_task_command;
    //console.log(`pre task for ${next} is --> ${pre_task_command} `)
    if (pre_task_command)
    { //this.sendTaskManagementData(post_task_command);
      console.log(`Sending pre task for ${next} --> ${pre_task_command} `)
      this.websocket.send(pre_task_command);
    }
  }


  computeObtainedScore () {
    // first,modify the activity status from ongoing to finished
    this.setState({activity_status:2})
    // close the socket connection 
    this.websocket.close();


    var obtained_score = 0;
    // for every task in the list check if the 
    // given response list is the same as the correct 
    // response list
    for (var i = 0;i<this.state.tasks.length;i++)
    {
      obtained_score += areArraysEqual(this.state.answers_list[i], this.state.tasks[i].correct_answers)
    }
    this.setState({obtained_score:obtained_score});
  }


  createTaskManagementWebSocket(uri, port) {
    var socket = new WebSocket(`ws://${uri}:${port}`,'TASK_MANAGEMENT_PROTOCOL')
    // add handlers 
    var component = this;
    socket.onopen = this.handleTaskManagementWebSocketOpen;
    socket.onclose = this.handleTaskManagementWebSocketClose;
    socket.onerror = this.handleTaskManagementWebSocketError;
    return socket;
  }

  startActivity() {
    this.setState({ activity_status: 1})
    this.handleCurrentTaskModification(0);
    console.log("Creating task management websocket");
  }


  componentDidMount() {
    // Create the websocket
    this.websocket = this.createTaskManagementWebSocket(`${process.env.REACT_APP_WEBSOCKET_URL}`, "443");
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
                    activity_started={this.state.activity_started} 
                    handleSocketOpen = {this.handleSocketOpen}
                    handleSocketClose = {this.handleSocketClose}
                    />
                  </Col>
                  <Col xs={12} className="lab_statment">
                    <Tabs
                    style={{
                      flexWrap:'wrap',
                    }}
                    className="align-items-center justify-content-center my-4"
                    activeKey={this.state.active_task}
                        onSelect={key => this.handleCurrentTaskModification(parseInt(key)) }
                    >
                      {
                        this.state.tasks.map((task,index) => {
                          return (
                            <Tab
                              style={{
                                flexWrap: 'wrap',
                              }}
                            className="text-center my-4"
                            key={index} 
                            eventKey={index} 
                            title={index+1}
                            >
                              <div className="text-left my-4">
                              {
                                  task.single_response ? (<strong>Un singur raspuns corect !</strong>) : (<strong>Niciun raspuns sau mai multe raspunsuri corecte !</strong>)
                              }
                              </div>
                              <p>{task.description}</p>
                              <div style={{ display: 'flex',flexWrap:'wrap' }} className="align-items-center justify-content-center my-4">
                                {
                                  task.answer_choices.map((choice,index) => {
                                    return (
                                    <div
                                    key={index} 
                                    onClick={() => this.handleAnswerChoice(index)}
                                    className={
                                      (this.state.answers_list[this.state.active_task].indexOf(index) == -1) ? 
                                      ("lab_answer_choice_button"):
                                      ("lab_answer_choice_button lab_active_answer_choice")
                                    }
                                    >
                                      {choice}
                                    </div>
                                    )
                                  }) 
                                }
                              </div>
                            </Tab>
                          )
                        })
                      }
                    </Tabs>
                  </Col>
                  <Col xs={12}>
                      {
                        this.state.active_task > 0 ? 
                        (
                        <Button
                          onClick={
                            () => {
                              console.log("MODIFYING CURRENT ACTIVE TASK TO ", this.state.active_task - 1)
                              this.handleCurrentTaskModification(this.state.active_task - 1)
                            }
                          }              
                        >
                          <FontAwesome name="arrow-left" className="mx-2"/>
                          <span>Anterior</span>
                        </Button>
                        ) : 
                        ('')
                      }
                      {
                        this.state.active_task < this.state.tasks.length-1 ? 
                        (
                          <Button
                          style={{
                            float:'right'
                          }}
                          onClick={
                            () => 
                            {
                              console.log("MODIFYING CURRENT ACTIVE TASK TO ", this.state.active_task + 1 )
                              this.handleCurrentTaskModification(this.state.active_task + 1)
                            }
                          }
                          >
                            <span>Urmator</span>
                            <FontAwesome name="arrow-right" className="mx-2" />
                          </Button>
                        ) : 
                        (
                            <Button
                              style={{
                                float: 'right'
                              }}
                              onClick={
                                () => {
                                  this.computeObtainedScore()
                                }
                              }
                            >
                              <span
                              >Finalizare</span>
                              <FontAwesome name="check" className="mx-2" />
                            </Button>                      
                        )
                      }
                  </Col>
                  </>
                ) : 
                (
                    <Col 
                    xs={12} 
                    style={{ height: '80vh', display: 'flex',flexWrap:'wrap' }} 
                    className="align-items-center justify-content-center">
                      {
                        this.state.activity_status ==0 ? (
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
                                          {areArraysEqual(
                                            this.state.answers_list[index],
                                            task.correct_answers
                                          )
                                            ? "DA"
                                            : "NU"}
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