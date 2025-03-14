'use client';

import * as React from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';

import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { Divider, List, Pagination } from '@mui/material';

// project import
import axios from 'utils/axios';
import { NoSeries, SeriesListItem } from 'components/SeriesListItem';

const defaultTheme = createTheme();

export default function SeriesBrowse() {
  const [series, setSeries] = React.useState<String[]>([]);
  const [currentPage, setCurrentPage] = React.useState(1);

  const perPage = 10;
  const offset = (currentPage - 1) * perPage;
  const pageCount = Math.ceil(series.length / perPage);

  React.useEffect(() => {
    axios
      .get('book/series')
      .then((response) => {
        setSeries(response.data.series_names);
        const sortSeries = (series: string[]) => {
          return series.sort((a, b) => a.localeCompare(b));
        };

        setSeries(sortSeries(response.data.series_names));
        // console.dir(response.data);
      })
      .catch((error) => console.error(error));
  }, []);

  const handleDelete = (seriesName: String) => {
    axios
      .delete('book/series?series=' + seriesName)
      .then((response) => {
        response.status == 200 && setSeries(series.filter((entryName) => entryName !== seriesName));
        // console.dir(response.status);
      })
      .catch((error) => console.error(error));
  };

  const seriesAsComponents = series
    .slice(offset, offset + perPage)
    // .filter((bk) => parameter == 0 || parameter == bk.parameter)
    .map((seriesName, index, series) => (
      <React.Fragment key={'seriesName list item: ' + index}>
        <SeriesListItem series={seriesName} onDelete={handleDelete} />
        {index < series.length - 1 && <Divider variant="middle" component="li" />}
      </React.Fragment>
    ));

  const handlePageClick = (event: React.ChangeEvent<unknown>, newPage: number) => {
    setCurrentPage(newPage);
  };

  return (
    <ThemeProvider theme={defaultTheme}>
      <Container component="main" maxWidth="md">
        <CssBaseline />
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Typography variant="h4">Select Series</Typography>
          <Box sx={{ mt: 1 }}>
            <List>{seriesAsComponents.length ? seriesAsComponents : <NoSeries />}</List>
          </Box>
          <Pagination count={pageCount} page={currentPage} onChange={handlePageClick} color="primary" />
        </Box>
      </Container>
    </ThemeProvider>
  );
}
