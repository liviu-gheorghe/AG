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


export class Queue
{
    constructor(array) {
        if(array === undefined)
        this._queue = []
        else
        this._queue = array;
    }
    pop_front() {
        let element = this._queue[0];
        this._queue.shift(); 
        return element;
    }
    push_back(elements) {
        if(typeof(elements) === 'number')
        {
            this._queue.push(elements);
        }
        else
        {
        console.log(elements);
        //console.log(this._queue.concat(elements));
        this._queue.concat(elements);
        }
    }
    empty() {
        return this._queue.length === 0;
    }
    shift()
    {
        let element = this.pop_front();
        this.push_back(element);
    }
}