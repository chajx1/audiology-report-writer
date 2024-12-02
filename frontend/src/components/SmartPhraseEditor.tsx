import {
  Button,
  Card,
  CardContent,
  Container,
  TextField,
  Typography,
} from "@mui/material";
import { SmartPhrase } from "../types";
import { useState } from "react";

type Props = {
  smartphrase: undefined | null | SmartPhrase;
  onSave: (sp: SmartPhrase) => void;
};

function SmartPhraseEditor(props: Props) {
  const [smartphrase, setSmartPhrase] = useState<SmartPhrase>(
    props.smartphrase ?? {
      smartphrase: null,
      title: null,
      template: null,
    }
  );

  return (
    <>
      <Typography variant="h4" component="h1">
        SmartPhrase Editor
      </Typography>
      <Card sx={{ m: 3 }}>
        <CardContent>
          <TextField
            sx={{ mb: 2 }}
            label="SmartPhrase"
            fullWidth
            value={smartphrase.smartphrase}
            onChange={(e) =>
              setSmartPhrase({ ...smartphrase, smartphrase: e.target.value })
            }
          />
          <TextField
            label="Title"
            multiline
            fullWidth
            value={smartphrase.title}
            onChange={(e) =>
              setSmartPhrase({ ...smartphrase, title: e.target.value })
            }
          />
        </CardContent>
      </Card>
      <Typography sx={{ mb: 2 }} variant="body2">
        Available variables are: @TD@, @LNAME@, @She@, @Her@, @Hers@.
      </Typography>
      <TextField
        sx={{ mb: 2 }}
        label="Template"
        multiline
        fullWidth
        minRows={10}
        value={smartphrase.template}
        onChange={(e) =>
          setSmartPhrase({ ...smartphrase, template: e.target.value })
        }
      />
      <Button
        variant="contained"
        fullWidth
        onClick={() => props.onSave(smartphrase)}
      >
        Save
      </Button>
    </>
  );
}

export default SmartPhraseEditor;
