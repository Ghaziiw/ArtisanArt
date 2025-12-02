import { User } from "./user.model";

export interface ProductComment {
  id: string;
  content: string;
  mark: number;
  userId: string;
  productId: string;
  createdAt: string;
  user: User;
}
