import { SVGProps, FC } from 'react'

const SUSIcon: FC<SVGProps<SVGSVGElement>> = (props: SVGProps<SVGSVGElement>) => {
  return (
    <img src="/sus.png" alt="Icon of SUS" style={props.style} />
  )
}

export default SUSIcon
