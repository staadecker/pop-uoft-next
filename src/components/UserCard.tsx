import Image from 'next/image'

type UserCardProps = {
  name: string;
};

export const UserCard = (props: UserCardProps) => (
  <div className="p-2 bg-white rounded-lg shadow hover:shadow-md justify-start items-center gap-2 flex transition-height ease-in duration-500">
    <div className="w-6 h-6 rounded-full justify-center items-center flex bg-surface">
      <Image width={20} height={20} src={`/avatars/${props.name}.png`} alt='Avatar' />
    </div>
    <div className="text-black text-xs cursor-default">
      Anonymous {props.name}
    </div>
  </div>
);
