import type { SmartPhrase } from "./types";
class DummyData {
  smartphrases: SmartPhrase[];

  constructor() {
    this.smartphrases = [
      {
        id: "1",
        smartphrase: "sn",
        title: "SNHL",
        template: "sensorineural hearing loss",
      },
      {
        id: "2",
        smartphrase: "dx",
        title: "Diagnosis",
        template: "@TD@ @LNAME@ has ***",
      },
    ];
  }

  // We should probably structure smartphrases like a dict or hash table
  // so that when we try to replace a smartphrase with the template,
  // we can achieve O(1) lookup, instead of looping through all phrases.

  addSmartPhrase(smartphrase: SmartPhrase) {
    this.smartphrases.push(smartphrase);
  }

  getSmartPhrases() {
    return this.smartphrases;
  }

  getSmartPhrase(id: string): SmartPhrase {
    const phrase = this.smartphrases.find((sp) => sp.id === id);
    if (phrase == null) {
      throw new Error("SmartPhrase not found");
    }
    return phrase;
  }
}

const data = new DummyData();

export default data;
