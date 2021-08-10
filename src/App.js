import Paginator from "./components/Paginator";
import Search from "./components/SearchBar";
import Table from "./components/Table";

function App() {
  return (
    <>
      <Search placeholder="Search by name, email or role. Enter to search" />
      <div style={{ height: 10 }} />
      <Table />
      <div style={{ height: 5 }} />
      <Paginator />
    </>
  );
}

export default App;