import api from './api'

export default class App {
    constructor() {
        this.currentPage = this.getCurrentPage();
        this.$content = document.getElementById('content');
        this.$prev = document.getElementById('prev');
        this.$next = document.getElementById('next');
        this.$first = document.getElementById('first');
        this.$last = document.getElementById('last');
        this.$random = document.getElementById('random');
        this.minPage = 1;
        this.maxPage = null;

        this.nextHandler = this.nextHandler.bind(this);
        this.prevHandler = this.prevHandler.bind(this);
        this.firstHandler = this.firstHandler.bind(this);
        this.lastHandler = this.lastHandler.bind(this);
        this.randomHandler = this.randomHandler.bind(this);

        this.init();
    }

    getCurrentPage() {
        const [_, page] = location.hash.split('#');

        return parseInt(page) || 0;
    }

    getFormattedDate(year, month, day) {
        return `${('0' + day).slice(-2)}.${('0' + month).slice(-2)}.${year}`;
    }

    renderComics({alt, img, title, day, month, year, num}) {
        location.hash = num;
        this.currentPage = num;

        const date = this.getFormattedDate(year, month, day);

        this.$content.innerHTML = `
            <div class="content">
                <div class="content__title">${title}</div>
                <div class="content__date">${date}</div>
                <img class="content__img" alt="${alt}" src="${img}">
            </div>
        `
    }

    async getCommicsAsync(page) {
        try {
            if (page) {
                const resp = await api.comics.getComicsByPage(page);
                this.renderComics(resp);
            } else {
                const resp = await api.comics.getCurrentComics();
                this.renderComics(resp);
            }
        } catch (e) {
            alert('Ошибка при загрузке');
        }
    }

    nextHandler() {
        if (this.currentPage < this.maxPage) {
            this.getCommicsAsync(this.currentPage + 1);
        }
    }

    prevHandler() {
        if (this.currentPage > this.minPage) {
            this.getCommicsAsync(this.currentPage - 1);
        }
    }

    firstHandler() {
        this.getCommicsAsync(this.minPage);
    }

    lastHandler() {
        this.getCommicsAsync(this.maxPage);
    }

    randomHandler() {
        const page = Math.floor(Math.random() * (this.maxPage - this.minPage + 1)) + this.minPage;
        this.getCommicsAsync(page);
    }

    initListeners() {
        this.$next.addEventListener('click', this.nextHandler);
        this.$prev.addEventListener('click', this.prevHandler);
        this.$first.addEventListener('click', this.firstHandler);
        this.$last.addEventListener('click', this.lastHandler);
        this.$random.addEventListener('click', this.randomHandler);
    }

    async getMaxPageAsync() {
        const {num} = await api.comics.getCurrentComics();
        return num;
    }

    async init() {
        this.maxPage = await this.getMaxPageAsync();
        this.initListeners();
        await this.getCommicsAsync(this.currentPage);
    }
}
