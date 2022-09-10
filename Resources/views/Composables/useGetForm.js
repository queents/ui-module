import { usePage } from "@inertiajs/inertia-vue3";

export function useGetForm() {
    function formMake() {
        let rowsArray = {};
        let rows = usePage().props.value.rows;
        if (rows) {
            for (let i = 0; i < rows.length; i++) {
                if(rows[i].create || rows[i].edit){
                    if (rows[i].vue === "ViltRelation.vue") {
                        rowsArray[rows[i].name] = "";
                    }
                    else if(rows[i].vue === "ViltSwitch.vue"){
                        if(rows[i].default){
                            rowsArray[rows[i].name] = rows[i].default;
                        }
                        else {
                            rowsArray[rows[i].name] = false;
                        }
                    }
                    else {
                        rowsArray[rows[i].name] = rows[i].default;
                    }
                }
            }
        }

        return rowsArray;
    }

    return { formMake };
}
