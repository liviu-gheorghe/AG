import React,{useState,useEffect} from 'react';
import {Container,Row,Col,Button,Tab,Nav,Tabs} from 'react-bootstrap';
import Header from '../../components/Header';
import '../../Main.css';
import FontAwesome from 'react-fontawesome';
import XTerminal from "../../components/XTerminal";
import { withCookies } from 'react-cookie';
import {Queue} from '../../utils/core';

class LabPage extends React.Component {

  constructor(props) {
    super(props);
    this.handleSocketOpen = this.handlePtySocketOpen.bind(this);
    this.handleSocketClose = this.handlePtySocketClose.bind(this);
    this.state = {
      tasks: [],
      activity_status : 0,
      active_task: null,
      answers_list : []
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
      `${process.env.REACT_APP_API_URL}/api/lab_tasks_choices/`
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
    this.websocket.send(data);
  }

  handleTaskManagementWebSocketOpen() {
    console.log("Task Management WebSocket connection opened")
  }

  handleTaskManagementWebSocketClose() {
    console.log("Task Management WebSocket connection closed")
  }

  handleTaskManagementWebSocketError() {
    console.log("Task Management WebSocket connection failed")
  }

  handlePtySocketOpen() {
    this.setState({connection_alive:true});
  }
  handlePtySocketClose(){
    //alert("O eroare neasteptata a aparut si conexiunea s-a inchis")
    this.setState({connection_alive:false});
  }

  handleAnswerChoice(answer) {
    // The current answers list for the current active task
    // Avoid mutating the state by concatenating the current task answers list with 
    // an empty array 
    var current_task_answers_list = this.state.answers_list[this.state.active_task].concat([]);
    //console.log("Active task is ", this.state.active_task);
    //console.log("So, the full state is \n",this.state.answers_list);

    // If the task has only one correct response then just replace the existing response(if any)
    // with the new response
    if(this.state.tasks[this.state.active_task].single_response == true)
    {
      //console.log("This is a single response task")
      //console.log(`User selected answer ${answer}`)
      // if the answer already exists and it is equal to the current answer 
      // it means that the users wants to toggle the response --> delete 
      // the response
      if (current_task_answers_list[0] == answer)
      {
        //console.log("The answer is the same , toggling")
        current_task_answers_list.pop();
      }
      // otherwise change the response with the new response
      else
      {
        //console.log(`The answer ${answer} is not the same as ${current_task_answers_list[0]}, adding `);
        //console.log(current_task_answers_list[0])
        //console.log(answer);
        current_task_answers_list[0]=answer;
      }
    }
    else
    {
      //console.log("THIS MESSAGE SHOULD NOT BE DISPLAYED");
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
      }
    }
    // update the state
    let answers_list = this.state.answers_list;
    //console.log("Current full state\n", this.state.answers_list)
    answers_list[this.state.active_task] = current_task_answers_list;
    //console.log(` Selected answers for task ${this.state.active_task}`)
    //console.log(current_task_answers_list);
    
    this.setState({
      answers_list : answers_list
    })
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
    this.setState({ activity_status: 1, active_task: 0 })
    console.log("Creating task management websocket");
    this.websocket = this.createTaskManagementWebSocket(`${process.env.REACT_APP_WEBSOCKET_URL}`,"443");
  }

  componentDidMount() {
    console.log(this.props.match)
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
                    onSelect={key => this.setState({ active_task: parseInt(key) }) }
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
                              this.setState({ active_task: this.state.active_task - 1 })
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
                              this.setState({active_task:this.state.active_task+1})
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
                                () => {}
                              }
                            >
                              <span
                              onClick = {
                                () => {
                                  this.sendTaskManagementData("mkdir /opt/paula")
                                }
                              }
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
                      <h3 className="mx-4">{ this.props.match.params.lab_name }</h3>
                      <Button 
                      style = {{
                        fontSize:'20px',
                        height:'60px',
                        width:'200px'
                      }}
                      onClick = {
                        () => {
                          this.startActivity();
                        }
                      }>
                        <span>Start</span>
                      </Button>
                      <div style={{ flexBasis: '100%', height: '0px' }}></div>
                    <h2><code>{"<code> </code>"}</code></h2>
                      <div style={{flexBasis:'100%',height:'0px'}}></div>
                    <small>Numarul de task-uri : {this.state.tasks.length}</small>
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