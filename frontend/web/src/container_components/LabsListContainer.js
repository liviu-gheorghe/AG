import React from 'react';
import {useState,useContent,useEfffect} from 'react';
import LabsList from '../presentational_components/labs/LabsList';
function LabsListContainer () {
    return <LabsList data={{'something':true}}/>
}

export default LabsListContainer;