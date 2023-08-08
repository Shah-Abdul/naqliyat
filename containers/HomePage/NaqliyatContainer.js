import React from "react";
import Paper from "@mui/material/Paper";
import { Skeleton } from "@mui/material";

const NaqliyatContainer = ({ naqliyatData, loading }) => {
  return (
    <Paper elevation={3} style={{ paddingBottom: "20px" }}>
      <ul
        style={{ textAlign: "center", fontSize: "20px", listStyleType: "none" }}
      >
        {loading ? (
          <>
            <br />
            <Skeleton variant="rounded" height={100} animation="wave" />
          </>
        ) : (
          naqliyatData.map((naqliyat) => (
            <NaqliyatDisplay naqliyat={naqliyat} key={naqliyat.index} />
          ))
        )}
      </ul>
    </Paper>
  );
};

const NaqliyatDisplay = ({ naqliyat }) => {
  const { english, urdu } = naqliyat;
  return (
    <li style={{ marginBottom: "48px" }}>
      <br />
      {urdu && <span>{urdu}</span>}
      {english && (
        <div dangerouslySetInnerHTML={{ __html: formatEnglishHtml(english) }} />
      )}
    </li>
  );
};

const formatEnglishHtml = (htmlString) => htmlString.replace("\n", "");
export default NaqliyatContainer;
