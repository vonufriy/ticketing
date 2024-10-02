import 'bootstrap/dist/css/bootstrap.min.css';
import buildClient from '../api/build-client';
import Header from '../components/header';

const AppComponent = ({ Component, pageProps, currentUser }) => {
    return (<div>
                <Header currentUser={currentUser} />
                <div className='container'>
                    <Component currentUser={currentUser} {...pageProps} />
                </div>
            </div>)
}

AppComponent.getInitialProps = async (appContex) => {
    const client = await buildClient(appContex.ctx);
    const response = await client.get('/api/users/currentuser');
    const pageProps = appContex.Component.getInitialProps ? await appContex.Component.getInitialProps(appContex.ctx, client, response.currentUser) : {};

    return {
        pageProps,
        ...response.data
    };
}

export default AppComponent;