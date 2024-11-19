import { useParams } from "react-router-dom";
import SmartPhraseEditor from "./components/SmartPhraseEditor";
import data from "./dummydata";

function SmartPhraseEditorPage() {
  const { id } = useParams();

  return id == null ? null : (
    <SmartPhraseEditor smartphrase={data.getSmartPhrase(id)} />
  );
}

export default SmartPhraseEditorPage;
