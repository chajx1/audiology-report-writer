import {
  Container,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from "@mui/material";
import { useEffect, useRef, useState } from "react";
import data from "./dummydata";

function capitalize(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

function transformReport(report: string, gender: string | null): string {
  const phrases = data.getSmartPhrases();
  let newReport = report.replaceAll("@TD@", new Date().toLocaleDateString());

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

  useEffect(() => {
    window.addEventListener("keydown", (e) => {
      if (e.key === "F2") {
        e.preventDefault();
        if (textField.current != null) {
          const fieldStart = report.indexOf("***");
          // Does not work with material UI right now
          textField.current.setSelectionRange(fieldStart, fieldStart + 3);
          textField.current.focus();
        }
      }
    });
  }, []);

  const [report, setReport] = useState<string>("");
  const [gender, setGender] = useState<string | null>(null);

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
