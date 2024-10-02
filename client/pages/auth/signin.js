
import { useState } from 'react';
import Router from 'next/router';
import useRequest from '../../hooks/use-request';

const signin = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { doRequest, errors } = useRequest({
        url: '/api/users/signin',
        method: 'post',
        body: {
            email, password
        },
        onSuccess: () => Router.push('/')
    });

    const onSubmitHandler = async event => {
        event.preventDefault();

        doRequest();
    }

    return (
        <div className='container'>
            <div className='row'>
                <div className='col-4'>
                    <form onSubmit={onSubmitHandler}>
                        <h1>Sign In</h1>
                        <div className="form-group">
                            <label>Email Address</label>
                            <input value={email} onChange={e => setEmail(e.target.value)} className="form-control" />
                        </div>
                        <div className="form-group">
                            <label>Password</label>
                            <input value={password} type="password" onChange={e => setPassword(e.target.value)} className="form-control" />
                        </div>
                            {errors}
                        <button className="btn btn-primary">Sign In</button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default signin;