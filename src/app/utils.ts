import {Response} from "@angular/http";
export class Utils {
    public static httpResponse(response: Response): boolean {
        if (response.status == 200) {
            return true;
        } else {
            return false;
        }
    }
}


