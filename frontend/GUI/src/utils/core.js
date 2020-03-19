export function areStringsEqual (arg0,arg1) {
    if(arg0.localeCompare(arg1))
        return false;
    return true;
}