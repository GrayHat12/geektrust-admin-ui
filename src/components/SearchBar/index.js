import { useRef } from "react";
import { useData } from "../../context/DataProvider";
import styles from "./Search.module.css";

export default function Search({ defaultValue, placeholder }) {
    const SearchRef = useRef(null);
    const { onSearch } = useData();
    function search() {
        if (onSearch) onSearch(SearchRef.current.value);
    }
    function onChange(ev) {
        //let keyCode = ev.code;
        search();
    }
    return (
        <div className={styles.container}>
            <input className={styles.input} placeholder={placeholder} ref={SearchRef} defaultValue={defaultValue} onChange={onChange} />
        </div>
    );
}