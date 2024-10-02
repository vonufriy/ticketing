import { useEffect, useState } from 'react';
import StripeCheckout from 'react-stripe-checkout';
import useRequest from '../../hooks/use-request';
import Router from 'next/router';

const orderShow = ({ order, currentUser }) => {
    const [timeLeft, setTimeLeft] = useState(0);
    const { doRequest, errors } = useRequest({
        url: '/api/payments',
        method: 'post',
        body: {
            orderId: order.id
        },
        onSuccess: () => Router.push('/orders')
    });

    useEffect(() => {
        const findTimeLeft = () => {
            const msLeft = new Date(order.expiresAt) - new Date();
            setTimeLeft(Math.round(msLeft / 1000));
        };

        findTimeLeft();
        const timerId = setInterval(findTimeLeft, 1000);

        return () => {
            clearInterval(timerId);
        };
    }, [order]);

    if (timeLeft < 0) {
        return <div>Order Expired</div>
    }

    return (
        <div>
            <h4>Time left to pay: {timeLeft} seconds</h4>
            <StripeCheckout
                token={({ id }) => doRequest({token: id})}
                stripeKey='pk_test_51Q42MCHaVJGWdlNsodMJnBRWOv4mjBE2ifsoWUcbfXjpI6kh7ovC4QWggKsKRcC8hgGiFXEhnC8ZQ2XMs6aO2Hdk005ibzQPAU'
                amount={order.ticket.price * 100}
                email={currentUser.email}
            />
        </div>
    )
};

orderShow.getInitialProps = async (context, client, currentUser) => {
    const { orderId } = context.query;
    const { data } = await client.get(`/api/orders/${orderId}`);

    return { order: data};
}

export default orderShow;