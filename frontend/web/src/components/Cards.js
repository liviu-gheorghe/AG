import React from 'react';
import {Col,Card,Badge} from 'react-bootstrap';
import FontAwesome from 'react-fontawesome';



const DIFFICULTY_COLOR = {
    'elementar': '#007bff',
    'usor': '#28a745',
    'intermediar': '#6f42c1',
    'dificil': '#dc3545',
}






export function ProblemSolutionCard(props) {
    return (
        <Col xs={12} md={6} lg={4} xl={4} className="my-4">
            <Card
                bg={props.solution.score == "100" ? "success" : "danger"}
                style={
                    {
                        width: '18rem',
                        color: '#fff',
                        margin: 'auto',
                    }
                }
                onClick={() => {
                    window.location.href = `/solutii_probleme/${props.solution.id}`
                }}
            >
                <Card.Header>Solutia #{props.solution.id}</Card.Header>
                <Card.Body className="text-center">
                    <div>
                        <p>Tip : {props.solution.source_type}</p>
                        <p>Punctaj : {props.solution.score} puncte</p>
                        <p>
                            Incarcat :<br />
                            {
                                props.solution.is_recent ? (
                                    "Acum " + props.solution.is_recent_date_posted
                                ) : (
                                        `${props.solution.date_posted} ${props.solution.time_posted}`
                                    )
                            }
                        </p>
                        <FontAwesome
                            name={props.solution.score == "100" ? "check" : "times"}
                            className="card_icon">
                        </FontAwesome>
                    </div>
                </Card.Body>
            </Card>
        </Col>        
    );
}

export function ProblemCard(props) {
    return (
        <Col
            xs={12}
            sm={6}
            md={6}
            lg={4}
            className="my-4"
            style={{
                cursor: 'pointer'
            }}
            onClick={
                () => {
                    window.location.href = `/probleme/${props.problem.id}`
                }
            }
        >
            <Card>
                <Card.Img className="problem_image" variant="top" src={
                    require(`../assets/img/${props.img_src}`)
                } />
                <Card.Body>
                    <Card.Title>
                        {props.problem.name}
                        <Badge
                            className="p-2 m-2"
                            style={{
                                backgroundColor: DIFFICULTY_COLOR[props.problem.difficulty],
                                color: '#fff',
                                fontSize: '14px'
                            }}
                        >
                            {props.problem.difficulty}
                        </Badge>
                    </Card.Title>
                    <Card.Text>
                        {props.problem.description.slice(0, 100).split(" ").slice(0, -1).join(' ')} <a href={`/probleme/${props.problem.id}`}>Mai mult</a>
                    </Card.Text>
                    <Card.Text>
                        Taguri
                        {
                            props.problem.tags.split(',').map(
                                (tag, index) => {
                                    return (
                                        <Badge key={index} className="px-2 py-1 m-2" variant="primary">{tag}</Badge>);
                                }
                            )
                        }
                    </Card.Text>
                </Card.Body>
                <Card.Footer>
                    <small>
                        <FontAwesome name="calendar"></FontAwesome>
                        {
                            props.problem.is_recent ? (<span className="mx-2">Acum {props.problem.is_recent_date_posted}</span>) : (
                                <span className="mx-2">
                                    {props.problem.date_posted} {props.problem.time_posted}
                                </span>
                            )
                        }
                    </small>
                </Card.Footer>
            </Card>
        </Col>        
    );
}

export function ProblemCategoryCard(props) {
    return (
        <Col xs={12} md={6} xl={4} className="my-4">
            <Card
                style={{
                    cursor:'pointer'
                }}
                onClick={
                    () => {
                        window.location.href = `/probleme/categorii/${props.topic.name}`;
                    }
                }
            >
                <Card.Img className="problem_image" variant="top" src={
                    require(`../assets/img/${props.img_src}`)
                } />
                <Card.Body>
                    <Card.Title className="text-center">
                        {props.topic.name}
                    </Card.Title>
                </Card.Body>
                <Card.Footer className="text-center">
                    <small>
                        {props.topic.problems_available_count} probleme
                    </small>
                </Card.Footer>
            </Card>
        </Col>
    );
}

export function LabCard(props) {
    return (
        <Col
            xs={12}
            sm={12}
            md={6}
            lg={6}
            className="my-4"
            onClick={
                () => {
                    window.location.href = `/laboratoare/${props.lab.name}`
                }
            }
        >
            <Card className="lab_card">
                <Card.Img className="lab_image" variant="top" src={
                    require(`../assets/img/${props.img_src}`)
                } />
                <Card.Body>
                    <Card.Title>
                        {props.lab.name}
                    </Card.Title>
                    <Card.Text>
                        {props.lab.short_description}
                    </Card.Text>
                </Card.Body>
                <Card.Footer>
                    <small>{props.lab.category}</small>
                </Card.Footer>
            </Card>
        </Col>
    );
}