import type { SmartPhrase } from "./types";
class DummyData {
  smartphrases: SmartPhrase[];

  constructor() {
    this.smartphrases = [
      {
        smartphrase: "sn",
        title: "SNHL",
        template: "sensorineural hearing loss",
      },
      {
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
}

const data = new DummyData();

export default data;
