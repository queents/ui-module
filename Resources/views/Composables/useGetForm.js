import { usePage } from "@inertiajs/inertia-vue3";

export function useGetForm() {
    function formMake() {
        let rowsArray = {};
        let rows = usePage().props.value.rows;
        if (rows) {
            for (let i = 0; i < rows.length; i++) {
                if (rows[i].vue === "ViltRelation.vue") {
                    rowsArray[rows[i].name] = "";
                } else {
                    rowsArray[rows[i].name] = rows[i].default;
                }
            }
        }

        return rowsArray;
    }

    return { formMake };
}
