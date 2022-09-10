import { useResourceStore } from '@@/Stores/resourceStore';
import { Inertia } from '@inertiajs/inertia';
import { toRaw } from 'vue';

export function useReload() {
    function reload() {
        let resourceStore = useResourceStore();
        let getDir = resourceStore.desc ?  'desc' : 'asc';

        let url = {};

        url.page = resourceStore.currentPage;
        url.per_page = resourceStore.per_page;
        url.orderBy = resourceStore.orderBy;
        url.orderDirection = getDir;

        if(resourceStore.search){
            url.search = resourceStore.search
        }

        let submitedFilter = toRaw(resourceStore.filters);

        if (submitedFilter) {
            Object.keys(submitedFilter).map((key) => {
                if(Array.isArray(submitedFilter[key])){
                    url[key] = submitedFilter[key].map((item) => item.id);
                }
                else {
                    url[key] = submitedFilter[key];
                }
            });
        }

        Inertia.get(route(resourceStore.currentUrl + '.index'), url, {
            preserveScroll: true,
            replace: true,
        });
    }

    return { reload };
}
