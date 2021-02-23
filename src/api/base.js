export default class Base {
    constructor() {
    }

    makeRequest(url) {
        return fetch(url).then(response => response.json())
    }
}