import React, {Component} from "react";


//TODO let us just forget about Error Boundaries and just render an Error Content Screen with a button to refresh signal
class ContentError extends Component{
    state = {
        hasError: false
    };

    componentDidCatch(error, info){
        console.log(error);
        console.log(info);
        this.setState({hasError: true});
    }

    render(){
        if(this.state.hasError)
            return <h1>Something went wrong!</h1>;
        return this.props.children;
    }
}

export default ContentError;