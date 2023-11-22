export class VariationDetails {
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
    public maximumNbDays: string,
    public frequency: string,
    public period: string,
    public dayInMonth: string,
    public sectionType: string,
  ) {}
}
