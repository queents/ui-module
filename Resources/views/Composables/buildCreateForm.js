import {computed} from "vue";
import {usePage} from "@inertiajs/inertia-vue3";

export function buildCreateForm(){
    return computed(()=>{
        return usePage().props.value.rows.filter(function (row){
            if(row.create){
                return row;
            }
        });
    });
}
