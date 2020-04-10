import  React  from 'react';
import {Table,Badge} from 'react-bootstrap';
import FontAwesome from 'react-fontawesome';
import './ProblemDetailsTable.css';


const DIFFICULTY_COLOR = {
    'elementar': '#007bff',
    'usor': '#28a745',
    'intermediar': '#6f42c1',
    'dificil': '#dc3545',
}

export function ProblemDetailsTable(props) {
    return (
        <Table striped bordered className="problem_info_table">
            <caption className="py-2">Detalii problema {props.problem.name}</caption>
            <tbody>
                <tr>
                    <td><FontAwesome name="layer-group" /></td>
                    <td>
                        <Badge style={{ backgroundColor: `${DIFFICULTY_COLOR[props.problem.difficulty]}`}} className="p-2 text-white">{props.problem.difficulty}</Badge>
                    </td>
                </tr>
                <tr>
                    <td><FontAwesome name="crosshairs" /></td>
                    <td>
                        {
                            props.problem.tags.split(",").map(
                                (tag, index) => {
                                    return <Badge key={index} variant="primary" className="p-2 m-2">{tag}</Badge>
                                }
                            )
                        }
                    </td>
                </tr>
                <tr>
                    <td><FontAwesome name="calendar" /></td>
                    <td>
                        {`${props.problem.date_posted}`}
                    </td>
                </tr>
                <tr>
                    <td><FontAwesome name="user" /></td>
                    <td>
                        <a href={`/utilizatori/${props.problem.author.id}`}>
                            {`${props.problem.author.first_name} ${props.problem.author.last_name}`}
                        </a>
                    </td>
                </tr>
                <tr>
                    <td><FontAwesome name="clock" /></td>
                    <td>{props.problem.time_limit} s</td>
                </tr>
                <tr>
                    <td><FontAwesome name="memory" /></td>
                    <td>{props.problem.memory_limit} MB</td>
                </tr>
            </tbody>
        </Table>
    );
}
