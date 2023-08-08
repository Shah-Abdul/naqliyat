import React, { useEffect, useState, useMemo } from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import OutlinedInput from "@mui/material/OutlinedInput";

import NaqliyatContainer from "./NaqliyatContainer";

/** @jsxImportSource @emotion/react */
import { css, jsx } from "@emotion/react";

import { useRouter } from "next/router";
import { Skeleton } from "@mui/material";

const navItems = ["Book", "Languages", "Page size"];

const BookSelect = ({ books, value, onChange }) => {
  const handleChange = (event) => {
    onChange(event.target.value);
  };

  return (
    <Box sx={{ minWidth: 120 }}>
      <FormControl fullWidth>
        <InputLabel id="demo-simple-select-label">Book</InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={value}
          label="Book"
          onChange={handleChange}
        >
          {books.map(({ bookId, name }) => (
            <MenuItem value={bookId} key={bookId}>
              {name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  );
};

const LanguageSelect = ({ languages, value, onChange }) => {
  const handleChange = (event) => {
    const {
      target: { value },
    } = event;
    onChange(
      // On autofill we get a stringified value.
      typeof value === "string" ? value.split(",") : value
    );
  };
  return (
    <div>
      <FormControl sx={{ width: 300 }}>
        <InputLabel id="demo-multiple-name-label">Languages</InputLabel>
        <Select
          labelId="demo-multiple-name-label"
          id="demo-multiple-name"
          multiple
          value={value}
          onChange={handleChange}
          input={<OutlinedInput label="Languages" />}
        >
          {languages.map((language) => (
            <MenuItem key={language} value={language}>
              {language}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </div>
  );
};

const PageSizeSelect = ({ value, pageSizes, onChange }) => {
  const handleChange = (event) => {
    onChange(event.target.value);
  };

  return (
    <Box sx={{ minWidth: 120 }}>
      <FormControl fullWidth>
        <InputLabel id="demo-simple-select-label">Page Size</InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={value}
          label="Page Size"
          onChange={handleChange}
        >
          {pageSizes.map((pageSize) => (
            <MenuItem value={pageSize} key={pageSize}>
              {pageSize}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  );
};

function HomePage(props) {
  const { window, books = [], languages = [], pageSizes = [] } = props;
  const router = useRouter();
  const { query } = router;
  const {
    bookId = 1,
    lang = languages,
    pageSize: pageSizeParam = 25,
    startIndex: startIndexParam = 0,
  } = query;

  const [mobileOpen, setMobileOpen] = useState(false);
  const [naqliyat, setNaqiyat] = useState([]);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);
  const [naqliyatCountForBook, setNaqliyatCount] = useState(25);

  const { pageSize, startIndex } = useMemo(() => {
    let pageSize = parseInt(pageSizeParam),
      startIndex = parseInt(startIndexParam);
    if (isNaN(pageSize)) {
      pageSize = 25;
    }
    if (isNaN(startIndex)) {
      startIndex = 0;
    }
    return { pageSize, startIndex };
  }, [pageSizeParam, startIndexParam]);

  const { prevPageButtonDisabled, nextPageButtonDisabled } = useMemo(() => {
    let prevPageButtonDisabled = false,
      nextPageButtonDisabled = false;
    if (startIndex < pageSize) {
      prevPageButtonDisabled = true;
    }
    if (startIndex + pageSize > naqliyatCountForBook) {
      nextPageButtonDisabled = true;
    }
    return { prevPageButtonDisabled, nextPageButtonDisabled };
  }, [naqliyatCountForBook, startIndex, pageSize]);

  const { pageNumber, pageIndexMin, pageIndexMax } = useMemo(() => {
    const pageIndexMin = startIndex || 1;
    const pageIndexMax = Math.min(naqliyatCountForBook, startIndex + pageSize);
    const pageNumber = 1 + parseInt(startIndex / pageSize);
    return { pageNumber, pageIndexMin, pageIndexMax };
  }, [startIndex, pageSize, naqliyatCountForBook]);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleBookChange = (bookId) => {
    router.replace({
      query: { ...query, bookId },
    });
  };

  const handleLangChange = (lang) => {
    router.replace({
      query: { ...query, lang },
    });
  };

  const handlePageSizeChange = (pageSize) => {
    router.replace({
      query: { ...query, pageSize },
    });
  };

  const handleBack = () => {
    router.replace({
      query: { ...query, startIndex: Math.max(0, startIndex - pageSize) },
    });
  };

  const handleNext = () => {
    router.replace({
      query: { ...query, startIndex: startIndex + pageSize },
    });
  };

  const handleRetryOnError = () => {
    router.replace({
      query: {
        ...query,
        startIndex: 0,
        bookId: 1,
        pageSize: 25,
        startIndex: 0,
        lang: [],
      },
    });
  };

  // Mobile drawer.
  const drawer = (
    <Box sx={{ textAlign: "center" }}>
      <section css={{ position: "relative" }}>
        <Typography variant="h6" sx={{ my: 2 }}>
          Naqliyat
        </Typography>
        <IconButton
          aria-label="close"
          css={{ position: "absolute", right: "10px", top: "-4px" }}
          onClick={handleDrawerToggle}
        >
          <CloseIcon />
        </IconButton>
      </section>
      <Divider />
      <List>
        {navItems.map((item, i) => (
          <ListItem key={item} disablePadding>
            <ListItemButton sx={{ textAlign: "center" }}>
              {i === 0 ? (
                <BookSelect
                  books={books}
                  value={bookId}
                  onChange={handleBookChange}
                />
              ) : i === 1 ? (
                <LanguageSelect
                  languages={languages}
                  value={typeof lang === "string" ? [lang] : lang}
                  onChange={handleLangChange}
                />
              ) : (
                <PageSizeSelect
                  pageSizes={pageSizes}
                  value={pageSize}
                  onChange={handlePageSizeChange}
                />
              )}
            </ListItemButton>
          </ListItem>
        ))}
        {/* <Filters /> */}
      </List>
    </Box>
  );

  const container =
    window !== undefined ? () => window.document.body : undefined;

  useEffect(() => {
    const fetchNaqliyat = async () => {
      try {
        setLoading(true);
        const resp = await fetch(
          `/api/naqliyat?bookId=${bookId}&pageSize=${pageSize}${
            startIndex ? `&startAtIndex=${startIndex}` : ""
          }${
            lang.length
              ? `&lang=${typeof lang === "string" ? lang : lang.join(",")}`
              : ""
          }`
        );
        if (!resp?.ok) {
          throw new Error("Something went wrong.");
        }
        const naqliyatResp = await resp.json();
        setLoading(false);
        setError(false);
        setNaqiyat(naqliyatResp);
      } catch (e) {
        console.error(e);
        setError(true);
        setLoading(false);
      }
    };
    fetchNaqliyat();
  }, [bookId, lang, pageSize, startIndex]);

  useEffect(() => {
    const fetchNaqliyatCount = async () => {
      try {
        setLoading(true);
        const resp = await fetch(`/api/naqliyat-count?bookId=${bookId}`);
        if (!resp?.ok) {
          throw new Error("Something went wrong.");
        }
        const naqliyatResp = await resp.json();
        setLoading(false);
        setError(false);
        setNaqliyatCount(naqliyatResp);
      } catch (e) {
        console.error(e);
        setError(true);
        setLoading(false);
      }
    };
    if (!isNaN(bookId)) {
      fetchNaqliyatCount();
    }
  }, [bookId]);

  return (
    <Box sx={{ display: "flex" }}>
      <AppBar component="nav">
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: "none" } }}
          >
            <MenuIcon />
          </IconButton>
          <Typography
            variant="h6"
            component="div"
            sx={{ flexGrow: 1, display: { sm: "block" } }}
          >
            Naqliyat
          </Typography>
          <Box
            sx={{
              display: { xs: "none", sm: "flex" },
              padding: { sm: "16px" },
            }}
          >
            {/* {navItems.map((item) => (
              <Button key={item} sx={{ color: "#fff" }}>
                {item}
              </Button>
            ))} */}
            <div style={{ paddingRight: "8px" }}>
              <BookSelect
                books={books}
                value={bookId}
                onChange={handleBookChange}
              />
            </div>
            <div style={{ paddingRight: "8px" }}>
              <LanguageSelect
                languages={languages}
                value={typeof lang === "string" ? [lang] : lang}
                onChange={handleLangChange}
              />
            </div>
            <PageSizeSelect
              pageSizes={pageSizes}
              value={pageSize}
              onChange={handlePageSizeChange}
            />
            {/* <Filters /> */}
          </Box>
        </Toolbar>
      </AppBar>
      <Box component="nav">
        <Drawer
          container={container}
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
          sx={{
            display: { xs: "block", sm: "none" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: "100%",
              background: "#1a1a1b",
            },
          }}
        >
          {drawer}
        </Drawer>
      </Box>
      <Box component="main" sx={{ p: 3, width: "100%" }}>
        <Toolbar />
        {error ? (
          <Typography style={{ textAlign: "center", padding: "16px" }}>
            Something went wrong. Click{" "}
            <Button variant="text" onClick={() => handleRetryOnError()}>
              here
            </Button>{" "}
            to start again.
          </Typography>
        ) : (
          <React.Fragment>
            <PageBackAndForward
              handleBack={handleBack}
              handleNext={handleNext}
              prevPageButtonDisabled={prevPageButtonDisabled}
              nextPageButtonDisabled={nextPageButtonDisabled}
            />
            <PageNumberAndIndices
              {...{ pageNumber, pageIndexMin, pageIndexMax }}
            />
            <NaqliyatContainer loading={loading && !naqliyat.length} naqliyatData={naqliyat} />
            <PageBackAndForward
              handleBack={handleBack}
              handleNext={handleNext}
              prevPageButtonDisabled={prevPageButtonDisabled}
              nextPageButtonDisabled={nextPageButtonDisabled}
            />
          </React.Fragment>
        )}
      </Box>
    </Box>
  );
}

const PageBackAndForward = ({
  handleBack,
  handleNext,
  prevPageButtonDisabled,
  nextPageButtonDisabled,
}) => (
  <div
    style={{ paddingTop: "12px", display: "flex", justifyContent: "center" }}
  >
    <Button
      disabled={prevPageButtonDisabled}
      variant="outlined"
      aria-label="Previous Page"
      startIcon={<ArrowBackIosIcon />}
      style={{ marginRight: "8px" }}
      onClick={handleBack}
    >
      Prev Page
    </Button>
    <Button
      disabled={nextPageButtonDisabled}
      variant="outlined"
      aria-label="Previous Page"
      endIcon={<ArrowForwardIosIcon />}
      onClick={handleNext}
    >
      Next Page
    </Button>
  </div>
);

const PageNumberAndIndices = ({ pageNumber, pageIndexMin, pageIndexMax }) => (
  <div style={{ display: "flex", justifyContent: "space-between", paddingTop: '12px' }}>
    <span style={{ fontWeight: "bold" }}>Page {pageNumber}</span>
    <span style={{ fontWeight: "bold" }}>
      # {pageIndexMin}-{pageIndexMax}
    </span>
  </div>
);
export default HomePage;
