class WorkClass {
    constructor (works) {
        works && Object.assign(this, works);
    }
}