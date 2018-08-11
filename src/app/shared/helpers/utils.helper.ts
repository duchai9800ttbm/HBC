import { URLSearchParams } from '@angular/http';

export default class Utils {
    static capitalizeFirstLetter(text) {
        return text ? text.charAt(0).toUpperCase() + text.slice(1) : '';
    }

    static parseAssignTo(assignToFormValue) {
        if (!assignToFormValue) {
            return null;
        }
        return {
            assignToType: assignToFormValue.split('_')[0],
            assignToId: assignToFormValue.split('_')[1],
        };
    }

    static createSearchParam(searchStr: string): URLSearchParams {
        const result = new URLSearchParams();
        result.append('searchTerm', searchStr);
        return result;
    }
}
