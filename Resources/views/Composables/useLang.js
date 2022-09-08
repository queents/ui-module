import { usePage } from '@inertiajs/inertia-vue3';

export function useLang() {
    function lang() {
        return usePage().props.value.data?.trans;
    }
    return { lang };
}
