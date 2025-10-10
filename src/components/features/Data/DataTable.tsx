import "./DataTable.css";

export interface TableInnerProps {
    id: string;
    headValues: string[];
    values: any[][];
}

export default function TableInner({ id, headValues, values }: TableInnerProps) {
    return (
        <table className="data-table" id={id}>
            <thead>
                <tr>
                    {headValues.map((value, idx) => (
                        <th key={idx} scope="col">{value.toUpperCase()}</th>
                    ))}
                </tr>
            </thead>
            <tbody>
                {values.map((row, idx) => (
                    <tr key={idx}>
                        {row.map((cell, cIdx) => (
                            <td key={cIdx}> 
                            {cell}
                            </td>
                        ))}
                    </tr>
                ))}
            </tbody>
        </table>
    );
}