
export const DEFAULT_DROPDOWN_CONFIG: any = {
    highlight: false,
    create: false,
    persist: true,
    plugins: ['dropdown_direction', 'remove_button'],
    dropdownDirection: 'down'
};


export const CURRENT_OPTIONS_CONFIG = Object.assign({}, DEFAULT_DROPDOWN_CONFIG, {
    labelField: 'text',
    valueField: 'id',
    searchField: 'text',
});

export const SEARCH_OPTIONS_CONFIG = Object.assign({}, DEFAULT_DROPDOWN_CONFIG, {
    labelField: 'text',
    valueField: 'id',
    
});

