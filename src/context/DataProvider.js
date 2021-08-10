import { createContext, useContext, useEffect, useState } from "react";

const DATA = [];

function getData(_data = DATA) {
    return _data.map((item) => {
        return { ...item, checked: false, editable: false };
    });
}

const DataProviderContext = createContext({
    data: [],
    order: [],
    actions: [],
    search: undefined,
    allCheck: false,
    pages: 0,
    currentPage: 0,
    hasNextPage: false,
    hasPrevPage: false,
    nextPage: () => { },
    prevPage: () => { },
    gotopageN: (n) => { },
    changeAllCheck: (value) => { },
    onSearch: (value) => { },
    check: (value, id) => { },
    checkAll: (value) => { },
    getDisplayData: () => [],
    updateData: (id, data) => { },
    setMaxItemsPerPage: (value) => { },
});

export const useData = () => {
    return useContext(DataProviderContext);
}

export const DataProvider = ({ children }) => {
    const [maxItemsPerPage, setMaxItemsPerPage] = useState(10);
    const [data, setData] = useState(getData(DATA));
    const order = ["Name", "Email", "Role"];
    const [search, setSearch] = useState("");
    const [allCheck, setAllCheck] = useState(false);
    const [pages, setPages] = useState(Math.ceil(getFilteredData().length / maxItemsPerPage));
    const [currentPage, setCurrentPage] = useState(1);

    const actions = [
        {
            name: "Edit",
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-pencil-square" viewBox="0 0 16 16">
                    <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z" />
                    <path fillRule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5v11z" />
                </svg>
            ),
            onClick: (id) => {
                console.log('edit', id);
                let ndata = data.map(x => {
                    if (x.id === id) {
                        x.editable = true;
                    }
                    return x;
                });
                setData(ndata);
            },
            show: (id) => {
                let dat = data.find(x => x.id === id);
                return !dat.editable;
            }
        },
        {
            name: "Delete",
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-trash" viewBox="0 0 16 16">
                    <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z" />
                    <path fillRule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z" />
                </svg>
            ),
            onClick: (id) => {
                setData(data.filter(x => {
                    return x.id !== id;
                }));
            },
            color: "red",
            show: (id) => true
        },
    ];

    useEffect(() => {
        setPages(Math.ceil(data.length / maxItemsPerPage));
    }, [maxItemsPerPage, data]);

    function onSearch(search) {
        setSearch(search);
    }
    function check(value, id) {
        let ndata = data.map(x => {
            if (x.id === id) {
                x.checked = value;
            }
            if (x.editable) x.editable = false;
            return x;
        });
        if (allCheck) setAllCheck(false);
        setData(ndata);
    }
    function changeAllCheck(value) {
        setAllCheck(value);
        let ndata = data.map(x => {
            x.checked = value;
            if (x.editable) x.editable = false;
            return x;
        });
        setData(ndata);
    }
    function getFilteredData() {
        return data.filter(item => {
            return item.email.includes(search) || item.name.includes(search) || item.role.includes(search);
        });
    }
    function nextPage() {
        if (currentPage < pages) {
            setCurrentPage(currentPage + 1);
            return true;
        }
        return false;
    }
    function prevPage() {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
            return true;
        }
        return false;
    }
    function gotopageN(n) {
        setCurrentPage(n);
    }
    function updateData(id, updateddata) {
        let ndata = data.map(x => {
            if (x.id === id) {
                x = { ...x, ...updateddata, editable: false };
            }
            return x;
        });
        setData(ndata);
    }

    async function fetchData() {
        let res = await fetch('https://geektrust.s3-ap-southeast-1.amazonaws.com/adminui-problem/members.json');
        let json = await res.json();
        return json;
    }

    useEffect(() => {
        fetchData().then(dat => {
            setData(getData(dat));
        }).catch(err => {
            alert(JSON.stringify(err));
            console.error(err);
        });
    }, []);

    useEffect(() => {
        setPages(Math.ceil(getFilteredData().length / maxItemsPerPage));
    }, [search, maxItemsPerPage, data]);

    useEffect(() => {
        if (currentPage > pages) setCurrentPage(1);
    }, [pages, currentPage]);

    let value = {
        data,
        order,
        search,
        allCheck,
        actions: actions,
        changeAllCheck,
        onSearch,
        check,
        checkAll: changeAllCheck,
        getDisplayData: () => getFilteredData().slice(currentPage * maxItemsPerPage - maxItemsPerPage, currentPage * maxItemsPerPage),
        pages,
        currentPage,
        hasNextPage: currentPage < pages,
        hasPrevPage: currentPage > 1,
        nextPage,
        prevPage,
        setMaxItemsPerPage,
        gotopageN,
        updateData,
    };
    return (
        <DataProviderContext.Provider value={value}>{children}</DataProviderContext.Provider>
    );
}