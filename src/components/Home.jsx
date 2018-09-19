import React, { Component } from 'react';
import MediaItem from './MediaItem';

class Home extends Component {
    constructor(props) {
        super(props);
        this.state = {
            user: null,
            instaMedia: null,
            accessToken: null
        }
    }
    async componentDidMount() {
        const res = await fetch('/api/current_user');
        const data = await res.json();
        const accessToken = data.accessToken;
        const userAccountReq = await fetch(`/api/getUserAccount/${data.facebookId}/${accessToken}`);
        const userAccountData = await userAccountReq.json();
        const fbPageId = userAccountData.data[0].id;
        const instaBizReq = await fetch(`/api/getInstaBizAccountId/${fbPageId}/${accessToken}`);
        const instaBizData = await instaBizReq.json();
        const instaBizId = instaBizData.instagram_business_account.id;
        const instaUserNameReq = await fetch(`/api/getInstaUserName/${instaBizId}/${accessToken}`);
        const instaUserNameData = await instaUserNameReq.json();
        const instaUserName = instaUserNameData.username;
        const instaMediaReq = await fetch(`/api/getInstaMediaStats/${instaBizId}/${instaUserName}/${accessToken}`);
        const instaMedia = await instaMediaReq.json();
        this.setState({
            user: data, 
            instaMedia: instaMedia.business_discovery.media.data,
            accessToken
        });
    }
    render() {
        if (this.state.user) {
            return (
                <div>
                    <h1>
                        Hey, {this.state.user.first_name} you're home. And you're logged in!!!
                    </h1>
                    <a href="/api/logout">Logout</a>
                    <br/>
                    <h3>
                        Here's your insta stuff!!!
                    </h3>
                    {this.state.instaMedia.map(media => {
                        return <MediaItem key={media.id} media={media} accessToken={this.state.accessToken}/>
                    })}
                </div>
            )
        } else {
            return null;
        }
    }
}

export default Home;