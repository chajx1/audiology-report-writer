import {
  Container,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import data from "./dummydata";

function SmartPhraseBrowserPage() {
  const phrases = data.getSmartPhrases();

  return (
    <Container fixed sx={{ mt: 3 }}>
      <Typography variant="h4" component="h1" sx={{ mb: 3 }}>
        SmartPhrase Browser
      </Typography>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell></TableCell>
              <TableCell></TableCell>
              <TableCell>SmartPhrase</TableCell>
              <TableCell>Title</TableCell>
              <TableCell>Template</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {phrases.map((phrase) => (
              <TableRow
                key={phrase.id}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell sx={{ width: 50 }}>
                  <IconButton aria-label="edit">
                    <EditIcon />
                  </IconButton>
                </TableCell>
                <TableCell sx={{ width: 50 }}>
                  <IconButton aria-label="delete">
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
                <TableCell component="th" scope="row">
                  {phrase.smartphrase}
                </TableCell>
                <TableCell>{phrase.title}</TableCell>
                <TableCell>
                  <Typography variant="body2" noWrap>
                    {phrase.template}
                  </Typography>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
}

export default SmartPhraseBrowserPage;
