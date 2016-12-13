import {Constants} from "./constants";

export class Card {
    img: string
    asking: boolean
    playerN: number
    color: string

    constructor() {
        this.img = Constants.DEFAULT_CARD_IMAGE
        this.asking = false
        this.playerN = -1
        this.color = 'transparent'
    }
}
