import React, { useEffect, useState } from "react";
import CircularProgress from "@mui/material/CircularProgress";
import Backdrop from "@mui/material/Backdrop";
import HomePage from "../containers/HomePage";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";

const darkTheme = createTheme({
  palette: {
    mode: "dark",
  },
});

export default function Home(props) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [filterValues, setFilterValues] = useState({});

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        setLoading(true);
        const resp = await fetch("/api/filterValues");
        if (!resp?.ok) {
          throw new Error("Something went wrong.");
        }
        const filterValues = await resp.json();
        const { books, languages, pageSizes } = filterValues;
        setLoading(false);
        setError(false);
        setFilterValues({ books, languages, pageSizes });
      } catch (e) {
        console.error(e);
        setError(true);
        setLoading(false);
      }
    };
    fetchBooks();
  }, []);

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      {loading ? (
        <Backdrop
          sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
          open={loading}
        >
          <CircularProgress />
        </Backdrop>
      ) : (
        <HomePage {...filterValues} />
      )}
    </ThemeProvider>
  );
}

// export async function getServerSideProps(context) {
//   try {
//     const books = await getBooks();
//     const languages = getLanguages();
//     return {
//       props: { books, languages, pageSizes: PAGE_SIZES },
//     };
//   } catch (e) {
//     console.error(e);
//     return {
//       props: { books: [], languages: [], pageSizes: [] },
//     };
//   }
// }
