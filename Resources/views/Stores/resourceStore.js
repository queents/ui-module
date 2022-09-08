import { defineStore } from 'pinia';

export let useResourceStore = defineStore('resource', {
    state: () => ({
        createModal: false,
        viewModal: false,
        deleteModal: false,
        bulkModal: false,
        goNext: true,
        goBack: true,
        search: '',
        per_page: 50,
        orderBy: 'id',
        desc: true,
        last_page: 0,
        edit: false,
        showFilter: false,
        filters: {},
        bulk: {},
        showBulk: false,
        bulkActionTitle: '',
        view: {},
        photoPreview: null,
        currentUrl: null,
        currentPage: 1,
        cols: {},
    }),

    actions: {
        setEdit(value){
            this.edit = value;
        },
        setFilters(filters) {
            this.filters = filters;
        },
        setCurrentUrl(url) {
            this.currentUrl = url;
        },
        setSearch(search) {
            this.search = search;
        },
        setDesc(value) {
            this.desc = value;
        },
        setOrderBy(orderBy) {
            this.orderBy = orderBy;
        },
        setCurrentPage(page) {
            this.currentPage = page;
        },
        setName(name) {
            this.name = name;
        },
        setCols(cols) {
            this.cols = cols;
        },
        toggleCol(col) {
            this.cols[col] = !this.cols[col];
        },
    },

    getters: {},
});
