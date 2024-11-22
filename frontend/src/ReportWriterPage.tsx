import {
  Container,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
  Button,
} from "@mui/material";
import { useEffect, useRef, useState } from "react";
import data from "./dummydata";

function capitalize(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

function lookupSmartphrase(s: string): string {
  return "template"; // template if it exists
}

function transformReport(report: string, gender: string | null): string {
  const phrases = data.getSmartPhrases();
  let newReport = report.replaceAll("@TD@", new Date().toLocaleDateString());
  // const regex = /\..*?(?=\s)/g;
  let smartphrase = "";
  for (let i = 0; i < report.length - 1; i++) {
    if (report.slice(i, i + 1) === "." && report.slice(i + 1, i + 2) !== " ") {
      let idx = i;
      let smartphrase = "";
      while (idx < report.length - 1 && report.slice(i, i + 1)) {
        smartphrase += report.slice(idx, idx + 1);
        idx++;
      }
      console.log(smartphrase);
      // lookupSmartphrase(smartphrase);
    }
  }
  // if (.str in report) {
  // const regex = /\..*?(?=\s)/g;
  //   if (regex in phrases) {
  //     report.replaceAll(regex, smartphrase.template)
  //   }
  // }

  if (gender == null) {
    return newReport;
  }
  // Gender replacements
  let possessive = "";
  let subject = "";
  let object = "";
  switch (gender) {
    case "he":
      possessive = "his";
      subject = "he";
      object = "him";
      break;
    case "she":
      possessive = "her";
      subject = "she";
      object = "her";
      break;
    case "they":
      possessive = "their";
      subject = "they";
      object = "them";
      break;
  }

  console.log(possessive, subject, object, newReport);

  newReport = newReport.replaceAll("@He", capitalize(subject));
  newReport = newReport.replaceAll("@Him", capitalize(object));
  newReport = newReport.replaceAll("@His", capitalize(possessive));
  newReport = newReport.replaceAll("@he", subject);
  newReport = newReport.replaceAll("@him", object);
  newReport = newReport.replaceAll("@his", possessive);

  return newReport;
}

function ReportWriterPage() {
  const textField = useRef<HTMLTextAreaElement>(null);

  const [report, setReport] = useState<string>("");
  const [gender, setGender] = useState<string | null>(null);

  useEffect(() => {
    window.addEventListener("keydown", (e) => {
      if (e.key === "F2") {
        e.preventDefault();
        if (textField.current != null) {
          const fieldStart = report.indexOf("***");
          textField.current.focus();
          textField.current.setSelectionRange(fieldStart, fieldStart + 3);
        }
      }
    });
  }, [report, textField]);

  return (
    <Container fixed sx={{ mt: 3 }}>
      <Typography variant="h4" component="h1">
        Report Writer
      </Typography>
      {gender != null ? (
        <Typography>Selected gender: {gender}</Typography>
      ) : (
        <ToggleButtonGroup
          color="primary"
          exclusive
          onChange={(_event, newGender) => {
            setGender(newGender);
            setReport(transformReport(report, newGender));
          }}
          aria-label="gender"
        >
          <ToggleButton value="he">He</ToggleButton>
          <ToggleButton value="she">She</ToggleButton>
          <ToggleButton value="they">They</ToggleButton>
        </ToggleButtonGroup>
      )}

      <Button
        variant="contained"
        onClick={() => setReport(transformReport(report, gender))}
      >
        Convert Smartphrases
      </Button>

      <TextField
        inputRef={textField}
        multiline
        minRows={10}
        fullWidth
        sx={{ mt: 3 }}
        value={report}
        onChange={(e) => setReport(transformReport(e.target.value, gender))}
      />
    </Container>
  );
}

export default ReportWriterPage;
