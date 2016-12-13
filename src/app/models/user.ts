export class User {
    username: string;
    avatarImg: string;
    isUser: boolean;
    color: string;
    no: number

    constructor() {
        this.username = '';
        this.avatarImg = ''
        this.isUser = false;
        this.color = 'black'
        this.no = -1
    }
}
