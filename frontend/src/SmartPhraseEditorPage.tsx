import { useNavigate, useParams } from "react-router-dom";
import SmartPhraseEditor from "./components/SmartPhraseEditor";
import data from "./dummydata";
import { useEffect, useState } from "react";
import {
  collection,
  doc,
  getDocs,
  query,
  setDoc,
  where,
} from "firebase/firestore";
import { db } from "./firebase";
import { SmartPhrase } from "./types";
import { Container } from "@mui/material";

function SmartPhraseEditorPage() {
  const { id } = useParams();
  const [phrase, setPhrase] = useState<SmartPhrase | null | undefined>(null);
  const [data, setData] = useState<{
    id: string;
    data: { uid: string; smartphrases: SmartPhrase[] };
  } | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    getDocs(query(collection(db, "users"), where("uid", "==", "Me"))).then(
      (querySnapshot) =>
        querySnapshot.forEach((doc) => {
          const data = doc.data() as {
            uid: string;
            smartphrases: SmartPhrase[];
          };
          setData({ id: doc.id, data });
          setPhrase(
            data.smartphrases.find((phrase) => phrase.smartphrase === id)
          );
        })
    );
  }, []);

  function onEditSave(smartphrase: SmartPhrase) {
    if (data == null) return;
    const newPhrases = [...data.data.smartphrases];
    const currentIdx = newPhrases.findIndex(
      (phrase) => phrase.smartphrase === id
    );
    newPhrases.splice(currentIdx, 1, smartphrase);
    const newDoc = {
      ...data?.data,
      smartphrases: newPhrases,
    };
    setDoc(doc(db, "users", data.id), newDoc).then(() => {
      setData({ ...data, data: newDoc });
      navigate("/smartphrases");
    });
  }

  return phrase == null ? null : (
    <Container fixed sx={{ mt: 3 }}>
      <SmartPhraseEditor smartphrase={phrase} onSave={(sp) => onEditSave(sp)} />
    </Container>
  );
}

export default SmartPhraseEditorPage;
