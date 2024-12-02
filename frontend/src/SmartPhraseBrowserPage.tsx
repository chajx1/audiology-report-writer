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
  Button,
  Modal,
  Box,
  Card,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import data from "./dummydata";
import { db } from "./firebase";
import { useEffect, useState } from "react";
import {
  collection,
  doc,
  getDocs,
  query,
  setDoc,
  where,
} from "firebase/firestore";
import { SmartPhrase } from "./types";
import { Link } from "react-router-dom";
import SmartPhraseEditor from "./components/SmartPhraseEditor";

function SmartPhraseBrowserPage() {
  const [data, setData] = useState<{
    id: string;
    data: { uid: string; smartphrases: SmartPhrase[] };
  } | null>(null);
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  useEffect(() => {
    getDocs(query(collection(db, "users"), where("uid", "==", "Me"))).then(
      (querySnapshot) =>
        querySnapshot.forEach((doc) => {
          const data = doc.data() as {
            uid: string;
            smartphrases: SmartPhrase[];
          };
          setData({ id: doc.id, data });
        })
    );
  }, []);

  if (data == null) return null;

  const phrases = data.data.smartphrases ?? [];

  const modalStyle = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: "80%",
    height: "80%",
    bgcolor: "background.paper",
    border: "2px solid #000",
    boxShadow: 24,
    p: 4,
    overflow: "scroll",
  };

  function onCreate(sp: SmartPhrase) {
    if (data == null) return;
    const newPhrases = [...phrases];
    newPhrases.push(sp);
    const newDoc = {
      ...data?.data,
      smartphrases: newPhrases,
    };
    setDoc(doc(db, "users", data.id), newDoc).then(() => {
      setData({ ...data, data: newDoc });
      handleClose();
    });
  }
  

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
            {phrases.map((phrase, idx) => (
              <TableRow
                key={phrase.smartphrase}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell sx={{ width: 50 }}>
                  <IconButton
                    aria-label="edit"
                    component={Link}
                    to={`${phrase.smartphrase}`}
                  >
                    <EditIcon />
                  </IconButton>
                </TableCell>
                <TableCell sx={{ width: 50 }}>
                  <IconButton
                    aria-label="delete"
                    onClick={() => {
                      const newPhrases = [...phrases];
                      newPhrases.splice(idx, 1);
                      const newDoc = {
                        ...data?.data,
                        smartphrases: newPhrases,
                      };
                      setDoc(doc(db, "users", data.id), newDoc).then(() =>
                        setData({ ...data, data: newDoc })
                      );
                    }}
                  >
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
      <Button variant="contained" onClick={handleOpen} sx={{ mt: 3 }}>
        Add Smartphrase
      </Button>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Card sx={modalStyle}>
          <SmartPhraseEditor smartphrase={null} onSave={(sp) => onCreate(sp)} />
        </Card>
      </Modal>
    </Container>
  );
}

export default SmartPhraseBrowserPage;
