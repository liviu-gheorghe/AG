export function areStringsEqual (arg0,arg1) {
    if(arg0.localeCompare(arg1))
        return false;
    return true;
}

export function capitalizeString(str)
{
    if(str === '') return '';
    return str[0].toUpperCase() + str.slice(1);
}