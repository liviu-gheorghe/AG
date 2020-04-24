import {useState,useEffect} from 'react';


export  function useComponentWillMount (f) {
    const [rendered,setRendered] = useState(false);
    useEffect(() => {
        setRendered(true)
    },[rendered])
    if(!rendered) {
        f()
    }
}