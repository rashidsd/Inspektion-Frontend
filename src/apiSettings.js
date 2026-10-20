const development = false;

export const settings = {
    baseURL:  development ? "http://localhost:4000" :"https://api.inspektionsolutions.de",
    apiURL:  development ? "http://localhost:4000/api/v1" :"https://api.inspektionsolutions.de/api/v1",
}
