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
};

function SmartPhraseEditor(props: Props) {
  const [smartphrase, setSmartPhrase] = useState<SmartPhrase>(
    props.smartphrase ?? {
      id: null,
      smartphrase: null,
      title: null,
      template: null,
    }
  );

  return (
    <Container fixed sx={{ mt: 3 }}>
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
      />
      <Button variant="contained" fullWidth>
        Save
      </Button>
    </Container>
  );
}

export default SmartPhraseEditor;
