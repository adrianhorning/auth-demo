import React, { Component } from 'react';

class MediaItem extends Component {
    constructor(props) {
        super(props);
        this.state = {
            media_url: null
        }
    }
    async componentDidMount() {
        const instaId = this.props.media.id;
        const accessToken = this.props.accessToken;
        const instaMediaItemDetailReq = await fetch(`/api/getInstaMediaItemDetail/${instaId}/${accessToken}`);
        const instaMediaItemDetailData = await instaMediaItemDetailReq.json();
        const { media_url } = instaMediaItemDetailData;
        this.setState({media_url})
    }
    render() {
        if (this.state.media_url) {
            return (
                <div>
                    With {this.props.media.like_count} likes and {this.props.media.comments_count} comments!
                    <br/>
                    <img src={this.state.media_url} alt="insta media pic"/>
                </div>
            )
        } else {
            return null;
        }
    }
}

export default MediaItem;