import Comics from './comics';

class Api {
    constructor() {
        this.comics = new Comics();
    }
}

export default new Api();