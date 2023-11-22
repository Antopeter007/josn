export class IrregularDetails {
  constructor(
    public operationType: string,
    public variationFirstDate: string,
    public variationPct: string,
    public variationAmt: string,
    public variationCurCode: string,
    public variationSequence: string,
    public type: string,
    public adviseFlag: string,
    public adviseReductionDays: string,
    public sectionType: string,
  ) {}
}
