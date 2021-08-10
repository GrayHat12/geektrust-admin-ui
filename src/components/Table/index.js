import { useData } from "../../context/DataProvider";
import Row from "../Row";
import styles from "./Table.module.css";

export default function Table() {
    const { allCheck, changeAllCheck, order, getDisplayData } = useData();
    return (
        <div className={styles.container}>
            <table>
                <thead>
                    <tr>
                        <th>
                            <input checked={allCheck} onChange={e => changeAllCheck(e.target.checked)} type="checkbox" />
                        </th>
                        {order.map((h, i) => <th key={i}>{h}</th>)}
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {getDisplayData().map((r,i) => <Row id={r.id} key={i} />)}
                </tbody>
            </table>
        </div>
    );
}