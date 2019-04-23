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
    static precisionRound(number, precision) {
        const factor = Math.pow(10, precision);
        return Math.round(number * factor) / factor;
    }

    static isEqual(value: any, other: any): boolean {
        // Get the value type
        const type = Object.prototype.toString.call(value);

        // If the two objects are not the same type, return false
        if (type !== Object.prototype.toString.call(other)) {
            return false;
        }

        // If items are not an object or array, return false
        if (['[object Array]', '[object Object]'].indexOf(type) < 0) {
            return false;
        }

        // Compare the length of the length of the two items
        const valueLen = type === '[object Array]' ? value.length : Object.keys(value).length;
        const otherLen = type === '[object Array]' ? other.length : Object.keys(other).length;
        if (valueLen !== otherLen) {
            return false;
        }

        // Compare properties
        if (type === '[object Array]') {
            for (let i = 0; i < valueLen; i++) {
                if (this.compare(value[i], other[i]) === false) {
                    console.log(value[i]);
                    return false;
                }
            }
        } else {
            for (const key in value) {
                if (value.hasOwnProperty(key)) {
                    if (this.compare(value[key], other[key]) === false) {
                        console.log(value[key]);
                        return false;
                    }
                }
            }
        }

        // If nothing failed, return true
        return true;
    }

    static compare(item1: any, item2: any) {
        const itemType = Object.prototype.toString.call(item1);

        // If an object or array, compare recursively
        if (['[object Array]', '[object Object]'].indexOf(itemType) >= 0) {
            if (!this.isEqual(item1, item2)) {
                return false;
            }
        } else {
            // Otherwise, do a simple comparison
            // If the two items are not the same type, return false
            if (itemType !== Object.prototype.toString.call(item2)) {
                return false;
            }

            // Else if it's a function, convert to a string and compare
            // Otherwise, just compare
            if (itemType === '[object Function]') {
                if (item1.toString() !== item2.toString()) {
                    return false;
                }
            } else {
                if (item1 !== item2) {
                    return false;
                }
            }

        }
    }

    static checkTypeFile(file: File[]): boolean {
        const typeAllow = ['jpg', 'jpeg', 'pdf', 'doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx'];
        let isReturn = true;
        for (const image of file) {
            const typeAray = image.name.split('.');
            if ( !(typeAllow.includes(typeAray[typeAray.length - 1]) && typeAray.length >= 2) ) {
                isReturn = false;
                break;
            }
        }
        return isReturn;
    }

    static checkTypeFileImage(file: File[]): boolean {
        const typeAllow = ['jpg', 'jpeg'];
        let isReturn = true;
        for (const image of file) {
            const typeAray = image.name.split('.');
            if ( !(typeAllow.includes(typeAray[typeAray.length - 1]) && typeAray.length >= 2) ) {
                isReturn = false;
                break;
            }
        }
        return isReturn;
    }

}
