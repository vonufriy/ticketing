import axios from "axios";

const buildClient = async ({ req }) => {
    if (typeof window === 'undefined') {
        // We are on the server
        // requests should be made to

        return axios.create({
            baseURL: 'http://ingress-nginx-controller.ingress-nginx.svc.cluster.local',
            headers: req.headers
        });
    } else {
        return axios.create({
            baseURL: '/'
        });
    }
}

export default buildClient;