import pool from "../config/db.js";

export const getAvailableQuantity = async (
    client,
    baseId,
    equipmentTypeId
) => {
    const result = await client.query(
        `
        SELECT
            COALESCE((
                SELECT SUM(quantity)
                FROM purchases
                WHERE base_id = $1
                  AND equipment_type_id = $2
            ), 0)

            +

            COALESCE((
                SELECT SUM(quantity)
                FROM transfers
                WHERE destination_base_id = $1
                  AND equipment_type_id = $2
                  AND status = 'COMPLETED'
            ), 0)

            -

            COALESCE((
                SELECT SUM(quantity)
                FROM transfers
                WHERE source_base_id = $1
                  AND equipment_type_id = $2
                  AND status = 'COMPLETED'
            ), 0)

            -

            COALESCE((
                SELECT SUM(quantity)
                FROM assignments
                WHERE base_id = $1
                  AND equipment_type_id = $2
            ), 0)

            -

            COALESCE((
                SELECT SUM(quantity)
                FROM expenditures
                WHERE base_id = $1
                  AND equipment_type_id = $2
            ), 0)

            AS available_quantity
        `,
        [baseId, equipmentTypeId]
    );

    return Number(result.rows[0].available_quantity);
};