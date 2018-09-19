import React, { Component } from 'react';
import MediaItem from './MediaItem';

class Home extends Component {
    constructor(props) {
        super(props);
        this.state = {
            user: null,
            instaMedia: null
        }
    }
    async componentDidMount() {
        const res = await fetch('/api/current_user');
        const data = await res.json();
        const userAccount = await fetch(`/api/getUserAccount/${data.facebookId}/${data.accessToken}`);
        const userAccountData = await userAccount.json();
        const fbPageId = userAccountData.data[0].id;
        const instaBiz = await fetch(`/api/getInstaBizAccountId/${fbPageId}/${data.accessToken}`);
        const instaBizData = await instaBiz.json();
        const instaBizId = instaBizData.instagram_business_account.id;
        const instaMediaReq = await fetch(`/api/getInstaMediaStats/${instaBizId}/${data.accessToken}`);
        const instaMedia = await instaMediaReq.json();
        console.log(instaMedia);
        this.setState({user: data, instaMedia: instaMedia.business_discovery.media.data}, () => console.log(this.state));
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
                        return <MediaItem key={media.id} mediaId={media.id}/>
                    })}
                </div>
            )
        } else {
            return null;
        }
    }
}

export default Home;