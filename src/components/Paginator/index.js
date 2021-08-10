import { useEffect, useState } from "react";
import { useData } from "../../context/DataProvider";
import styles from "./Paginator.module.css";

export default function Paginator() {
    const { pages, currentPage, hasNextPage, hasPrevPage, gotopageN, nextPage, prevPage } = useData();

    const [startPage, setStartPage] = useState(currentPage > 5 ? currentPage : 1);
    const [endPage, setEndPage] = useState(Math.min(currentPage + 1, pages));

    useEffect(() => {
        setStartPage(Math.max(Math.floor(currentPage / 5), 1));
        setEndPage(Math.min(currentPage + 5, pages));
    }, [currentPage, pages]);

    return (
        <div className={styles.container}>
            <button onClick={() => gotopageN(1)} disabled={currentPage === 1}>
                {"<<"}
            </button>
            <button onClick={prevPage} disabled={!hasPrevPage}>
                {"<"}
            </button>
            {Array(endPage - startPage + 1).fill(null).map((_, i) => (
                <button onClick={() => gotopageN(i + startPage)} className={`${i + startPage === currentPage ? styles.active : ""}`} key={i}>
                    {i + startPage}
                </button>
            ))}
            <button onClick={nextPage} disabled={!hasNextPage}>
                {">"}
            </button>
            <button onClick={() => gotopageN(pages)} disabled={currentPage === pages}>
                {">>"}
            </button>
        </div>
    );
}