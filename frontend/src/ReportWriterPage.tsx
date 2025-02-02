import {
  Container,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
  Button,
} from "@mui/material";
import React, { useEffect, useRef, useState } from "react";
import { SmartPhrase } from "./types";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "./firebase";

function capitalize(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

function lookupSmartphrase(
  s: string,
  phraseHash: { [key: string]: string }
): string {
  s = s.slice(1);
  if (phraseHash.hasOwnProperty(s)) {
    return phraseHash[s];
  } else {
    return "";
  }
}

function transformReport(
  report: string,
  gender: string | null,
  phrases: SmartPhrase[]
): { newReport: string; cursorPos: null | number } {
  let newReport = report.replaceAll("@TD@", new Date().toLocaleDateString());
  let smartphrase;
  let cursorPos = null;

  for (let i = 0; i < report.length - 1; i++) {
    if (report.slice(i, i + 1) === "." && report.slice(i + 1, i + 2) !== " ") {
      let idx = i;
      let smartphrase = "";
      while (idx < report.length && report.slice(idx, idx + 1) !== " ") {
        smartphrase += report.slice(idx, idx + 1);
        idx++;
      }
      if (report.slice(idx, idx + 1) !== " ") {
        smartphrase = "";
      }
      let template = lookupSmartphrase(
        smartphrase,
        Object.fromEntries(phrases.map((p) => [p.smartphrase, p.template]))
      );
      if (template !== "") {
        newReport = newReport.replace(smartphrase, template);
        cursorPos = idx - smartphrase.length + template.length + 1;
      }
    }
  }

  if (gender == null) {
    return { newReport, cursorPos };
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

  newReport = newReport.replaceAll("@He", capitalize(subject));
  newReport = newReport.replaceAll("@Him", capitalize(object));
  newReport = newReport.replaceAll("@His", capitalize(possessive));
  newReport = newReport.replaceAll("@he", subject);
  newReport = newReport.replaceAll("@him", object);
  newReport = newReport.replaceAll("@his", possessive);

  return { newReport, cursorPos };
}

const FIELD_STR = "***";

function ReportWriterPage() {
  const textField = useRef<HTMLTextAreaElement>(null);

  const [report, setReport] = useState<string>("");
  const [gender, setGender] = useState<string | null>(null);
  const [fieldIndex, setFieldIndex] = useState<number>(0);
  const [phrases, setPhrases] = useState<SmartPhrase[]>([]);

  useEffect(() => {
    getDocs(query(collection(db, "users"), where("uid", "==", "Me"))).then(
      (querySnapshot) =>
        querySnapshot.forEach((doc) => {
          const data = doc.data() as {
            uid: string;
            smartphrases: SmartPhrase[];
          };
          setPhrases(data.smartphrases);
        })
    );
  }, []);

  useEffect(() => {
    const handleFieldSearch = (e: KeyboardEvent) => {
      if (e.key === "F2") {
        e.preventDefault();
        if (textField.current != null) {
          let fieldStart = report.indexOf(
            FIELD_STR,
            textField.current.selectionEnd
          );
          if (fieldStart === -1) {
            fieldStart = report.indexOf(FIELD_STR);
          }
          textField.current.focus();
          if (fieldStart > -1) {
            textField.current.setSelectionRange(fieldStart, fieldStart + 3);
          }
        }
      }
    };
    window.addEventListener("keydown", handleFieldSearch);
    return () => window.removeEventListener("keydown", handleFieldSearch);
  }, [report, textField, fieldIndex]);

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
            setReport(transformReport(report, newGender, phrases).newReport);
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
        onChange={(e) => {
          const nonTransformedReport = e.target.value;
          const { newReport, cursorPos } = transformReport(
            e.target.value,
            gender,
            phrases
          );
          if (nonTransformedReport !== newReport) {
            setReport(newReport);
            if (cursorPos) {
              setTimeout(() => {
                textField.current?.focus();
                textField.current?.setSelectionRange(cursorPos, cursorPos);
              }, 60);
            }
          } else {
            setReport(newReport);
          }
        }}
      />
    </Container>
  );
}

export default ReportWriterPage;
