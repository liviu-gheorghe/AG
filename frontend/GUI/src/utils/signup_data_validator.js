import {areStringsEqual} from './core';
export function isValidInput(type,value) {
    switch (type) {
        case 'first_name':
            return validateFirstName(value);
            break;
        case 'last_name':
            return validateLastName(value);
            break;
        case 'username':
            return validateUsername(value);
            break;
        case 'email':
            return validateEmail(value);
            break;
        case 'password':
            return validatePassword(value);
            break;
        default:
            return true;
            break;
    }
}

function validateFirstName(value) {
    var regex = /^[A-Z]{1}[a-z]+$/g;
    if(value.length <2 || value.length >32)
        return false;
    if(regex.exec(value) === null)
        return false;
    return true;
}

function validateLastName(value) {
    var regex = /^[A-Z]{1}[a-z]+$/g;
    if(value.length <2 || value.length >32)
        return false;
    if(regex.exec(value) === null)
        return false;
    return true;
}
function validateUsername(value) {
    var regex = /^[a-z]{1}[a-z_0-9-]*[a-z0-9]{1}$/ig;
    if (regex.exec(value) === null)
        return false;
    return true;
}
function validateEmail(value) {
    var regex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    if (regex.exec(value) === null)
        return false;
    return true;
}

function validatePassword(value)
{
    if(value.length <3)
    return false;
    return true;
}
