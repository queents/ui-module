import {Inertia} from "@inertiajs/inertia";
import {useSuccess} from '@@/Composables/useSuccess.js';
import {usePage} from "@inertiajs/inertia-vue3";

export function submitForm(method, from, id=false, redirect=false) {
    let {success} = useSuccess();
    Inertia.post(id ? route(usePage().props.value.url+method, id) : route(usePage().props.value.url+method),from, {
        preserveState: false,
        preserveScroll: true,
        onSuccess: () => {
            success();
            if(redirect === true){
                Inertia.visit(route(usePage().props.value.url+'.index'));
            }
            else {
                return true;
            }
        },
        onError: () => {
            return false;
        }
    });
}
