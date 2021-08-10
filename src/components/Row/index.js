import { useEffect, useState } from "react";
import { useData } from "../../context/DataProvider";
import styles from "./Row.module.css";

export default function Row({ id }) {
    const { data, check, order, actions, updateData } = useData();
    const [_data, setData] = useState(data.find(x => x.id === id));
    //const [copy_data, setCopyData] = useState({ ..._data });
    useEffect(() => {
        setData(data.find(x => x.id === id));
    }, [id, data]);
    return (
        <tr className={styles.tr}>
            <td>
                <input onChange={ev => check(ev.target.checked, id)} checked={_data.checked} type="checkbox" />
            </td>
            {!_data.editable && order.map((id, key) => (
                <td key={key}>
                    {_data[id.toLowerCase()]}
                </td>
            ))}
            {_data.editable && (
                order.map((id, key) => (
                    <td key={key}>
                        <input value={_data[id.toLowerCase()]} onChange={ev => {
                            let newdata = { ..._data };
                            newdata[id.toLowerCase()] = ev.target.value;
                            setData(newdata);
                        }} />
                    </td>
                ))
            )}
            <td>
                <div className={styles.actions}>
                    {_data.editable && (
                        <button title="Save Changes" style={{ color: 'green' }} onClick={e => updateData(id, _data)}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-check2" viewBox="0 0 16 16">
                                <path d="M13.854 3.646a.5.5 0 0 1 0 .708l-7 7a.5.5 0 0 1-.708 0l-3.5-3.5a.5.5 0 1 1 .708-.708L6.5 10.293l6.646-6.647a.5.5 0 0 1 .708 0z" />
                            </svg>
                        </button>
                    )}
                    {actions.map((a, i) => (
                        a.show(id) ? <button title={a.name} style={{ color: a.color }} key={i} onClick={e => a.onClick(id)}>
                            {a.icon}
                        </button> : null
                    ))}
                </div>
            </td>
        </tr>
    );
}