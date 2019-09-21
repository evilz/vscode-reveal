export interface ISlide {
  title: string
  index: number
  text: string
  verticalChildren: ISlide[] // Rem : child can't have child
  attributes: string
}
