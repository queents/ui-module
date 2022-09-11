import {computed} from "vue";
import {usePage} from "@inertiajs/inertia-vue3";

export function buildViewRows(){
    return computed(()=>{
        return usePage().props.value.rows.filter(function (row){
            if(row.view){
                return row;
            }
        });
    });
}
