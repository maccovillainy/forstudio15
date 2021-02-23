import Base from './base';

export default class Comics extends Base {
    constructor() {
        super();
    }

    getCurrentComics() {
        let url = 'https://xkcd.com/info.0.json';
        return this.makeRequest(url);
    }

    getComicsByPage(page) {
        let url = `https://xkcd.com/${page}/info.0.json`;

        return this.makeRequest(url);
    }
}