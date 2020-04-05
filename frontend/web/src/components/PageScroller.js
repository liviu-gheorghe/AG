import React from 'react';
import {useState,useEffect} from 'react';
import FontAwesome from 'react-fontawesome';
import './PageScroller.css';
function PageScroller(props) {
    const [visible,setVisible]  = useState(false);
    function windowListener() {
        if (window.pageYOffset > window.innerHeight && !visible) {
            setVisible(true)
        }
        else if (window.pageYOffset < window.innerHeight && visible) {
            setVisible(false)
        }        
    }
    useEffect(() => {
            window.addEventListener('scroll' , windowListener);
        }
    )
    return (
        <div className={
            (visible === true) ?
                "scroll_to_top" :
                "hidden"
        }
            onClick={
                () => {
                    window.scroll({
                        top: 0,
                        left: 0,
                        behavior: 'smooth',
                    });
                }
            }
        >
            <FontAwesome name="arrow-up" />
        </div>
    );
}
export default PageScroller;
