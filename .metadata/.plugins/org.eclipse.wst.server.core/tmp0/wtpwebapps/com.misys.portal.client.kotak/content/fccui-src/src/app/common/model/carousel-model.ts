export interface CarouselCardParams {
  name?: string;
  reference?: string;
  description?: string;
  text1?: number;
  text2?: number;
  selected?: boolean;
}

export interface CarouselParams {
  cardParams: CarouselCardParams[];
  greetingRequired?: boolean;
  greetingName?: string;
  greetingMessage?: string;
  numScroll?: number;
  numVisible?: number;
}
