import React, { Component } from 'react';

class MediaItem extends Component {
    componentDidMount() {

    }
    render() {
        return (
            <div>
                {this.props.mediaId}
            </div>
        )
    }
}

export default MediaItem;