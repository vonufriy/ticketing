const showOrders = ({orders}) => {
    return (
        <div>
            <h1>Orders</h1>
            <table className="table">
                <thead>
                    <tr>
                        <th>Title</th>
                        <th>Price</th>
                        <th>Status</th>
                    </tr>
                </thead>
                <tbody>
                    {orders.map(order => (
                        <tr key={order.id}>
                            <td>{order.ticket.title}</td>
                            <td>{order.ticket.price}</td>
                            <td>{order.status}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

showOrders.getInitialProps = async (context, client) => {
    const {data} = await client.get('/api/orders');
    return {orders: data};
}

export default showOrders;