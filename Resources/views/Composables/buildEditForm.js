import {computed} from "vue";
import {usePage} from "@inertiajs/inertia-vue3";

export function buildEditForm(){
    return computed(()=>{
        return usePage().props.value.rows.filter(function (row){
            if(row.edit){
                return row;
            }
        });
    });
}
