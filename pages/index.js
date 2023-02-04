import Head from "next/head";
import HomePage from "../containers/HomePage";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";

import { getBooks } from "./api/books";
import { getLanguages } from "./api/languages";
import { PAGE_SIZES } from "./api/naqliyat";

const darkTheme = createTheme({
  palette: {
    mode: "dark",
  },
});

export default function Home(props) {
  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <HomePage {...props} />
    </ThemeProvider>
  );
}

export async function getServerSideProps(context) {
  try {
    const books = await getBooks();
    const languages = getLanguages();
    return {
      props: { books, languages, pageSizes: PAGE_SIZES },
    };
  } catch (e) {
    console.error(e);
    return {
      props: { books: [], languages: [], pageSizes: [] },
    };
  }
}
