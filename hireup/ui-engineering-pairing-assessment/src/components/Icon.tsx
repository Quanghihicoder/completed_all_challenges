import * as Icons from '../assets/icons';

type IconName = keyof typeof Icons;

interface IconProps extends React.SVGProps<SVGSVGElement> {
  name: IconName;
}

const Icon = ({ name, ...props }: IconProps) => {
  const SvgIcon = Icons[name];
  return SvgIcon ? <SvgIcon {...props} /> : null;
};

export default Icon;