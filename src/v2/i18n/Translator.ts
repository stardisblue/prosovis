export class Translator {
  data: { [k: string]: { [k: string]: string } };
  constructor(data: { [k: string]: { [k: string]: string } }) {
    this.data = data;
  }

  eventKind(value: string) {
    return this.data['event-kind'][value] || value;
  }
}
