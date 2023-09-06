export interface PushApartProps {
  radius:  number
  scalar?: number
}

export interface PushApart {
  (props: PushApartProps): void
}
