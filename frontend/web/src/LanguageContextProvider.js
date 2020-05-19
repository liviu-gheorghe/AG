import React from 'react';

import {LanguageContext} from './index';
 
class LanguageContextProvider extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            language : 'ro',
        }
    }
    shouldComponentUpdate() {
        return true;
    }
    render() {
        return (
            <LanguageContext.Provider value={{
                language: this.state.language,
                setLanguage: (lang) => {
                    this.setState({language:lang})
                }
            }}>
                {this.props.children}
            </LanguageContext.Provider>
        );
    }
}
export default LanguageContextProvider;