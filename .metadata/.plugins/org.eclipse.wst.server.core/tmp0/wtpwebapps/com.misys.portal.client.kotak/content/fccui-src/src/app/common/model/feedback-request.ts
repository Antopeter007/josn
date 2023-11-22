import { UserData } from './user-data';
export class FeedbackRequest {
  feedbackTime: string;
  rating: number;
  feedback: string;
  location: string;
  userData: UserData;
  productCode: string;
  subProductCode: string;
  tnxTypeCode: string;
}
